
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, User, AlertTriangle, CalendarDays, AlarmClock as ClockIcon } from 'lucide-react'; // Added ClockIcon
import { format, isPast } from 'date-fns';

const TaskItem = ({ task }) => {
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'todo': return 'bg-yellow-500/20 text-yellow-300';
      case 'inprogress': return 'bg-blue-500/20 text-blue-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'approved': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'completed' && task.status !== 'approved';
  
  return (
    <li className={`p-4 bg-white/10 rounded-lg shadow-md ${isOverdue ? 'border-l-2 border-red-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-primary flex items-center">
          <ListChecks className="h-5 w-5 mr-2" />
          {task.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${isOverdue ? 'bg-red-500/30 text-red-300' : getStatusColorClass(task.status)}`}>
          {isOverdue ? 'OVERDUE' : task.status.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-300 mb-2">{task.description || "No description."}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300">
        <p className="flex items-center"><User className="h-4 w-4 mr-2 text-sky-400" /> Assigned (EID): {task.assigned_to_employee_id || 'Unassigned'}</p>
        <p className="flex items-center"><AlertTriangle className={`h-4 w-4 mr-2 ${getPriorityColorClass(task.priority)}`} /> Priority: <span className={`${getPriorityColorClass(task.priority)} font-semibold`}>{task.priority?.toUpperCase()}</span></p>
        <p className="flex items-center col-span-full"><ClockIcon className="h-4 w-4 mr-2 text-pink-400" /> Created: {new Date(task.created_at).toLocaleDateString()}</p>
        {task.due_date && (
            <p className={`flex items-center col-span-full ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                <CalendarDays className="h-4 w-4 mr-2" /> Due: {format(new Date(task.due_date), "PPP")}
            </p>
        )}
      </div>
    </li>
  );
};


const TaskListModal = ({ isOpen, onClose, tasks, title, description }) => {
  if (!tasks) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800/90 backdrop-blur-md border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">No tasks found for this category.</p>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskListModal;
  