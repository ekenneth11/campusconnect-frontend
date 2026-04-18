import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './MainRouter';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-1">
              <Navigation />
            </div>
            <div className="lg:col-span-2">
              <MainRouter />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-black"
            aria-label="Toggle light and dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi ${isDark ? 'bi-lightbulb' : 'bi-lightbulb-fill'}`} aria-hidden="true" />
          </button>
        </div>
      </Router>
    </>
  );
}

export default App;