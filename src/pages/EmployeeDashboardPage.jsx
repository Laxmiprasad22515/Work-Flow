
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckSquare, ListTodo, Clock, UserCircle, Briefcase } from 'lucide-react'; // Removed CalendarX
import KanbanColumn from '@/components/KanbanColumn';
import TaskListModal from '@/components/TaskListModal';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { organizations as orgConfig } from '@/config/organizations';
// Removed parseISO, isPast from date-fns as they are no longer needed for overdue logic

const EmployeeDashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTasks, setModalTasks] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  useEffect(() => {
     fetchTasks(); 
  }, [user, fetchTasks]);

  const organizationName = orgConfig.find(org => org.id === user?.organization_id_slug)?.name || 'Your Organization';

  const getFilteredTasks = useCallback(() => {
    const allMyTasks = tasks || [];
    
    // Simplified: no overdue filtering needed here anymore
    const todoTasks = allMyTasks.filter(task => task.status === 'todo');
    const inProgressTasks = allMyTasks.filter(task => task.status === 'inprogress');
    const completedTasks = allMyTasks.filter(task => task.status === 'completed' || task.status === 'approved');
    
    // overdueTasks removed
    return { todoTasks, inProgressTasks, completedTasks, allMyTasks };
  }, [tasks]);

  // overdueTasks removed from destructuring
  const { todoTasks, inProgressTasks, completedTasks } = getFilteredTasks();


  const handleCardClick = (tasksToList, title, description) => {
    setModalTasks(tasksToList);
    setModalTitle(title);
    setModalDescription(description);
    setIsModalOpen(true);
  };

  if (tasksLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-white">My Task Dashboard</h1>
        <div className="flex items-center justify-center gap-4 mt-2 text-lg text-purple-300">
            <div className="flex items-center gap-1">
                <UserCircle className="h-5 w-5" />
                <span>{user.first_name || user.username}</span> 
            </div>
            <div className="flex items-center gap-1">
                <Briefcase className="h-5 w-5" />
                <span>{organizationName}</span>
            </div>
            {user.employee_id && (
                <span className="text-sm bg-primary/30 text-primary-foreground px-2 py-0.5 rounded">ID: {user.employee_id}</span>
            )}
        </div>
      </motion.div>

      {/* Adjusted grid to 3 columns as Overdue card is removed */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-pointer" onClick={() => handleCardClick(todoTasks, "To Do Tasks", "All tasks assigned to you that are ready to start.")}>
          <Card className="bg-white/20 backdrop-blur-md border-none text-white h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <ListTodo className="h-6 w-6 text-yellow-300" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{todoTasks.length}</div>
              <p className="text-xs text-gray-300">Tasks ready to start</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-pointer" onClick={() => handleCardClick(inProgressTasks, "In Progress Tasks", "Tasks you are currently working on.")}>
          <Card className="bg-white/20 backdrop-blur-md border-none text-white h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-6 w-6 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{inProgressTasks.length}</div>
              <p className="text-xs text-gray-300">Currently working on</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-pointer" onClick={() => handleCardClick(completedTasks, "Completed Tasks", "All tasks you have marked as completed or have been approved.")}>
          <Card className="bg-white/20 backdrop-blur-md border-none text-white h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckSquare className="h-6 w-6 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-gray-300">Finished tasks (includes approved)</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overdue Tasks Card Removed */}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 p-2 md:p-6 bg-black/20 backdrop-blur-lg rounded-xl shadow-xl"
      >
        <h2 className="text-3xl font-semibold text-white mb-6 px-4 md:px-0">My Kanban Board</h2>
         {/* Overdue Column Removed */}
         <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
          <KanbanColumn title="To Do" tasks={todoTasks} status="todo" />
          <KanbanColumn title="In Progress" tasks={inProgressTasks} status="inprogress" />
          <KanbanColumn title="Completed / Approved" tasks={completedTasks} status="completed" />
        </div>
      </motion.div>
      <TaskListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tasks={modalTasks}
        title={modalTitle}
        description={modalDescription}
      />
    </motion.div>
  );
};

export default EmployeeDashboardPage;
  