<h1>The Chair Listens</h1>

<p><strong>The Chair Listens</strong> is an interactive, browser-based digital experience built around <strong>The Blue Chair</strong>, a physical, travelling symbol for men&rsquo;s health awareness across South Africa.</p>

<p>A person takes a seat at The Blue Chair, scans a QR code placed on it, and is guided through a short, judgment-free digital conversation. The chair prompts carefully designed questions around <strong>mental health, wellbeing, masculinity, prostate health, and the men who matter to them</strong>. Responses can be shared by <strong>text or voice</strong>: a thought, a story, a concern, or a message he wants someone else to hear.</p>

<p>Every response becomes part of a growing, <strong>anonymised digital archive</strong> of men&rsquo;s (and women&rsquo;s) voices from across South Africa. As The Blue Chair travels from city to city, each interaction is tagged to that location and surfaced on a live digital map, building an evolving picture of what men are thinking, feeling, and saying, and where those conversations are happening.</p>

<hr>

<h2>The Journey: Sit &rarr; Ask &rarr; Listen &rarr; Collect &rarr; Connect</h2>
<ol>
  <li><strong>Sit.</strong> A person takes a seat at The Blue Chair and scans the QR code, opening the digital experience on their own phone.</li>
  <li><strong>The Chair Asks.</strong> The platform prompts him with carefully designed questions around mental health, wellbeing, masculinity, prostate health, and the men who matter to him.</li>
  <li><strong>The Chair Listens.</strong> He responds by text or voice, sharing a thought, story, concern, or message he wants another person to hear.</li>
  <li><strong>The Chair Collects.</strong> Every story becomes part of a growing, anonymised digital archive of voices from across South Africa.</li>
  <li><strong>The Chair Travels.</strong> As The Blue Chair moves between cities, every interaction is geo-tagged and visualised on a live digital map.</li>
  <li><strong>The Chair Connects.</strong> Stories, insights, and conversations surface through the campaign platform, creating an evolving picture of what men are thinking, feeling, and saying.</li>
</ol>

<hr>

<h2>Core Features</h2>
<ul>
  <li><strong>Zero-Install, QR-Triggered Access:</strong> No app download. Scanning the QR code on the chair opens the experience directly in the phone&rsquo;s browser.</li>
  <li><strong>Consent-First Design:</strong> Before anything is submitted, the platform clearly explains how responses and data will be used.</li>
  <li><strong>Text or Voice Responses:</strong> Flexible, accessible ways to share a thought, story, or concern.</li>
  <li><strong>Flexible Question Interface:</strong> Campaign questions can be uploaded and updated without needing a redevelopment cycle.</li>
  <li><strong>Anonymised Response Archive:</strong> Stories are captured and stored without collecting unnecessary personal information.</li>
  <li><strong>Geo-Tagged Locations:</strong> Every response is associated with the campaign stop it came from, enabling a live map of where conversations are happening.</li>
  <li><strong>Analytics Dashboard:</strong> Gives the campaign team visibility into participation metrics, response volumes, and reach.</li>
</ul>

<hr>

<h2>System Architecture</h2>

<p>The Chair Listens is a lightweight, browser-first web application. A physical QR code on The Blue Chair links directly to the web experience, and everything from there runs as a standard mobile-responsive site backed by a small API and database.</p>

<pre>
┌────────────────────────────────────────┐
│         PHYSICAL QR CODE (ON CHAIR)     │
│   Encodes a URL + campaign location ID  │
└───────────────────┬────────────────────┘
                     │ Scanned with phone camera
                     ▼
┌────────────────────────────────────────┐
│           MOBILE / DESKTOP BROWSER      │
│   Next.js + Tailwind CSS + JavaScript   │
│   Consent → Question Flow → Response    │
└───────────────────┬────────────────────┘
                     │ HTTPS API Calls
                     ▼
