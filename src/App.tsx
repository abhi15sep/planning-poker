import { Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import CreateRoomPage from './pages/CreateRoomPage'
import JoinRoomPage from './pages/JoinRoomPage'
import GameRoomPage from './pages/GameRoomPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  useTheme()

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomId" element={<GameRoomPage />} />
        <Route path="/room/:roomId/join" element={<JoinRoomPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
