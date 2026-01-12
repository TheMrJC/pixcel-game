import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import PixelCard from '../components/PixelCard';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('SUBMITTING...');
    const [resultData, setResultData] = useState(null);

    const sentRef = React.useRef(false);

    useEffect(() => {
        if (!state || !state.answers) {
            navigate('/');
            return;
        }

        if (sentRef.current) return;
        sentRef.current = true;

        const submit = async () => {
            const userId = localStorage.getItem('pixel_quiz_user_id');
            try {
                const payload = {
                    userId,
                    userAnswers: state.answers,
                    passThreshold: import.meta.env.VITE_PASS_THRESHOLD || 3 // Default threshold
                };
                const res = await api.submitScore(payload);
                setResultData(res);
                setStatus('COMPLETED');
            } catch (err) {
                console.error(err);
                setStatus('ERROR SAVING SCORE');
                // Still show local calculation if API failed? 
                // For now just error state.
            }
        };
        submit();
    }, [state, navigate]);

    const handleRetry = () => {
        navigate('/game'); // Or Home? Usually 'Retry' -> Start Game
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
            <h1 style={{
                color: resultData?.passed ? '#388e3c' : '#d32f2f',
                marginBottom: '40px',
                textShadow: '4px 4px 0 #000'
            }}>
                {status === 'SUBMITTING...' ? 'CALCULATING...' :
                    resultData?.passed ? 'MISSION COMPLETE' : 'GAME OVER'}
            </h1>

            <PixelCard>
                {status === 'SUBMITTING...' ? (
                    <p className="blink">TRANSMITTING DATA...</p>
                ) : resultData ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '10px' }}>SCORE</div>
                        <div style={{ fontSize: '48px', color: '#fbc02d', marginBottom: '20px' }}>
                            {resultData.score} <span style={{ fontSize: '16px', color: '#fff' }}>/ {state.total}</span>
                        </div>

                        <div style={{ marginBottom: '30px', fontSize: '14px', color: '#ccc' }}>
                            {resultData.passed ? "YOU HAVE PASSED THE TRIAL." : "TRY AGAIN."}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={handleRetry}>RETRY</button>
                            <button onClick={handleHome} style={{ background: '#555' }}>HOME</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p style={{ color: '#d32f2f' }}>CONNECTION LOST.</p>
                        <button onClick={handleHome}>RETURN</button>
                    </div>
                )}
            </PixelCard>

            <style>{`
        .blink { animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
        </div>
    );
};

export default Result;
