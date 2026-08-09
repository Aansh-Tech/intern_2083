# PROJECT MAP — frontend_mobile

## 1. Overview

A React Native (Expo) mobile portfolio app with a public-facing tab-based interface and a password-protected admin panel. It consumes a Laravel backend API at `EXPO_PUBLIC_API_BASE_URL`.

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 57, React Native |
| Navigation | Expo Router (file-based) |
| Language | TypeScript |
| Styling | NativeWind (TailwindCSS for RN) + `StyleSheet` |
| HTTP | Axios with interceptors |
| Auth Token | SecureStore (`expo-secure-store`) |
| Persistent Storage | AsyncStorage (`@react-native-async-storage/async-storage`) |
| Animations | React Native `Animated` + `LayoutAnimation` |
| Icons | `lucide-react-native` + `@expo/vector-icons/Ionicons` |
| File Download | `expo-file-system` + `expo-file-system/legacy` |
| Document Picker | `expo-document-picker` |
| Gradients | `expo-linear-gradient` |
| Navigation Bar | `expo-navigation-bar` |

## 3. Directory Structure

```
frontend_mobile/
├── PROJECT_MAP.md
├── AGENTS.md
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── global.css
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── _layout.tsx         # Root layout (providers + Stack)
│   │   ├── (tabs)/             # Public tab screens
│   │   │   ├── _layout.tsx     # Custom tab bar
│   │   │   ├── index.tsx       # Home / Landing
│   │   │   ├── project.tsx     # Projects listing
│   │   │   ├── blog.tsx        # Blog listing
│   │   │   ├── about.tsx       # About page
│   │   │   └── contact.tsx     # Contact form
│   │   ├── admin/              # Admin panel (protected)
│   │   │   ├── _layout.tsx     # Auth guard + tab navigation + NotificationPanel
│   │   │   ├── index.tsx       # Login screen
│   │   │   ├── adminoverview.tsx  # Dashboard
│   │   │   ├── projects.tsx    # CRUD projects
│   │   │   ├── blog.tsx        # BlogControl wrapper
│   │   │   ├── inbox.tsx       # Messages inbox
│   │   │   ├── comments.tsx    # Comments moderation
│   │   │   ├── skills.tsx      # Skills CRUD
│   │   │   ├── about.tsx       # AboutControl wrapper
│   │   │   └── certificates.tsx# Certificates CRUD with image upload
│   │   └── project/
│   │       └── [id].tsx        # Project detail (dynamic route)
│   ├── components/
│   │   ├── about/              # Public About page components
│   │   │   ├── AboutHero.tsx   # Avatar, bio, resume, social links
│   │   │   ├── Skills.tsx      # Skills display
│   │   │   └── Certificate.tsx # Certificates display
│   │   ├── admin/              # Admin login components
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── LoginCard.tsx
│   │   │   ├── InputField.tsx
│   │   │   └── PasswordField.tsx
│   │   ├── admin_about/        # Admin About editor
│   │   │   ├── AboutControl.tsx    # Main editor: avatar, identity, resume, social links
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── IdForm.tsx
│   │   ├── admin_blog/         # Admin Blog editor
│   │   │   └── BlogControl.tsx
│   │   ├── admin_certificates/ # Admin Certificate CRUD
│   │   │   ├── CertificateCard.tsx
│   │   │   ├── CertificateFormModal.tsx
│   │   │   ├── DeleteModal.tsx
│   │   │   └── ImageViewer.tsx
│   │   ├── admincomments/      # Admin Comments moderation
│   │   │   ├── AdminCommentsHeader.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   ├── CommentsList.tsx
│   │   │   └── EmptyComments.tsx
│   │   ├── admininbox/         # Admin Inbox
│   │   │   ├── InboxHeader.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   ├── InboxList.tsx
│   │   │   ├── EmptyInbox.tsx
│   │   │   └── MessageModal.tsx
│   │   ├── adminoverview/      # Admin Dashboard layout
│   │   │   ├── AdminLayout.tsx       # Pull-to-refresh wrapper
│   │   │   ├── AdminOverviewHeader.tsx # Avatar, name, theme toggle, bell, sign-out
│   │   │   ├── AdminOverviewTabs.tsx  # Horizontal tab bar
│   │   │   ├── WelcomeSection.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── QuickActionsSection.tsx
│   │   │   ├── ActivitySection.tsx
│   │   │   └── NotificationPanel.tsx  # Modal overlay for notifications
│   │   ├── adminprojects/      # Admin Projects CRUD
│   │   │   ├── ProjectSearch.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectModal.tsx
│   │   ├── adminskills/        # Admin Skills CRUD
│   │   │   ├── SkillForm.tsx
│   │   │   ├── SkillSection.tsx
│   │   │   ├── DeleteSkillModal.tsx
│   │   │   └── SkillFormModal.tsx
│   │   ├── blog/               # Public Blog
│   │   │   └── PostModal.tsx
│   │   ├── contactpage/        # Public Contact
│   │   │   ├── ContactInfoCard.tsx
│   │   │   └── ContactInput.tsx
│   │   ├── homepage/           # Public Homepage components
│   │   │   ├── Header.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── FeaturedProjects.tsx
│   │   │   ├── ToolkitSection.tsx
│   │   │   └── LatestWriting.tsx
│   │   ├── shared_components/
│   │   └── work/               # Public Projects listing
│   │       ├── PageHeader.tsx
│   │       ├── FilterTabs.tsx
│   │       ├── Projectlist.tsx
│   │       └── StatusBadge.tsx
│   ├── context/                # React Contexts (state management)
│   │   ├── ThemeContext.tsx     # Theme definitions + context
│   │   ├── ThemeProvider.tsx    # Theme state + toggle
│   │   ├── useTheme.ts         # Theme hook
│   │   ├── ProfileContext.tsx   # Profile + social links + photoTimestamp
│   │   ├── ProjectContext.tsx   # Projects CRUD + filter operations
│   │   ├── SkillsContext.tsx    # Skills CRUD + getSkillsByCategory
│   │   ├── InboxContext.tsx     # Messages inbox + read tracking via AsyncStorage
│   │   ├── CommentContext.tsx   # Comments moderation (approve/reject/delete)
│   │   ├── DashboardContext.tsx # Aggregated dashboard data across contexts
│   │   ├── CertificateContext.tsx # Certificates CRUD
│   │   └── NotificationContext.tsx # Notifications from contacts + comments
│   ├── hooks/
│   │   ├── useComments.ts      # Re-export of useSkills + comment posting hooks
│   │   └── useSkills.ts        # Re-export: export { useSkills } from "../context/SkillsContext"
│   ├── services/               # API service layer
│   │   ├── api.ts              # Axios instance + interceptors (auth, public GET)
│   │   ├── auth.ts             # Login/logout/getUser, token management
│   │   ├── aboutService.ts     # Profile CRUD, social links CRUD, resume upload
│   │   ├── project.ts          # Projects CRUD with image mapping
│   │   ├── blogService.ts      # Blog posts CRUD (admin)
│   │   ├── contact.ts          # Contact form submit (public) + admin inbox
│   │   ├── commentService.ts   # Comments fetch/moderation + fallback per-post
│   │   ├── skill.ts            # Skills CRUD with category mapping
│   │   ├── certificate.ts      # Certificates CRUD with image mapping
│   │   ├── dashboard.ts        # Blog post count
│   │   ├── image.ts            # uploadImage (FormData), resolveImageUrl
│   │   └── notificationService.ts # Build notifications from contacts + comments
│   ├── types/                  # TypeScript type definitions
│   │   ├── profile.ts          # ProfileData
│   │   ├── project.ts          # Project, ProjectStatus
│   │   ├── skill.ts            # Skill, SkillCategory
│   │   ├── inbox.ts            # InboxMessage
│   │   ├── comment.ts          # Comment, CommentStatus
│   │   ├── commentTypes.ts     # Comments, Post (alternate types)
│   │   ├── certificate.ts      # Certificate
│   │   ├── dashboard.ts        # DashboardData, ActivityItem
│   │   └── socialLink.ts       # SocialLink
│   ├── utils/
│   │   ├── token.ts            # SecureStore wrapper (save/get/remove)
│   │   └── adminAuth.ts        # login/logout/isLoggedIn (wraps auth service)
│   └── constants/
│       └── colors.ts           # (unused – colors in ThemeContext)
```

