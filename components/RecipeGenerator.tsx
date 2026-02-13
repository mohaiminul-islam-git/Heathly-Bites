import React, { useState } from 'react';
import { generateRecipe } from '../services/geminiService';
import { Recipe } from '../types';
import { Loader2, ChefHat, Clock, Gauge, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RecipeGenerator: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe(ingredients, dietary, mealType);
      setRecipe(result);
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = recipe ? [
    { name: 'Protein', value: recipe.macros.protein, color: '#10b981' }, // emerald-500
    { name: 'Carbs', value: recipe.macros.carbs, color: '#f59e0b' },    // amber-500
    { name: 'Fats', value: recipe.macros.fats, color: '#ef4444' },      // red-500
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Form */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center">
              <ChefHat className="mr-3 text-emerald-600" />
              AI Kitchen
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  What ingredients do you have?
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                  placeholder="e.g., chicken breast, spinach, sweet potato, greek yogurt..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                    placeholder="e.g., Keto, Vegan, Gluten-free"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    className="w-full rounded-xl border-stone-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-stone-50"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                    <option>Dessert</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Cooking up ideas...
                  </>
                ) : (
                  'Generate Recipe'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {recipe && (
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden animate-fade-in">
              <div className="bg-emerald-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white mb-2">{recipe.title}</h3>
                <p className="text-emerald-100">{recipe.description}</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 text-sm font-medium text-stone-600 bg-stone-50 p-4 rounded-xl justify-around">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                    {recipe.cookingTime}
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-emerald-600" />
                    {recipe.difficulty}
                  </div>
                  <div className="flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-orange-500" />
                    {recipe.macros.calories} kcal
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-stone-900 mb-4 border-b border-stone-100 pb-2">Ingredients</h4>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start text-stone-600">
                          <span className="w-2 h-2 mt-2 bg-emerald-400 rounded-full mr-3 shrink-0"></span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Macro Chart */}
                  <div className="h-64 relative">
                     <h4 className="text-lg font-semibold text-stone-900 mb-2 border-b border-stone-100 pb-2">Nutrition</h4>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => `${value}g`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-stone-900 mb-4 border-b border-stone-100 pb-2">Instructions</h4>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm mr-4">
                          {idx + 1}
                        </span>
                        <p className="text-stone-600 mt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {!recipe && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-stone-400 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
              <ChefHat className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Your AI-generated recipe will appear here.</p>
              <p className="text-sm">Enter your ingredients to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;