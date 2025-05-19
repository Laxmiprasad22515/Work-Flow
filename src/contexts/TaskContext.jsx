
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext'; 
import { supabase } from '@/lib/supabaseClient';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); 

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from('tasks').select('*');

      if (user.role === 'admin' && user.organization_id_slug) {
        query = query.eq('organization_id_slug', user.organization_id_slug);
      } else if (user.role === 'employee' && user.organization_id_slug && user.employee_id) {
        query = query.eq('organization_id_slug', user.organization_id_slug)
                     .or(`assigned_to_employee_id.eq.${user.employee_id},assigned_to_employee_id.is.null`);
      } else {
         setTasks([]);
         setLoading(false);
         return;
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks from Supabase", error);
      toast({
        title: 'Error Fetching Tasks',
        description: error.message || 'Could not load tasks.',
        variant: 'destructive',
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    if (!user || !user.organization_id_slug) {
        toast({
            title: 'Error',
            description: 'Cannot add task without organization context.',
            variant: 'destructive',
        });
        return;
    }
    try {
      const newTaskPayload = { 
        ...taskData, 
        status: 'todo', 
        organization_id_slug: user.organization_id_slug,
        created_by_user_id: user.id,
        due_date: null, // Explicitly set due_date to null or remove if column allows null by default
      };
      // Remove due_date from payload if it's not expected or should be null
      if (newTaskPayload.hasOwnProperty('due_date')) {
          delete newTaskPayload.due_date;
      }

      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert(newTaskPayload)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      toast({
        title: 'Task Added',
        description: `Task "${newTask.title}" has been successfully created.`,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error Adding Task',
        description: error.message || 'Could not create task.',
        variant: 'destructive',
      });
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      toast({
        title: 'Task Updated',
        description: `Task status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error Updating Task',
        description: error.message || 'Could not update task status.',
        variant: 'destructive',
      });
    }
  };
  
  const approveTaskCompletion = async (taskId) => {
     try {
      const { data: approvedTask, error } = await supabase
        .from('tasks')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? approvedTask : task
        )
      );
      toast({
        title: 'Task Approved',
        description: `Task has been approved as completed.`,
      });
    } catch (error) {
      console.error('Error approving task:', error);
      toast({
        title: 'Error Approving Task',
        description: error.message || 'Could not approve task.',
        variant: 'destructive',
      });
    }
  };

  const getTasksByStatus = (status) => {
    if (!user) return [];
    return tasks.filter(task => task.status === status);
  };
  
  // getOverdueTasks function removed

  const getAllTasksForUser = () => {
    if (!user) return [];
    return tasks; 
  };

  return (
    // getOverdueTasks removed from context value
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, approveTaskCompletion, getTasksByStatus, getAllTasksForUser, loading, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
  