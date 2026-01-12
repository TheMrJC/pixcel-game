import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import PixelCard from '../components/PixelCard';

const Game = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { 0: 'A', 1: 'B' }
  const [feedback, setFeedback] = useState(null); // 'HIT' or 'MISS'

  useEffect(() => {
    const userId = localStorage.getItem('pixel_quiz_user_id');
    if (!userId) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        // Fetch 5 questions by default, or use ENV param
        const q = await api.fetchQuestions(import.meta.env.VITE_QUESTION_COUNT || 5);
        setQuestions(q);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load level data.");
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleAnswer = (choice) => {
    if (feedback) return; // Prevent double click

    const currentQ = questions[currentIndex];
    const isCorrect = currentQ.answer && currentQ.answer === choice;

    // Save answer
    const newAnswers = { ...answers, [currentQ.id]: choice };
    setAnswers(newAnswers);

    // Show feedback
    setFeedback(isCorrect ? 'HIT' : 'MISS');

    // Next question delay
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // End Game
        navigate('/result', { state: { answers: newAnswers, total: questions.length } });
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 className="blink">LOADING DATA...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>NO DATA.</div>;
  }

  const currentQ = questions[currentIndex];
  // Use question text or ID as seed for consistent boss image
  const bossImage = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQ.id}`;

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '12px' }}>
        <div>LEVEL {currentIndex + 1}/{questions.length}</div>
        <div>PLAYER: {localStorage.getItem('pixel_quiz_user_id')}</div>
      </div>

      {/* Boss Area */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        position: 'relative',
        minHeight: '150px'
      }}>
        <img
          src={bossImage}
          alt="Boss"
          width="120"
          height="120"
          style={{
            imageRendering: 'pixelated',
            filter: feedback === 'MISS' ? 'grayscale(100%)' : 'none',
            transition: 'filter 0.2s',
            animation: feedback === 'HIT' ? 'shake 0.5s' : 'float 3s infinite ease-in-out'
          }}
        />

        {/* Feedback text overlay */}
        {feedback && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            color: feedback === 'HIT' ? '#388e3c' : '#d32f2f',
            textShadow: '3px 3px 0 #000',
            zIndex: 10
          }}>
            {feedback}!
          </div>
        )}
      </div>

      <PixelCard title="MISSION">
        <div style={{ marginBottom: '24px', minHeight: '60px' }}>
          {currentQ.question}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              style={{
                opacity: feedback ? 0.5 : 1,
                backgroundColor: '#202028'
              }}
            >
              <span style={{ color: '#fbc02d', marginRight: '8px' }}>{opt}.</span>
              {currentQ.options[opt]}
            </button>
          ))}
        </div>
      </PixelCard>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Game;
