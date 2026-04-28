import { useState } from 'react';
import { UtensilsCrossed, Clock, ChevronRight, Plus, Minus, X, Save, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { useMenu, MenuItem } from '../components/MenuContext';
import { toast } from 'sonner';

const categoryLabels = {
  'main-dish': 'Main Dish',
  'appetizer': 'Appetizer',
  'dessert': 'Dessert',
  'beverage': 'Beverage',
};

export default function MenuInputPage() {
  const { items, setItems, targetDate, setTargetDate, saveMenuToFirebase } = useMenu();
  const [isSaving, setIsSaving] = useState(false);
  
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
    
    const newId = `M${String(items.length + 1).padStart(3, '0')}`;
    
    const recipeToAdd: MenuItem = {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      prepTime: Number(newItem.prepTime) || 0,
      cookTime: Number(newItem.cookTime) || 0,
      plateTime: Number(newItem.plateTime) || 0,
      active: true,
      expectedOrders: 20
    };

    setItems([...items, recipeToAdd]);
    setIsAddModalOpen(false); 
    setNewItem({
      name: '',
      category: 'main-dish',
      prepTime: '',
      cookTime: '',
      plateTime: '',
    });
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      await saveMenuToFirebase();
      toast.success(`Menu for ${targetDate} saved successfully!`);
    } catch (error) {
      toast.error('Failed to save Menu to Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeItems = items.filter(item => item.active);
  const totalPrepTime = activeItems.reduce((sum, item) => sum + (item.prepTime * item.expectedOrders / 60), 0);
  const totalCookTime = activeItems.reduce((sum, item) => sum + (item.cookTime * item.expectedOrders / 60), 0);
  const totalOrders = activeItems.reduce((sum, item) => sum + item.expectedOrders, 0);

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Daily Menu Input</h2>
          <p className="text-gray-600 mt-1">Select active menu items and set expected order volumes</p>
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

          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Menu'}
          </button>
        </div>
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
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Menu Configuration</h3>
            <p className="text-sm text-gray-600 mt-1">Toggle items and adjust expected orders for today</p>
          </div>
          
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
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Menu Item Info */}
                <div className="flex items-center gap-4 flex-1 w-full">
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                      item.active
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {item.active && <div className="w-3 h-3 bg-white rounded-sm" />}
                  </button>

                  <UtensilsCrossed className={`w-10 h-10 p-2 rounded-lg flex-shrink-0 ${
                    item.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`} />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        item.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Prep: {item.prepTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Cook: {item.cookTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Plate: {item.plateTime}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Volume Control */}
                {item.active && (
                  <div className="flex items-center gap-4 lg:ml-auto w-full lg:w-auto mt-2 lg:mt-0 pl-10 lg:pl-0">
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
      
      {/* Proceed Button */}
      <div className="flex justify-end pt-4">
         <Link
            to="/demand-input"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Proceed to Demand Input
            <ChevronRight className="w-5 h-5" />
          </Link>
      </div>
    </div>
  );
}