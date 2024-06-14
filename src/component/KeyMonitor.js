import React, { useState, useEffect, useCallback } from 'react';

const KeyMonitor = () => {
    const [adPressed, setAdPressed] = useState({ a: false, d: false });
    const [startTime, setStartTime] = useState(null);
    const [laps, setLaps] = useState([]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'a' || event.key === 'd') {
            setAdPressed(prev => ({ ...prev, [event.key]: true }));
        }
    }, []);

    const handleKeyUp = useCallback((event) => {
        if (event.key === 'a' || event.key === 'd') {
            setAdPressed(prev => ({ ...prev, [event.key]: false }));
        }
    }, []);

    useEffect(() => {
        if (adPressed.a && adPressed.d) {
            if (startTime === null) {
                setStartTime(performance.now());
            }
        } else {
            if (startTime !== null) {
                const endTime = performance.now();
                setLaps(prev => [...prev, (endTime - startTime) / 1000]);
                setStartTime(null);
            }
        }
    }, [adPressed, startTime]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h1>AとDの同時押し時間を計測</h1>
                <p>AキーとDキーを交互に押してください</p>
                <p>同時押し時間がある場合、時間が表示されます</p>
            </div>
            <div style={{ marginLeft: '20px' }}>
                <h2>ラップタイム</h2>
                <ul>
                    {laps.map((lap, index) => (
                        <li key={index}>{lap.toFixed(4)} 秒</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default KeyMonitor;
