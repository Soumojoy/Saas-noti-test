// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form ka state jisme widget ki settings save hongi
  const [formData, setFormData] = useState({
    popup_text: '',
    theme_color: '#2563eb',
    position: 'bottom-left',
    delay: 3000,
    show_avatar: true
  });

  // 1. Backend se data READ karna (GET)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/widgets/config');
        setFormData(response.data); // Jo data aaya, usko form mein daal do
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 2. Input fields mein change handle karna
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 3. Backend mein data UPDATE karna (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await api.put('/widgets/config', formData);
      setMessage('✅ Widget settings saved successfully!');
      
      // 3 second baad message hata do
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating config:", error);
      setMessage('❌ Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Customize your Social Proof Widget</p>
          </div>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Text Template</label>
            <input 
              type="text" 
              name="popup_text"
              value={formData.popup_text}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="{{name}} from {{city}} just bought this!"
            />
            <p className="text-xs text-gray-500 mt-1">Use {"{{name}}"} and {"{{city}}"} as dynamic variables.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  name="theme_color"
                  value={formData.theme_color}
                  onChange={handleChange}
                  className="h-10 w-10 border-0 rounded cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-600">{formData.theme_color}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Widget Position</label>
              <select 
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Delay (ms)</label>
              <input 
                type="number" 
                name="delay"
                value={formData.delay}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                min="1000"
                step="500"
              />
            </div>

            <div className="flex items-center mt-6">
              <input 
                type="checkbox" 
                name="show_avatar"
                checked={formData.show_avatar}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                id="show_avatar"
              />
              <label htmlFor="show_avatar" className="ml-2 block text-sm text-gray-900">
                Show User Avatar
              </label>
            </div>
          </div>

          <hr className="my-6" />

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Dashboard;