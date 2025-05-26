import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Typography,
    Chip,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useHabitStore } from '../store/habitStore';

export const HabitList = () => {
    const habits = useHabitStore(state => state.habits);
    const updateHabit = useHabitStore(state => state.updateHabit);
    const removeHabit = useHabitStore(state => state.removeHabit);

    const handleCheck = (id: string) => {
        updateHabit(id, {
            lastChecked: new Date(),
            streak: (habits.find(h => h.id === id)?.streak || 0) + 1
        });
    };

    const getFrequencyText = (frequency: string) => {
        const texts = {
            daily: 'Diario',
            weekly: 'Semanal',
            monthly: 'Mensual'
        };
        return texts[frequency as keyof typeof texts] || frequency;
    };

    if (habits.length === 0) {
        return (
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography align="center" color="text.secondary">
                    No hay hábitos definidos. ¡Añade uno nuevo!
                </Typography>
            </Paper>
        );
    }

    return (
        <List>
            {habits.map((habit) => (
                <ListItem
                    key={habit.id}
                    component={Paper}
                    sx={{ mb: 2, p: 2 }}
                    secondaryAction={
                        <Box>
                            <IconButton
                                edge="end"
                                aria-label="marcar como completado"
                                onClick={() => handleCheck(habit.id)}
                                sx={{ mr: 1 }}
                                color="primary"
                            >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="eliminar"
                                onClick={() => removeHabit(habit.id)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    }
                >
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {habit.name}
                                <Chip
                                    label={getFrequencyText(habit.frequency)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                {habit.streak > 0 && (
                                    <Chip
                                        label={`Racha: ${habit.streak}`}
                                        size="small"
                                        color="success"
                                    />
                                )}
                            </Box>
                        }
                        secondary={
                            <>
                                <Typography variant="body2" component="span" display="block">
                                    {habit.description}
                                </Typography>
                                {habit.lastChecked && (
                                    <Typography variant="caption" color="text.secondary">
                                        Última vez: {new Date(habit.lastChecked).toLocaleDateString()}
                                    </Typography>
                                )}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};
