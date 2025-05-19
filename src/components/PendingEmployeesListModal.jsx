
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle2, UserSquare2, Mail, Smartphone, Clock } from 'lucide-react';

const PendingEmployeeItem = ({ employee }) => {
  return (
    <li className="p-4 bg-white/10 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-semibold text-primary flex items-center">
            <UserCircle2 className="h-5 w-5 mr-2" /> 
            {employee.firstName || ''} {employee.lastName || ''}
        </h3>
        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full">Pending</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300">
        <p className="flex items-center"><UserSquare2 className="h-4 w-4 mr-2 text-sky-400" /> Username: {employee.username}</p>
        <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-pink-400" /> Email: {employee.email}</p>
        <p className="flex items-center"><Smartphone className="h-4 w-4 mr-2 text-yellow-400" /> Mobile: {employee.mobile}</p>
        <p className="flex items-center col-span-full"><Clock className="h-4 w-4 mr-2 text-gray-400" /> Registered: {new Date(employee.createdAt).toLocaleDateString()}</p>
      </div>
    </li>
  );
};

const PendingEmployeesListModal = ({ isOpen, onClose, employees, organizationName }) => {
  if (!employees) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800/90 backdrop-blur-md border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Pending Employee Approvals - {organizationName}</DialogTitle>
          <DialogDescription className="text-gray-300">
            List of new employee registrations awaiting your approval.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {employees.length > 0 ? (
            <ul className="space-y-3">
              {employees.map((employee) => (
                <PendingEmployeeItem key={employee.id} employee={employee} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">No pending employee registrations.</p>
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

export default PendingEmployeesListModal;
  