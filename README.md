# The-Chair-Listens (WebAR Location Experience)
The Chair is an interactive, browser-based Augmented Reality (AR) web application that brings a symbolic figure "_The Chair_" to life at iconic real-world South African landmarks.
Users scan a physical QR code placed at a designated landmark, verify their GPS presence at that location, and step into a WebAR experience where they encounter The Chair face-to-face. Through carefully designed prompts, The Chair opens conversations around mental health, wellbeing, masculinity, prostate health, and the men who matter most in a person's life.
The Chair responds (by text or voice) sharing reflections, stories, concerns, or messages the user might need to hear in that moment. As users engage with The Chair across different landmarks, they can collect digital badges and souvenir photo cards, turning each encounter into part of a larger journey.

<h2>Core Features</h2>
<ul>
  <li><strong>Zero-Install WebAR</strong> &mdash; Powered by WebXR / WebAR technology (runs directly in mobile Safari or Chrome without requiring an app store download)</li>
  <li><strong>Location-Verified Access</strong> &mdash; GPS check confirms presence at a designated landmark before unlocking the experience</li>
  <li><strong>QR-Triggered Entry</strong> &mdash; no app install required, runs directly in the browser</li>
  <li><strong>WebAR Interaction</strong> &mdash; The Chair appears in the user&rsquo;s real-world environment</li>
  <li><strong>Guided Conversation</strong> &mdash; prompts exploring mental health, masculinity, and wellbeing</li>
  <li><strong>Text or Voice Responses</strong> &mdash; flexible, accessible interaction modes</li>
  <li><strong>Collectible Badges</strong> &mdash; earned by visiting landmarks and completing interactions</li>
  <li><strong>Souvenir Photo Cards</strong> &mdash; shareable AR photo mementos of each encounter</li>
</ul>

<h2>System Architecture</h2>

<p>The Chair is built as a lightweight, browser-first architecture &mdash; no native app installation required. It combines client-side AR rendering with a lean backend responsible for location verification and secure session issuance.</p>

<pre>
┌────────────────────────────────────────┐
│              MOBILE BROWSER             │
│      (HTML5 / Tailwind / React / Vue)   │
└───────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌─────────────────────┐  ┌─────────────────────┐
│  WebAR & 3D Engine   │  │  Sensors & Scanner   │
│  Three.js / A-Frame /│  │  Html5-QRCode /      │
│  8th Wall / MindAR.js│  │  jsQR / Geolocation  │
└─────────────────────┘  └─────────────────────┘
        │                         │
        └────────────┬────────────┘
                      │ HTTPS API Calls
                      ▼
┌────────────────────────────────────────┐
│             EXPRESS BACKEND             │
│  • Haversine GPS Distance Check         │
│  • QR Token Decryption                  │
│  • AR Token Issuance                    │
└───────────────────┬────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│            DATA PERSISTENCE             │
│  • PostgreSQL / SQLite (Locations)      │
│  • Cloudinary CDN (3D Assets/Photos)    │
└────────────────────────────────────────┘
</pre>

<h3>Layer Breakdown</h3>

<h4>1. Mobile Browser (Client Layer)</h4>
<p>The entry point for all users &mdash; no app store, no install. Built with <strong>HTML5</strong>, styled via <strong>Tailwind</strong>, and powered by <strong>React</strong> or <strong>Vue</strong> for state management and UI flow (QR scan &rarr; GPS check &rarr; AR session &rarr; badge/photo capture).</p>

<h4>2. WebAR &amp; 3D Engine</h4>
<p>Renders The Chair in the user&rsquo;s real-world environment using <strong>Three.js</strong>, <strong>A-Frame</strong>, <strong>8th Wall</strong>, or <strong>MindAR.js</strong>. Handles 3D model loading, plane/surface tracking, animations, and voice/text response overlays.</p>

<h4>3. Sensors &amp; Scanner</h4>
<p>Reads the physical QR code via <strong>Html5-QRCode</strong> or <strong>jsQR</strong>, and captures the user&rsquo;s live coordinates via the browser&rsquo;s <strong>Geolocation API</strong>. Both feed into the location-verification step before AR unlocks.</p>

