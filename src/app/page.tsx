"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
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
            </tr>
          </thead>
          <tbody>
            {proposals.map((p: any) => (
              <tr key={p.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {p.id}
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