┌────────────────────────────────────────┐
│              API LAYER                  │
│   Next.js API Routes / Node + Express   │
│  • Consent logging                      │
│  • Question retrieval (CMS-driven)      │
│  • Response submission (text/voice)     │
│  • Location tagging                     │
└───────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌─────────────────────┐  ┌─────────────────────┐
│  DATABASE (Supabase/ │  │  MEDIA STORAGE       │
│  PostgreSQL)         │  │  (Cloudinary)        │
│  • Questions         │  │  • Voice recordings   │
│  • Responses         │  │  • Compressed/CDN-    │
│  • Locations         │  │    served             │
│  • Consent records   │  │                       │
└─────────────────────┘  └─────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│              ADMIN DASHBOARD            │
│  • Question management (CMS)            │
│  • Participation analytics              │
│  • Live map of campaign locations       │
└────────────────────────────────────────┘
</pre>

<h3>Layer Breakdown</h3>

<h4>1. Physical QR Code</h4>
<p>A sticker or plaque on The Blue Chair itself. No scanning logic lives inside the app. The code simply encodes a URL, with a location identifier as a query parameter, opened by the phone&rsquo;s native camera.</p>

<h4>2. Mobile / Desktop Browser (Client Layer)</h4>
<p>A responsive web app built with <strong>Next.js</strong> and <strong>Tailwind CSS</strong>. Guides the user through consent, the question flow, and text/voice response capture. No install, no account required.</p>

<h4>3. API Layer</h4>
<p>Handles consent logging, question retrieval, response submission, and location tagging. Built as <strong>Next.js API routes</strong> (or a separate Node/Express service if preferred) to keep the stack small for a short build window.</p>

<h4>4. Database &amp; Media Storage</h4>
<p><strong>Supabase (PostgreSQL)</strong> stores questions, responses, consent records, and campaign locations. <strong>Cloudinary</strong> stores and serves voice recordings, compressed and CDN-delivered.</p>

<h4>5. Admin Dashboard</h4>
<p>An authenticated section where the campaign team can manage questions, view participation analytics, and see a live map of where The Blue Chair has travelled and how each stop performed.</p>

<hr>

<h2>Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li><strong>Next.js:</strong> single project serving both the public chair experience and the admin dashboard</li>
  <li><strong>Tailwind CSS:</strong> styling</li>
  <li><strong>JavaScript (ES6+):</strong> core client logic</li>
  <li><strong>MediaRecorder API</strong> (browser-native): captures voice responses, no external library needed</li>
  <li><strong>Leaflet.js / Mapbox:</strong> renders the live map of campaign locations</li>
</ul>

<h3>Backend</h3>
<ul>
  <li><strong>Next.js API Routes</strong> (or Node.js + Express as a standalone service): consent, questions, responses, location tagging</li>
  <li><strong>Supabase:</strong> PostgreSQL database, file storage, and admin authentication in one service</li>
</ul>

<h3>Media &amp; Optional Services</h3>
<ul>
  <li><strong>Cloudinary:</strong> voice recording storage, compression, CDN delivery</li>
  <li><strong>Speech-to-Text</strong> (Google Cloud Speech-to-Text / AssemblyAI / Deepgram): optional, only needed if searchable transcripts are required rather than raw audio playback</li>
</ul>

<h3>Hosting &amp; Infrastructure</h3>
<ul>
  <li><strong>Vercel:</strong> frontend + API hosting, automatic SSL, pairs natively with Next.js</li>
  <li><strong>Supabase:</strong> managed database and storage</li>
  <li><strong>Domain registrar</strong> (Namecheap / domains.co.za): campaign domain</li>
</ul>

<h3>Monitoring &amp; Reliability</h3>
<ul>
  <li><strong>Sentry:</strong> error tracking in production, important since the app runs unattended at live activations</li>
  <li><strong>UptimeRobot:</strong> uptime alerts during campaign events</li>
</ul>

<h3>DevOps &amp; Tooling</h3>
<ul>
  <li><strong>GitHub:</strong> version control, Issues for task tracking</li>
  <li><strong>GitHub Actions:</strong> CI (build, test on every PR)</li>
  <li><strong>ESLint / Prettier:</strong> code quality and formatting</li>
</ul>

<hr>

<h2>Repo Structure</h2>

