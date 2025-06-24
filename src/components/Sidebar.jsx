import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiCheckSquare, FiFolderPlus, FiBarChart3, FiSettings, FiPlus } = FiIcons;

function Sidebar({ currentPage, setCurrentPage }) {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/', icon: FiHome, label: 'Dashboard' },
    { id: 'tasks', path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { id: 'projects', path: '/projects', icon: FiFolderPlus, label: 'Projects' },
    { id: 'analytics', path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
    { id: 'settings', path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40"
    >
      <div className="p-6">
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 mb-8">
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span className="font-medium">New Task</span>
        </button>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <SafeIcon 
                  icon={item.icon} 
                  className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} 
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-600">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="font-medium text-blue-600">6</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;