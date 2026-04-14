import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Tag, ShoppingCart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useDemand } from '../components/DemandContext';

type EventType = 'normal' | 'peak' | 'promo' | 'holiday' | 'bulk-order';

interface EventCondition {
  type: EventType;
  label: string;
  multiplier: number;
  color: string;
  description: string;
}

const eventConditions: EventCondition[] = [
  {
    type: 'normal',
    label: 'Normal Day',
    multiplier: 1.0,
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Regular operating conditions with standard demand'
  },
  {
    type: 'peak',
    label: 'Peak Day',
    multiplier: 1.5,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'High traffic period (weekend, lunch/dinner rush)'
  },
  {
    type: 'promo',
    label: 'Promo Day',
    multiplier: 1.8,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Active promotional campaign driving increased orders'
  },
  {
    type: 'holiday',
    label: 'Holiday',
    multiplier: 2.0,
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Special holiday with significantly higher demand'
  },
  {
    type: 'bulk-order',
    label: 'Bulk Order',
    multiplier: 1.4,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Pre-arranged large order for event or catering'
  },
];

export default function DemandInputPage() {
  const { demandData, updateDemandData } = useDemand();

  const [selectedEvent, setSelectedEvent] = useState<EventType>('normal');
  const [baselineDemand, setBaselineDemand] = useState(demandData.baselineDemand);
  const [bulkOrderSize, setBulkOrderSize] = useState(demandData.bulkOrderSize);
  const [notes, setNotes] = useState('');

  const currentEvent = eventConditions.find(e => e.type === selectedEvent)!;
  const adjustedDemand = Math.round(baselineDemand * currentEvent.multiplier) + bulkOrderSize;

  useEffect(() => {
    updateDemandData({
      baselineDemand,
      bulkOrderSize,
      multiplier: currentEvent.multiplier,
      adjustedDemand
    });
  }, [baselineDemand, bulkOrderSize, currentEvent.multiplier, adjustedDemand]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Daily Demand & Event Input</h2>
          <p className="text-gray-600 mt-1">Set expected demand and operational conditions</p>
        </div>
        <Link
          to="/skill-matrix"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Begin Analysis
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Baseline Demand Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Baseline Demand Forecast</h3>
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
              value={baselineDemand}
              onChange={(e) => setBaselineDemand(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">50 orders</span>
              <span className="text-2xl font-semibold text-blue-600">{baselineDemand} orders</span>
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

            return (
              <button
                key={event.type}
                onClick={() => setSelectedEvent(event.type)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedEvent === event.type
                    ? `${event.color} border-current`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="font-medium mb-1">{event.label}</div>
                <div className="text-xs opacity-75">{event.multiplier}x multiplier</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{currentEvent.description}</p>
        </div>
      </div>

      {selectedEvent === 'bulk-order' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Order Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Order Quantity
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={bulkOrderSize}
                onChange={(e) => setBulkOrderSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter bulk order size"
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Context</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Add any special notes about today's operations (optional)"
        />
      </div>

      {/* Demand Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Baseline Demand</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{baselineDemand}</p>
          <p className="text-xs text-gray-500 mt-1">orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Event Multiplier</p>
          <p className="text-3xl font-semibold text-orange-600 mt-1">{currentEvent.multiplier}x</p>
          <p className="text-xs text-gray-500 mt-1">{currentEvent.label}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-700">Final Expected Demand</p>
          <p className="text-3xl font-semibold text-blue-900 mt-1">{adjustedDemand}</p>
          <p className="text-xs text-blue-600 mt-1">total orders globally linked</p>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Demand Impact on Operations</h4>
        <p className="text-sm text-blue-800">
          Expected demand of {adjustedDemand} orders will automatically flow into the Takt Time Analysis page to calculate required production pace and workstation capacity constraints.
        </p>
      </div>
    </div>
  );
}