export interface Habit {
    id: string;
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    createdAt: Date;
    lastChecked?: Date;
    streak: number;
}
