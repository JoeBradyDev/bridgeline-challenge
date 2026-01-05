"use client";

import React, { ReactNode } from "react";
import { FaUpload, FaFileAlt, FaEnvelope, FaCheck } from "react-icons/fa";

type SidebarProps = {
  currentStep: number;
  onStepClick?: (step: number) => void;
  children: ReactNode;
};

type Step = {
  label: string;
  disabled: boolean;
  icon: React.ReactNode;
  iconColor: string;
};

const steps: Step[] = [
  {
    label: "Upload Documents",
    disabled: false,
    icon: <FaUpload />,
    iconColor: "#f97316",
  }, // orange
  {
    label: "Review Proposals",
    disabled: true,
    icon: <FaFileAlt />,
    iconColor: "#22c55e",
  }, // green tones
  {
    label: "Invite to Bid",
    disabled: false,
    icon: <FaEnvelope />,
    iconColor: "#8b5cf6",
  }, // purple
  { label: "Confirm", disabled: true, icon: <FaCheck />, iconColor: "#f59e0b" }, // amber
];

export default function Sidebar({
  currentStep,
  onStepClick,
  children,
}: SidebarProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          backgroundColor: "#f8fafc",
          borderRight: "1px solid #d1d5db",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#475569",
            letterSpacing: "0.05em",
            marginBottom: "1.75rem",
            textTransform: "uppercase",
          }}
        >
          Bid Workflow
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isDisabled = step.disabled && !isActive;
            const isClickable = !step.disabled;

            return (
              <li
                key={step.label}
                onClick={() => {
                  if (isClickable && onStepClick) {
                    onStepClick(stepNumber);
                  }
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.65rem",
                  borderRadius: 8,
                  marginBottom: "0.5rem",
                  backgroundColor: isActive ? "#eef2ff" : "transparent",
                  color: isDisabled
                    ? "#94a3b8"
                    : isActive
                    ? "#1e3a8a"
                    : "#1f2937",
                  fontWeight: isActive ? 600 : 500,
                  cursor: isClickable ? "pointer" : "default",
                  opacity: isDisabled ? 0.8 : 1,
                  userSelect: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  width: "100%",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Left side: number + label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      backgroundColor: isActive ? "#1e3a8a" : "#cbd5e1",
                      color: isActive ? "#ffffff" : "#1e40af",
                      flexShrink: 0,
                    }}
                  >
                    {stepNumber}
                  </div>

                  <span style={{ fontSize: 14 }}>{step.label}</span>
                </div>

                {/* Right side: icon */}
                <div
                  style={{
                    fontSize: 16,
                    color: step.iconColor,
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#ffffff",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
