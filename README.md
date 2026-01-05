# Proposal to Invitation to Bid Automation App

# Overview
This is a Next.js proof-of-concept application for managing ITT proposals. Users upload PDFs, review and edit extracted data, and send bid invitations. The interface follows a step-based workflow: Upload → Review → Invite → Confirm.

# How It Works

1. **Upload** – Users drag-and-drop or browse for PDF files. The file is sent to the /api/upload route.

2. **Extraction** – The server extracts text using unpdf, sends it to the Gemini API for structured data parsing, and applies AI transformations to standardize formatting.

3. **Review** – The extracted data is displayed in editable fields with per-field checkmarks. Users must verify all fields before saving.

4. **Invite** – Users select proposals from a table and send bid invitations. The system supports individual and bulk actions and navigates to a confirmation page when complete.

The frontend (Next.js) communicates with Supabase for database operations, keeping backend and frontend separate for security.

# Architecture Choices

**Next.js** – Familiarity and good integration with Supabase for a lightweight full-stack POC.

**Supabase** – Provides hosted PostgreSQL and authentication for secure data storage.

**unpdf** – Node.js library for PDF text extraction.

**Gemini API** – AI parsing of extracted text into structured proposal data.

**Frontend/Backend separation** ensures sensitive operations like AI calls and database writes remain secure.

# Tradeoffs

* Next.js is primarily a frontend framework; the backend is limited compared to dedicated solutions like Nest.js.

* Something using Docker/Kubernetes would be able to scale better than this solution.
* GCP would have more options for hosting than this Next.js/Vercel solution
* AI responses may include markdown or inconsistent formatting; extra checks are required.

# What Could Be Improved
* Email sending is not implemented; the app currently simulates invitations.
* Confidence indicators for extracted data are not yet implemented.
* Use a more robust backend framework for complex business logic.
* Implement authentication for accessing the application
* Componentize forms, tables, and buttons for better reusability.
* Add confidence scoring for extracted data and validation before invitations.


