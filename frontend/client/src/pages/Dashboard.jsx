// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [widgetKey, setWidgetKey] = useState('');
  const [copied, setCopied] = useState(false);

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
        setWidgetKey(response.data.widget_key || '');
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
      const response = await api.put('/widgets/config', formData);
      setMessage('✅ Widget settings saved successfully!');
      setWidgetKey(response.data.widget_key || '');
      
      // 3 second baad message hata do
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating config:", error);
      setMessage('❌ Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySnippet = () => {
    const origin = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://ubiquitous-chainsaw-5gxjv4jr44pqcjw7-5000.app.github.dev';
    const scriptTag = `<script src="${origin}/embed.js?key=${widgetKey}" defer></script>`;
    
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreviewMessage = () => {
    const template = formData.popup_text || '{{name}} from {{city}} bought {{product}}';
    const parts = template.split(/(\{\{\s*name\s*\}\}|\{\{\s*city\s*\}\}|\{\{\s*product\s*\}\})/g);
    return parts.map((part, index) => {
      if (part.match(/\{\{\s*name\s*\}\}/)) {
        return <strong key={index} className="font-semibold text-slate-800">Rajesh</strong>;
      }
      if (part.match(/\{\{\s*city\s*\}\}/)) {
        return <strong key={index} className="font-semibold text-slate-800">Mumbai</strong>;
      }
      if (part.match(/\{\{\s*product\s*\}\}/)) {
        return <span key={index} style={{ color: formData.theme_color }} className="font-semibold">Premium Plan</span>;
      }
      return part;
    });
  };

  if (isLoading) return <div className="p-10 text-center font-medium text-slate-600">Loading your dashboard...</div>;

  const origin = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://ubiquitous-chainsaw-5gxjv4jr44pqcjw7-5000.app.github.dev';
  const scriptTag = `<script src="${origin}/embed.js?key=${widgetKey || 'WIDGET_KEY'}" defer></script>`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">Social Proof SaaS</span>
              <span className="ml-2 text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full border border-blue-100">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Logged in as <strong className="text-slate-900 font-semibold">{user?.name}</strong></span>
            <button 
              onClick={logout} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-slate-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        
        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 mb-6 rounded-xl flex items-center gap-2 border font-medium text-sm shadow-sm transition-all animate-fade-in ${
            message.includes('✅') 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Form (7/12) */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">Widget Customization</h2>
              <p className="text-slate-500 text-xs">Configure the design and text of your proof notification.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notification Text Template</label>
                <input 
                  type="text" 
                  name="popup_text"
                  value={formData.popup_text}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 transition-all font-medium text-sm"
                  placeholder="{{name}} from {{city}} just bought this!"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 flex gap-2 font-medium">
                  <span>💡 Variables:</span>
                  <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono font-semibold">{"{{name}}"}</code>
                  <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono font-semibold">{"{{city}}"}</code>
                  <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono font-semibold">{"{{product}}"}</code>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Theme Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      name="theme_color"
                      value={formData.theme_color}
                      onChange={handleChange}
                      className="h-10 w-12 border border-slate-200 rounded-xl cursor-pointer bg-transparent overflow-hidden"
                    />
                    <span className="text-sm font-mono font-bold text-slate-500 bg-slate-50 px-3 py-2 border border-slate-100 rounded-xl">{formData.theme_color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Widget Position</label>
                  <select 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 bg-white transition-all font-medium text-sm"
                  >
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Delay (ms)</label>
                  <input 
                    type="number" 
                    name="delay"
                    value={formData.delay}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 transition-all font-medium text-sm"
                    min="1000"
                    step="500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Time before the first popup loads.</p>
                </div>

                <div className="flex items-center h-full pt-6 md:pt-8">
                  <label className="relative flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="show_avatar"
                      checked={formData.show_avatar}
                      onChange={handleChange}
                      className="peer sr-only"
                      id="show_avatar"
                    />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="text-sm font-semibold text-slate-700">
                      Show User Avatar
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </section>

          {/* Right Column: Preview & Embed Code (5/12) */}
          <section className="lg:col-span-5 space-y-6">
            
            {/* 1. Live Preview Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-base">Live Preview</h3>
                <p className="text-slate-500 text-xs">Simulated preview on your target webpage layout.</p>
              </div>

              <div className="p-6">
                <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
                  
                  {/* Backdrop dotted grid pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                  <div className="absolute top-2.5 left-3 text-[10px] uppercase tracking-wider font-bold text-slate-500 pointer-events-none">
                    Website Simulation
                  </div>

                  {/* Float the Card based on set position */}
                  <div 
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                      transform: 'scale(0.85)',
                      transformOrigin: 'center'
                    }}
                    className={`absolute w-72 bg-white/95 backdrop-blur-md rounded-2xl border p-4 flex items-center gap-3 transition-all duration-500 ease-out ${
                      formData.position === 'bottom-left' ? 'bottom-3 left-3' :
                      formData.position === 'bottom-right' ? 'bottom-3 right-3' :
                      formData.position === 'top-left' ? 'top-3 left-3' :
                      'top-3 right-3'
                    }`}
                  >
                    {/* Theme color Accent strip */}
                    <div 
                      style={{ backgroundColor: formData.theme_color }} 
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                    />

                    {formData.show_avatar && (
                      <div className="relative flex-shrink-0">
                        <div 
                          style={{ background: `linear-gradient(135deg, ${formData.theme_color}dd, ${formData.theme_color})` }}
                          className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-md"
                        >
                          R
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border border-white flex items-center justify-center shadow-sm">
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="flex-grow min-w-0 pr-2 select-none">
                      <div className="flex justify-between items-center mb-0.5 gap-2">
                        <span style={{ color: formData.theme_color }} className="text-[9px] font-bold uppercase tracking-wider">Verified Purchase</span>
                        <span className="text-[9px] text-slate-400 font-semibold">2m ago</span>
                      </div>
                      <div className="text-[12px] text-slate-700 leading-snug">
                        {renderPreviewMessage()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Installation Snippet Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Installation Script</h3>
                  <p className="text-slate-500 text-xs">Copy and insert this script before the &lt;/body&gt; tag of your website.</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed border border-slate-800 shadow-inner select-all">
                    {scriptTag}
                  </pre>
                  
                  <button 
                    onClick={handleCopySnippet}
                    className={`absolute right-3 bottom-3 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                      copied 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <span>Copied!</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Copy Code</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-150 rounded-xl p-3.5 text-xs text-blue-800 font-medium leading-normal">
                  <div className="flex gap-2">
                    <span className="text-sm">ℹ️</span>
                    <div>
                      This snippet connects directly to this server instance and loads settings dynamically. Any modifications made here are updated instantly.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;