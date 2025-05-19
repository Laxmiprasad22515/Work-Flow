
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, UserCircle2, Briefcase, Mail, Smartphone } from 'lucide-react';
import AddTaskDialog from '@/components/AddTaskDialog';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { organizations as orgConfig } from '@/config/organizations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ApprovedEmployeesModal from '@/components/ApprovedEmployeesModal';
import TaskListModal from '@/components/TaskListModal';
import PendingEmployeesListModal from '@/components/PendingEmployeesListModal';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import PendingApprovalsSection from '@/components/admin/PendingApprovalsSection';
import AdminKanbanBoard from '@/components/admin/AdminKanbanBoard';


const EmployeeInfoModal = ({ employee, isOpen, onClose }) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800/90 backdrop-blur-md border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center"><UserCircle2 className="mr-2 h-6 w-6 text-primary"/>Employee Details: {employee.first_name || ''} {employee.last_name || ''} ({employee.username})</DialogTitle>
          <DialogDescription className="text-gray-400">
            Employee ID: {employee.employee_id || 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="flex items-center"><Briefcase className="h-5 w-5 mr-2 text-primary" /> Status: <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${employee.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>{employee.status}</span></p>
          <p className="flex items-center"><Mail className="h-5 w-5 mr-2 text-primary" /> Email: {employee.email || 'Not provided'}</p>
          <p className="flex items-center"><Smartphone className="h-5 w-5 mr-2 text-primary" /> Mobile: {employee.mobile || 'Not provided'}</p>
          <p className="text-xs text-gray-400">Registered on: {new Date(employee.created_at).toLocaleDateString()}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const AdminDashboardPage = () => {
  const { user, approveEmployee, getAllUsersForAdminView } = useAuth();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  
  const [allOrgUsers, setAllOrgUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeInfoModalOpen, setIsEmployeeInfoModalOpen] = useState(false);
  
  const [activeModal, setActiveModal] = useState(null); 
  const [modalData, setModalData] = useState([]);

  const organization = useMemo(() => orgConfig.find(org => org.id === user?.organization_id_slug), [user?.organization_id_slug]);
  const organizationName = organization?.name || 'Your Organization';
  
  useEffect(() => {
    const loadInitialData = async () => {
      if (user?.organization_id_slug) {
        setDataLoading(true);
        await fetchTasks(); // Ensure tasks are fetched by TaskContext
        const usersFromDb = await getAllUsersForAdminView(user.organization_id_slug);
        setAllOrgUsers(usersFromDb || []);
        setDataLoading(false);
      }
    };
    loadInitialData();
  }, [user, getAllUsersForAdminView, fetchTasks]);


  const orgTasks = useMemo(() => tasks.filter(task => task.organization_id_slug === user?.organization_id_slug), [tasks, user?.organization_id_slug]);

  const todoTasks = useMemo(() => orgTasks.filter(task => task.status === 'todo'), [orgTasks]);
  const inProgressTasks = useMemo(() => orgTasks.filter(task => task.status === 'inprogress'), [orgTasks]);
  const completedTasksForApproval = useMemo(() => orgTasks.filter(task => task.status === 'completed'), [orgTasks]); 
  const approvedTasks = useMemo(() => orgTasks.filter(task => task.status === 'approved'), [orgTasks]); 

  const pendingEmployees = useMemo(() => allOrgUsers.filter(u => u.role === 'employee' && u.status === 'pending'), [allOrgUsers]);
  const approvedOrgEmployees = useMemo(() => allOrgUsers.filter(u => u.role === 'employee' && u.status === 'approved'), [allOrgUsers]);

  const totalOrgTasks = orgTasks.length;
  const completionRate = totalOrgTasks > 0 ? ((approvedTasks.length / totalOrgTasks) * 100).toFixed(0) : 0;

  const handleViewEmployeeDetails = (employeeId) => {
    const emp = allOrgUsers.find(u => u.id === employeeId);
    setSelectedEmployee(emp);
    setIsEmployeeInfoModalOpen(true);
  };
  
  const handleApproveEmployee = async (employeeDbId) => {
    await approveEmployee(employeeDbId);
    // Re-fetch users to update the list after approval
    if (user?.organization_id_slug) {
        const updatedUsers = await getAllUsersForAdminView(user.organization_id_slug);
        setAllOrgUsers(updatedUsers || []);
    }
  };


  const handleCardClick = (modalType) => {
    setActiveModal(modalType);
    switch(modalType) {
      case 'totalTasks': setModalData(orgTasks); break;
      case 'pendingApprovalTasks': setModalData(completedTasksForApproval); break;
      case 'approvedTasks': setModalData(approvedTasks); break;
      case 'pendingEmployees': setModalData(pendingEmployees); break;
      case 'approvedEmployees': setModalData(approvedOrgEmployees); break;
      default: setModalData([]);
    }
  };

  const closeModal = () => setActiveModal(null);

  const stats = {
    totalOrgTasks,
    todoTasksCount: todoTasks.length,
    inProgressTasksCount: inProgressTasks.length,
    completedTasksForApprovalCount: completedTasksForApproval.length,
    approvedTasksCount: approvedTasks.length,
    pendingEmployeesCount: pendingEmployees.length,
    approvedOrgEmployeesCount: approvedOrgEmployees.length,
  };

  const kanbanTasks = {
    todoTasks, inProgressTasks, completedTasksForApproval, approvedTasks
  };

  if (tasksLoading || dataLoading || !user) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-xl text-purple-300 flex items-center"><Building className="mr-2 h-6 w-6"/>{organizationName}</p>
        </motion.div>
        <AddTaskDialog />
      </div>
      
      <AdminStatsGrid stats={stats} onCardClick={handleCardClick} />

      <PendingApprovalsSection 
        pendingEmployees={pendingEmployees}
        onApprove={handleApproveEmployee}
        onViewDetails={handleViewEmployeeDetails}
        showFullListLink={() => handleCardClick('pendingEmployees')}
      />
      
      <AdminKanbanBoard tasks={kanbanTasks} completionRate={completionRate} />
      
      <EmployeeInfoModal employee={selectedEmployee} isOpen={isEmployeeInfoModalOpen} onClose={() => setIsEmployeeInfoModalOpen(false)} />
      
      {activeModal === 'approvedEmployees' && (
        <ApprovedEmployeesModal 
          isOpen={true} 
          onClose={closeModal} 
          employees={modalData}
          organizationName={organizationName}
        />
      )}
      {activeModal === 'pendingEmployees' && (
        <PendingEmployeesListModal
          isOpen={true}
          onClose={closeModal}
          employees={modalData}
          organizationName={organizationName}
        />
      )}
      {['totalTasks', 'pendingApprovalTasks', 'approvedTasks'].includes(activeModal) && (
        <TaskListModal
          isOpen={true}
          onClose={closeModal}
          tasks={modalData}
          title={`${activeModal === 'totalTasks' ? 'All' : activeModal === 'pendingApprovalTasks' ? 'Pending Approval' : 'Approved'} Tasks - ${organizationName}`}
          description={`List of ${activeModal === 'totalTasks' ? 'all' : activeModal === 'pendingApprovalTasks' ? 'pending approval' : 'approved'} tasks.`}
        />
      )}
    </motion.div>
  );
};

export default AdminDashboardPage;
  