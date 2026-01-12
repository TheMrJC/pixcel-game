/**
 * Google Apps Script for Pixel Art Quiz Game
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Rename Sheet1 to '題目' (Questions) with columns: 
 *    [ID (ignored), Question_Text, Option_A, Option_B, Option_C, Option_D, Answer]
 *    Note: The script assumes data starts from Row 2.
 * 
 * 3. Create a sheet named '回答' (Responses) with columns:
 *    [ID, PlayCount, TotalScore, MaxScore, FirstClearScore, AttemptsToClear, LastPlayedTime]
 * 
 * 4. Deploy as Web App (Execute as Me, Access: Anyone).
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('題目');
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet '題目' not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  
  const questions = rows.map((row, index) => ({
    id: index,
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    },
    answer: row[6] // Included for client-side immediate feedback
  }));

  const validQuestions = questions.filter(q => q.question);
  const count = e.parameter.count ? parseInt(e.parameter.count) : 10;
  const shuffled = validQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return ContentService.createTextOutput(JSON.stringify(selected))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const postData = JSON.parse(e.postData.contents);
    const { userId, userAnswers, passThreshold } = postData; 
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Server-side validation
    const qSheet = ss.getSheetByName('題目');
    const qData = qSheet.getDataRange().getValues().slice(1);
    let score = 0;
    
    for (const [qIdStr, choice] of Object.entries(userAnswers)) {
      const qId = parseInt(qIdStr);
      if (qData[qId]) {
        const correctAnswer = qData[qId][6]; 
        if (String(choice).toUpperCase() === String(correctAnswer).toUpperCase()) {
          score++;
        }
      }
    }

    const isPass = score >= (passThreshold || 5);
    const rSheet = ss.getSheetByName('回答');
    if (!rSheet) throw new Error("Sheet '回答' not found");
    
    const rData = rSheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < rData.length; i++) {
      if (String(rData[i][0]) === String(userId)) {
        rowIndex = i + 1;
        break;
      }
    }
    
    const timestamp = new Date();
    
    if (rowIndex === -1) {
      const firstClearScore = isPass ? score : "";
      const attempts = isPass ? 1 : "";
      rSheet.appendRow([userId, 1, score, score, firstClearScore, attempts, timestamp]);
    } else {
      const rowRange = rSheet.getRange(rowIndex, 2, 1, 6);
      const rowValues = rowRange.getValues()[0];
      let [playCount, totalScore, maxScore, firstClearScore, attempts, lastPlayed] = rowValues;
      
      playCount = (parseInt(playCount) || 0) + 1;
      totalScore = (parseInt(totalScore) || 0) + score; // Cumulative
      maxScore = Math.max((parseInt(maxScore) || 0), score);
      
      if (String(firstClearScore) === "") {
        if (isPass) {
          firstClearScore = score;
          attempts = playCount;
        }
      }
      rowRange.setValues([[playCount, totalScore, maxScore, firstClearScore, attempts, timestamp]]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      score: score,
      passed: isPass
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
