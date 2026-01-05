"use client";

import Sidebar from "../components/sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaFileAlt,
  FaClipboardList,
  FaCheck,
  FaSave,
} from "react-icons/fa";

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

  // Track which fields have been checked
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>(
    {}
  );

  const resetToUpload = () => {
    setFile(null);
    setProposal(null);
    setMessage(null);
    setIsUploading(false);
    setCurrentStep(1);
    setCheckedFields({});
  };

  const handleStepClick = (step: number) => {
    if (step === 1) {
      resetToUpload();
      return;
    }

    if (step === 3) {
      router.push("/invite-to-bid");
    }
  };

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
    // Reset checkmark if user edits
    setCheckedFields((prev) => ({ ...prev, [name]: false }));
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

  const handleCancel = () => {
    setCurrentStep(1);
    setProposal(null);
    setFile(null);
    setMessage(null);
    setCheckedFields({});
  };

  const toggleCheck = (field: string) => {
    setCheckedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Input wrapper for icon + field + checkmark
  const InputField = ({
    icon,
    label,
    type = "text",
    value,
    name,
    multiline = false,
  }: {
    icon: JSX.Element;
    label: string;
    type?: string;
    value: string;
    name: string;
    multiline?: boolean;
  }) => (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          padding: "8px 12px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginRight: "8px",
            marginTop: multiline ? "4px" : "0",
            color: "#9ca3af",
          }}
        >
          {icon}
        </div>
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              resize: "vertical",
              minHeight: "60px",
              color: "#111827",
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#111827",
              height: "36px",
            }}
          />
        )}
        <button
          type="button"
          onClick={() => toggleCheck(name)}
          style={{
            marginLeft: "8px",
            color: checkedFields[name] ? "#10b981" : "#9ca3af",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );

  const allChecked =
    proposal &&
    Object.keys(proposal).every(
      (key) => key in checkedFields && checkedFields[key]
    );

  return (
    <Sidebar currentStep={currentStep} onStepClick={handleStepClick}>
      <div>
        <h1 style={{ marginBottom: "24px" }}>
          {currentStep === 1 ? "Upload Proposal Documents" : "Review Proposal"}
        </h1>

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
                margin: "0",
                border: "2px dashed #bbb",
                borderRadius: "12px",
                padding: "36px 24px",
                textAlign: "left",
                cursor: "pointer",
                backgroundColor: isDragging ? "#f3f4f6" : "#fafafa",
                transition: "background-color 0.15s ease, border-color 0.15s",
                borderColor: isDragging ? "#888" : "#bbb",
              }}
            >
              <div
                style={{ fontSize: "14px", color: "#555", textAlign: "center" }}
              >
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
                    textAlign: "center",
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
              marginTop: "24px",
              border: "1px solid #e5e7eb",
              padding: "28px",
              borderRadius: "12px",
              maxWidth: "720px",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Verify and Edit Proposal Info
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Please review the extracted information and make any necessary
              edits before saving. Click the green checkmark for each field when
              verified.
            </p>

            <InputField
              icon={<FaUser />}
              label="Company"
              name="company"
              value={proposal.company || ""}
            />
            <InputField
              icon={<FaUser />}
              label="Contact Name"
              name="contactName"
              value={proposal.contactName || ""}
            />
            <InputField
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={proposal.email || ""}
            />
            <InputField
              icon={<FaPhone />}
              label="Phone"
              name="phone"
              value={proposal.phone || ""}
            />
            <InputField
              icon={<FaHome />}
              label="Address"
              name="address"
              value={proposal.address || ""}
              multiline
            />
            <InputField
              icon={<FaClipboardList />}
              label="Scope"
              name="scope"
              value={proposal.scope || ""}
            />
            <InputField
              icon={<FaFileAlt />}
              label="Description"
              name="description"
              value={proposal.description || ""}
              multiline
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                  fontWeight: 500,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#e5e7eb")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#f3f4f6")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!allChecked}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: allChecked ? "#10b981" : "#9ca3af",
                  color: "white",
                  fontWeight: 500,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: allChecked ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  allChecked
                    ? ((e.target as HTMLButtonElement).style.backgroundColor =
                        "#059669")
                    : null
                }
                onMouseOut={(e) =>
                  allChecked
                    ? ((e.target as HTMLButtonElement).style.backgroundColor =
                        "#10b981")
                    : null
                }
              >
                <FaSave /> Save
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
