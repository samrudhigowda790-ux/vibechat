# VibeChat Design System: Obsidian Kinetic
> Extracted from Stitch-generated VibeChat Workspace (`projects/2597220873522838826/screens/939e6d77d6aa43e0bfd49db0bc320e27`)
> Visual Source of Truth: Obsidian Kinetic Dark Telemetry

---

## 1. Design Philosophy & Character
**Obsidian Kinetic** merges high-focus obsidian dark-mode minimalism with luminous sentiment telemetry and refined glassmorphism. The aesthetic eliminates cognitive friction for high-velocity teams while giving atmospheric, emotional intelligence to group conversations.

- **Substrate Tone**: Deep obsidian canvases layered with frosted slate containers.
- **Micro-Interactions**: Rapid, dampened, and intentional with subtle inner borders and outer glow halos.
- **Telemetry Layer**: Dynamic sentiment indicators that breathe and pulse without overwhelming the reading interface.

---

## 2. Color Palette & Tokens

### Base Canvases & Surfaces
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--canvas-root` | `#0B0F17` | Root background base |
| `--surface-lowest` | `#0A0E16` | Inset fields, composer inputs, dark recesses |
| `--surface-low` | `#181C24` | Sidebars, drawers, panels |
| `--surface-container` | `#1C2028` | Cards, list items, avatar badges |
| `--surface-high` | `#262A33` | Elevated hover states, active conversation item |
| `--surface-highest` | `#31353E` | Modals, elevated tags, pills |
| `--surface-bright` | `#353942` | Bright borders and active pill accents |
| `--surface-glass` | `rgba(30, 41, 59, 0.65)` | Frosted cards with `backdrop-blur(12px)` |

### Text & Contrast
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--on-surface` | `#DFE2EE` | Primary headers, active titles, message body |
| `--on-surface-variant` | `#BCC9C6` | Subtitles, meta tags, timestamps, secondary labels |
| `--outline` | `#879391` | Default borders and dividers |
| `--outline-variant` | `#3D4947` | Subtle hairlines (opacity 20%-40%) |

### Dynamic Sentiment Spectrum (Conversation Vibes)
| Vibe | Emoji | Primary Accent | Container / Background | Rim Glow / Border |
| :--- | :--- | :--- | :--- | :--- |
| **🤝 Collaborative** | `🤝` | `#0D9488` (Teal) / `#6BD8CB` | `rgba(13, 148, 136, 0.15)` | `rgba(13, 148, 136, 0.35)` / glow `0 0 16px rgba(13,148,136,0.25)` |
| **🎉 Excited** | `🎉` | `#A855F7` (Violet) / `#DDB7FF` | `rgba(168, 85, 247, 0.15)` | `rgba(168, 85, 247, 0.35)` / glow `0 0 20px rgba(168,85,247,0.28)` |
| **😊 Positive** | `😊` | `#F59E0B` (Amber) / `#FFB95F` | `rgba(245, 158, 11, 0.15)` | `rgba(245, 158, 11, 0.35)` |
| **😐 Neutral** | `😐` | `#64748B` (Slate) / `#879391` | `rgba(100, 116, 139, 0.15)` | `rgba(100, 116, 139, 0.30)` |
| **😤 Frustrated** | `😤` | `#F43F5E` (Rose Red) / `#FFB4AB`| `rgba(244, 63, 94, 0.15)` | `rgba(244, 63, 94, 0.35)` |

---

## 3. Typography

- **Header Font**: `'Plus Jakarta Sans', sans-serif`
- **Body & Label Font**: `'Inter', sans-serif`
- **Monospace Font**: `'JetBrains Mono', 'Fira Code', monospace` (for metrics, counters, timestamps)

| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | Plus Jakarta Sans | `40px` | 700 (Bold) | `48px` | `-0.025em` |
| `headline-lg` | Plus Jakarta Sans | `28px` | 600 (Semibold) | `36px` | `-0.02em` |
| `headline-md` | Plus Jakarta Sans | `20px` | 600 (Semibold) | `28px` | `-0.015em` |
| `body-lg` | Inter | `16px` | 400 (Regular) | `24px` | `-0.011em` |
| `body-md` | Inter | `14px` | 400 (Regular) | `22px` | `-0.006em` |
| `body-sm` | Inter | `12px` | 400 (Regular) | `18px` | `0em` |
| `label-lg` | Inter | `14px` | 500 (Medium) | `20px` | `+0.005em` |
| `label-md` | Inter | `12px` | 600 (Semibold) | `16px` | `+0.02em` |
| `label-xs` | Inter | `10px` | 700 (Bold) | `14px` | `+0.06em` (Uppercase) |

