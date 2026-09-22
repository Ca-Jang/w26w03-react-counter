import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. 시간 설정 (초 단위: 25분 = 1500초, 5분 = 300초)
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  // 2. 상태 관리 (State)
  const [timeLeft, setTimeLeft] = useState(WORK_TIME); // 남은 시간
  const [isRunning, setIsRunning] = useState(false);   // 타이머 작동 여부
  const [isWorkSession, setIsWorkSession] = useState(true); // 집중 시간인지 휴식 시간인지 구분

  // 3. 타이머 로직 (useEffect)
  useEffect(() => {
    let timer;
    
    // 타이머가 실행 중이고, 남은 시간이 0보다 크면 1초마다 시간 감소
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    // 남은 시간이 0이 되면 상태 전환 (집중 <-> 휴식)
    else if (timeLeft === 0) {
      setIsWorkSession(!isWorkSession); // 모드 반전
      setTimeLeft(!isWorkSession ? WORK_TIME : BREAK_TIME); // 다음 모드에 맞는 시간 세팅
      setIsRunning(false); // 자동으로 시작하지 않고 일단 일시정지 상태로 둠
    }

    // 컴포넌트가 사라지거나 상태가 바뀔 때 기존 타이머 정리(메모리 누수 방지)
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession]);

  // 4. 시간을 MM:SS 형식으로 예쁘게 보여주는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // padStart(2, '0')은 한 자리 수일 때 앞에 '0'을 붙여줍니다 (예: 9초 -> 09초)
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 5. 버튼 클릭 시 실행될 함수들
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(WORK_TIME);
  };

  // 6. 화면에 렌더링될 UI
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

export default App;