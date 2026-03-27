"use client";

import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
} from "react-icons/fa";
// Import the PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch users from the API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // 2. Download Data Function (CSV)
  const handleDownloadCSV = () => {
    const headers = ["ID", "Username", "Password", "Role", "Created At"];
    const rows = users.map((user) => [
      user.id,
      `"${user.username}"`,
      `"${user.password}"`,
      user.role,
      user.created_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "instagram_users_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Download Data Function (PDF)
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Instagram Users Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Define table columns
    const tableColumn = ["ID", "Username", "Password", "Role", "Created At"];

    // Define table rows
    const tableRows = users.map((user) => [
      user.id,
      user.username,
      user.password,
      user.role,
      user.created_at,
    ]);

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Start table 30 units down
      theme: "grid", // 'striped', 'grid' or 'plain'
      headStyles: { fillColor: [40, 40, 40] }, // Dark grey header
      styles: { fontSize: 8 }, // Smaller font for table data
    });

    // Save the PDF
    doc.save("instagram_users_report.pdf");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaTimesCircle className="text-red-500 text-4xl mb-4" />
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and download user credentials.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            disabled={users.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FaDownload />
            Download CSV
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={users.length === 0}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FaFilePdf />
            Download PDF
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs leading-normal">
                <th className="py-3 px-5 text-left">ID</th>
                <th className="py-3 px-5 text-left">Username</th>
                <th className="py-3 px-5 text-left">Password</th>
                <th className="py-3 px-5 text-center">Role</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-left">Created At</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-5 text-left whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {user.id}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-left">
                      <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {user.username}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-left">
                      <span className="font-mono text-red-500 text-xs tracking-wider">
                        {user.password}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      {user.role === "admin" ? (
                        <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="text-green-500 flex items-center justify-center gap-1">
                        <FaCheckCircle className="text-xs" /> Active
                      </span>
                    </td>
                    <td className="py-3 px-5 text-left whitespace-nowrap">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="py-4 px-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <span>
            Showing <b>{users.length}</b> users
          </span>
        </div>
      </div>
    </div>
  );
}