---

## 4. Spacing & Layout Architecture

### Spacing Scale
- `space-xs`: `4px` (`0.25rem`)
- `space-sm`: `8px` (`0.5rem`)
- `space-md`: `16px` (`1rem`)
- `space-lg`: `24px` (`1.5rem`)
- `space-xl`: `36px` (`2.25rem`)

### Layout Columns (Desktop 3-Column Studio Grid)
- **Top App Bar**: Height `64px` (`4rem`), fixed full width, `backdrop-blur(12px)`.
- **Left Sidebar (Navigation & Channels)**: Fixed width `280px`, flex column with scrollable list.
- **Center Canvas (Chat Stream)**: Flexible `flex-1`, min-width `480px`, scrollable message area + docked bottom composer.
- **Right Panel (Conversation Insights)**: Fixed width `320px`, scrollable analysis telemetry.

---

## 5. Border Radius & Shapes
- `rounded-sm`: `4px` (`0.25rem`) - Micro tags, status chips.
- `rounded-md`: `8px` (`0.5rem`) - Action icon buttons, thumbnail avatars.
- `rounded-lg`: `12px` (`0.75rem`) - Input fields, message bubbles.
- `rounded-xl`: `16px` (`1rem`) - Cards, conversation items, modal containers.
- `rounded-2xl`: `20px` (`1.25rem`) - Composer card container, hero vibe card.
- `rounded-full`: `9999px` - Vibe badges, status pills, circular action triggers.

---

## 6. Components Specification

### A. Navigation (Top App Bar)
- **Branding**: Gradient logo icon (`#6F00BE` to `#6BD8CB`) with `forum` glyph + "VibeChat Workspace" in `headline-md` + "v2.4 Pro" pill tag.
- **Activity Links**: Inline navigation tabs (`All Activity`, `Mentions`, `Key Decisions`, `Vibe Telemetry`) with active bottom border indicator.
- **Controls**: Filter button, "Start Sync" button, notifications bell with unread dot, and user avatar with green/teal online ring.

### B. Left Sidebar
- **User Profile Chip**:
  - Container: `bg-surface-container/60 border border-outline-variant/20 rounded-xl`.
  - Avatar: `36x36px` with online indicator dot.
  - User handle & title: e.g. "Liam Vance" / "Lead Designer • Active".
- **Primary CTA (`+ New Conversation`)**:
  - Background: Gradient `from-primary-container via-surface-tint to-primary` (`#29A195` -> `#6BD8CB`).
  - Text: `font-label-md` Semibold, dark text `#00201D` for high contrast.
  - Shadow: `shadow-lg shadow-primary/15`, active press: `scale-[0.98]`.
- **Search Bar**:
  - Inset field: `bg-surface-container-lowest border border-outline-variant/40 rounded-xl`.
  - Left search icon, right keyboard shortcut chip `⌘K`.
- **Conversation List Items**:
  - Inactive: `hover:bg-surface-container/60 border border-transparent rounded-xl p-2.5`.
  - Active: `bg-surface-container-high/80 border border-primary/40 rounded-xl p-2.5 shadow-sm`.
  - Content: Title, relative time (`font-mono text-[10px]`), message preview, unread counter pill, and mini vibe badge.
- **Sidebar Docked Footer**:
  - Telemetry status: Pulsing green dot, "Live Telemetry Active", "99.8% Resonance".

### C. Chat Area (Center Canvas)
- **Chat Header (`h-16`)**:
  - Left: Channel tag `#` icon badge, channel title (`headline-md`), member count ("4 active members").
  - Center/Right: **Live Conversation Vibe Pill** (Capsule with animated ping dot, label "Conversation Vibe:", and vibe state e.g. "🤝 Collaborative").
  - Participant cluster: Stacked avatars (`-space-x-2`) with count chip (`+1`).
  - Utility actions: Search inside thread, audio call, video call, more options.
- **Message Bubbles**:
  - Grouping: Sender avatar (`40x40px rounded-xl`) with corner sentiment mini emoji badge.
  - Header: Sender name, role chip (e.g. "Backend Eng"), monospace timestamp (`10:17 AM`).
  - Incoming Bubble: `bg-surface-container-low border border-outline-variant/30 rounded-2xl rounded-tl-sm p-3.5`.
  - Outgoing (Self) Bubble: `bg-gradient-to-br from-primary-container/20 to-surface-container border border-primary/40 rounded-2xl rounded-tr-sm p-3.5`.
  - Footer meta: Message sentiment tag pill (e.g. `🤝 Collaborative`), emoji reaction badges with counts (`👍 3`, `🚀 2`), and read receipts (`done_all`).
