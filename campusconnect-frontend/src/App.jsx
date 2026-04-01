import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './MainRouter';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <MainRouter />
      </Router>
    </>
  );
}

export default App;