"use client";

import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#222",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      {/* Top Menu Bar */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "1rem 2rem",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <FaFileAlt size={28} />
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
          Bid Workflow
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
          gap: "4rem",
          padding: "12rem 5rem 4rem 5rem",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Large icon floated top-left of text */}
          <FaFileAlt
            size={120}
            color="#27ae60"
            style={{
              float: "left",
              marginRight: "1.5rem",
              marginBottom: "1rem",
            }}
          />

          <h1
            style={{
              fontSize: "3.2rem",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            Automate Document
            <br />
            Ingestion & Bid Selection
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Upload PDFs to automatically extract structured data and key
            details. Extracted information is processed and organized, powering
            efficient bid review and selection as part of your ITT workflow.
            Save time, reduce manual work, and make informed decisions faster.
          </p>

          <Link
            href="/uploader"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              backgroundColor: "#27ae60",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "1.2rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1e8449")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#27ae60")
            }
          >
            Upload Documents
          </Link>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1695388474402-ed805a890d8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Business team working with documents"
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </main>

      {/* Bottom Description */}
      <div style={{ textAlign: "center", padding: "2rem 2rem" }}>
        <p
          style={{
            fontSize: "1rem",
            color: "#555",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Start by uploading PDFs to extract contact information, project scope,
          and other essential elements — enabling smarter bid invitations and a
          more efficient review process.
        </p>
      </div>
    </div>
  );
}
