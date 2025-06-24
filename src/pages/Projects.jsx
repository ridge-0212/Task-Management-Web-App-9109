import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiFolderPlus, FiUsers, FiCalendar } = FiIcons;

function Projects() {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      progress: 75,
      tasks: 12,
      completedTasks: 9,
      members: 4,
      dueDate: '2024-02-15',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'iOS and Android app for customer portal',
      progress: 45,
      tasks: 18,
      completedTasks: 8,
      members: 6,
      dueDate: '2024-03-30',
      color: 'purple'
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q1 digital marketing campaign launch',
      progress: 90,
      tasks: 8,
      completedTasks: 7,
      members: 3,
      dueDate: '2024-01-31',
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[project.color]} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={FiFolderPlus} className="w-6 h-6 text-white" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.progress === 100 ? 'bg-green-100 text-green-700' :
                project.progress >= 50 ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {project.progress}% Complete
              </span>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2">{project.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${colorClasses[project.color]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-500">
                  <SafeIcon icon={FiUsers} className="w-4 h-4" />
                  <span>{project.members} members</span>
                </div>
                <span className="text-gray-600">
                  {project.completedTasks}/{project.tasks} tasks
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Projects;