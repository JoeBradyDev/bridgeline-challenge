"use client";
import React, { useState } from "react";

type ProposalInfo = {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  scope?: string;
  description?: string;
};

const Uploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [proposal, setProposal] = useState<ProposalInfo | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
        setMessage(null);
      } else {
        setMessage("Upload failed");
        setProposal(null);
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred during upload");
      setProposal(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!proposal) return;
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleSave = async () => {
    if (!proposal) return;

    const formData = new FormData();
    // Only include the editable proposal fields, not the file
    Object.entries(proposal).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Proposal saved successfully!");
      } else {
        setMessage("Failed to save proposal");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred while saving");
    }
  };

  return (
    <div>
      <h1>File Uploader</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}

      {proposal && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2>Verify and Edit Proposal Info</h2>
          <p>
            Please review the extracted information and make any necessary edits
            before saving.
          </p>

          <label>
            Company:
            <input
              type="text"
              name="company"
              value={proposal.company || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Contact Name:
            <input
              type="text"
              name="contactName"
              value={proposal.contactName || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={proposal.email || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={proposal.phone || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Address:
            <textarea
              name="address"
              value={proposal.address || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Scope:
            <input
              type="text"
              name="scope"
              value={proposal.scope || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={proposal.description || ""}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
          </label>

          <button onClick={handleSave} style={{ marginTop: "12px" }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Uploader;
