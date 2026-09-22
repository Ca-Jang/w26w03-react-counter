import React, { useState, useEffect } from 'react';
import './App.css'; // CSS 파일명은 실제 환경에 맞게 수정해 주세요.

function Apps() {
  const WORK_TIME: number = 25 * 60;
  const BREAK_TIME: number = 5 * 60;

  // 제네릭(<type>)을 사용해 상태값의 타입을 명시합니다.
  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWorkSession, setIsWorkSession] = useState<boolean>(true);

  useEffect(() => {
    // window.setInterval을 사용하여 브라우저 환경의 타이머 ID 타입(number)으로 지정합니다.
    let timer: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    else if (timeLeft === 0) {
      setIsWorkSession(!isWorkSession);
      setTimeLeft(!isWorkSession ? WORK_TIME : BREAK_TIME);
      setIsRunning(false);
    }

    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, isWorkSession]);

  // 매개변수 seconds에 number 타입을 지정합니다.
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = (): void => setIsRunning(true);
  const handlePause = (): void => setIsRunning(false);
  const handleReset = (): void => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(WORK_TIME);
  };

  return (
    <div className="pomodoro-container">
      <h1>{isWorkSession ? '💻 집중 시간' : '☕ 휴식 시간'}</h1>
      
      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>
      
      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart} className="btn btn-start">시작</button>
        ) : (
          <button onClick={handlePause} className="btn btn-pause">일시정지</button>
        )}
        <button onClick={handleReset} className="btn btn-reset">초기화</button>
      </div>
    </div>
  );
}

export default Apps;