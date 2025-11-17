import React, { useState } from 'react';
import type { AppMode } from '../App';

interface HeaderProps {
  onSetMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ onSetMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (mode: AppMode) => {
    onSetMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-blue-700 cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          Java Interview
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
           <button 
             onClick={() => handleNavClick('study')} 
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
           >
             Học lý thuyết
           </button>
           <button 
             onClick={() => handleNavClick('flashcards')} 
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200"
           >
             Flashcards
           </button>
           <button 
             onClick={() => handleNavClick('interview')} 
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-transform duration-200 hover:scale-105"
           >
             Phỏng vấn thử
           </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
       <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg border-t border-slate-200`}>
            <button onClick={() => handleNavClick('study')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                Học lý thuyết
            </button>
            <button onClick={() => handleNavClick('flashcards')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                Flashcards
            </button>
             <button onClick={() => handleNavClick('interview')} className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                Phỏng vấn thử
            </button>
       </div>
    </header>
  );
};

export default Header;