"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch all users if admin
    if (parsedUser.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Instagram Dashboard
              </h1>
              <span className="text-sm text-gray-500">
                Welcome, {user.username} ({user.role})
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user.role === "admin" ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                User Management
              </h2>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {users.map((userData) => (
                    <li key={userData._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Username: {userData.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                Email: {userData.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                Role: {userData.role}
                              </p>
                              <p className="text-sm text-gray-500">
                                Created:{" "}
                                {new Date(
                                  userData.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-red-600 font-mono">
                                Password: {userData.password}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {users.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                  No users found.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome to Instagram!
              </h2>
              <p className="text-gray-600 mb-4">
                You are logged in as a regular user.
              </p>
              <p className="text-sm text-gray-500">
                Username: {user.username}
                <br />
                Email: {user.email}
                <br />
                Role: {user.role}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
