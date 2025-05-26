import { useState } from 'react'
import { Box, Container, Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AddHabitDialog } from './components/AddHabitDialog'
import { HabitList } from './components/HabitList'
import './App.css'

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Seguimiento de Hábitos
        </Typography>
        
        <HabitList />
        
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setIsDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        <AddHabitDialog 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
        />
      </Box>
    </Container>
  )
}

export default App
