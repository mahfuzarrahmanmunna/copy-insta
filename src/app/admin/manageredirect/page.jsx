"use client";
import React, { useState, useEffect } from "react";

export default function ManageRedirectPage() {
  const [links, setLinks] = useState([]);
  const [newUrl, setNewUrl] = useState(""); // State for the input field

  const [loading, setLoading] = useState(false); // For activating
  const [addLoading, setAddLoading] = useState(false); // For adding
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Fetch all links on load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setFetchLoading(true);
        const res = await fetch("/api/admin/redirect");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.links) {
          setLinks(data.links);
        }
      } catch (error) {
        console.error("Failed to fetch links", error);
        setMessage({ type: "error", text: "Failed to load links." });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // 2. Handle Adding a New Link
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setAddLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "New link added successfully!" });
        setNewUrl(""); // Clear input

        // Refetch list to show the new link
        const fetchRes = await fetch("/api/admin/redirect");
        const fetchData = await fetchRes.json();
        if (fetchData.links) setLinks(fetchData.links);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add link.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setAddLoading(false);
    }
  };

  // 3. Handle Setting Active Link
  const handleSetActive = async (id) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Optimistic UI update
        setLinks((prev) =>
          prev.map((link) => ({
            ...link,
            is_active: link.id === id ? 1 : 0,
          })),
        );
        setMessage({ type: "success", text: "Active redirect link updated!" });
      } else {
        setMessage({ type: "error", text: "Failed to update active link." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 space-y-6">
      {/* --- SECTION 1: ADD NEW LINK --- */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Link</h2>
          <p className="text-sm text-gray-500">
            Enter a new URL to add to your list.
          </p>
        </div>

        <form onSubmit={handleAddLink} className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/new-link"
              required
              className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-gray-50"
            />
          </div>
          <button
            type="submit"
            disabled={addLoading}
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {addLoading ? "Adding..." : "Add Link"}
          </button>
        </form>
      </div>

      {/* --- SECTION 2: SET ACTIVE LINK --- */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Active Redirect Selection
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select one link from the list below to be the current active
            redirect.
          </p>
        </div>

        {/* Global Status Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {fetchLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {links.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No links found. Add one above.
              </p>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    link.is_active === 1
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio Button */}
                    <input
                      type="radio"
                      name="active-link"
                      id={`link-${link.id}`}
                      checked={link.is_active === 1}
                      onChange={() => handleSetActive(link.id)}
                      disabled={loading}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-600 cursor-pointer"
                    />

                    <label
                      htmlFor={`link-${link.id}`}
                      className="text-sm font-medium text-gray-900 cursor-pointer select-none break-all"
                    >
                      {link.redirect_url}
                    </label>
                  </div>

                  {link.is_active === 1 && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
