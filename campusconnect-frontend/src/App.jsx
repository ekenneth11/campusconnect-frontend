import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './MainRouter';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <div className="ml-64 min-h-screen">
          <MainRouter />
        </div>
      </Router>
    </>
  );
}

export default App;