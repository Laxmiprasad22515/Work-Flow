
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, UserPlus, Mail, Smartphone, User } from 'lucide-react';
import { organizations } from '@/config/organizations';

const SignupForm = ({ onSignupSuccess }) => {
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupFirstName || !signupLastName || !signupUsername || !signupPassword || !signupConfirmPassword || !selectedOrganization || !signupEmail || !signupMobile) {
      toast({
        title: 'Error',
        description: 'Please fill all fields for signup.',
        variant: 'destructive',
      });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
        toast({
            title: 'Error',
            description: 'Please enter a valid email address.',
            variant: 'destructive',
        });
        return;
    }
    const mobileRegex = /^\d{10}$/; 
     if (!mobileRegex.test(signupMobile)) {
        toast({
            title: 'Error',
            description: 'Please enter a valid 10-digit mobile number.',
            variant: 'destructive',
        });
        return;
    }

    const success = signup({ 
        firstName: signupFirstName,
        lastName: signupLastName,
        username: signupUsername, 
        password: signupPassword, 
        organizationId: selectedOrganization,
        email: signupEmail,
        mobile: signupMobile 
    });

    if (success) {
      setSignupFirstName('');
      setSignupLastName('');
      setSignupUsername('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupEmail('');
      setSignupMobile('');
      setSelectedOrganization('');
      if (onSignupSuccess) onSignupSuccess();
    }
  };

  return (
    <form onSubmit={handleSignupSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="signup-firstname" className="text-gray-100">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              id="signup-firstname"
              type="text"
              placeholder="Your first name"
              value={signupFirstName}
              onChange={(e) => setSignupFirstName(e.target.value)}
              className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pl-10"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="signup-lastname" className="text-gray-100">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              id="signup-lastname"
              type="text"
              placeholder="Your last name"
              value={signupLastName}
              onChange={(e) => setSignupLastName(e.target.value)}
              className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pl-10"
            />
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-username" className="text-gray-100">Username</Label>
        <Input
          id="signup-username"
          type="text"
          placeholder="Choose a username"
          value={signupUsername}
          onChange={(e) => setSignupUsername(e.target.value)}
          className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-email" className="text-gray-100">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
            id="signup-email"
            type="email"
            placeholder="your.email@example.com"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pl-10"
            />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-mobile" className="text-gray-100">Mobile Number</Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
            id="signup-mobile"
            type="tel"
            placeholder="e.g., 1234567890"
            value={signupMobile}
            onChange={(e) => setSignupMobile(e.target.value)}
            className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pl-10"
            />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-password" className="text-gray-100">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showSignupPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pr-10"
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-300 hover:text-white" onClick={() => setShowSignupPassword(!showSignupPassword)}>
            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="signup-confirm-password" className="text-gray-100">Confirm Password</Label>
          <div className="relative">
            <Input
                id="signup-confirm-password"
                type={showSignupConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="bg-white/30 text-white placeholder-gray-300 border-white/40 focus:ring-pink-400 pr-10"
            />
            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-300 hover:text-white" onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}>
                {showSignupConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="organization" className="text-gray-100">Organization</Label>
        <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
          <SelectTrigger className="w-full bg-white/30 text-white border-white/40 focus:ring-pink-400">
            <SelectValue placeholder="Select your organization" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {organizations.map(org => (
              <SelectItem key={org.id} value={org.id} className="hover:bg-primary/30 focus:bg-primary/40">
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CardFooter className="p-0 pt-2">
        <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-lg py-3 transition-all duration-300 ease-in-out transform hover:scale-105">
          <UserPlus className="mr-2 h-5 w-5" /> Sign Up
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
  