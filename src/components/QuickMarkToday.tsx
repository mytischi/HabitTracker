import React from 'react';
import { Habit } from '../types';

interface QuickMarkTodayProps {
  habits: Habit[];
  onUpdateProgress: (habitId: string, date: string, completed: boolean) => void;
}

const QuickMarkToday: React.FC<QuickMarkTodayProps> = ({ habits, onUpdateProgress }) => {
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getHabitStatus = (habit: Habit, date: Date): boolean | null => {
    const dateKey = formatDateKey(date);
    return habit.data[dateKey] ?? null;
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

  const getWeeklyProgress = (habit: Habit): { completed: number; total: number; days: boolean[] } => {
    const today = new Date();
    const days: boolean[] = [];
    let completed = 0;
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const status = getHabitStatus(habit, date);
      const isCompleted = status === true;
      days.push(isCompleted);
      if (isCompleted) completed++;
    }
    
    return { completed, total: 7, days };
  };

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-3 text-center">Quick Mark Today</h3>
      <div className="space-y-3">
        {habits.map(habit => {
          const todayStatus = getHabitStatus(habit, new Date());
          const weeklyProgress = getWeeklyProgress(habit);
          
          return (
            <div key={habit.id} className="flex flex-col items-center space-y-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Habit name and today button */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{habit.name}</span>
                <button
                  onClick={() => markToday(habit)}
                  className={`px-3 py-1 border rounded text-xs transition-colors ${
                    todayStatus === true 
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                      : 'border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Today: {getStatusSymbol(todayStatus)}
                </button>
              </div>
              
              {/* Weekly progress bar */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Week: {weeklyProgress.completed}/{weeklyProgress.total}</span>
                  <span>{Math.round((weeklyProgress.completed / weeklyProgress.total) * 100)}%</span>
                </div>
                <div className="flex space-x-1">
                  {weeklyProgress.days.map((day, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded ${
                        day 
                          ? 'bg-black dark:bg-white' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={`Day ${index + 1}: ${day ? 'Completed' : 'Not completed'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickMarkToday;
