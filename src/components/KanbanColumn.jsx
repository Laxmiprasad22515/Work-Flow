
import React from 'react';
import TaskCard from '@/components/TaskCard';
import { motion } from 'framer-motion';

const KanbanColumn = ({ title, tasks, status }) => {
  const columnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
  };

  const getTitleColor = (status) => {
    switch (status) {
      case 'todo': return 'text-yellow-300';
      case 'inprogress': return 'text-blue-300';
      case 'completed': return 'text-green-300';
      case 'approved': return 'text-purple-300';
      // 'overdue' case removed
      default: return 'text-gray-300';
    }
  };

  return (
    <motion.div 
      variants={columnVariants} 
      initial="hidden" 
      animate="visible" 
      className="flex-1 p-4 bg-white/5 backdrop-blur-sm rounded-lg shadow-md min-w-[300px]"
    >
      <h3 className={`text-2xl font-semibold mb-4 ${getTitleColor(status)}`}>{title} ({tasks.length})</h3>
      <div className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-gray-400 text-center py-4">No tasks in this column.</p>
        )}
      </div>
    </motion.div>
  );
};

export default KanbanColumn;
  