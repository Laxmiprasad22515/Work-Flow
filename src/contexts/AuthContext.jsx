
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { organizations as orgConfig, generateEmployeeId as generateIdUtil } from '@/config/organizations';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const fetchUserSession = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('workFlowUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        let userDetails = null;
        if (parsedUser.role === 'admin') {
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .eq('id', parsedUser.id)
                .single();
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
            userDetails = data;
        } else if (parsedUser.role === 'employee') {
             const { data, error } = await supabase
                .from('employees')
                .select('*')
                .eq('id', parsedUser.id)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            userDetails = data;
        }

        if (userDetails) {
          setUser(userDetails);
        } else {
          localStorage.removeItem('workFlowUser'); // Stored user not found in DB
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
      localStorage.removeItem('workFlowUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserSession();
  }, []);


  const generateUniqueEmployeeId = async () => {
    let newId;
    let isUnique = false;
    while (!isUnique) {
      newId = generateIdUtil();
      const { data, error } = await supabase
        .from('employees')
        .select('employee_id')
        .eq('employee_id', newId)
        .maybeSingle(); 
      if (error) {
        console.error('Error checking employee ID uniqueness:', error);
        throw error; 
      }
      if (!data) {
        isUnique = true;
      }
    }
    return newId;
  };

  const login = async (credentials) => {
    const { usernameOrId, password, roleSelection } = credentials;
    let foundUser = null;
    let error = null;

    try {
      if (roleSelection === 'admin') {
        const { data, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('username', usernameOrId)
          .eq('password', password) 
          .single();
        if (adminError && adminError.code !== 'PGRST116') error = adminError;
        foundUser = data;
      } else if (roleSelection === 'employee') {
        const { data, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .or(`username.eq.${usernameOrId},employee_id.eq.${usernameOrId}`)
          .eq('password', password) 
          .single();
        
        if (employeeError && employeeError.code !== 'PGRST116') error = employeeError;
        
        if (data && data.status !== 'approved') {
          toast({
            title: 'Login Failed',
            description: 'Your account is pending approval or has been rejected.',
            variant: 'destructive',
          });
          return;
        }
        foundUser = data;
      }

      if (error) throw error;
      
      if (foundUser) {
        localStorage.setItem('workFlowUser', JSON.stringify(foundUser));
        setUser(foundUser);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${foundUser.first_name || foundUser.username}!`,
        });
        if (foundUser.role === 'admin') navigate('/admin');
        else if (foundUser.role === 'employee') navigate('/employee');
        else navigate('/');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials, role, or account not approved.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred during login.',
        variant: 'destructive',
      });
    }
  };

  const signup = async (userData) => {
    const { firstName, lastName, username, password, organizationId, email, mobile } = userData;

    try {
      const { data: existingUser, error: selectError } = await supabase
        .from('employees')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') throw selectError;

      if (existingUser) {
        toast({
          title: 'Signup Failed',
          description: existingUser.username === username ? 'Username already exists.' : 'Email already registered.',
          variant: 'destructive',
        });
        return false;
      }

      const { error: insertError } = await supabase.from('employees').insert({
        first_name: firstName,
        last_name: lastName,
        username,
        password, 
        email,
        mobile,
        organization_id_slug: organizationId,
        status: 'pending',
      });

      if (insertError) throw insertError;

      toast({
        title: 'Signup Successful',
        description: 'Your registration is pending admin approval.',
      });
      return true;
    } catch (err) {
      console.error('Signup error:', err);
      toast({
        title: 'Signup Error',
        description: err.message || 'An unexpected error occurred during signup.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const approveEmployee = async (employeeDbId) => {
    try {
      const newGeneratedEmployeeId = await generateUniqueEmployeeId();
      const { data: updatedEmployee, error } = await supabase
        .from('employees')
        .update({ status: 'approved', employee_id: newGeneratedEmployeeId })
        .eq('id', employeeDbId)
        .select()
        .single();

      if (error) throw error;

      if (updatedEmployee) {
         toast({
          title: 'Employee Approved',
          description: `${updatedEmployee.first_name || updatedEmployee.username} approved with ID: ${newGeneratedEmployeeId}.`,
        });
        fetchUserSession(); // Re-fetch all users or update local state if necessary
      }
    } catch (err) {
      console.error('Error approving employee:', err);
      toast({
        title: 'Approval Error',
        description: err.message || 'Could not approve employee.',
        variant: 'destructive',
      });
    }
  };
  
  const getEmployeesByOrganization = async (organizationIdSlug, status = 'approved') => {
    if (!organizationIdSlug) return [];
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug)
        .eq('status', status);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching employees by org:', err);
      return [];
    }
  };

  const getPendingEmployees = async (organizationIdSlug) => {
     if (!organizationIdSlug) return [];
     try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug)
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching pending employees:', err);
      return [];
    }
  };
  
  const getAllUsersForAdminView = async (organizationIdSlug) => {
    if (!organizationIdSlug) return [];
     try {
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug);
      if (employeesError) throw employeesError;

      return employeesData || [];
    } catch (err) {
      console.error('Error fetching all users for admin:', err);
      return [];
    }
  }

  const logout = () => {
    localStorage.removeItem('workFlowUser');
    setUser(null);
    navigate('/login');
  };
  
  useEffect(() => {
    if (location.pathname !== '/login' && !user) { 
        fetchUserSession();
    } else if (location.pathname === '/login' && user) {
      // If already logged in and navigating to login, redirect based on role.
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'employee') navigate('/employee', { replace: true });
      else navigate('/', { replace: true });
    } else {
        setLoading(false); 
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, approveEmployee, getEmployeesByOrganization, getPendingEmployees, getAllUsersForAdminView, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
  