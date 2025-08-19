import React, { useState } from 'react';

interface HabitFormProps {
  onAddHabit: (habitName: string) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim());
      setHabitName('');
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Add New Habit
        </h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1 border border-current hover:bg-opacity-20 hover:bg-current transition-colors rounded text-sm"
        >
          {isVisible ? '[-] Hide' : '[+] Show'}
        </button>
      </div>
      
      {isVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="habitName" className="block mb-2">
              Habit name:
            </label>
            <input
              type="text"
              id="habitName"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              placeholder="e.g., Morning exercise"
              maxLength={50}
            />
          </div>
          
          <button
            type="submit"
            disabled={!habitName.trim()}
            className="w-full p-3 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            [+] Add Habit
          </button>
        </form>
      )}
    </div>
  );
};

export default HabitForm;
