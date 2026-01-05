"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import Sidebar from "../components/sidebar";

export default function BidInviteConfirmation() {
  const router = useRouter();

  const handleStepClick = (step: number) => {
    switch (step) {
      case 1:
        router.push("/uploader");
        break;
      case 3:
        router.push("/invite-to-bid");
        break;
      default:
        break; // Steps 2 and 4 are disabled
    }
  };

  return (
    <Sidebar currentStep={4} onStepClick={handleStepClick}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#ffffff", // changed to white
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#d1fae5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <FaCheckCircle size={64} color="#10b981" />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Invitations Sent!
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "1rem",
            color: "#6b7280",
            maxWidth: 400,
          }}
        >
          All selected participants have been successfully invited to submit
          their bids. You can track responses in the proposal dashboard.
        </p>
      </div>
    </Sidebar>
  );
}
