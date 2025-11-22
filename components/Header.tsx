import React, { useState } from 'react';
import type { AppMode } from '../App';

interface HeaderProps {
  onSetMode: (mode: AppMode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
    <path fillRule="evenodd" d="M10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm0 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm9-6a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm11.657-6.243a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 15.536a1 1 0 010 1.414l-.708.707a1 1 0 11-1.414-1.414l.708-.707a1 1 0 011.414 0zm10.607 1.414a1 1 0 00-1.414-1.414l-.708.707a1 1 0 001.414 1.414l.708-.707zM5.05 4.464A1 1 0 103.636 3.05l-.707.708A1 1 0 104.343 5.88l.707-.707z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293a8 8 0 01-10.586-10.586 1 1 0 00-1.32-1.497A10 10 0 1018.79 14.613a1 1 0 00-1.497-1.32z" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onSetMode, isDarkMode, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (mode: AppMode) => {
    onSetMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <header className={`shadow-md sticky top-0 z-50 w-full border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur' : 'bg-white border-transparent'}`}>
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-blue-700 dark:text-blue-400 cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          Java Interview
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
           <button 
             onClick={() => handleNavClick('study')} 
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 dark:text-slate-200 dark:hover:text-blue-400"
           >
             Học lý thuyết
           </button>
           <button 
             onClick={() => handleNavClick('flashcards')} 
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 dark:text-slate-200 dark:hover:text-blue-400"
           >
             Flashcards
           </button>
           <button 
             onClick={() => handleNavClick('interview')} 
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-transform duration-200 hover:scale-105"
           >
             Phỏng vấn thử
           </button>
           <button 
             onClick={() => handleNavClick('feedback')} 
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 dark:text-slate-200 dark:hover:text-blue-400"
           >
             Liên hệ
           </button>
           <button
             onClick={onToggleTheme}
             className="ml-4 p-2 rounded-full border border-slate-200 hover:border-blue-500 transition-colors duration-200 dark:border-slate-700 dark:hover:border-blue-400"
             aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
           >
             {isDarkMode ? <SunIcon /> : <MoonIcon />}
           </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full border border-slate-200 hover:border-blue-500 transition-colors duration-200 dark:border-slate-700 dark:hover:border-blue-400"
              aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-16 6h16" />
                    </svg>
                )}
            </button>
        </div>
      </nav>

       {/* Mobile Menu Dropdown */}
       <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden shadow-lg border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => handleNavClick('study')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                Học lý thuyết
            </button>
            <button onClick={() => handleNavClick('flashcards')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                Flashcards
            </button>
             <button onClick={() => handleNavClick('interview')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                Phỏng vấn thử
            </button>
            <button onClick={() => handleNavClick('feedback')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                Liên hệ
            </button>
       </div>
    </header>
  );
};

export default Header;