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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

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
  };

  return (
    <div>
      <h1>File Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}

      {proposal && (
        <div>
          <h2>Proposal Info</h2>
          <p>
            <strong>Company:</strong> {proposal.company}
          </p>
          <p>
            <strong>Contact Name:</strong> {proposal.contactName}
          </p>
          <p>
            <strong>Email:</strong> {proposal.email}
          </p>
          <p>
            <strong>Phone:</strong> {proposal.phone}
          </p>
          <p>
            <strong>Address:</strong> {proposal.address}
          </p>
          <p>
            <strong>Scope:</strong> {proposal.scope}
          </p>
          <p>
            <strong>Description:</strong> {proposal.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default Uploader;
