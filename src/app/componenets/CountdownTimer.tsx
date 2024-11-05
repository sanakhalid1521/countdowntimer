"use client";

import { useEffect, useState } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [isRunning, setIsRunning] = useState(false); 
  const [isPaused, setIsPaused] = useState(false); 
  const [customMinutes, setCustomMinutes] = useState(5); 
  const [isClient, setIsClient] = useState(false);   
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Function to calculate time left
  const calculateTimeLeft = (target: Date) => {
    const difference = +target - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  
  useEffect(() => {
    setIsClient(true); 

    let timer: NodeJS.Timeout;
    if (isRunning && targetDate) {
      timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(targetDate));
      }, 1000);
    }

    if (targetDate && +new Date() >= +targetDate) {
      setIsRunning(false);  
    }

    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, targetDate]);

  
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMinutes(parseInt(e.target.value, 10));
  };


  const handleStart = () => {
    const now = new Date();
    const target = new Date(now.getTime() + customMinutes * 60 * 1000);
    setTargetDate(target);
    setTimeLeft(calculateTimeLeft(target));
    setIsRunning(true);
    setIsPaused(false); // Reset paused state when starting
  };

  //  pause
  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  // resume
  const handleResume = () => {
    if (targetDate) {
      const now = new Date();
      const remainingTime = targetDate.getTime() - now.getTime(); // Calculate remaining time correctly
      const newTargetDate = new Date(now.getTime() + remainingTime);
      setTargetDate(newTargetDate);
      setIsRunning(true);
      setIsPaused(false);
    }
  };
  

  // reset (pause and reset time)
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft({});
    setTargetDate(null);
    setCustomMinutes(1); 
  };

  if (!isClient) {
    return null; 
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center p-4">
        <span className="text-4xl font-bold text-indigo-600">
          {timeLeft[interval as keyof typeof timeLeft]}
        </span>
        <span className="text-lg text-gray-700 capitalize">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex flex-col justify-center items-center space-y-4 bg-gray-400 p-8 rounded-lg shadow-lg">
      {/* Timer display */}
      <div className="flex justify-center items-center space-x-8">
      {timerComponents.length ? timerComponents : <span className="text-xl font-semibold text-red-900">Time&apos;s up!</span>}

      </div>

      
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Set Minutes:</label>
        <input
          type="number"
          className="p-2 border border-gray-300 text-black rounded-md"
          value={customMinutes}
          onChange={handleTimeInputChange}
          disabled={isRunning} 
          min={1} 
          max={120}
        />
      </div>

      <div className="flex space-x-4 mt-4">
        {!isRunning && !isPaused && (
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
            onClick={handleStart}
          >
            Start Timer
          </button>
        )}
        {isRunning && (
          <button
            className="px-4 py-2 bg-yellow-00 text-white rounded hover:bg-yellow-700"
            onClick={handlePause}
          >
            Pause
          </button>
        )}
        {isPaused && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleResume}
          >
            Resume
          </button>
        )}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;