<pre>
the-chair-listens/
├── app/                            # Next.js app (frontend + API routes)
│   ├── public/
│   │   └── index.html
│   ├── pages/ (or app/ router)
│   │   ├── index.jsx               # Landing / consent screen
│   │   ├── questions/[step].jsx    # Question flow screens
│   │   ├── response.jsx            # Text/voice response capture
│   │   ├── thank-you.jsx           # Confirmation screen
│   │   └── admin/
│   │       ├── login.jsx
│   │       ├── dashboard.jsx       # Analytics dashboard
│   │       ├── questions.jsx       # Question CMS
│   │       └── map.jsx             # Live location map
│   ├── components/
│   │   ├── ConsentForm/
│   │   ├── QuestionCard/
│   │   ├── VoiceRecorder/          # MediaRecorder wrapper
│   │   ├── TextResponse/
│   │   └── LocationMap/            # Leaflet/Mapbox component
│   ├── api/
│   │   ├── consent.js
│   │   ├── questions.js            # GET/POST/PUT for CMS
│   │   ├── responses.js            # Submit text/voice responses
│   │   └── locations.js            # Campaign stop management
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   ├── cloudinary.js
│   │   └── validators.js
│   ├── styles/
│   ├── tests/
│   │   ├── unit/                   # Jest
│   │   │   ├── components/
│   │   │   └── api/
│   │   └── acceptance/             # Supertest / Playwright
│   │       ├── consent-flow.spec.js
│   │       ├── question-cms.spec.js
│   │       ├── response-submission.spec.js
│   │       └── admin-dashboard.spec.js
│   ├── package.json
│   ├── jest.config.js
│   └── next.config.js
│
├── database/
│   ├── schema.sql                  # questions, responses, locations, consent
│   └── seed-data/                  # initial questions, campaign locations
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   ├── testing.md
│   ├── data-privacy.md             # POPIA-aligned consent & data handling notes
│   └── campaign-locations.md
│
├── .github/
│   └── workflows/
│       ├── ci-unit.yml
│       └── ci-acceptance.yml
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
</pre>

<hr>

<h2>Testing</h2>

<h3>Unit Tests</h3>
<ul>
  <li><strong>Jest:</strong> components, API route handlers, validators</li>
  <li><strong>React Testing Library:</strong> ConsentForm, QuestionCard, VoiceRecorder, TextResponse</li>
  <li><strong>Coverage target:</strong> 80% or higher for consent logging, response submission, and question CRUD. These are the paths most tied to data integrity and compliance.</li>
</ul>

<h3>Acceptance / End-to-End Tests</h3>
<ul>
  <li><strong>Playwright / Cypress:</strong> full user journey covering scan link, consent, question flow, text/voice response, and confirmation</li>
  <li><strong>API Contract Tests:</strong> Supertest against consent, questions, responses, and locations endpoints</li>
  <li><strong>Admin Dashboard Tests:</strong> question CMS edits persist correctly; analytics reflect submitted responses accurately</li>
</ul>

<h3>Example Test Scenarios</h3>
<ul>
  <li>User cannot submit a response without first giving consent</li>
  <li>Text response is stored without any identifying personal information</li>
  <li>Voice response uploads successfully and is retrievable from storage</li>
  <li>A response is correctly tagged to the active campaign location</li>
  <li>An admin can add, edit, or remove a question and it reflects immediately in the live flow</li>
  <li>Analytics dashboard totals match the number of stored responses</li>
</ul>

<h3>CI Integration</h3>
<ul>
  <li>Unit tests run on every pull request via <strong>GitHub Actions</strong></li>
  <li>Acceptance suite runs on merge to <code>main</code> and before any live activation</li>
  <li>Failed acceptance tests block deployment</li>
</ul>

<hr>

<h2>Data Privacy Note</h2>
<p>This platform captures personal stories about mental health, masculinity, and prostate health. Even where data is anonymised, this project should be built and reviewed with <strong>POPIA (Protection of Personal Information Act)</strong> compliance in mind, particularly around consent language, voice data handling, and what counts as personal information. Legal sign-off on the consent flow and privacy policy should sit with the campaign owner, not be assumed by the development team.</p>
