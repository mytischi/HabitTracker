import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HabitForm from './components/HabitForm';
import QuickMarkToday from './components/QuickMarkToday';
import HabitCalendar from './components/HabitCalendar';
import { Habit, HabitData } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    // Load habits from localStorage
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    // Save habits to localStorage when changed
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addHabit = (habitName: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      createdAt: new Date().toISOString(),
      data: {}
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabitProgress = (habitId: string, date: string, completed: boolean) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newData = { ...habit.data };
        newData[date] = completed;
        return { ...habit, data: newData };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <div className="container mx-auto px-4 py-8">
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme}
          currentDate={currentDate}
        />
        
        <div className="mt-8 space-y-6">
          {/* Quick Mark Today - Top */}
          <QuickMarkToday 
            habits={habits}
            onUpdateProgress={updateHabitProgress}
          />
          
          {/* Habit Form - Below Quick Mark Today */}
          <HabitForm onAddHabit={addHabit} />
          
          {/* Habit Calendar - Bottom */}
          <HabitCalendar 
            habits={habits}
            currentDate={currentDate}
            onUpdateProgress={updateHabitProgress}
            onDeleteHabit={deleteHabit}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
