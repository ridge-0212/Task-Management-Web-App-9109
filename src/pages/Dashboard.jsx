import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTask } from '../context/TaskContext';

const { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } = FiIcons;

function Dashboard() {
  const { state } = useTask();
  const { tasks } = state;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date() && task.status !== 'completed';
  }).length;

  const stats = [
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: FiClock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: FiAlertCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: FiTrendingUp,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border ${stat.bg} ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.project}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">
                  {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;