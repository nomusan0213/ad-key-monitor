import React, { useState, useEffect, useCallback } from "react";
import "../Strafe.css";

export const Strafe = () => {
  const [events, setEvents] = useState([]);
  const [keysPressed, setKeysPressed] = useState({});
  const [startTimeKeyPress, setStartTimeKeyPress] = useState({});
  const [startTimeMultiple, setStartTimeMultiple] = useState(null);
  const [startTimeMouseWheel, setStartTimeMouseWheel] = useState(null);
  const [wheelTimeout, setWheelTimeout] = useState(null);
  const [memo, setMemo] = useState("");

  const handleKeyDown = useCallback((event) => {
    if (event.repeat) return;
    if (event.key === ' ') event.preventDefault();
  
    const key = event.key === ' ' ? 'Space' : event.key.toLowerCase();
    const currentTime = performance.now();
  
    setKeysPressed(prev => {
      const newKeysPressed = { ...prev, [key]: true };
      const pressedKeys = Object.keys(newKeysPressed).filter(k => newKeysPressed[k]);

      if (pressedKeys.length > 1 && !startTimeMultiple) {
        setStartTimeMultiple({ time: currentTime, keys: pressedKeys.join('') });
      }
  
      return newKeysPressed;
    });
    setStartTimeKeyPress(prev => ({ ...prev, [key]: currentTime }));
  }, [startTimeMultiple]);

  const handleKeyUp = useCallback((event) => {
    const key = event.key === ' ' ? 'Space' : event.key.toLowerCase();
    const currentTime = performance.now();
  
    setKeysPressed(prev => {
      const newKeysPressed = { ...prev, [key]: false };
      const pressedKeys = Object.keys(newKeysPressed).filter(k => newKeysPressed[k]);

      if (startTimeKeyPress[key]) {
        const duration = (currentTime - startTimeKeyPress[key]) / 1000; // ミリ秒を秒に変換
        setEvents(prevEvents => [...prevEvents, { type: key.toUpperCase(), time: duration }]);
      }

      if (pressedKeys.length === 0 && startTimeMultiple) {
        const duration = (currentTime - startTimeMultiple.time) / 1000; // ミリ秒を秒に変換
        setEvents(prevEvents => [...prevEvents, { type: `${startTimeMultiple.keys.toUpperCase()}同時`, time: duration }]);
        setStartTimeMultiple(null);
      }
  
      return newKeysPressed;
    });
  }, [startTimeKeyPress, startTimeMultiple]);

  const handleMouseDown = useCallback((event) => {
    const button = event.button;
    const currentTime = performance.now();
    setEvents(prevEvents => [...prevEvents, { type: `Mouse ${button}`, time: 0 }]);
  }, []);

  const handleWheel = useCallback((event) => {
    const currentTime = performance.now();
    const direction = event.deltaY > 0 ? 'Down' : 'Up';
  
    if (startTimeMouseWheel === null) {
      setStartTimeMouseWheel({ time: currentTime, direction });
    }
  
    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
    }
  
    setWheelTimeout(setTimeout(() => {
      const duration = (performance.now() - startTimeMouseWheel.time) / 1000; // ミリ秒を秒に変換
      setEvents(prevEvents => [...prevEvents, { type: `Mouse Wheel ${startTimeMouseWheel.direction}`, time: duration }]);
      setStartTimeMouseWheel(null);
    }, 200));
  }, [startTimeMouseWheel, wheelTimeout]);

  const resetEvents = () => {
    setEvents([]);
    setKeysPressed({});
    setStartTimeKeyPress({});
    setStartTimeMultiple(null);
    setStartTimeMouseWheel(null);
    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
    }
    setWheelTimeout(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleWheel, wheelTimeout]);

  return (
    <div className="strafe">
      <h2>strafe模範道場</h2>
      <textarea
        className="memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="ここにメモを入力してください"
      />
      <button onClick={resetEvents}>リセット</button>
      <div className="event-container">
        {events.map((event, index) => (
          <div key={index} className="event-item" onClick={() => handleCopy(`${event.type}: ${event.time.toFixed(4)} 秒`)}>
            {event.type}
            : {event.time.toFixed(4)} 秒
          </div>
        ))}
      </div>
    </div>
  );
}
