import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';
import { useHabitStore } from '../store/habitStore';

export const AddHabitDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [showSuccess, setShowSuccess] = useState(false);
    
    const addHabit = useHabitStore(state => state.addHabit);

    const handleSubmit = () => {
        if (name.trim() && description.trim()) {
            addHabit({
                name,
                description,
                frequency
            });
            setShowSuccess(true);
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setFrequency('daily');
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Añadir nuevo hábito</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nombre del hábito"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Frecuencia</InputLabel>
                            <Select
                                value={frequency}
                                label="Frecuencia"
                                onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                            >
                                <MenuItem value="daily">Diario</MenuItem>
                                <MenuItem value="weekly">Semanal</MenuItem>
                                <MenuItem value="monthly">Mensual</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Añadir
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Hábito añadido correctamente
                </Alert>
            </Snackbar>
        </>
    );
};
