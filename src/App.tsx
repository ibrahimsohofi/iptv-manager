import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Tv, Users, Box, CreditCard, Home } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import TVBoxes from './pages/TVBoxes';
import Subscriptions from './pages/Subscriptions';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/boxes', icon: Box, label: 'TV Boxes' },
    { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Tv className="h-8 w-8 text-slate-900" />
              <h1 className="text-xl font-bold text-slate-900">IPTV Manager</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/boxes" element={<TVBoxes />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navigation />
    </Router>
  );
}
