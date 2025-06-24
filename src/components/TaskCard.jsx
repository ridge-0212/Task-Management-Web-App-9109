import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTask } from '../context/TaskContext'
import { format } from 'date-fns'

const { FiEdit2, FiTrash2, FiCalendar, FiUser, FiFlag } = FiIcons

function TaskCard({ task, onEdit }) {
  const { updateTask, deleteTask } = useTask()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id)
    }
  }

  const handleStatusChange = async (newStatus) => {
    await updateTask({ ...task, status: newStatus })
  }

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  }

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-200 ${
        isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFlag} className={`w-4 h-4 ${priorityColors[task.priority]}`} />
          <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <SafeIcon icon={FiCalendar} className="w-4 h-4" />
          <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          {isOverdue && <span className="text-red-600 font-medium">Overdue</span>}
        </div>
        {task.assignee && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <SafeIcon icon={FiUser} className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ').toUpperCase()}
        </span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </motion.div>
  )
}

export default TaskCard