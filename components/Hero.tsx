import React from 'react';
import { ChefHat, Activity, ArrowRight, Stethoscope, CalendarDays } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden bg-stone-50 pt-16 pb-32 space-y-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl tracking-tight font-extrabold text-stone-900 sm:text-5xl md:text-6xl mb-6">
            <span className="block">Your Complete AI</span>
            <span className="block text-emerald-600">Health Ecosystem</span>
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base text-stone-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            From fridge-to-fork recipes to personalized workout plans and medical chats. We have everything you need to live a healthier life.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 gap-4 flex-wrap">
            <button
              onClick={() => onNavigate(ViewState.RECIPE_GENERATOR)}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg transition-all shadow-lg hover:shadow-emerald-200"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Smart Recipes
            </button>
            <button
              onClick={() => onNavigate(ViewState.WELLNESS_PLANNER)}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-stone-200 text-base font-medium rounded-full text-emerald-700 bg-white hover:bg-emerald-50 md:py-4 md:text-lg transition-all shadow-lg"
            >
              <CalendarDays className="w-5 h-5 mr-2" />
              Get My Plan
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ChefHat className="text-orange-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Smart Recipes</h3>
            <p className="text-sm text-stone-500">
              Input ingredients you have, and let AI craft the perfect recipe that minimizes waste.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Macro Analysis</h3>
            <p className="text-sm text-stone-500">
              Instant breakdown of calories, proteins, fats, and carbs for any meal description.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Stethoscope className="text-teal-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Dr. AI Assistant</h3>
            <p className="text-sm text-stone-500">
              Chat with our AI doctor for health tips, symptom info, and general wellness advice.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <CalendarDays className="text-indigo-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Wellness Plan</h3>
            <p className="text-sm text-stone-500">
              Get a full weekly workout schedule and nutrition guide tailored to your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;