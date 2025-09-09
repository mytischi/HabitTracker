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
    
    // Настраиваем начало недели с понедельника
    const startDate = new Date(firstDay);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = (firstDayOfWeek + 6) % 7; // Сколько дней от понедельника
    startDate.setDate(startDate.getDate() - daysFromMonday);
    
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const daysToSunday = (7 - lastDayOfWeek) % 7; // Сколько дней до воскресенья
    endDate.setDate(endDate.getDate() + daysToSunday);
    
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
    // Используем локальную дату вместо UTC для избежания проблем с часовыми поясами
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getHabitStatus = (habit: Habit, date: Date): boolean | null => {
    const dateKey = formatDateKey(date);
    return habit.data[dateKey] ?? null;
  };

  const handleHabitClick = (habit: Habit, date: Date) => {
    const dateKey = formatDateKey(date);
    const currentStatus = getHabitStatus(habit, date);
    const newStatus = currentStatus === true ? null : true;
    onUpdateProgress(habit.id, dateKey, newStatus);
  };

  const markToday = (habit: Habit) => {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const currentStatus = getHabitStatus(habit, today);
    const newStatus = currentStatus === true ? null : true;
    onUpdateProgress(habit.id, todayKey, newStatus);
  };

  const getStatusSymbol = (status: boolean | null): string => {
    if (status === true) return 'X';
    return '.';
  };

  const getStatusColor = (status: boolean | null): string => {
    if (status === true) return 'text-black dark:text-white';
    return 'text-gray-400 dark:text-gray-600';
  };

  // Функция для определения стиля кнопки календаря
  const getCalendarButtonStyle = (habit: Habit, currentDay: CalendarDay): string => {
    const currentStatus = getHabitStatus(habit, currentDay.date);
    
    if (currentStatus === true) {
      // Выполненный день - используем цвета как в Quick Mark Today для не отмеченных дней
      return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    } else {
      // Не отмеченный день - только обводка, без заливки
      return 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
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
              ←
            </button>
            <h3 className="text-lg font-bold text-center flex-1">{monthName}</h3>
            <button
              onClick={() => changeMonth('next')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded text-sm"
            >
              →
            </button>
          </div>

          {/* Individual Habit Calendars */}
          <div className="space-y-6">
            {habits.map(habit => {
              const streak = calculateStreak(habit);
              return (
                <div key={habit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {/* Habit Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-2/3 pr-4">
                      <h4 className="text-lg font-semibold text-left break-words">{habit.name}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400 block mt-1 text-left">
                        {streak} day{streak !== 1 ? 's' : ''} streak
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
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="p-1 text-center font-medium text-gray-600 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((day, index) => {
                      const status = getHabitStatus(habit, day.date);
                      const buttonStyle = getCalendarButtonStyle(habit, day);
                      
                      const todayRing = day.isToday ? 'ring-2 ring-blue-500' : '';
                      const opacity = !day.isCurrentMonth ? 'opacity-30' : '';
                      
                      return (
                        <div key={index} className="p-1 text-center">
                          <button
                            onClick={() => handleHabitClick(habit, day.date)}
                            className={`w-8 h-8 flex items-center justify-center transition-colors duration-200 rounded-lg border text-sm font-medium ${buttonStyle} ${todayRing} ${opacity} hover:shadow-md`}
                            disabled={!day.isCurrentMonth}
                            title={`${day.date.toLocaleDateString()}: ${status === true ? 'Completed' : 'Not marked'}`}
                          >
                            {day.dayOfMonth}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="mt-4 flex justify-center items-center space-x-6 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600"></div>
                      <span className="text-gray-600 dark:text-gray-400">Not marked</span>
                    </div>
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
