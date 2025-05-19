
import { supabase } from '@/lib/supabaseClient';
import { generateEmployeeId as generateIdUtil } from '@/config/organizations';

export const fetchUserDetails = async (userId, role) => {
  const tableName = role === 'admin' ? 'admins' : 'employees';
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') { 
    console.error(`Error fetching ${role} details:`, error);
    throw error;
  }
  return data;
};

export const checkEmployeeIdUniqueness = async (employeeId) => {
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id')
    .eq('employee_id', employeeId)
    .maybeSingle();
  if (error) {
    console.error('Error checking employee ID uniqueness:', error);
    throw error;
  }
  return !data; 
};

export const generateUniqueEmployeeId = async () => {
  let newId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10; 

  while (!isUnique && attempts < maxAttempts) {
    newId = generateIdUtil();
    isUnique = await checkEmployeeIdUniqueness(newId);
    attempts++;
  }
  if (!isUnique) {
    throw new Error("Failed to generate a unique employee ID after several attempts.");
  }
  return newId;
};

export const findUserForLogin = async (usernameOrId, password, roleSelection) => {
  if (roleSelection === 'admin') {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', usernameOrId)
      .eq('password', password) 
      .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding admin for login:', error);
        throw error;
    }
    return data;
  } else if (roleSelection === 'employee') {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`username.eq.${usernameOrId},employee_id.eq.${usernameOrId}`)
      .eq('password', password) 
      .eq('status', 'approved') 
      .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding employee for login:', error);
        throw error;
    }
    if (data && data.status !== 'approved') {
        return { ...data, login_blocked_status: data.status }; 
    }
    return data;
  }
  return null;
};

export const checkExistingEmployee = async (username, email) => {
    const { data, error } = await supabase
        .from('employees')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();
    if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing employee:', error);
        throw error;
    }
    return data;
};

export const insertNewEmployee = async (employeeData) => {
    const { error } = await supabase.from('employees').insert(employeeData);
    if (error) {
        console.error('Error inserting new employee:', error);
        throw error;
    }
};

export const updateEmployeeStatusAndId = async (employeeDbId, newStatus, employeeId) => {
    const { data: updatedEmployee, error } = await supabase
        .from('employees')
        .update({ status: newStatus, employee_id: employeeId, updated_at: new Date().toISOString() })
        .eq('id', employeeDbId)
        .select()
        .single();
    if (error) {
        console.error('Error updating employee status:', error);
        throw error;
    }
    return updatedEmployee;
};

export const fetchEmployeesByOrganization = async (organizationIdSlug, status = 'approved') => {
    if (!organizationIdSlug) return [];
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug)
        .eq('status', status);
      if (error) {
        console.error('Error fetching employees by org:', error);
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error('Error in fetchEmployeesByOrganization:', err);
      return [];
    }
};
  
export const fetchPendingEmployees = async (organizationIdSlug) => {
     if (!organizationIdSlug) return [];
     try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug)
        .eq('status', 'pending');
      if (error) {
        console.error('Error fetching pending employees:', error);
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error('Error in fetchPendingEmployees:', err);
      return [];
    }
};

export const fetchAllUsersForAdminView = async (organizationIdSlug) => {
    if (!organizationIdSlug) return [];
     try {
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('organization_id_slug', organizationIdSlug);
      if (employeesError) {
        console.error('Error fetching all users for admin:', employeesError);
        throw employeesError;
      }
      return employeesData || [];
    } catch (err) {
      console.error('Error in fetchAllUsersForAdminView:', err);
      return [];
    }
};
  