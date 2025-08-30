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
  const [selectedMonth, setSelectedMonth] = useState(new Date());

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

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setSelectedMonth(newMonth);
  };

  const calendarDays = getCalendarDays(selectedMonth);
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  


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
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => changeMonth('prev')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded text-sm"
            >
              ← Previous
            </button>
            <h3 className="text-lg font-bold">{monthName}</h3>
            <button
              onClick={() => changeMonth('next')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded text-sm"
            >
              Next →
            </button>
          </div>

          {/* Individual Habit Calendars */}
          <div className="space-y-6">
            {habits.map(habit => {
              const streak = calculateStreak(habit);
              return (
                <div key={habit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {/* Habit Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold">{habit.name}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        [*] {streak} day{streak !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => markToday(habit)}
                        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
                      >
                        Mark Today
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
                        title="Delete habit"
                      >
                        [X]
                      </button>
                    </div>
                  </div>

                  {/* Mini Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-1 text-center font-medium text-gray-600 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((day, index) => {
                      const status = getHabitStatus(habit, day.date);
                      return (
                        <div key={index} className="p-1 text-center">
                          <button
                            onClick={() => handleHabitClick(habit, day.date)}
                            className={`w-6 h-6 flex items-center justify-center hover:bg-opacity-20 hover:bg-current transition-colors rounded text-xs ${
                              getStatusColor(status)
                            } ${
                              day.isToday ? 'ring-2 ring-blue-500' : ''
                            } ${
                              !day.isCurrentMonth ? 'opacity-30' : ''
                            }`}
                            disabled={!day.isCurrentMonth}
                            title={`${day.date.toLocaleDateString()}: ${status === true ? 'Completed' : status === false ? 'Failed' : 'Not marked'}`}
                          >
                            {day.dayOfMonth}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Legend for this habit */}
                  <div className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400">
                    <span className="mr-4">
                      <span className="text-black dark:text-white">X</span> Completed
                    </span>
                    <span className="mr-4">
                      <span className="text-gray-600 dark:text-gray-400">O</span> Failed
                    </span>
                    <span>
                      <span className="text-gray-400 dark:text-gray-600">.</span> Empty
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* General Legend */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Click on any date to mark/unmark completion. Today's date is highlighted with a blue ring.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default HabitCalendar;