<h4>4. Express Backend (API Layer)</h4>
<p>A lean <strong>Node.js/Express</strong> service responsible for:</p>
<ul>
  <li><strong>Haversine GPS Distance Check</strong> &mdash; confirms the user is physically within range of the landmark&rsquo;s registered coordinates</li>
  <li><strong>QR Token Decryption</strong> &mdash; validates the scanned QR code maps to a legitimate, un-tampered landmark token</li>
  <li><strong>AR Token Issuance</strong> &mdash; issues a short-lived session token that unlocks the WebAR experience only after GPS + QR checks pass</li>
</ul>

<h4>5. Data Persistence</h4>
<ul>
  <li><strong>PostgreSQL / SQLite</strong> &mdash; stores landmark metadata (coordinates, QR token mappings, badge definitions, user progress)</li>
  <li><strong>Cloudinary CDN</strong> &mdash; hosts and serves 3D assets (Chair models, animations) and generated souvenir photo cards</li>
</ul>

<h3>Request Flow</h3>
<ol>
  <li>User scans QR code at landmark &rarr; token extracted client-side</li>
  <li>Browser requests Geolocation permission &rarr; coordinates captured</li>
  <li>Client sends QR token + GPS coordinates to Express backend</li>
  <li>Backend decrypts QR token, runs Haversine check against stored landmark coordinates</li>
  <li>If valid &rarr; backend issues a short-lived AR session token</li>
  <li>Client loads WebAR scene, fetching 3D assets from Cloudinary</li>
  <li>User interacts with The Chair &rarr; responses served via text/voice</li>
  <li>On completion &rarr; badge awarded and photo card generated/stored</li>
</ol>

<h2>Repo Structure</h2>
 
<pre>
the-chair-ar/
├── client/                        # Frontend (React/Vue + WebAR)
│   ├── public/
│   │   ├── models/                # 3D assets (Chair models, animations)
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRScanner/         # Html5-QRCode / jsQR scanning logic
│   │   │   ├── ARScene/           # Three.js / A-Frame / MindAR.js scene
│   │   │   ├── GeoCheck/          # Geolocation permission + capture
│   │   │   ├── ChatInterface/     # Text/voice conversation UI
│   │   │   ├── BadgeDisplay/      # Collectible badge UI
│   │   │   └── PhotoCard/         # Souvenir photo card generator
│   │   ├── hooks/                 # useGeolocation, useARSession, etc.
│   │   ├── services/              # API calls to Express backend
│   │   ├── pages/                 # Landing, Scan, AR Experience, Badges
│   │   ├── styles/                # Tailwind config/overrides
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/
│   │   ├── unit/                  # Jest + React Testing Library / Vue Test Utils
│   │   │   ├── components/
│   │   │   │   ├── QRScanner.test.jsx
│   │   │   │   ├── ARScene.test.jsx
│   │   │   │   ├── ChatInterface.test.jsx
│   │   │   │   └── BadgeDisplay.test.jsx
│   │   │   └── hooks/
│   │   │       └── useGeolocation.test.js
│   │   └── e2e/                   # Playwright / Cypress
│   │       ├── scan-to-badge.spec.js       # Full user journey
│   │       ├── gps-denied.spec.js
│   │       └── ar-scene-smoke.spec.js
│   ├── package.json
│   ├── jest.config.js
│   ├── playwright.config.js       # or cypress.config.js
│   └── vite.config.js             # or webpack.config.js
│
├── server/                        # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── location.routes.js # GPS + Haversine check endpoints
│   │   │   ├── qr.routes.js       # QR token decryption/validation
│   │   │   ├── ar.routes.js       # AR session token issuance
│   │   │   ├── badges.routes.js
│   │   │   └── photos.routes.js
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── haversine.service.js
│   │   │   ├── qrToken.service.js
│   │   │   ├── cloudinary.service.js
│   │   │   └── voice.service.js   # TTS or audio response handling
│   │   ├── models/                 # Sequelize/Prisma models
│   │   │   ├── Location.js
│   │   │   ├── User.js
│   │   │   ├── Badge.js
│   │   │   └── PhotoCard.js
│   │   ├── middleware/
│   │   │   ├── validateToken.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   ├── db.config.js
│   │   │   └── cloudinary.config.js
│   │   └── app.js
│   ├── tests/
│   │   ├── unit/                  # Jest
│   │   │   ├── services/
│   │   │   │   ├── haversine.service.test.js
│   │   │   │   ├── qrToken.service.test.js
│   │   │   │   └── cloudinary.service.test.js
│   │   │   ├── controllers/
│   │   │   └── middleware/
│   │   │       └── validateToken.test.js
│   │   └── acceptance/            # Supertest — API contract tests
│   │       ├── location.routes.test.js
│   │       ├── qr.routes.test.js
│   │       ├── ar.routes.test.js
│   │       └── badges.routes.test.js
│   ├── migrations/                # DB schema migrations
│   ├── seeders/                   # Seed landmark data
│   ├── package.json
│   ├── jest.config.js
│   └── server.js
│
├── database/
│   ├── schema.sql                 # PostgreSQL/SQLite schema
│   └── seed-data/                 # Landmark coordinates, QR mappings
│
├── assets/
│   ├── 3d-models/                 # Source .glb/.gltf Chair models
│   └── audio/                     # Pre-recorded voice lines (if applicable)
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   ├── testing.md                 # Testing strategy, coverage targets
│   └── landmarks.md               # List of AR landmark locations
│
├── .github/
│   └── workflows/
│       ├── ci-unit.yml            # Runs on every PR
│       └── ci-acceptance.yml      # Runs on merge to main / nightly
│
├── .env.example
├── .gitignore
├── docker-compose.yml             # Optional: local Postgres + services
├── LICENSE
└── README.md
</pre>

