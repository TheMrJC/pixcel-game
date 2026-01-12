import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// Stubs for now, will implement next
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';

function App() {
    return (
        <>
            <div className="scanlines"></div>
            <Router>
                <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
