import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTask } from '../context/TaskContext';

const { FiTrendingUp, FiTarget, FiClock, FiCalendar } = FiIcons;

function Analytics() {
  const { state } = useTask();
  const { tasks } = state;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  const taskStatusData = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Task Status',
        type: 'pie',
        radius: '50%',
        data: [
          { value: completedTasks, name: 'Completed' },
          { value: inProgressTasks, name: 'In Progress' },
          { value: pendingTasks, name: 'Pending' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const priorityData = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['High', 'Medium', 'Low'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Tasks',
        type: 'bar',
        barWidth: '60%',
        data: [
          tasks.filter(task => task.priority === 'high').length,
          tasks.filter(task => task.priority === 'medium').length,
          tasks.filter(task => task.priority === 'low').length
        ],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#3B82F6'
            }, {
              offset: 1, color: '#8B5CF6'
            }]
          }
        }
      }
    ]
  };

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: FiTarget,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Completion Rate',
      value: `${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%`,
      icon: FiTrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: FiClock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'This Month',
      value: tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        const now = new Date();
        return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
      }).length,
      icon: FiCalendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="text-sm text-gray-500">
          Task performance overview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border ${stat.bg} border-gray-200`}
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h2>
          {tasks.length > 0 ? (
            <ReactECharts option={taskStatusData} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Priority</h2>
          {tasks.length > 0 ? (
            <ReactECharts option={priorityData} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task, index) => (
            <div key={task.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.status === 'completed' ? 'Completed' : 
                   task.status === 'in-progress' ? 'In Progress' : 'Created'}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Today'}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">No activity yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Analytics;