"use client";

import Sidebar from "../components/sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProposalInfo = {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  scope?: string;
  description?: string;
};

export default function UploaderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [proposal, setProposal] = useState<ProposalInfo | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  useEffect(() => {
    if (!file) return;

    const upload = async () => {
      setIsUploading(true);
      setMessage(null);

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
          setCurrentStep(2);
        } else {
          setMessage("Upload failed");
          setFile(null);
        }
      } catch {
        setMessage("An error occurred during upload");
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    };

    upload();
  }, [file]);

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
    Object.entries(proposal).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch("/api/save", { method: "POST", body: formData });
      if (res.ok) router.push("/invite-to-bid");
      else setMessage("Failed to save proposal");
    } catch {
      setMessage("An error occurred while saving");
    }
  };

  return (
    <Sidebar currentStep={currentStep}>
      <div>
        <h1>{currentStep === 1 ? "File Uploader" : "Review Proposal"}</h1>

        {currentStep === 1 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                maxWidth: "420px",
                margin: "40px auto",
                border: "2px dashed #bbb",
                borderRadius: "12px",
                padding: "36px 24px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging ? "#f3f4f6" : "#fafafa",
                transition: "background-color 0.15s ease, border-color 0.15s",
                borderColor: isDragging ? "#888" : "#bbb",
              }}
            >
              <div style={{ fontSize: "14px", color: "#555" }}>
                {isUploading
                  ? "Uploading…"
                  : file
                  ? file.name
                  : "Drag and drop a file here"}
              </div>
              {!file && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "#777",
                  }}
                >
                  or click to browse
                </div>
              )}
            </div>
          </>
        )}

        {message && <p>{message}</p>}

        {proposal && (
          <div
            style={{
              marginTop: "20px",
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              maxWidth: "720px",
            }}
          >
            <h2>Verify and Edit Proposal Info</h2>
            <p>
              Please review the extracted information and make any necessary
              edits before saving.
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
    </Sidebar>
  );
}
