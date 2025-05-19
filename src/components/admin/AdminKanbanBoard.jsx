
import React from 'react';
import { motion } from 'framer-motion';
import KanbanColumn from '@/components/KanbanColumn';

const AdminKanbanBoard = ({ tasks, completionRate }) => {
  const { todoTasks, inProgressTasks, completedTasksForApproval, approvedTasks } = tasks;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-12 p-2 md:p-6 bg-black/20 backdrop-blur-lg rounded-xl shadow-xl"
    >
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
          <h2 className="text-3xl font-semibold text-white">Task Board</h2>
          <div className="w-1/3">
               <div className="text-sm text-gray-300 text-right">Overall Completion: {completionRate}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
              </div>
          </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        <KanbanColumn title="To Do" tasks={todoTasks} status="todo" />
        <KanbanColumn title="In Progress" tasks={inProgressTasks} status="inprogress" />
        <KanbanColumn title="Pending Approval" tasks={completedTasksForApproval} status="completed" />
        <KanbanColumn title="Approved" tasks={approvedTasks} status="approved" />
      </div>
    </motion.div>
  );
};

export default AdminKanbanBoard;
  