import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoctorAvatar, getRandomAvatar, detectGender, INITIAL_DOCTORS } from '../data/mockData';

const AuthContext = createContext();

const INITIAL_REGISTERED_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@medpulse.org',
    role: 'Admin',
    department: 'Cardiology',
    avatar: getDoctorAvatar('Dr. Sarah Jenkins')
  },
  {
    id: 'USR-002',
    name: 'Dr. Marcus Thorne',
    email: 'marcus.thorne@medpulse.org',
    role: 'Doctor',
    department: 'Neurology',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'USR-003',
    name: 'Emily Staff',
    email: 'staff@medpulse.org',
    role: 'Receptionist',
    department: 'Frontdesk & Check-in',
    avatar: getDoctorAvatar('Emily Staff')
  }
];

const DEFAULT_USER = INITIAL_REGISTERED_USERS[0];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medpulse_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('medpulse_registered_accounts');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('medpulse_auth_user');
    return saved !== null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medpulse_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medpulse_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medpulse_registered_accounts', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password, selectedRole = 'Admin') => {
    const lowerEmail = (email || '').toLowerCase().trim();

    // 1. Check registered users list
    const registeredAccount = registeredUsers.find(u => u.email.toLowerCase() === lowerEmail);

    if (registeredAccount) {
      // Validate role match
      if (registeredAccount.role !== selectedRole) {
        return {
          success: false,
          message: `Access Denied: Account "${email}" is registered as ${registeredAccount.role}. Please select the ${registeredAccount.role} role tab to sign in.`
        };
      }

      setUser(registeredAccount);
      setIsAuthenticated(true);
      return { success: true, message: `Logged in successfully as ${selectedRole}` };
    }

    // 2. Check INITIAL_DOCTORS
    const existingDoc = INITIAL_DOCTORS.find(d => d.email && d.email.toLowerCase() === lowerEmail);
    if (existingDoc) {
      if (selectedRole !== 'Doctor') {
        return {
          success: false,
          message: `Access Denied: ${existingDoc.name} is a Medical Doctor account. Please select the Doctor role tab to sign in.`
        };
      }

      const mockUser = {
        id: existingDoc.id,
        name: existingDoc.name,
        email: lowerEmail,
        role: 'Doctor',
        avatar: existingDoc.avatar,
        department: existingDoc.specialization || 'Cardiology'
      };
      setRegisteredUsers(prev => [mockUser, ...prev]);
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, message: 'Logged in successfully as Doctor' };
    }

    // 3. Register new user for this email with selectedRole
    const name = email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
    const newUser = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name,
      email: lowerEmail,
      role: selectedRole,
      avatar: getDoctorAvatar(name),
      department: selectedRole === 'Doctor' ? 'General Practice' : (selectedRole === 'Admin' ? 'System Administration' : 'Frontdesk Check-in')
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, message: `Logged in successfully as ${selectedRole}` };
  };

  const register = (name, email, password, role = 'Doctor', extraFields = {}) => {
    const lowerEmail = (email || '').toLowerCase().trim();

    // Check if user with this email already exists
    const existing = registeredUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (existing) {
      if (existing.role !== role) {
        return {
          success: false,
          message: `An account with email ${email} is already registered as ${existing.role}. You cannot re-register it as ${role}.`
        };
      }
    }

    const letterAvatar = getDoctorAvatar(name);
    const mockUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email: lowerEmail,
      role,
      avatar: letterAvatar,
      department: extraFields.department || (role === 'Doctor' ? 'General Practice' : (role === 'Admin' ? 'System Administration' : 'Frontdesk')),
      licenseNo: extraFields.licenseNo || 'LIC-2026-99',
      phone: extraFields.phone || '+1 (555) 019-2834'
    };

    setRegisteredUsers(prev => [mockUser, ...prev.filter(u => u.email.toLowerCase() !== lowerEmail)]);
    setUser(mockUser);
    setIsAuthenticated(true);
    return { success: true, message: `Account registered successfully as ${role}!` };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medpulse_auth_user');
  };

  const updateUserProfile = (updatedDetails) => {
    setUser(prev => {
      let avatar = updatedDetails.avatar || prev.avatar;
      const gender = updatedDetails.gender || prev.gender || detectGender(updatedDetails.name || prev.name, updatedDetails.email || prev.email);
      if (updatedDetails.gender && updatedDetails.gender !== prev.gender && !updatedDetails.avatar) {
        avatar = getRandomAvatar(gender, Math.floor(Math.random() * 80) + 1);
      }
      const updated = {
        ...prev,
        ...updatedDetails,
        gender,
        avatar
      };
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
