import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelCard from '../components/PixelCard';

const Home = () => {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (!userId.trim()) return;

        // Save to local storage for persistence
        localStorage.setItem('pixel_quiz_user_id', userId);
        navigate('/game');
    };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{
                fontSize: '48px',
                marginBottom: '40px',
                color: '#fbc02d',
                textShadow: '6px 6px 0px #d32f2f'
            }}>
                PIXEL QUIZ
            </h1>

            <PixelCard title="PLAYER SELECT">
                <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ lineHeight: '1.6', fontSize: '14px', color: '#ccc' }}>
                        INSERT COIN OR ENTER ID TO START
                    </p>

                    <div>
                        <label htmlFor="userId" style={{ display: 'none' }}>PLAYER ID</label>
                        <input
                            id="userId"
                            type="text"
                            placeholder="ENTER PLAYER ID..."
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            autoFocus
                            autoComplete="off"
                        />
                    </div>

                    <button type="submit" disabled={!userId.trim()}>
                        PRESS START
                    </button>
                </form>
            </PixelCard>

            <div style={{ marginTop: '20px', fontSize: '10px', color: '#666' }}>
                © 2024 PIXEL INC. ALL RIGHTS RESERVED.
            </div>
        </div>
    );
};

export default Home;
