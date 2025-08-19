import React, { useState } from 'react';
import { Habit, CalendarDay } from '../types';

interface HabitCalendarProps {
  habits: Habit[];
  currentDate: Date;
  onUpdateProgress: (habitId: string, date: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habits,
  currentDate,
  onUpdateProgress,
  onDeleteHabit
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push({
        date: new Date(current),
        dayOfMonth: current.getDate(),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString()
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getHabitStatus = (habit: Habit, date: Date): boolean | null => {
    const dateKey = formatDateKey(date);
    return habit.data[dateKey] ?? null;
  };

  const handleHabitClick = (habit: Habit, date: Date) => {
    const dateKey = formatDateKey(date);
    const currentStatus = getHabitStatus(habit, date);
    const newStatus = currentStatus === null ? true : !currentStatus;
    onUpdateProgress(habit.id, dateKey, newStatus);
  };

  const markToday = (habit: Habit) => {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const currentStatus = getHabitStatus(habit, today);
    const newStatus = currentStatus === null ? true : !currentStatus;
    onUpdateProgress(habit.id, todayKey, newStatus);
  };

  const getStatusSymbol = (status: boolean | null): string => {
    if (status === true) return 'X';
    if (status === false) return 'O';
    return '.';
  };

  const getStatusColor = (status: boolean | null): string => {
    if (status === true) return 'text-black dark:text-white';
    if (status === false) return 'text-gray-600 dark:text-gray-400';
    return 'text-gray-400 dark:text-gray-600';
  };

  const calculateStreak = (habit: Habit): number => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateKey = formatDateKey(currentDate);
      const status = habit.data[dateKey];
      
      if (status === true) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calendarDays = getCalendarDays(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (habits.length === 0) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Habit Calendar
          </h2>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-3 py-1 border border-current hover:bg-opacity-20 hover:bg-current transition-colors rounded text-sm"
          >
            {isVisible ? '[-] Hide' : '[+] Show'}
          </button>
        </div>
        {isVisible && (
          <p className="text-lg">
            No habits to track. Add your first habit above!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Habit Calendar
        </h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1 border border-current hover:bg-opacity-20 hover:bg-current transition-colors rounded text-sm"
        >
          {isVisible ? '[-] Hide' : '[+] Show'}
        </button>
      </div>
      
      {isVisible && (
        <>
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold">{monthName}</h3>
          </div>

          {/* Calendar Grid - Horizontal Layout */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header with habit names and streaks */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2 font-bold text-center text-sm">Date</div>
                {habits.map(habit => {
                  const streak = calculateStreak(habit);
                  return (
                    <div key={habit.id} className="p-2 text-center text-sm min-w-[100px]">
                      <div className="font-bold mb-1">{habit.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        [*] {streak} day{streak !== 1 ? 's' : ''}
                      </div>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Delete habit"
                      >
                        [X]
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Calendar days - Horizontal rows */}
              {calendarDays.map((day, index) => (
                <div key={index} className="grid grid-cols-8 gap-1">
                  <div className={`p-1 text-center text-xs border-r border-gray-300 dark:border-gray-600 ${
                    day.isToday ? 'font-bold bg-gray-400 dark:bg-gray-600' : ''
                  } ${!day.isCurrentMonth ? 'opacity-50' : ''}`}>
                    {day.dayOfMonth}
                  </div>
                  {habits.map(habit => {
                    const status = getHabitStatus(habit, day.date);
                    return (
                      <div key={habit.id} className="p-1 text-center border-r border-gray-300 dark:border-gray-600 min-w-[100px]">
                        <button
                          onClick={() => handleHabitClick(habit, day.date)}
                          className={`w-6 h-6 flex items-center justify-center hover:bg-opacity-20 hover:bg-current transition-colors rounded ${
                            getStatusColor(status)
                          }`}
                          disabled={!day.isCurrentMonth}
                        >
                          {getStatusSymbol(status)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 text-center text-sm">
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-black dark:text-white">X</span>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">O</span>
                <span>Failed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 dark:text-gray-600">.</span>
                <span>Empty</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">[*]</span>
                <span>Current Streak</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HabitCalendar;
