// Mock Firebase Auth without requiring actual Firebase
// This file provides a simplified auth system that doesn't require Firebase credentials

// Define our mock User type to match Firebase User interface
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  getIdToken: () => Promise<string>;
}

// Mock auth state
let currentUser: User | null = null;
const listeners: Array<(user: User | null) => void> = [];

// Mock auth object
export const auth = {
  currentUser,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Add the callback to listeners
    listeners.push(callback);
    // Immediately call with current state
    setTimeout(() => callback(currentUser), 0);
    // Return a function to unsubscribe
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) listeners.splice(index, 1);
    };
  },
};

// Helper to update all listeners
const updateAuthState = (user: User | null) => {
  currentUser = user;
  listeners.forEach(callback => callback(user));
};

// Sign in with Google (mock)
export const signInWithGoogle = async (): Promise<User> => {
  console.log("Mock sign in with Google");
  const mockUser: User = {
    uid: "google-user-123",
    email: "user@example.com",
    displayName: "Demo User",
    photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=user@example.com",
    emailVerified: true,
    getIdToken: async () => "mock-id-token-123",
  };
  updateAuthState(mockUser);
  return mockUser;
};

// Sign in with username and password
export const signInWithEmail = async (username: string, password: string): Promise<User> => {
  console.log(`Mock sign in with username: ${username}`);
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  const mockUser: User = {
    uid: `user-${username}`,
    email: null,
    displayName: username,
    photoURL: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
    emailVerified: true,
    getIdToken: async () => "mock-id-token-456",
  };
  updateAuthState(mockUser);
  return mockUser;
};

// Sign up with username and password
export const signUpWithEmail = async (username: string, password: string): Promise<User> => {
  console.log(`Mock sign up with username: ${username}`);
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  const mockUser: User = {
    uid: `user-${username}`,
    email: null,
    displayName: username,
    photoURL: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
    emailVerified: true,
    getIdToken: async () => "mock-id-token-789",
  };
  updateAuthState(mockUser);
  return mockUser;
};

// Sign out
export const logOut = async (): Promise<void> => {
  console.log("Mock sign out");
  updateAuthState(null);
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};
