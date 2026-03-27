import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* NEW: Sub Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-14 items-center">
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            {/* Link to the new Redirect Page */}
            <Link
              href="/admin/manageredirect"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Manage Redirect
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
