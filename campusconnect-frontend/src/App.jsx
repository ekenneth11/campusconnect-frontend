
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { BrowserRouter as Router} from 'react-router-dom'
import MainRouter from './MainRouter'
function App() {


  return (
    <>
    <Router>
      <MainRouter />
    </Router>
    </>
  )
}

export default App
