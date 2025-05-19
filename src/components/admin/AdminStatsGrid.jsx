
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, ListChecks, CheckCircle, UserPlus, UserCheck as UserCheckIcon } from 'lucide-react';

const StatCard = ({ title, value, description, icon: Icon, iconColor, onClick }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="cursor-pointer" onClick={onClick}>
    <Card className="bg-white/20 backdrop-blur-md border-none text-white h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        <p className="text-xs text-gray-300">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);


const AdminStatsGrid = ({ stats, onCardClick }) => {
  const { 
    totalOrgTasks, 
    todoTasksCount, 
    inProgressTasksCount, 
    completedTasksForApprovalCount, 
    approvedTasksCount, 
    pendingEmployeesCount, 
    approvedOrgEmployeesCount 
  } = stats;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard 
        title="Total Tasks" 
        value={totalOrgTasks} 
        description={`${todoTasksCount} To Do, ${inProgressTasksCount} In Prog.`} 
        icon={ListChecks} 
        iconColor="text-pink-300"
        onClick={() => onCardClick('totalTasks')}
      />
      <StatCard 
        title="Pending Task Approval" 
        value={completedTasksForApprovalCount} 
        description="Tasks awaiting your review" 
        icon={Users} 
        iconColor="text-orange-300"
        onClick={() => onCardClick('pendingApprovalTasks')}
      />
      <StatCard 
        title="Approved Tasks" 
        value={approvedTasksCount} 
        description="Completed & verified" 
        icon={CheckCircle} 
        iconColor="text-green-400"
        onClick={() => onCardClick('approvedTasks')}
      />
      <StatCard 
        title="Pending Employees" 
        value={pendingEmployeesCount} 
        description="Registrations to approve" 
        icon={UserPlus} 
        iconColor="text-yellow-300"
        onClick={() => onCardClick('pendingEmployees')}
      />
      <StatCard 
        title="Approved Employees" 
        value={approvedOrgEmployeesCount} 
        description="Active in your organization" 
        icon={UserCheckIcon} 
        iconColor="text-blue-300"
        onClick={() => onCardClick('approvedEmployees')}
      />
    </div>
  );
};

export default AdminStatsGrid;
  