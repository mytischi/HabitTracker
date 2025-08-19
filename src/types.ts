export interface HabitData {
  [date: string]: boolean;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  data: HabitData;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
