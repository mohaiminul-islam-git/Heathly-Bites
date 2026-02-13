import React, { useState } from 'react';
import { generateWellnessPlan } from '../services/geminiService';
import { WellnessPlan } from '../types';
import { 
  Dumbbell, Utensils, Droplets, Moon, 
  Loader2, Printer, Activity, CalendarDays 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const WellnessPlanner: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Female',
    weight: '',
    height: '',
    goal: 'Weight Loss',
    activityLevel: 'Moderate',
  });
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WellnessPlan | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateWellnessPlan(
        formData.age,
        formData.gender,
        formData.weight,
        formData.height,
        formData.goal,
        formData.activityLevel
      );
      setPlan(result);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const macroData = plan ? [
    { name: 'Protein', value: plan.targetMacros.protein, color: '#10b981' },
    { name: 'Carbs', value: plan.targetMacros.carbs, color: '#f59e0b' },
    { name: 'Fats', value: plan.targetMacros.fats, color: '#ef4444' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 print:hidden">
        <h2 className="text-3xl font-bold text-stone-900">Professional Wellness Planner</h2>
        <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
          Get a fully personalized weekly workout schedule and nutrition guide tailored to your body and goals.
        </p>
      </div>

      {!plan && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                <input
                  required
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Weight (kg)</label>
                <input
                  required
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Height (cm)</label>
                <input
                  required
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                  placeholder="170"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Primary Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Maintenance</option>
                  <option>Improve Endurance</option>
                  <option>Flexibility & Balance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-stone-300 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 shadow-sm"
                >
                  <option>Sedentary (Office job)</option>
                  <option>Lightly Active (1-3 days/week)</option>
                  <option>Moderate (3-5 days/week)</option>
                  <option>Very Active (6-7 days/week)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Analyzing Biometrics...
                </>
              ) : (
                'Generate Personalized Plan'
              )}
            </button>
          </form>
        </div>
      )}

      {plan && (
        <div className="space-y-8 animate-fade-in">
          {/* Action Bar */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center text-emerald-600 mb-2">
                <Activity className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Daily Calories</h3>
              </div>
              <p className="text-3xl font-bold text-stone-900">{plan.targetMacros.calories}</p>
              <p className="text-sm text-stone-500">kcal recommended</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center text-blue-600 mb-2">
                <Droplets className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Hydration</h3>
              </div>
              <p className="text-3xl font-bold text-stone-900">{plan.hydrationGoal}</p>
              <p className="text-sm text-stone-500">daily water intake</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center text-indigo-600 mb-2">
                <Moon className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Sleep</h3>
              </div>
              <p className="text-3xl font-bold text-stone-900">{plan.sleepGoal}</p>
              <p className="text-sm text-stone-500">nightly rest</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center text-orange-600 mb-2">
                <CalendarDays className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Frequency</h3>
              </div>
              <p className="text-3xl font-bold text-stone-900">
                {plan.weeklySchedule.filter(d => d.focus !== 'Rest').length}
              </p>
              <p className="text-sm text-stone-500">active days/week</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Workout Schedule */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-stone-900 text-white p-6 flex items-center">
                  <Dumbbell className="w-6 h-6 mr-3 text-emerald-400" />
                  <h3 className="text-xl font-bold">Weekly Routine</h3>
                </div>
                <div className="p-6 space-y-6">
                  {plan.weeklySchedule.map((day, idx) => (
                    <div key={idx} className="border-b border-stone-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-lg text-stone-800">{day.day}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          day.focus === 'Rest' 
                            ? 'bg-stone-100 text-stone-500' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {day.focus}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center text-sm text-stone-600 mb-2">
                         <span className="font-semibold mr-2">Duration:</span> {day.duration}
                      </div>
                      <ul className="space-y-1">
                        {day.exercises.map((ex, i) => (
                          <li key={i} className="flex items-start text-stone-600 text-sm">
                            <span className="w-1.5 h-1.5 mt-1.5 bg-stone-300 rounded-full mr-2 shrink-0"></span>
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Nutrition */}
            <div className="space-y-6">
              {/* Macros Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 h-80">
                <h3 className="font-bold text-stone-900 mb-4">Macro Split</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Meal Guide */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-emerald-600 text-white p-6 flex items-center">
                  <Utensils className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-bold">Sample Day</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Breakfast</h4>
                    <p className="text-stone-800 font-medium">{plan.mealGuide.breakfast}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Lunch</h4>
                    <p className="text-stone-800 font-medium">{plan.mealGuide.lunch}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Dinner</h4>
                    <p className="text-stone-800 font-medium">{plan.mealGuide.dinner}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Snack</h4>
                    <p className="text-stone-800 font-medium">{plan.mealGuide.snack}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessPlanner;