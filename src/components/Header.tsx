import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentDate: Date;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, currentDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="flex justify-between items-center mb-8">
      {/* Title */}
      <div className="text-2xl font-bold">
        Habit Tracker
      </div>

      {/* Time and Date */}
      <div className="text-center">
        <div className="text-xl font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm opacity-80">
          {formatDate(currentDate)}
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="px-4 py-2 border border-current hover:bg-opacity-20 hover:bg-current transition-colors rounded"
      >
        {isDarkMode ? '[ ] Light' : '[#] Dark'}
      </button>
    </header>
  );
};

export default Header;
