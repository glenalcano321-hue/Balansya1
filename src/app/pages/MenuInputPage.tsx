import { useState } from 'react';
import { UtensilsCrossed, Clock, ChevronRight, Plus, Minus, X } from 'lucide-react';
import { Link } from 'react-router'; // Note: Usually 'react-router-dom' in standard Vite setups

interface MenuItem {
  id: string;
  name: string;
  category: 'main-dish' | 'appetizer' | 'dessert' | 'beverage';
  prepTime: number;
  cookTime: number;
  plateTime: number;
  active: boolean;
  expectedOrders: number;
}

const initialMenuItems: MenuItem[] = [
  { id: 'M001', name: 'Chicken Adobo', category: 'main-dish', prepTime: 15, cookTime: 45, plateTime: 5, active: true, expectedOrders: 35 },
  { id: 'M002', name: 'Sinigang na Baboy', category: 'main-dish', prepTime: 20, cookTime: 50, plateTime: 5, active: true, expectedOrders: 28 },
  { id: 'M003', name: 'Beef Kare-Kare', category: 'main-dish', prepTime: 25, cookTime: 60, plateTime: 5, active: false, expectedOrders: 0 },
  { id: 'M004', name: 'Lumpia Shanghai', category: 'appetizer', prepTime: 30, cookTime: 10, plateTime: 3, active: true, expectedOrders: 45 },
  { id: 'M005', name: 'Pancit Canton', category: 'main-dish', prepTime: 15, cookTime: 20, plateTime: 4, active: true, expectedOrders: 32 },
  { id: 'M006', name: 'Halo-Halo', category: 'dessert', prepTime: 10, cookTime: 0, plateTime: 5, active: true, expectedOrders: 20 },
  { id: 'M007', name: 'Lechon Kawali', category: 'main-dish', prepTime: 20, cookTime: 40, plateTime: 5, active: false, expectedOrders: 0 },
  { id: 'M008', name: 'Mango Shake', category: 'beverage', prepTime: 5, cookTime: 0, plateTime: 2, active: true, expectedOrders: 25 },
];

const categoryLabels = {
  'main-dish': 'Main Dish',
  'appetizer': 'Appetizer',
  'dessert': 'Dessert',
  'beverage': 'Beverage',
};

export default function MenuInputPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  
  // State for the Add Recipe Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'main-dish' as MenuItem['category'],
    prepTime: '',
    cookTime: '',
    plateTime: '',
  });

  const toggleActive = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, active: !item.active, expectedOrders: !item.active ? 20 : 0 } : item
    ));
  };

  const updateExpectedOrders = (id: string, change: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, expectedOrders: Math.max(0, item.expectedOrders + change) } : item
    ));
  };

  const handleAddNewRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a simple ID (e.g., M009)
    const newId = `M${String(items.length + 1).padStart(3, '0')}`;
    
    const recipeToAdd: MenuItem = {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      prepTime: Number(newItem.prepTime) || 0,
      cookTime: Number(newItem.cookTime) || 0,
      plateTime: Number(newItem.plateTime) || 0,
      active: true, // Auto-activate new recipes
      expectedOrders: 20 // Default starting expected orders
    };

    setItems([...items, recipeToAdd]);
    setIsAddModalOpen(false); // Close modal
    
    // Reset form
    setNewItem({
      name: '',
      category: 'main-dish',
      prepTime: '',
      cookTime: '',
      plateTime: '',
    });
  };

  const activeItems = items.filter(item => item.active);
  const totalPrepTime = activeItems.reduce((sum, item) => sum + (item.prepTime * item.expectedOrders / 60), 0);
  const totalCookTime = activeItems.reduce((sum, item) => sum + (item.cookTime * item.expectedOrders / 60), 0);
  const totalOrders = activeItems.reduce((sum, item) => sum + item.expectedOrders, 0);

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Daily Menu Input</h2>
          <p className="text-gray-600 mt-1">Select active menu items and set expected order volumes</p>
        </div>
        <Link
          to="/demand-input"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next: Demand Input
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Active Menu Items</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{activeItems.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Expected Orders</p>
          <p className="text-3xl font-semibold text-blue-600 mt-1">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Prep Load</p>
          <p className="text-3xl font-semibold text-orange-600 mt-1">{totalPrepTime.toFixed(0)}h</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Cook Load</p>
          <p className="text-3xl font-semibold text-red-600 mt-1">{totalCookTime.toFixed(0)}h</p>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Menu Configuration</h3>
            <p className="text-sm text-gray-600 mt-1">Toggle items and adjust expected orders for today</p>
          </div>
          
          {/* Add Recipe Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Plus className="w-4 h-4" />
            Add Recipe
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-6 transition-colors ${item.active ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between gap-6">
                {/* Menu Item Info */}
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      item.active
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {item.active && <div className="w-3 h-3 bg-white rounded-sm" />}
                  </button>

                  <UtensilsCrossed className={`w-10 h-10 p-2 rounded-lg ${
                    item.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`} />

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Prep: {item.prepTime}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Cook: {item.cookTime}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Plate: {item.plateTime}min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Volume Control */}
                {item.active && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Expected Orders:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateExpectedOrders(item.id, -5)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">{item.expectedOrders}</span>
                      <button
                        onClick={() => updateExpectedOrders(item.id, 5)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Menu Load Impact</h4>
        <p className="text-sm text-blue-800">
          Today's active menu creates approximately {totalPrepTime.toFixed(1)} hours of prep work and{' '}
          {totalCookTime.toFixed(1)} hours of cooking time across {totalOrders} expected orders. This data
          will determine workstation task allocation and balancing strategies.
        </p>
      </div>

      {/* --- ADD RECIPE MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Add New Recipe</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewRecipe} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <input 
                  type="text" 
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spicy Tofu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value as MenuItem['category']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="main-dish">Main Dish</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
                  <input 
                    type="number" 
                    required min="0"
                    value={newItem.prepTime}
                    onChange={(e) => setNewItem({...newItem, prepTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
                  <input 
                    type="number" 
                    required min="0"
                    value={newItem.cookTime}
                    onChange={(e) => setNewItem({...newItem, cookTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plate (min)</label>
                  <input 
                    type="number" 
                    required min="0"
                    value={newItem.plateTime}
                    onChange={(e) => setNewItem({...newItem, plateTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}