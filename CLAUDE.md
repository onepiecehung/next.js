---
alwaysApply: true
---

# CLAUDE.md — Next.js 15+ Frontend-Only Project Specification

## 📋 Project Overview

This repository contains a **Next.js 15+ frontend-only application**, built as a modern blogging and article publishing platform.  
It leverages the latest ecosystem tools to deliver **a beautiful UI, responsive experience, and strong maintainability**.

---

## 🛠️ Core Technologies

### 🧱 Framework & Core
- **Next.js 15.5.4** — React framework with App Router
- **React 19.2.0** — Core UI library
- **TypeScript 5** — Full type safety
- **Yarn v3+ (Berry)** — Package manager

### 🎨 UI & Styling
- **shadcn/ui** — New York–style component system
- **TailwindCSS 4** — Utility-first CSS
- **Radix UI** — Accessible primitives
- **Lucide React** — Icon library
- **next-themes** — Dark/light theme management
- **tw-animate-css** — Animation utilities

### 🖋️ Rich Text Editor
- **TipTap** — Modern rich text editor
- **@tiptap/react** — React integration
- **@tiptap/starter-kit** — Base extension set
- **@tiptap/extension-*** — Code, link, highlight, etc.
- **highlight.js / lowlight** — Syntax highlighting
- **mermaid** — Diagram rendering

### 💾 State & Data Management
- **Jotai** — Atomic state management
- **Axios** — HTTP client
- **React Hook Form** — Form control
- **Zod** — Schema validation

### 🔐 Authentication
- **Firebase Auth** — Authentication provider
- **OAuth (Google, GitHub, Twitter)** — Social login support

### 🌐 Internationalization
- **next-intl** — Multi-language support  
  → Supported: **English** and **Vietnamese**

### 🧪 Testing & Quality
- **Jest** — Unit testing framework
- **@testing-library/react** — UI test utilities
- **Coverage threshold: 80%**
- **ESLint + Prettier** — Code quality and style enforcement
- **Turbopack** — Development bundler

---

## 🏗️ Project Architecture

### 📂 Folder Structure
```

src/
├── app/                    # App Router pages (no server actions)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── features/           # Business logic & domain components
│   ├── providers/          # Context providers (auth, i18n, theme)
│   └── shared/             # Reusable utilities (skeletons, helpers)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API, validators, stores
├── i18n/                   # Internationalization configuration
└── **tests**/              # Jest & RTL tests

```

### ⚙️ Architecture Principles
- **Frontend-only** — No `app/api` or `"use server"` blocks
- **Type-safe data flow** — All schemas validated via Zod
- **Atomic state** — Jotai for isolated reactive state
- **Strict typing** — TypeScript strict mode enabled
- **Theming** — Dark/light modes managed by `next-themes`
- **i18n-first design** — All text comes from locale files (`src/i18n/locales/{en,vi}`)

---

## ✨ Core Features

1. 🖋️ **Rich Text Editor** — TipTap-based editor with code highlighting and Mermaid diagram support.  
2. 🎨 **Theme System** — Multiple themes: Neutral, Stone, Zinc, Gray, Slate, Dracula.  
3. 🔐 **Authentication** — Firebase Auth + OAuth (Google, GitHub, Twitter).  
4. 🌍 **Internationalization** — Multi-language UI (EN + VI).  
5. 📱 **Responsive Design** — Mobile-first layout.  
6. 🖼️ **Image Management** — Upload, crop, and render with Next.js Image.  
7. ⚡ **Content Rendering** — Custom renderer for rich media and Markdown-like blocks.  
8. 🚦 **Rate Limiting** — API rate limit client integration.  
9. ⌛ **Skeleton Loading** — Placeholder states for async content.

---

## 🎨 UI/UX Features

| Feature | Description |
|----------|--------------|
| 🌗 Dark/Light Mode | Theme toggle with `next-themes` |
| 📱 Responsive Design | Mobile-first + adaptive layouts |
| ♿ Accessibility | WCAG 2.1 compliance via Radix primitives |
| ⏳ Skeleton Loading | Smooth loading transitions |
| 🔔 Toast Notifications | Non-intrusive feedback via shadcn/ui |
| ✅ Form Validation | Real-time Zod schema validation |
| 🖼️ Image Optimization | Uses Next.js `Image` for automatic resizing |

---

## 🔧 Development Features

- **TypeScript Strict Mode** — full type safety  
- **Path Aliases** — cleaner imports with `@/`  
- **ESLint + Prettier** — enforced lint & format  
- **Jest** — automated unit tests  
- **Hot Reloading** — fast local iteration  
- **Turbopack** — dev bundler for speed  

---

## 🧭 Development Guidelines

- No backend logic or database SDKs included.  
- All API calls go through `src/lib/http.ts`.  
- Only use `NEXT_PUBLIC_*` environment variables.  
- Avoid inline styling; use TailwindCSS utilities.  
- All user-visible text must be i18n-driven.  
- Maintain ≥ 80% unit test coverage.  
- Keep files ≤ 300 lines, components ≤ 200 lines.

---

## ✅ Definition of Done

| Checkpoint | Required |
|-------------|-----------|
| No ESLint/TS warnings | ✅ |
| Theme supports dark/light mode | ✅ |
| Fully responsive (mobile-first) | ✅ |
| No `"use server"` or secret APIs | ✅ |
| Uses shadcn primitives with proper states | ✅ |
| i18n present for EN + VI | ✅ |
| Accessible (focus, aria, contrast) | ✅ |
| Test coverage ≥ 80% | ✅ |

---

## 🧾 Summary

This project exemplifies a **modern, modular, frontend-only Next.js 15+ application**, integrating **shadcn/ui**, **TailwindCSS**, **TipTap**, and **Firebase Auth** to deliver a premium editing and viewing experience.  
Its codebase follows strict architecture, accessibility, and i18n standards — designed for scalability, developer experience, and user delight.
