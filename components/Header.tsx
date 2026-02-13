import React from 'react';
import { Leaf, Menu, X, Stethoscope, CalendarDays } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'AI Chef', view: ViewState.RECIPE_GENERATOR },
    { label: 'Nutrition', view: ViewState.NUTRITION_ANALYZER },
    { label: 'Dr. AI', view: ViewState.HEALTH_ASSISTANT },
    { label: 'My Plan', view: ViewState.WELLNESS_PLANNER },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate(ViewState.HOME)}
          >
            <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="ml-2 text-xl font-bold text-stone-800 tracking-tight">
              Healthy Bites <span className="text-emerald-600">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.view)}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  currentView === item.view
                    ? 'text-emerald-600'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label === 'Dr. AI' && <Stethoscope className="w-4 h-4 mr-1.5" />}
                {item.label === 'My Plan' && <CalendarDays className="w-4 h-4 mr-1.5" />}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-stone-500 hover:text-stone-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  currentView === item.view
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {item.label === 'Dr. AI' && <Stethoscope className="w-4 h-4 mr-2" />}
                {item.label === 'My Plan' && <CalendarDays className="w-4 h-4 mr-2" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;