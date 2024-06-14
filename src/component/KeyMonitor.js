import React, { useState, useEffect, useCallback } from 'react';
import '../KeyMonitor.css';

const KeyMonitor = () => {
    const [adPressed, setAdPressed] = useState({ a: false, d: false });
    const [startTimeAD, setStartTimeAD] = useState(null);
    const [lapsAD, setLapsAD] = useState([]);

    const [wPressed, setWPressed] = useState(false);
    const [sPressed, setSPressed] = useState(false);
    const [startTimeW, setStartTimeW] = useState(null);
    const [startTimeS, setStartTimeS] = useState(null);
    const [lapsW, setLapsW] = useState([]);
    const [lapsS, setLapsS] = useState([]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'a' || event.key === 'd') {
            setAdPressed(prev => ({ ...prev, [event.key]: true }));
        }
        if (event.key === 'w') {
            if (!wPressed) {
                setStartTimeW(performance.now());
            }
            setWPressed(true);
        }
        if (event.key === 's') {
            if (!sPressed) {
                setStartTimeS(performance.now());
            }
            setSPressed(true);
        }
    }, [wPressed, sPressed]);

    const handleKeyUp = useCallback((event) => {
        if (event.key === 'a' || event.key === 'd') {
            setAdPressed(prev => ({ ...prev, [event.key]: false }));
        }
        if (event.key === 'w') {
            if (wPressed) {
                const endTime = performance.now();
                setLapsW(prev => {
                    const newLaps = [...prev, (endTime - startTimeW) / 1000];
                    if (newLaps.length > 20) {
                        newLaps.splice(0, 1); // Remove the oldest lap
                    }
                    return newLaps;
                });
                setStartTimeW(null);
            }
            setWPressed(false);
        }
        if (event.key === 's') {
            if (sPressed) {
                const endTime = performance.now();
                setLapsS(prev => {
                    const newLaps = [...prev, (endTime - startTimeS) / 1000];
                    if (newLaps.length > 20) {
                        newLaps.splice(0, 1); // Remove the oldest lap
                    }
                    return newLaps;
                });
                setStartTimeS(null);
            }
            setSPressed(false);
        }
    }, [wPressed, sPressed, startTimeW, startTimeS]);

    useEffect(() => {
        if (adPressed.a && adPressed.d) {
            if (startTimeAD === null) {
                setStartTimeAD(performance.now());
            }
        } else {
            if (startTimeAD !== null) {
                const endTime = performance.now();
                setLapsAD(prev => {
                    const newLaps = [...prev, (endTime - startTimeAD) / 1000];
                    if (newLaps.length > 20) {
                        newLaps.splice(0, 1); // Remove the oldest lap
                    }
                    return newLaps;
                });
                setStartTimeAD(null);
            }
        }
    }, [adPressed, startTimeAD]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const renderLaps = (laps) => {
        return laps.map((lap, index) => (
            <li key={index} className={index === laps.length - 1 ? 'latest-lap' : ''}>
                {lap.toFixed(4)} 秒
            </li>
        ));
    };

    const resetLaps = () => {
        setLapsAD([]);
        setLapsW([]);
        setLapsS([]);
    };

    return (
        <div className="key-monitor">
            <div className="instructions">
                <h2>AとDの同時押し時間計測</h2>
                <h2>WとSの押し込み時間計測</h2>
                <button onClick={resetLaps}>リセット</button>
            </div>
            <div className="laps">
                <div className="lap-group">
                    <h2>(AとD)</h2>
                    <ul>
                        {renderLaps(lapsAD)}
                    </ul>
                </div>
                <div className="lap-group">
                    <h2>(W)</h2>
                    <ul>
                        {renderLaps(lapsW)}
                    </ul>
                </div>
                <div className="lap-group">
                    <h2>(S)</h2>
                    <ul>
                        {renderLaps(lapsS)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default KeyMonitor;
