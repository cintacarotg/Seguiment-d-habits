import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Typography, TextField, Button, Snackbar, IconButton, List, ListItem, ListItemText, Box } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [lastAction, setLastAction] = useState(null); // { type: 'add', habit }
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarMarks, setCalendarMarks] = useState(() => {
    const stored = localStorage.getItem('calendarMarks');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('calendarMarks', JSON.stringify(calendarMarks));
  }, [habits, calendarMarks]);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const habit = { id: Date.now(), name: newHabit.trim() };
    setHabits([...habits, habit]);
    setLastAction({ type: 'add', habit });
    setMessage('Hàbit afegit!');
    setOpen(true);
    setNewHabit('');
  };

  const handleToggleComplete = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    const toggled = habits.find(h => h.id === id);
    setLastAction({ type: 'toggle', habit: toggled });
    setMessage(
      toggled.completed
        ? 'Hàbit marcat com a pendent.'
        : 'Hàbit marcat com a completat!'
    );
    setOpen(true);
    // Marcar/desmarcar el dia al calendari
    const today = new Date().toISOString().slice(0, 10);
    setCalendarMarks(prev => {
      const newMarks = { ...prev };
      if (!toggled.completed) {
        // Marquem el dia
        newMarks[today] = true;
      } else {
        // Desmarquem el dia si no hi ha cap hàbit completat
        newMarks[today] = false;
      }
      return newMarks;
    });
  };

  const handleDeleteHabit = (id) => {
    const deletedHabit = habits.find(h => h.id === id);
    setHabits(habits.filter(h => h.id !== id));
    setLastAction({ type: 'delete', habit: deletedHabit });
    setMessage('Hàbit eliminat!');
    setOpen(true);
  };

  const handleUndo = () => {
    if (lastAction?.type === 'add') {
      setHabits(habits.filter(h => h.id !== lastAction.habit.id));
      setMessage('Acció desfeta. Hàbit eliminat.');
      setOpen(true);
      setLastAction(null);
    } else if (lastAction?.type === 'toggle') {
      // Desfem el toggle
      const updatedHabits = habits.map(habit =>
        habit.id === lastAction.habit.id
          ? { ...habit, completed: !habit.completed }
          : habit
      );
      setHabits(updatedHabits);
      setMessage('Acció desfeta. Estat del hàbit restaurat.');
      setOpen(true);
      setLastAction(null);
      // Desfem el marcatge del calendari
      const today = new Date().toISOString().slice(0, 10);
      setCalendarMarks(prev => {
        const newMarks = { ...prev };
        newMarks[today] = !newMarks[today];
        return newMarks;
      });
    } else if (lastAction?.type === 'delete') {
      setHabits([...habits, lastAction.habit]);
      setMessage('Acció desfeta. Hàbit restaurat.');
      setOpen(true);
      setLastAction(null);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // Funció per marcar els dies al calendari
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const key = date.toISOString().slice(0, 10);
      if (calendarMarks[key]) {
        return 'calendar-completed';
      }
    }
    return null;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 4, bgcolor: '#f5f5f5', borderRadius: 3, boxShadow: 3, p: 4, color: '#222' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#222' }}>🗓️ Seguiment d'hàbits</Typography>
      {/* Calendari de compliment */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Calendar
          value={calendarDate}
          onChange={setCalendarDate}
          tileClassName={tileClassName}
          locale="ca-ES"
        />
      </Box>
      <Box component="form" onSubmit={handleAddHabit} sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Afegeix un nou hàbit..."
          variant="outlined"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: '#222' } }}
          InputProps={{ style: { color: '#222' } }}
        />
        <Button type="submit" variant="contained" color="primary" endIcon={<AddIcon />}>
          Afegir
        </Button>
        {lastAction?.type === 'add' && (
          <IconButton color="secondary" onClick={handleUndo} title="Desfer" sx={{ ml: 1 }}>
            <UndoIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {habits.map(habit => (
          <ListItem
            key={habit.id}
            divider
            sx={{
              bgcolor: habit.completed ? '#d0f5e8' : '#fff',
              borderRadius: 2,
              mb: 1,
              boxShadow: habit.completed ? 2 : 0,
              transition: 'all 0.2s',
              opacity: habit.completed ? 0.7 : 1
            }}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={habit.completed ? 'outlined' : 'contained'}
                  color={habit.completed ? 'success' : 'primary'}
                  onClick={() => handleToggleComplete(habit.id)}
                  sx={{ minWidth: 120 }}
                >
                  {habit.completed ? 'Desmarcar' : 'Completat'}
                </Button>
                <IconButton color="error" onClick={() => handleDeleteHabit(habit.id)} title="Elimina hàbit">
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={habit.name}
              primaryTypographyProps={{
                style: {
                  color: habit.completed ? '#388e3c' : '#222',
                  textDecoration: habit.completed ? 'line-through' : 'none',
                  fontWeight: habit.completed ? 600 : 400
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default App;
