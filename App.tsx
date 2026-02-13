import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RecipeGenerator from './components/RecipeGenerator';
import NutritionAnalyzer from './components/NutritionAnalyzer';
import HealthAssistant from './components/HealthAssistant';
import WellnessPlanner from './components/WellnessPlanner';
import Footer from './components/Footer';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.RECIPE_GENERATOR:
        return <RecipeGenerator />;
      case ViewState.NUTRITION_ANALYZER:
        return <NutritionAnalyzer />;
      case ViewState.HEALTH_ASSISTANT:
        return <HealthAssistant />;
      case ViewState.WELLNESS_PLANNER:
        return <WellnessPlanner />;
      case ViewState.HOME:
      default:
        return <Hero onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;