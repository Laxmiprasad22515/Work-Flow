
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  
  const handleSignupSuccess = () => {
    setActiveTab('login');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        <Card className="w-full max-w-lg bg-white/20 backdrop-blur-lg shadow-2xl border-none">
          <CardHeader className="text-center">
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              {activeTab === 'login' ? 
                <LogIn className="mx-auto h-16 w-16 text-primary mb-4 p-2 bg-primary/20 rounded-full" /> :
                <UserPlus className="mx-auto h-16 w-16 text-primary mb-4 p-2 bg-primary/20 rounded-full" />
              }
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white">Welcome to Work Flow</CardTitle>
            <CardDescription className="text-gray-200">
              {activeTab === 'login' ? 'Please sign in to continue' : 'Create your employee account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/30 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">New Employee</TabsTrigger>
              </TabsList>

              {activeTab === 'login' && <LoginForm />}
              {activeTab === 'signup' && <SignupForm onSignupSuccess={handleSignupSuccess} />}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
  