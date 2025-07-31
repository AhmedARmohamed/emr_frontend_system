import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Plus, 
  Search, 
  Activity,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: Activity, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/patients/new', icon: Plus, label: 'New Patient' },
    { path: '/patients/search', icon: Search, label: 'Search Patients' },
    { path: '/facilities', icon: Building2, label: 'Facilities' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="bg-gray-50 w-64 min-h-screen border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;