## 4. Routing Map

### Public Routes (Tab Navigator)
| Path | Screen | Description |
|------|--------|-------------|
| `/` | `(tabs)/index.tsx` | Homepage — hero, CTA, featured projects, toolkit, latest writing |
| `/project` | `(tabs)/project.tsx` | Projects listing with filter (all/featured/status) |
| `/blog` | `(tabs)/blog.tsx` | Blog listing from `/v1/blog-posts` |
| `/about` | `(tabs)/about.tsx` | About — hero, skills, certificates |
| `/contact` | `(tabs)/contact.tsx` | Contact form → `POST /v1/contact` |
| `/project/[id]` | `project/[id].tsx` | Project detail (fetches by slug) |

### Admin Routes (Stack Navigator, protected)
| Path | Screen | Description |
|------|--------|-------------|
| `/admin` | `admin/index.tsx` | Login page |
| `/admin/adminoverview` | `admin/adminoverview.tsx` | Dashboard — welcome, stats, quick actions, activity |
| `/admin/projects` | `admin/projects.tsx` | Projects CRUD with search + image upload |
| `/admin/blog` | `admin/blog.tsx` | Blog management |
| `/admin/inbox` | `admin/inbox.tsx` | Messages inbox with read tracking |
| `/admin/comments` | `admin/comments.tsx` | Comments moderation |
| `/admin/skills` | `admin/skills.tsx` | Skills CRUD by category |
| `/admin/about` | `admin/about.tsx` | About page editor |
| `/admin/certificates` | `admin/certificates.tsx` | Certificates CRUD with image upload |

