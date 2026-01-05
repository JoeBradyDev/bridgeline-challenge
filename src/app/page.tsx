"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Proposal = {
  id: number;
  company: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  scope?: string;
  description?: string;
};

export default function HomePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch("/api/proposals");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch proposals");
        setProposals(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleDelete = async (ids: number[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} proposal(s)?`))
      return;

    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      // Remove deleted proposals from state
      setProposals((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        ids.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkDelete = () => {
    handleDelete(Array.from(selectedIds));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Proposals</h1>

      <div style={{ margin: "1rem 0" }}>
        <Link
          href="/uploader"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Add Proposal
        </Link>

        <button
          onClick={handleBulkDelete}
          disabled={selectedIds.size === 0}
          style={{
            marginLeft: "1rem",
            padding: "8px 16px",
            backgroundColor: selectedIds.size === 0 ? "#ccc" : "#d32f2f",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: selectedIds.size === 0 ? "not-allowed" : "pointer",
          }}
        >
          Delete Selected
        </button>
      </div>

      {loading && <p>Loading proposals...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && proposals.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Select
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Company
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Contact Name
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Phone
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Scope
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.company}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.contact_name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.phone}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.scope}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.description}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => handleDelete([p.id])}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && proposals.length === 0 && (
        <p>No proposals found.</p>
      )}
    </div>
  );
}
