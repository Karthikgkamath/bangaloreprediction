import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    _id: "1",
    name: "Demo User",
    email: "user@example.com"
  },
  {
    _id: "2",
    name: "Test User",
    email: "test@example.com"
  },
  {
    _id: "3",
    name: "Admin User",
    email: "admin@example.com"
  }
];

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchUsers = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header Message */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500">
          Welcome to User Management
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          View and manage all registered users in the system
        </p>
      </div>

      {/* User List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-card p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-sky-200/30 dark:border-sky-700/20"
            >
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList; 