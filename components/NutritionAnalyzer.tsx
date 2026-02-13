import React, { useState } from 'react';
import { analyzeNutrition } from '../services/geminiService';
import { NutritionAnalysis } from '../types';
import { Activity, Loader2, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const NutritionAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeNutrition(input);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze nutrition. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = analysis ? [
    { name: 'Protein', value: analysis.macros.protein, fill: '#10b981' },
    { name: 'Carbs', value: analysis.macros.carbs, fill: '#f59e0b' },
    { name: 'Fats', value: analysis.macros.fats, fill: '#ef4444' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-stone-900">Nutrition Analyzer</h2>
        <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
          Not sure how healthy your lunch was? Describe it below and get an instant AI breakdown.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-2xl shadow-sm">
            <textarea
              rows={4}
              className="block w-full rounded-2xl border-stone-300 pl-4 pr-12 py-4 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm text-lg"
              placeholder="e.g. A bowl of oatmeal with blueberries, honey, and almonds..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute bottom-4 right-4 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Activity className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
        )}

        {analysis && (
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden animate-fade-in">
            {/* Header / Score */}
            <div className="bg-stone-900 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{analysis.foodItem}</h3>
                  <p className="text-stone-400 mt-1">{analysis.summary}</p>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4
                    ${analysis.healthRating >= 8 ? 'border-green-500 text-green-500' : 
                      analysis.healthRating >= 5 ? 'border-yellow-500 text-yellow-500' : 
                      'border-red-500 text-red-500'}
                  `}>
                    {analysis.healthRating}
                  </div>
                  <span className="text-xs text-stone-500 mt-1">Health Score</span>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Macros Chart */}
              <div className="h-64">
                <h4 className="font-semibold text-stone-900 mb-4">Macro Breakdown (g)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={50} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-sm font-medium text-stone-500 mt-2">
                  Total Calories: <span className="text-stone-900">{analysis.macros.calories}</span>
                </p>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-semibold text-stone-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 text-rose-500 mr-2" />
                  Healthier Alternatives
                </h4>
                <ul className="space-y-3">
                  {analysis.suggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start bg-emerald-50 p-3 rounded-lg text-sm text-stone-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 mr-2 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionAnalyzer;