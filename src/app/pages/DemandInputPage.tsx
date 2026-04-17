import { useState } from 'react';
import { TrendingUp, Calendar, Tag, ShoppingCart, ChevronRight, Save } from 'lucide-react';
import { Link } from 'react-router';
import { useDemand } from '../components/DemandContext';
import { toast } from 'sonner';

type EventType = 'normal' | 'peak' | 'promo' | 'holiday' | 'bulk-order';

interface EventCondition {
  type: EventType;
  label: string;
  multiplier: number;
  color: string;
  description: string;
}

const eventConditions: EventCondition[] = [
  { type: 'normal', label: 'Normal Day', multiplier: 1.0, color: 'bg-gray-100 text-gray-700 border-gray-300', description: 'Regular operating conditions with standard demand' },
  { type: 'peak', label: 'Peak Day', multiplier: 1.5, color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'High traffic period (weekend, lunch/dinner rush)' },
  { type: 'promo', label: 'Promo Day', multiplier: 1.8, color: 'bg-purple-100 text-purple-700 border-purple-300', description: 'Active promotional campaign driving increased orders' },
  { type: 'holiday', label: 'Holiday', multiplier: 2.0, color: 'bg-red-100 text-red-700 border-red-300', description: 'Special holiday with significantly higher demand' },
  { type: 'bulk-order', label: 'Bulk Order', multiplier: 1.4, color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Pre-arranged large order for event or catering' },
];

export default function DemandInputPage() {
  const { demandData, targetDate, setTargetDate, updateDemandData, saveDemandToFirebase } = useDemand();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentEvent = eventConditions.find(e => e.multiplier === demandData.multiplier) || eventConditions[0];

  const handleBaselineChange = (newBaseline: number) => {
    const adjustedDemand = Math.round(newBaseline * currentEvent.multiplier) + demandData.bulkOrderSize;
    updateDemandData({ baselineDemand: newBaseline, adjustedDemand });
  };

  const handleEventChange = (event: EventCondition) => {
    const adjustedDemand = Math.round(demandData.baselineDemand * event.multiplier) + demandData.bulkOrderSize;
    updateDemandData({ multiplier: event.multiplier, adjustedDemand });
  };

  const handleBulkOrderChange = (newBulkSize: number) => {
    const adjustedDemand = Math.round(demandData.baselineDemand * currentEvent.multiplier) + newBulkSize;
    updateDemandData({ bulkOrderSize: newBulkSize, adjustedDemand });
  };

  // NEW: The function that runs when you click the Save button
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      await saveDemandToFirebase();
      toast.success(`Demand for ${targetDate} saved to database!`);
    } catch (error) {
      toast.error('Failed to save to Firebase. Check your console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Daily Demand & Forecast</h2>
          <p className="text-gray-600 mt-1">Set expected demand and operational conditions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border-none outline-none text-sm font-medium text-gray-700 bg-transparent cursor-pointer w-full"
            />
          </div>

          {/* NEW SAVE BUTTON */}
          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save to Database'}
          </button>
        </div>
      </div>

      {/* Baseline Demand Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Baseline Demand Forecast</h3>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Target: {targetDate}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Orders (Baseline)
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={demandData.baselineDemand}
              onChange={(e) => handleBaselineChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">50 orders</span>
              <span className="text-2xl font-semibold text-blue-600">{demandData.baselineDemand} orders</span>
              <span className="text-sm text-gray-600">500 orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Condition Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {eventConditions.map((event) => {
            const Icon = event.type === 'peak' ? TrendingUp :
                        event.type === 'promo' ? Tag :
                        event.type === 'holiday' ? Calendar :
                        event.type === 'bulk-order' ? ShoppingCart :
                        Calendar;

            const isSelected = currentEvent.type === event.type;

            return (
              <button
                key={event.type}
                onClick={() => handleEventChange(event)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `${event.color} border-current shadow-sm`
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? '' : 'text-gray-500'}`} />
                <div className={`font-medium mb-1 ${isSelected ? '' : 'text-gray-900'}`}>{event.label}</div>
                <div className={`text-xs ${isSelected ? 'opacity-90' : 'text-gray-500'}`}>{event.multiplier}x multiplier</div>
              </button>
            );
          })}
        </div>
      </div>

      {currentEvent.type === 'bulk-order' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200 bg-blue-50/30">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Bulk Order Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Order Quantity (Flat amount added after multiplier)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={demandData.bulkOrderSize}
                onChange={(e) => handleBulkOrderChange(Number(e.target.value))}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Demand Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Baseline Demand</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{demandData.baselineDemand}</p>
          <p className="text-xs text-gray-500 mt-1">orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Event Multiplier</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{currentEvent.multiplier}x</p>
          <p className="text-xs text-gray-500 mt-1">{currentEvent.label}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200 bg-blue-50">
          <p className="text-sm font-bold text-blue-800">Final Expected Demand</p>
          <p className="text-4xl font-black text-blue-900 mt-1">{demandData.adjustedDemand}</p>
          <p className="text-xs font-medium text-blue-600 mt-1">Total orders globally linked</p>
        </div>
      </div>
      
      {/* Proceed Button */}
      <div className="flex justify-end pt-4">
         <Link
            to="/takt-time"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Proceed to Takt Time Analysis
            <ChevronRight className="w-5 h-5" />
          </Link>
      </div>
    </div>
  );
}