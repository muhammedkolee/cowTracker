# CowTracker — Animal Management Desktop App

> **Project status:** University capstone project · Development paused. This repository documents the original implementation; it is not currently maintained.

CowTracker (also titled **Hayvan Yönetimi**) is a desktop application developed to organize livestock records and routine farm-management tasks. It was created as a university graduation project and represents the technologies and development practices used at that time.

## Features

- Maintain animal records and browse categories such as cows, calves, heifers, and bulls.
- Add, edit, view, and remove animal entries.
- Track vaccination information and records.
- Record animal-related events, including births and insemination.
- View dashboard summaries and upcoming events.
- User sign-in and sign-up through Supabase.
- Desktop application updates through `electron-updater`.

## Technology stack

| Area | Technologies |
| --- | --- |
| Desktop runtime | Electron |
| Interface | React, TypeScript, Vite, Tailwind CSS |
| Backend services | Supabase |
| Routing | React Router |
| Packaging / updates | electron-builder, electron-updater |

## Project structure

```text
electron/
  main.ts                # Electron lifecycle, windows, IPC handlers
  preload.ts             # APIs exposed to renderer windows
  services/              # Data access, authentication, app settings
src/
  App.tsx                # App routes and initial session handling
  components/            # Shared UI components
  features/              # Feature-specific screens and logic
shared/                  # Shared types/interfaces
public/                  # Static application assets
```

## Local development

**Requirements:** Node.js, npm, and access to a compatible Supabase project/database. The historical database schema and deployment configuration are not provided as a one-click setup.

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/muhammedkolee/cowTracker.git
   cd cowTracker
   npm ci
   ```
2. Create a local `.env` file with the Supabase client values expected by the code:
   ```dotenv
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
   ```
3. Start the development environment:
   ```bash
   npm run dev
   ```

The build script runs TypeScript, Vite, and Electron packaging:

```bash
npm run build
```

The packaging configuration primarily targets a Windows installer. Successful execution depends on compatible dependencies, database tables, and environment configuration; it has not been freshly verified for this archived project.

## Releases

The project's historical release builds and tags are available under [GitHub Releases](https://github.com/muhammedkolee/cowTracker/releases).

## Notes

This codebase is preserved as an **academic portfolio project**. It is not a claim of production readiness or an example of the author's current preferred architecture. A future rewrite may be explored separately, but no maintenance schedule is promised.
