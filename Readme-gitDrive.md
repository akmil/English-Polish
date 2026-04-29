# GitDrive

> Use your GitHub repositories as a Google Drive-style file manager. Upload, browse, preview, rename, and delete files directly through the GitHub API — all from a clean, modern web UI.

---

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Authentication](#authentication)
- [Context & State](#context--state)
- [Pages](#pages)
- [Components](#components)
  - [Drive](#drive)
  - [Dialogs](#dialogs)
  - [UI Primitives](#ui-primitives)
- [Library / Utilities](#library--utilities)
- [Styling & Theming](#styling--theming)
- [Tech Stack](#tech-stack)

---

## Overview

GitDrive is a single-page React application that wraps the GitHub REST API v3 into a file-manager experience similar to Google Drive. Users authenticate via a GitHub Personal Access Token (PAT), select a repository, and can then:

- Browse folders and files in grid or list view
- Upload files (drag & drop or browse)
- Create folders (via hidden `.gitkeep` placeholder files)
- Delete files and folders (recursively)
- Rename files (copy + delete under the hood)
- Preview images, videos, audio, PDFs, text/code files, and ZIP archives
- Download files

No backend is required — all data flows directly from the browser to the GitHub API.

---

## Folder Structure

```
src/
├── api/
│   └── base44Client.js          # Base44 SDK client initialization
│
├── components/
│   ├── drive/
│   │   ├── FileCard.jsx          # Individual file/folder card (grid & list modes)
│   │   ├── FileGrid.jsx          # Grid/list layout container for files
│   │   ├── FilePreview.jsx       # Full-screen file preview modal
│   │   ├── LoginScreen.jsx       # GitHub PAT authentication form
│   │   ├── NewRepoDialog.jsx     # Dialog to create a new GitHub repository
│   │   ├── RepoSelector.jsx      # Repository selection screen
│   │   ├── Sidebar.jsx           # Left navigation sidebar
│   │   ├── Toolbar.jsx           # Top toolbar (breadcrumbs, search, actions)
│   │   ├── UploadDropzone.jsx    # File upload drag-and-drop overlay
│   │   └── dialogs/
│   │       ├── DeleteDialog.jsx  # Confirm file/folder deletion
│   │       ├── NewFolderDialog.jsx # Create a new folder
│   │       └── RenameDialog.jsx  # Rename a file
│   │
│   └── ui/                       # shadcn/ui component library (Radix UI based)
│       ├── accordion.jsx
│       ├── alert.jsx
│       ├── alert-dialog.jsx
│       ├── avatar.jsx
│       ├── badge.jsx
│       ├── button.jsx
│       ├── calendar.jsx
│       ├── card.jsx
│       ├── carousel.jsx
│       ├── chart.jsx
│       ├── checkbox.jsx
│       ├── collapsible.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── popover.jsx
│       ├── progress.jsx
│       ├── scroll-area.jsx
│       ├── select.jsx
│       ├── separator.jsx
│       ├── sheet.jsx
│       ├── skeleton.jsx
│       ├── sonner.jsx
│       ├── switch.jsx
│       ├── table.jsx
│       ├── tabs.jsx
│       ├── textarea.jsx
│       ├── toast.jsx
│       ├── toaster.jsx
│       └── tooltip.jsx
│
├── context/
│   └── GitHubContext.jsx         # Global auth state, token, user, active repo
│
├── hooks/
│   └── use-mobile.jsx            # Responsive mobile detection hook
│
├── lib/
│   ├── AuthContext.jsx           # Base44 platform auth context (unused in core flow)
│   ├── github.js                 # All GitHub REST API calls + file utilities
│   ├── PageNotFound.jsx          # 404 page
│   ├── query-client.js           # React Query client instance
│   └── utils.js                  # cn() class name utility
│
├── pages/
│   ├── Drive.jsx                 # Main drive page (file browser, all orchestration)
│   └── Index.jsx                 # Entry point — routes to Drive or LoginScreen
│
├── utils/
│   └── index.ts                  # Shared utilities
│
├── App.jsx                       # Router setup, providers
├── index.css                     # Global styles, CSS design tokens
├── main.jsx                      # React DOM entry point
└── tailwind.config.js            # Tailwind theme configuration
```

---

## Authentication

**File:** `src/components/drive/LoginScreen.jsx`

The app does **not** use OAuth. Instead, users provide a GitHub **Personal Access Token (PAT)** directly in the UI. The token is validated immediately by calling `GET /user` and stored in `localStorage` for session persistence.

Required GitHub token scopes:
- `repo` — full repository access
- `delete_repo` — required for deleting repositories

**File:** `src/context/GitHubContext.jsx`

Manages global auth state via React Context. Persists the token and the active repository to `localStorage`. Exposes:

| Value | Description |
|---|---|
| `token` | The raw GitHub PAT string |
| `user` | Authenticated GitHub user object |
| `loading` | Token validation in progress |
| `error` | Validation error message |
| `activeRepo` | Currently selected repository |
| `setActiveRepo` | Switch repository |
| `validateToken(t)` | Validate and store a PAT |
| `logout()` | Clear all auth state |
| `isAuthenticated` | Boolean derived from `user` |

---

## Context & State

**File:** `src/context/GitHubContext.jsx`

The entire application state for authentication and repository selection lives here. It is provided at the root level in `App.jsx` via `<GitHubProvider>`, making the `useGitHub()` hook available throughout the component tree.

---

## Pages

### `src/pages/Index.jsx`
Entry point. Reads `isAuthenticated` from `GitHubContext` and conditionally renders:
- `<LoginScreen />` if not authenticated
- `<Drive />` if authenticated

### `src/pages/Drive.jsx`
The main application page. Orchestrates all file browser functionality:

- Fetches directory contents from GitHub via `getContents()`
- Manages breadcrumb navigation and current folder path
- Handles file open (preview), download, upload, delete, rename, and folder creation
- Renders the layout: `<Sidebar>`, `<Toolbar>`, `<FileGrid>`
- Mounts all dialogs: `UploadDropzone`, `NewFolderDialog`, `DeleteDialog`, `RenameDialog`, `NewRepoDialog`, `FilePreview`

---

## Components

### Drive

#### `FileCard.jsx`
Renders a single file or folder. Supports two display modes:

- **Grid mode** — card with icon, name, size, hover menu
- **List mode** — row with icon, name, size, hover menu

Includes a `<FileMenu>` sub-component (dropdown) with actions: Download, Rename, Delete. Double-click opens the item.

#### `FileGrid.jsx`
Receives the array of items and renders them using `FileCard`. Separates folders from files, shows section headers ("Folders", "Files"), handles empty state and loading spinner. Filters out `.gitkeep` files.

#### `FilePreview.jsx`
Full-screen overlay modal for previewing files. Supports:

| Type | Formats | Method |
|---|---|---|
| Image | png, jpg, jpeg, gif, svg, webp | Base64 → Blob URL |
| Video | mp4, webm, ogg, mov, avi, mkv | Fetched via `download_url` |
| Audio | mp3, wav, flac, ogg, aac, m4a | Fetched via `download_url` |
| PDF | pdf | Base64 → Blob URL → `<iframe>` |
| Text / Code | txt, md, json, js, py, etc. | Base64 decoded, shown in code block |
| ZIP Archive | zip, jar, apk, ipa | Parsed with JSZip, file tree displayed |
| Presentation | ppt, pptx, key | Download prompt only |

#### `LoginScreen.jsx`
GitHub PAT input form with show/hide toggle, inline error display, and a link to generate a token on GitHub.

#### `NewRepoDialog.jsx`
Dialog to create a new GitHub repo. Options: name, description, public/private toggle. Calls `createRepo()` from `lib/github.js`.

#### `RepoSelector.jsx`
Shown when authenticated but no repo is selected. Lists all user repositories (fetched via `listRepos()`), allows creating a new one inline, and sets the active repo on selection.

#### `Sidebar.jsx`
Left navigation with:
- App logo/brand
- Nav links: My Drive, Recent, Starred, Trash
- Storage section showing the active repository name
- User avatar, name, and logout button

#### `Toolbar.jsx`
Top toolbar with:
- Breadcrumb path navigation (clickable segments)
- Search bar (filters items client-side by name)
- New Folder button
- Upload button
- Grid / List view toggle

#### `UploadDropzone.jsx`
Full-screen upload overlay. Supports drag & drop and file browser selection. Shows per-file upload progress with status icons (pending, uploading, done, error).

### Dialogs

#### `dialogs/NewFolderDialog.jsx`
Simple dialog with a name input. On confirm, calls `createFolder()` which uploads a hidden `.gitkeep` file to materialise the folder in git.

#### `dialogs/DeleteDialog.jsx`
Confirm dialog before deleting a file or folder. For folders, warns that all contents will be deleted recursively.

#### `dialogs/RenameDialog.jsx`
Dialog pre-filled with the current file name. On confirm, copies the file to the new path and deletes the old one (GitHub API has no native rename).

---

## Library / Utilities

### `src/lib/github.js`

All GitHub REST API interactions. Uses `fetch` with a Bearer token header.

| Function | Description |
|---|---|
| `getAuthenticatedUser(token)` | `GET /user` — validate token and get profile |
| `listRepos(token)` | `GET /user/repos` — list all user repos |
| `createRepo(token, name, desc, private)` | `POST /user/repos` — create a new repo |
| `deleteRepo(token, owner, repo)` | `DELETE /repos/:owner/:repo` |
| `getContents(token, owner, repo, path)` | `GET /repos/:owner/:repo/contents/:path` |
| `createFile(token, owner, repo, path, content, message)` | `PUT` — create or overwrite a file |
| `updateFile(token, owner, repo, path, content, sha, message)` | `PUT` — update existing file by SHA |
| `deleteFile(token, owner, repo, path, sha, message)` | `DELETE` — delete a file by SHA |
| `getFileContent(token, owner, repo, path)` | Fetch a single file's metadata + base64 content |
| `createFolder(token, owner, repo, folderPath)` | Create `.gitkeep` to materialise a folder |
| `searchCode(token, owner, repo, query)` | `GET /search/code` — search within repo |
| `fileToBase64(file)` | Convert a browser `File` object to base64 string |
| `base64ToBlob(base64, mimeType)` | Decode base64 to a `Blob` |
| `getFileIcon(filename)` | Return emoji icon for a file extension |
| `formatBytes(bytes)` | Human-readable file size string |
| `getMimeType(filename)` | Return MIME type for a file extension |

### `src/lib/utils.js`
Exports `cn()` — a utility combining `clsx` and `tailwind-merge` for conditional class name composition.

### `src/lib/query-client.js`
Exports a shared `QueryClient` instance for `@tanstack/react-query`.

---

## Styling & Theming

**File:** `src/index.css`

Uses CSS custom properties (design tokens) for all colors and spacing. Tokens are mapped to Tailwind classes in `tailwind.config.js`.

Key tokens:

| Token | Light | Dark |
|---|---|---|
| `--background` | `248 250 252` (slate-50) | `10 10 15` |
| `--foreground` | `15 23 42` (slate-900) | `248 250 252` |
| `--primary` | `99 102 241` (indigo-500) | `129 140 248` |
| `--card` | `255 255 255` | `15 15 25` |
| `--muted` | `241 245 249` | `30 30 45` |
| `--border` | `226 232 240` | `30 41 59` |

Font: **Inter** (Google Fonts), configured via `--font-inter` token and `font-inter` Tailwind class.

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 18 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS + CSS variables |
| UI Components | shadcn/ui (Radix UI primitives) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Data Fetching | @tanstack/react-query |
| ZIP Parsing | JSZip |
| PDF Generation | jsPDF (installed, not used in core flow) |
| Notifications | Sonner |
| Build Tool | Vite |
| API | GitHub REST API v3 (no backend) |