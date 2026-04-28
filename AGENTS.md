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