<h2>Tech Stack</h2>

<h3>Frontend (Client Layer)</h3>
<ul>
  <li><strong>HTML5 / CSS3 (Tailwind)</strong> &mdash; structure and utility-first styling</li>
  <li><strong>JavaScript (ES6+)</strong> &mdash; core client logic</li>
  <li><strong>React / Vue</strong> &mdash; UI components and state management</li>
  <li><strong>Three.js / A-Frame</strong> &mdash; 3D scene rendering</li>
  <li><strong>WebXR API</strong> &mdash; browser-native AR runtime</li>
  <li><strong>AR Engine:</strong> 8th Wall (Production) or MindAR.js / AR.js (Open Source)</li>
  <li><strong>Html5-QRCode / jsQR</strong> &mdash; QR code scanning</li>
  <li><strong>Geolocation API</strong> &mdash; browser-native GPS capture</li>
</ul>

<h3>Backend (API Layer)</h3>
<ul>
  <li><strong>Node.js</strong> &mdash; runtime environment</li>
  <li><strong>Express.js</strong> &mdash; REST API framework</li>
  <li><strong>TypeScript</strong> &mdash; type safety across the stack (recommended, shared types with frontend)</li>
  <li><strong>jsonwebtoken (JWT)</strong> &mdash; AR session token issuance &amp; validation</li>
  <li><strong>Sequelize / Prisma</strong> &mdash; ORM for database access</li>
  <li><strong>Custom Haversine Service</strong> &mdash; GPS distance verification logic</li>
  <li><strong>QR Token Decryption Service</strong> &mdash; validates scanned landmark tokens (crypto / jose)</li>
</ul>

<h3>Data Persistence</h3>
<ul>
  <li><strong>SQLite</strong> &mdash; local development database</li>
  <li><strong>PostgreSQL</strong> &mdash; production database</li>
  <li><strong>Cloudinary / AWS S3</strong> &mdash; asset hosting (Draco-compressed 3D mesh files, souvenir photo cards)</li>
</ul>

<h3>DevOps &amp; Tooling</h3>
<ul>
  <li><strong>Docker</strong> &mdash; containerized local development (Node service + Postgres)</li>
  <li><strong>GitHub Actions</strong> &mdash; CI/CD pipeline (build, test, deploy)</li>
  <li><strong>Postman / Swagger (swagger-jsdoc)</strong> &mdash; API documentation and testing</li>
  <li><strong>ESLint / Prettier</strong> &mdash; code quality and formatting</li>
  <li><strong>Vercel / AWS Lambda / Render</strong> &mdash; hosting/deployment target (lightweight Node cold starts fit serverless well)</li>
</ul>