### Auth Guard (`admin/_layout.tsx`)
- Checks `isLoggedIn()` on mount → redirects to `/admin` (login) if not authenticated
- Renders `AdminOverviewHeader` (avatar, name, theme toggle, notification bell, sign-out) + `AdminOverviewTabs` + `NotificationPanel` overlay
- `NotificationProvider` wraps the entire admin area

## 5. Provider Tree (from `_layout.tsx`)

```
ThemeProvider
└── ProfileProvider
    └── CertificateProvider
        └── ProjectProvider
            └── InboxProvider
                └── CommentProvider
                    └── SkillsProvider
                        └── DashboardProvider
                            └── RootLayoutInner (Stack Navigator)
```

Admin also adds: `NotificationProvider` in `admin/_layout.tsx`.

## 6. Contexts Detail

### ThemeContext / ThemeProvider / useTheme
- Dark/light mode with `LayoutAnimation` toggle
- Colors: `background`, `header`, `card`, `border`, `primary` (#8B83FF), `text`, `secondaryText`
- Default: dark mode (`#070B14` background)

### ProfileContext
- **State**: `profile`, `socialLinks`, `loading`, `refreshing`, `photoTimestamp`
- On mount: `Promise.all([getAbout(), getSocialLinks()])`
- `photoTimestamp` incremented when avatar URL changes (cache busting for React Native image cache)
- Providers: Logo, AboutHero, AdminOverviewHeader, AboutControl

### ProjectContext
- **State**: `projects`, `loading`, `refreshing`
- CRUD: `addProject`, `editProject`, `deleteProject`, `toggleFeatured`, `toggleCompleted`
- `refreshProjects(admin?)` — public vs admin endpoint
- On mount: loads public projects

### InboxContext
- **State**: `messages`, `loading`, `refreshing`, `unreadCount`
- Read tracking per-message via `AsyncStorage` key `@inbox_read_ids`
- CRUD: `addMessage` (public contact), `markAsRead`, `deleteMessage`

### CommentContext
- **State**: `comments`, `loading`, `pendingCount`
- Operations: `approveComment`, `rejectComment`, `deleteComment`, `refreshComments`
- Requires auth token; returns empty if unauthorized

### SkillsContext
- **State**: `skills`, `loading`, `refreshing`
- CRUD: `addSkill`, `updateSkill`, `deleteSkill`, `getSkillsByCategory` (groups into Frontend/Backend/Design/Other)
- Validation: name required, percentage 0–100

### CertificateContext
- **State**: `certificates`, `loading`, `refreshing`
- CRUD: `addCertificate`, `editCertificate`, `deleteCertificate`
- Image upload handled at screen level (not context)

### DashboardContext
- **State**: `dashboard` (computed), `loading`, `refreshing`, `blogPosts`
- Aggregates from: ProjectContext, InboxContext, SkillsContext, CommentContext + blog count
- Generates `recentActivity` (sorted, top 5)
- Deduplication via `busyRef` to prevent concurrent refreshes

### NotificationContext
- **State**: `notifications`, `unreadCount`, `loading`, `refreshing`
- Builds notifications from `contactService.getContacts()` + `commentService.getAllComments()`
- Read tracking via `AsyncStorage` key `@notification_read_ids`
- `markAllAsRead` sets all current notification IDs as read

## 7. Services Detail

### api.ts — Axios Instance
- `baseURL` from `EXPO_PUBLIC_API_BASE_URL` env var
- **Request interceptor**: auto-attaches `Bearer` token for non-public GET requests
- Public GET endpoints (no auth): `/v1/blog-posts`, `/v1/projects`, `/v1/skills`, `/v1/certificates`, `/v1/profile`, `/v1/social-links`
- **Response interceptor**: logs status/error details

### auth.ts
- `login(email, password)` → `POST /login`, saves token via `saveToken`
- `logout()` → `POST /logout`, removes token
- `getUser()` → `GET /user`

### aboutService.ts
- `getAbout()` → `GET /v1/profile`, normalizes with `normalizeProfile()` (resolves avatar from images array, profile_photo, avatar, profile_image fallbacks; resolves resume URL)
- `updateProfile(payload)` → `PUT /v1/profile`
- `saveAbout(payload)` — orchestrates profile update, resume upload, social link diff (create/update/delete)
- `getSocialLinks()` → `GET /v1/social-links`
- `createSocialLink`, `updateSocialLink`, `deleteSocialLink`
- `uploadResume(fileUri)` → `POST /v1/profile/resume` (FormData)

### image.ts
- `uploadImage(uri, imageableType, imageableId, options)` → `POST /v1/images` (FormData)
  - Fields: `image` (file), `imageable_type`, `imageable_id`, `type`, `is_primary`
  - Returns resolved URL via `resolveImageUrl()`
- `resolveImageUrl(path)` — prepends `SERVER_ROOT/storage/` to relative paths

### project.ts
- `getProjects(admin?)`, `getProject(id, admin?)`
- Maps backend fields: `subtitle` → `category`, `is_featured` → `featured`, `status` → `completed`
- Resolves image URLs via `resolveImageUrl`
- `createProject`, `updateProject`, `deleteProject`

### blogService.ts
- Admin CRUD: `getBlogs`, `getBlog`, `createBlog`, `updateBlog`, `deleteBlog`
- API: `/v1/admin/blog-posts`

### contact.ts
- Public: `submitContact(data)` → `POST /v1/contact`
- Admin: `getContacts()` → `GET /v1/contact`, `deleteContact(id)`

### commentService.ts
- `getAllComments()` → `GET /v1/comments` with fallback per-post fetching
- `approveComment(id)` → `PATCH /v1/comments/{id}` status=approved
- `rejectComment(id)` → `PATCH /v1/comments/{id}` status=rejected
- `deleteComment(id)` → `DELETE /v1/comments/{id}`
- Map: `content` → `comment`, `rejected` → `spam`

### skill.ts
- `getSkills()` → `GET /v1/skills`
- `createSkill`, `updateSkill`, `deleteSkill`
- Category mapping: lowercase → titlecase (Frontend/Backend/Design/Other)

### certificate.ts
- `getCertificates()` → `GET /v1/certificates` with verbose logging
- Maps images: primary from `images[]` array or fallback `image` field, resolved via `resolveImageUrl`

### dashboard.ts
- `getBlogCount()` — parses nested Laravel pagination response

### notificationService.ts
- `buildNotifications()` — fetches contacts + comments, sorts by date descending, returns top 10

## 8. Image Upload Flow

The app follows a **create-first, upload-second** pattern:
1. **Create entity** via API (project, certificate, profile) → receive `id`
2. **Upload image** via `uploadImage(uri, imageableType, id, options)` → `POST /v1/images` with FormData
3. For **edits**: upload with existing entity `id`, then pass returned URL to update payload
4. For **profile avatar**: `AboutControl` uploads then passes resolved URL as `profile_photo` to `saveAbout`

## 9. Auth Flow

1. User submits email/password → `POST /login` → receives JWT token
2. Token stored in `SecureStore` via `saveToken()`
3. Axios interceptor auto-attaches `Authorization: Bearer <token>` on non-public GET requests and all POST/PUT/DELETE
4. Logout: `POST /logout` + `removeToken()`
5. Auth guard in `admin/_layout.tsx`: calls `isLoggedIn()` → `GET /user` → redirects to login if 401

## 10. Caching & Read Tracking

- **Inbox read status**: stored per-message `id` in AsyncStorage `@inbox_read_ids`
- **Notification read status**: stored per-notification `id` in AsyncStorage `@notification_read_ids`
- **Profile photo cache busting**: `photoTimestamp` in ProfileContext — incremented when avatar URL changes; appended as `?t={timestamp}` to HTTP image URIs in Logo, AboutHero, AdminOverviewHeader

## 11. Known Patterns / Quirks

- `console.log = () => {}` at top of almost every file — suppresses debug output in production
- `mountedRef` pattern used extensively to prevent state updates after unmount
- `safeAreaInsets` for padding; `SafeAreaView` for public screens
- Tab bar is custom (not Expo Router's default) — uses `Home`, `Briefcase`, `BookOpen`, `User`, `Mail` icons
- Admin tabs are custom horizontal scroll tabs (not Expo Router tabs)
- `refreshControl` with pull-to-refresh on all scrollable screens
- API pagination unwrapping: all services handle 3-level nesting (`data.data.data`), 2-level (`data.data`), direct array, and flat responses
- `unreadCount` used in both InboxContext and NotificationContext, each independently tracked
