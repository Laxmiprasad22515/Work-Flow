
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle } from 'lucide-react';

const AddTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToEmployeeId, setAssignedToEmployeeId] = useState(null); 
  const [priority, setPriority] = useState('medium');
  const { addTask } = useTasks();
  const { user, getEmployeesByOrganization } = useAuth();
  const [employeesInOrganization, setEmployeesInOrganization] = useState([]);

  useEffect(() => {
    const fetchOrgEmployees = async () => {
      if (user?.organization_id_slug && open) {
        const employees = await getEmployeesByOrganization(user.organization_id_slug, 'approved');
        setEmployeesInOrganization(employees);
      }
    };
    fetchOrgEmployees();
  }, [user, open, getEmployeesByOrganization]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return; 
    await addTask({ 
      title, 
      description, 
      assigned_to_employee_id: assignedToEmployeeId, 
      priority,
      // due_date is removed
    });
    setTitle('');
    setDescription('');
    setAssignedToEmployeeId(null);
    setPriority('medium');
    setOpen(false);
  };

  const handleDialogChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Optionally reset form fields when dialog closes
      setTitle('');
      setDescription('');
      setAssignedToEmployeeId(null);
      setPriority('medium');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details for the new task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-gray-300">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                placeholder="Task title"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                placeholder="Task description"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="assignedTo" className="text-gray-300">Assign To</Label>
              <Select onValueChange={(value) => setAssignedToEmployeeId(value === 'unassigned' ? null : value)} value={assignedToEmployeeId || 'unassigned'}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white placeholder-gray-500">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="unassigned" className="text-gray-400 hover:bg-primary/30 focus:bg-primary/40">Unassigned</SelectItem>
                  {employeesInOrganization.map(emp => (
                    <SelectItem key={emp.id} value={emp.employee_id} className="hover:bg-primary/30 focus:bg-primary/40">
                      {emp.first_name} {emp.last_name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="priority" className="text-gray-300">Priority</Label>
              <Select onValueChange={setPriority} value={priority}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                 <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="low" className="hover:bg-primary/30 focus:bg-primary/40">Low</SelectItem>
                    <SelectItem value="medium" className="hover:bg-primary/30 focus:bg-primary/40">Medium</SelectItem>
                    <SelectItem value="high" className="hover:bg-primary/30 focus:bg-primary/40">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
  