- **Composer / Input Dock**:
  - Floating card: `rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/40 p-3 shadow-2xl`.
  - Focus state: `border-primary/60 ring-2 ring-primary/20`.
  - Textarea: Auto-resizing or 2-row clean resize-none input.
  - Formatting toolbar: Bold, attachment, emoji picker, user mention `@`.
  - Predictive sentiment badge: "Live Vibe: 🤝 Collaborative (92% confidence)".
  - Circular send button: `36x36px rounded-full bg-gradient-to-r from-primary-container to-primary hover:scale-105 active:scale-95`.

### D. Right Panel ("Conversation Insights")
- **Panel Header**: Title with `monitoring` icon and collapse button (`dock_to_right`).
- **Hero Card ("Current Overall Vibe")**:
  - Gradient background: `from-primary-container/25 via-surface-container to-surface-container-high border border-primary/40`.
  - Label: "CURRENT OVERALL VIBE" with live pulse dot.
  - Large Emoji (`3xl`) + Vibe Name (`headline-md font-extrabold text-primary`).
  - Stability index metric: `94% Stability Index`.
  - AI Description summary: e.g. *"Team is aligned and actively brainstorming. High consensus and constructive task allocation."*
  - Mini audio/sentiment waveform bars (pulse animation).
- **Mood Breakdown**:
  - Progress bar list for each of the 5 vibes (Collaborative, Excited, Positive, Neutral, Frustrated).
  - Background track: `h-1.5 bg-surface-container-highest rounded-full`.
  - Color-coded progress bar fills with percentage labels.
- **Metrics Grid**:
  - 2-column cards: "42 Messages" (`+18 vs yday`), "4 Participants" (`100% active`).
- **Detected Tasks & Decisions Checklist**:
  - Header: "Detected Tasks & Decisions" with `auto_awesome` badge.
  - Decision Card: Primary teal badge `[Decision]`, timestamp, title, checkmark glyph.
  - Task Card: Secondary violet badge `[Task]`, due date, title, assigned avatar with name tag.
- **Docked Footer Action**: "Sync to Linear & Notion" button.

---

## 7. Icons & Glyphs
- **Library**: Google Material Symbols Outlined (`font-variation-settings: 'FILL' 0, 'wght' 400`).
- **Standard Sizes**:
  - Micro / Inline: `14px` - `16px`
  - Control button: `18px` - `20px`
  - Large header: `24px`

---

## 8. Hover, Active & Transition States
- **Hover on Cards/Rows**: Background transitions from `transparent` to `rgba(255,255,255,0.04)`, border brightens to `rgba(255,255,255,0.1)`.
- **Button Hover**: Brightness increases by 10%, glow expands (`box-shadow: 0 0 16px rgba(...)`).
- **Active Press**: `transform: scale(0.98)` for tactile feedback.
- **Scrollbars**: Ultra-thin (`5px`), track transparent, thumb `rgba(61, 73, 71, 0.4)` hovering to teal `rgba(107, 216, 203, 0.4)`.

---

## 9. Responsive Behavior Guidelines
- **Desktop (>= 1280px)**: Full 3-column layout (Sidebar 280px + Chat flex-1 + Insights 320px).
- **Tablet (768px – 1279px)**:
  - Sidebar collapses to compact icon rail or off-canvas slideover.
  - Insights panel docks into a slide-over drawer toggled by header icon.
- **Mobile (< 768px)**:
  - Single pane view.
  - Hamburger menu opens conversation list.
  - Floating tab / sheet toggles Insights panel.
  - Full-width touch-friendly input composer.

---

## 10. React Implementation Readiness
This specification maps 1:1 to:
1. `index.css`: Predefined CSS variables, font imports, and utilities.
2. React components:
   - `<TopNavBar />`
   - `<Sidebar />` (`<ConversationList />`, `<ConversationItem />`, `<UserProfile />`)
   - `<ChatArea />` (`<ChatHeader />`, `<MessageList />`, `<MessageItem />`, `<MessageComposer />`)
   - `<InsightsPanel />` (`<VibeHeroCard />`, `<MoodBreakdown />`, `<MetricsGrid />`, `<TaskChecklist />`)
   - `<VibeBadge />` (Reusable dynamic sentiment pill component)
