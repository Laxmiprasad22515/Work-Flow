
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle2, FileBadge as CheckBadgeIcon, Mail, Smartphone, KeyRound as UserRoundCog } from 'lucide-react'; // Adjusted UserCheck to UserRoundCog for variety

const ApprovedEmployeeItem = ({ employee }) => {
  return (
    <li className="p-4 bg-white/10 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-primary flex items-center">
            <UserCircle2 className="h-5 w-5 mr-2" /> 
            {employee.first_name || ''} {employee.last_name || ''}
        </h3>
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full flex items-center">
            <CheckBadgeIcon className="h-3 w-3 mr-1" /> Approved
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300">
        <p className="flex items-center"><UserRoundCog className="h-4 w-4 mr-2 text-sky-400" /> Employee ID: {employee.employee_id || 'N/A'}</p>
        <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-pink-400" /> Email: {employee.email}</p>
        <p className="flex items-center"><Smartphone className="h-4 w-4 mr-2 text-yellow-400" /> Mobile: {employee.mobile}</p>
      </div>
    </li>
  );
};

const ApprovedEmployeesModal = ({ isOpen, onClose, employees, organizationName }) => {
  if (!employees) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800/90 backdrop-blur-md border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Approved Employees - {organizationName}</DialogTitle>
          <DialogDescription className="text-gray-300">
            List of all approved employees in your organization.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {employees.length > 0 ? (
            <ul className="space-y-3">
              {employees.map((employee) => (
                <ApprovedEmployeeItem key={employee.id} employee={employee} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">No approved employees found.</p>
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

export default ApprovedEmployeesModal;
  