
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, UserCheck } from 'lucide-react'; // Removed AlertTriangle, CalendarDays
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { format, parseISO, isValid } from 'date-fns'; // isPast removed

const TaskCard = ({ task }) => {
  const { user } = useAuth();
  const { updateTaskStatus, approveTaskCompletion } = useTasks();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Due date and overdue logic removed
  // const dueDateExists = task.due_date;
  // let parsedDueDate = null;
  // if (dueDateExists) {
  //   const tempDate = parseISO(task.due_date);
  //   if (isValid(tempDate)) {
  //     parsedDueDate = tempDate;
  //   }
  // }
  // const isOverdue = parsedDueDate && isPast(parsedDueDate) && task.status !== 'completed' && task.status !== 'approved';

  const getStatusColor = (status) => {
    // if (isOverdue) return 'border-l-4 border-red-500'; // Overdue color removed
    switch (status) {
      case 'todo': return 'border-l-4 border-yellow-400';
      case 'inprogress': return 'border-l-4 border-blue-400';
      case 'completed': return 'border-l-4 border-green-400';
      case 'approved': return 'border-l-4 border-purple-500';
      default: return 'border-l-4 border-gray-400';
    }
  };
  
  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleApprove = () => {
    approveTaskCompletion(task.id);
  };

  const createdAtDate = task.created_at ? parseISO(task.created_at) : null;
  const updatedAtDate = task.updated_at ? parseISO(task.updated_at) : null;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className={`bg-white/10 backdrop-blur-md text-white shadow-lg ${getStatusColor(task.status)}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold">{task.title}</CardTitle>
            {/* AlertTriangle for overdue removed */}
          </div>
          <CardDescription className="text-gray-300 text-xs">
            Created: {createdAtDate && isValid(createdAtDate) ? format(createdAtDate, "MMM dd, yyyy") : 'N/A'} | Last Updated: {updatedAtDate && isValid(updatedAtDate) ? format(updatedAtDate, "MMM dd, yyyy") : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-200 text-sm mb-2">{task.description || "No description provided."}</p>
          <div className="text-xs text-gray-400">Assigned to Employee ID: {task.assigned_to_employee_id || 'Unassigned'}</div>
          <div className="text-xs text-gray-400">Priority: <span className={`font-semibold ${task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{task.priority?.toUpperCase()}</span></div>
          {/* Due date display removed */}
          {/* {parsedDueDate && (
            <div className={`text-xs flex items-center mt-1 ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
              <CalendarDays className="h-3 w-3 mr-1" />
              Due: {format(parsedDueDate, "MMM dd, yyyy")}
            </div>
          )} */}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4">
          {/* Status display simplified, no specific overdue styling */}
          <span className={`text-sm font-medium px-3 py-1 rounded-full bg-primary/30 text-primary-foreground`}>
            {task.status.toUpperCase()}
          </span>
          <div className="space-x-2">
            {/* Button logic simplified, no overdue checks */}
            {user?.role === 'employee' && task.status === 'todo' && (
              <Button variant="outline" size="sm" onClick={() => handleStatusChange('inprogress')} className="text-blue-300 border-blue-400 hover:bg-blue-400 hover:text-white">
                <Clock className="h-4 w-4 mr-1" /> Start
              </Button>
            )}
            {user?.role === 'employee' && task.status === 'inprogress' && (
              <Button variant="outline" size="sm" onClick={() => handleStatusChange('completed')} className="text-green-300 border-green-400 hover:bg-green-400 hover:text-white">
                <CheckCircle className="h-4 w-4 mr-1" /> Complete
              </Button>
            )}
            {/* Complete (Overdue) button removed */}
            {user?.role === 'admin' && task.status === 'completed' && (
               <Button variant="outline" size="sm" onClick={handleApprove} className="text-purple-300 border-purple-500 hover:bg-purple-500 hover:text-white">
                <UserCheck className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
  