const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom event dispatcher for auth changes within the same window
const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('authStateChange'));
};

export const signInWithEmail = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to sign in');
  
  if (data.session?.access_token) {
    localStorage.setItem('session', JSON.stringify(data.session));
    dispatchAuthChange();
  }
  return data;
};

export const signInWithGoogle = async () => {
  throw new Error('Google Sign-In is not supported in the custom backend yet.');
};

export const signOut = async () => {
  localStorage.removeItem('session');
  dispatchAuthChange();
};

export const signUp = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to sign up');
  
  if (data.session?.access_token) {
    localStorage.setItem('session', JSON.stringify(data.session));
    dispatchAuthChange();
  }
  return data;
};

export const getSession = async () => {
  const sessionStr = localStorage.getItem('session');
  if (!sessionStr) return null;
  
  try {
    const sessionLocal = JSON.parse(sessionStr);
    const role = sessionLocal?.user?.role;
    const url = role === 'doctor' ? `${API_URL}/doctors/me` : `${API_URL}/auth/me`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionLocal.access_token}`
      },
    });
    
    if (!response.ok) {
        localStorage.removeItem('session');
        dispatchAuthChange();
        return null;
    }
    const data = await response.json();
    if (data.session) {
      localStorage.setItem('session', JSON.stringify(data.session));
      return data.session;
    }
    return null;
  } catch(error) {
     localStorage.removeItem('session');
     dispatchAuthChange();
     return null;
  }
};