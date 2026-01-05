"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";

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

export default function InviteToBidPage() {
  const router = useRouter();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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

  const handleStepClick = (step: number) => {
    if (step === 1) {
      router.push("/uploader");
      return;
    }

    if (step === 3) {
      router.push("/invite-to-bid");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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

      setProposals((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkDelete = () => handleDelete(Array.from(selectedIds));

  const handleInviteToBid = () => {
    if (selectedIds.size === 0) return;

    alert(`Invitation emails sent to ${selectedIds.size} bidder(s).`);
    setSelectedIds(new Set());
  };

  return (
    <Sidebar currentStep={3} onStepClick={handleStepClick}>
      <h1>Proposals</h1>

      <div style={{ margin: "1rem 0" }}>
        <button
          onClick={() => router.push("/uploader")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Proposal
        </button>

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

        <button
          onClick={handleInviteToBid}
          disabled={selectedIds.size === 0}
          style={{
            marginLeft: "1rem",
            padding: "8px 16px",
            backgroundColor: selectedIds.size === 0 ? "#ccc" : "#2e7d32",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: selectedIds.size === 0 ? "not-allowed" : "pointer",
          }}
        >
          Invite to Bid
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
              {[
                "Select",
                "Company",
                "Contact Name",
                "Email",
                "Phone",
                "Address",
                "Scope",
                "Description",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{ border: "1px solid #ccc", padding: "8px" }}
                >
                  {h}
                </th>
              ))}
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
    </Sidebar>
  );
}
