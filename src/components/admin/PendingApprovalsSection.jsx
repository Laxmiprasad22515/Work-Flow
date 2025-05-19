
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, Smartphone, Info, UserCheck as UserCheckIcon } from 'lucide-react';

const PendingApprovalsSection = ({ pendingEmployees, onApprove, onViewDetails, showFullListLink }) => {
  if (!pendingEmployees || pendingEmployees.length === 0) {
    return null;
  }

  const displayEmployees = pendingEmployees.slice(0,3);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 p-4 md:p-6 bg-black/20 backdrop-blur-lg rounded-xl shadow-xl"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Approve New Employees</h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {displayEmployees.map(emp => (
          <motion.div 
            key={emp.id} 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white/10 rounded-lg"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          >
            <div>
                <span className="text-gray-100 font-semibold">{emp.firstName || ''} {emp.lastName || ''} ({emp.username})</span>
                <div className="text-xs text-gray-300">
                    <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{emp.email || 'N/A'}</span>
                    <span className="flex items-center"><Smartphone className="h-3 w-3 mr-1" />{emp.mobile || 'N/A'}</span>
                </div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
                <Button size="sm" onClick={() => onViewDetails(emp.id)} variant="outline" className="text-sky-300 border-sky-400 hover:bg-sky-400 hover:text-white">
                    <Info className="h-4 w-4 mr-1" /> Details
                </Button>
                <Button size="sm" onClick={() => onApprove(emp.id)} className="bg-green-500 hover:bg-green-600 text-white">
                    <UserCheckIcon className="h-4 w-4 mr-2" /> Approve
                </Button>
            </div>
          </motion.div>
        ))}
        {pendingEmployees.length > 3 && (
          <p className="text-center text-gray-300 text-sm mt-2">
            And {pendingEmployees.length - 3} more... 
            {showFullListLink && <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 ml-1" onClick={showFullListLink}>View all</Button>}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PendingApprovalsSection;
  