import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TaskContext = createContext()

const initialState = {
  tasks: [],
  projects: [],
  filter: 'all',
  sortBy: 'dueDate',
  loading: false,
  error: null
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const { user } = useAuth()

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    if (!user) return
    
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m1p3q')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      dispatch({ type: 'SET_TASKS', payload: data || [] })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  // Add task to Supabase
  const addTask = async (taskData) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m1p3q')
        .insert([{
          ...taskData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      dispatch({ type: 'ADD_TASK', payload: data })
      return { data, error: null }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { data: null, error }
    }
  }

  // Update task in Supabase
  const updateTask = async (taskData) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m1p3q')
        .update(taskData)
        .eq('id', taskData.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      dispatch({ type: 'UPDATE_TASK', payload: data })
      return { data, error: null }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { data: null, error }
    }
  }

  // Delete task from Supabase
  const deleteTask = async (taskId) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tasks_7x9k2m1p3q')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) throw error
      dispatch({ type: 'DELETE_TASK', payload: taskId })
      return { error: null }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { error }
    }
  }

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('projects_8k1m3n5r7s')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      dispatch({ type: 'SET_PROJECTS', payload: data || [] })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  // Add project to Supabase
  const addProject = async (projectData) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('projects_8k1m3n5r7s')
        .insert([{
          ...projectData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      dispatch({ type: 'ADD_PROJECT', payload: data })
      return { data, error: null }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { data: null, error }
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchProjects()
    } else {
      dispatch({ type: 'SET_TASKS', payload: [] })
      dispatch({ type: 'SET_PROJECTS', payload: [] })
    }
  }, [user])

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return

    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks_7x9k2m1p3q',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_TASK', payload: payload.new })
          } else if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'UPDATE_TASK', payload: payload.new })
          } else if (payload.eventType === 'DELETE') {
            dispatch({ type: 'DELETE_TASK', payload: payload.old.id })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tasksSubscription)
    }
  }, [user])

  return (
    <TaskContext.Provider value={{
      state,
      dispatch,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      fetchTasks,
      fetchProjects
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}