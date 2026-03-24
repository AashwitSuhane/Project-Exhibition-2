# QRClub — QR-Based Club & Event Management System

A fully featured React frontend with dark glassmorphism UI, QR generation, camera-based QR scanning, protected routes, and a complete mock API layer.

---

## 🚀 Quick Setup

```bash
# 1. Enter project
cd qr-club-app

# 2. Install all dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 🔐 Login Credentials

Any email + password (4+ chars) works. Or click **"Use Demo Credentials"** to auto-fill:
- **Email:** `admin@qrclub.dev`
- **Password:** `demo1234`

---

## 📁 Full Project Structure

```
qr-club-app/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── App.jsx                        ← Router + providers
    ├── main.jsx                       ← ReactDOM entry
    ├── index.css                      ← Tailwind + global styles
    │
    ├── context/
    │   ├── AuthContext.jsx            ← Auth state, login/logout
    │   └── ToastContext.jsx           ← Global toast notifications
    │
    ├── components/
    │   ├── DashboardLayout.jsx        ← Sidebar + Navbar wrapper
    │   ├── Sidebar.jsx                ← Nav links, user footer, mobile overlay
    │   ├── Navbar.jsx                 ← Top bar with page title + actions
    │   ├── ProtectedRoute.jsx         ← Auth guard for private routes
    │   ├── StatCard.jsx               ← Reusable dashboard metric card
    │   ├── EventCard.jsx              ← Event display + register CTA
    │   ├── LoadingSpinner.jsx         ← Animated spinner
    │   └── EmptyState.jsx             ← Empty state with optional CTA
    │
    ├── pages/
    │   ├── LoginPage.jsx              ← Auth form + demo fill
    │   ├── DashboardPage.jsx          ← Stats, recent events, quick actions
    │   ├── EventsPage.jsx             ← Searchable/filterable event list
    │   ├── CreateEventPage.jsx        ← Event creation form with validation
    │   ├── MyQRPage.jsx               ← QR code display per registration
    │   ├── ScannerPage.jsx            ← Camera-based QR scanner
    │   └── NotFoundPage.jsx           ← 404 page
    │
    ├── services/
    │   └── api.js                     ← Full mock API (getEvents, createEvent, registerEvent, etc.)
    │
    └── utils/
        └── helpers.js                 ← Date formatting, color maps, capacity helpers
```

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client (ready for real API) |
| `qrcode.react` | QR code generation (SVG) |
| `html5-qrcode` | Camera-based QR scanner |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS |
| `vite` | Build tool & dev server |

---

## 🎨 Design System

- **Font stack:** Syne (display/headings) + DM Sans (body) + JetBrains Mono (code)
- **Dark theme** with glassmorphism surfaces
- **Accent colors:** Neon green, Aqua, Ember, Rose
- **Animations:** Fade-in, slide-up, scale-in, float, glow-pulse

---

## 🧩 Features

### Auth
- Email + password login with localStorage JWT persistence
- Protected routes redirect unauthenticated users to `/login`
- Auto-redirect if already logged in

### Dashboard
- Live stats: total events, upcoming, my registrations, clubs
- Recent events list with capacity bars
- My registrations panel with QR shortcuts
- Quick action buttons

### Events
- 6 pre-loaded events across 4 clubs
- Search by title or club name
- Filter by category (Workshop, Hackathon, etc.) + status
- Register with real capacity tracking
- Direct link to QR after registration

### Create Event
- Full form: name, description, club, category, date, time, venue, capacity
- Emoji + color accent picker
- Client-side validation with inline errors
- Success confirmation card

### My QR Codes
- Master list of all registrations
- SVG QR code per registration (using `qrcode.react`)
- Download QR as SVG file
- Registration ID, event details displayed

### QR Scanner
- Uses device camera (`html5-qrcode`)
- Parses JSON QR data from registrations
- Displays decoded event + user info on success
- Graceful camera permission error handling

---

## 🔌 Connecting a Real Backend

Replace functions in `src/services/api.js` with real Axios calls:

```js
import axios from 'axios'
const API = axios.create({ baseURL: 'https://your-api.com/api' })

export const getEvents = () => API.get('/events').then(r => r.data)
export const createEvent = (data) => API.post('/events', data).then(r => r.data)
export const registerEvent = (eventId, userId) => API.post(`/events/${eventId}/register`, { userId }).then(r => r.data)
```

Add an Axios interceptor for JWT in requests:
```js
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('qrc_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
```

---

## 📱 Responsive Design

- **Mobile:** Hamburger menu → slide-in sidebar overlay
- **Tablet:** Fluid grid layouts
- **Desktop:** Persistent sidebar, multi-column grids

---

Built with ❤️ using React + Vite + Tailwind CSS
