"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  currentStep: number; // 1 = Upload Documents, 2 = Review Proposals, 3 = Invite to Bid
  children: ReactNode;
};

type Step = {
  label: string;
  href: string;
};

const steps: Step[] = [
  { label: "Upload Documents", href: "/uploader" },
  { label: "Review Proposals", href: "/review-proposals" },
  { label: "Invite to Bid", href: "/invite-to-bid" },
];

export default function Sidebar({ currentStep, children }: SidebarProps) {
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => handleClick(step.href)}
              style={{
                marginBottom: "1rem",
                fontWeight: index + 1 === currentStep ? "bold" : "normal",
                color: index + 1 === currentStep ? "#0070f3" : "#333",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {index + 1}. {step.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
