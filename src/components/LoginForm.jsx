
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [usernameOrId, setUsernameOrId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameOrId || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username/ID and password.',
        variant: 'destructive',
      });
      return;
    }
    login({ usernameOrId, password, roleSelection: selectedRole });
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/30 mb-4">
          <TabsTrigger value="employee" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">Employee</TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Admin</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-2">
        <Label htmlFor="login-username" className="text-gray-100">{selectedRole === 'employee' ? 'Username or Employee ID' : 'Username'}</Label>
        <Input
          id="login-username"
          type="text"
          placeholder={selectedRole === 'employee' ? 'Your username or ID' : 'Your username'}
          value={usernameOrId}
          onChange={(e) => setUsernameOrId(e.target.value)}
          className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-gray-100">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-300 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <CardFooter className="p-0">
        <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg py-3 transition-all duration-300 ease-in-out transform hover:scale-105">
          <LogIn className="mr-2 h-5 w-5" /> Sign In
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
  