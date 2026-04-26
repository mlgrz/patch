<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:folder structure -->

Strictly follow this folder structure when creating new code

```
/
├── app/                    # App Router
│   ├── (auth)/             # Auth routes
│   ├── (main)/             # Main app routes
│   ├── api/                # API routes
│   └── [...not-found].tsx
├── components/
│   ├── common/             # Custom reusable components
│   ├── ui/                 # shadcn/ui (auto-generated, don't edit by hand)
│   ├── sections/           # Page sections
│   ├── templates/          # Page layouts
│   └── icons/              # Icon components
├── features/               # Feature-based modules
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
├── lib/
│   ├── api/                # Supabase client
│   ├── utils/              # Shared utilities
│   └── services/           # Shared business logic
├── hooks/                  # Global custom hooks
├── contexts/               # React contexts
├── providers/              # Global providers
├── types/                  # Global types
├── styles/                 # Global CSS
└── utils/                  # Global utilities
```

<!-- END:folder structure -->

<!-- BEGIN:project details -->

Product Requirements Document (PRD) — Patch MVP

1. Overview
   Product Name: Patch
   Type: Web application
   Users:
   Developers (primary)
   End-users / reporters (secondary, no auth required)
   Goal:
   Enable developers to collect, organize, and ship user feedback efficiently through structured reports → issues → releases.

2. Core User Flow
   Reporter submits report → Patch automatically creates issues → Developer reviews reports → Converts/merges into issues → Works on issues → Ships via releases → Updates public roadmap & changelog → Notify reporters

3. Functional Requirements
   3.1 Authentication
   Screen: Sign In
   Users: Developers
   Requirements:
   OAuth login via:
   Google
   GitHub
   Successful authentication redirects to Dashboard
   No manual account creation

3.2 Developer Dashboard
Purpose: Central overview across projects
Requirements:
View list of projects
Search projects
Create new project
Open project
Data Preview Sections:
Recent reports (cross-project, limited)
Ongoing issues (cross-project, limited)

3.3 Project Creation
Screen: Create Project
Requirements:
Input fields (minimum):
Project name
Description (optional)
Create project action
Generate:
Shareable link
QR code

3.4 Project Overview (Main Hub)
Screen: Project Page
Navigation Tabs:
Overview (default)
Reports
Issues
Releases
Settings

Overview Tab
Requirements:
Display:
Project details
Roadmap summary
Basic analytics (e.g. report volume, issue status)

3.5 Reports Management
Purpose: Intake and triage layer
Requirements:
List View:
Display all reports
Search
Filter (e.g. status, type)
Sort (e.g. newest, severity)
Actions:
Open report (detailed view)
Convert report → new issue
Merge report → existing issue
Bulk actions:
Select multiple reports
Batch merge / convert

3.6 Issues Management
Purpose: Primary working unit
Requirements:
List View:
Display all issues
Search
Filter (e.g. status, priority)
Sort
Actions:
Accept/decline automatically created draft issue based on submitted reports
Create issue (manual)
Open issue (detail view)
Bulk actions (e.g. status update)

3.7 Releases Management
Purpose: Version control and shipping
Requirements:
List View:
Display all versions
Actions:
Create version
Select issues to include in version
Release version
Outputs:
Auto-generated changelog based on selected issues

3.8 Project Settings
Requirements:
Edit project details
Delete project

3.9 Report Submission (Public)
Screen: Submit Report
Users: End-users (no auth)
Requirements:
Submit report form
Cancel submission
Minimal friction (no login required)

3.10 Public Roadmap
Purpose: Transparency for users
Requirements:
Publicly accessible page
Sections:
Planned
In Progress
Done
Shipped
Data sourced from issues

3.11 Public Releases Page
Purpose: Changelog visibility
Requirements:
List all released versions
Each version shows:
Included issues
Structured changelog

4. Data Model (High-Level)
   Entities
   User
   Project
   Report
   Issue
   Release (Version)
   Relationships
   Project
   has many Reports
   has many Issues
   has many Releases
   Report
   may belong to one Issue
   Issue
   aggregates multiple Reports
   belongs to one Release (optional)
   Release
   contains multiple Issues

5. Key System Behaviors
   Reports can be:
   Converted into new issues
   Merged into existing issues
   Issues are the single source of truth for work
   Releases:
   Are composed by selecting issues
   Automatically generate changelogs
   Public pages:
   Reflect internal issue + release state

6. MVP Scope Constraints
   No advanced collaboration (comments, threads)
   No role-based access control
   No notifications system
   No integrations (e.g. GitHub issues sync)

7. Success Criteria
   Developer can:
   Create project in <1 minute
   Receive reports via shareable link
   Convert reports into structured issues
   Ship a release with auto changelog
   User can:
   Submit report in <30 seconds
   View roadmap and releases publicly

8. Future Considerations (Out of Scope)
Report clustering automation
Comments/discussions on reports/issues
Severity auto-calculation
GitHub/Jira integrations
Analytics dashboard expansion
<!-- END:project details -->
