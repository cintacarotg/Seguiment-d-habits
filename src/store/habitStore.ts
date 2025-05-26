import { create } from 'zustand';
import { Habit } from '../types/Habit';

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

interface HabitStore {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak'>) => void;
    removeHabit: (id: string) => void;
    updateHabit: (id: string, habit: Partial<Habit>) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
    habits: [],
    addHabit: (habitData) => set((state) => ({
        habits: [...state.habits, {
            ...habitData,
            id: generateId(),
            createdAt: new Date(),
            streak: 0
        }]
    })),
    removeHabit: (id) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== id)
    })),
    updateHabit: (id, habitData) => set((state) => ({
        habits: state.habits.map(habit => 
            habit.id === id ? { ...habit, ...habitData } : habit
        )
    }))
}));
