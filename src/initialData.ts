import { Lead, RemoteTeamMember, AgentLog } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    businessName: "Evergreen Dental Care",
    city: "Chicago",
    niche: "Dentistry",
    website: "https://evergreendentistrychi.com",
    contactEmail: "care@evergreendentistrychi.com",
    status: "complete",
    originalPageSpeed: 34,
    newPageSpeed: 89,
    accessibilityScore: 58,
    auditIssues: [
      "No mobile viewport compression or responsive scaling.",
      "Hero image lacks descriptive alt text, causing screen-reader failure.",
      "Vite project assets loading synchronously, delaying First Contentful Paint by 4.2s."
    ],
    auditFixes: [
      "Compress asset from 4.2MB PNG to 180KB WebP.",
      "Set up dynamic layout containers with custom viewport wrappers.",
      "Inject asynchronous image loading triggers."
    ],
    redesignPageUrl: "https://evergreendental.agentpreview.com",
    heyGenVideoUrl: "https://heygen.cdn.com/videos/evergreen_walkthrough_12.mp4",
    heyGenStatus: "ready",
    heyGenCost: 2.00,
    outreachChannel: "instagram",
    conversionStatus: "converted",
    assignedTo: "Sarah Jenkins (UI Coach)",
    comments: [
      {
        id: "c1",
        authorName: "Scout Agent",
        authorType: "agent",
        authorRole: "Lead Harvesting Node",
        text: "Lead Evergreen Dental Care harvested. Initial PageSpeed Insights test marked at severe 34.",
        timestamp: "2026-05-24T10:15:00Z"
      },
      {
        id: "c2",
        authorName: "Diagnoser Agent",
        authorType: "agent",
        authorRole: "Consulting Copywriting Node",
        text: "Custom 3-problem audit generated. Highlighted performance lag, missing touch targets, and poor SEO tags.",
        timestamp: "2026-05-24T10:17:30Z"
      },
      {
        id: "c3",
        authorName: "Builder Agent",
        authorType: "agent",
        authorRole: "React Frontend Compiler Node",
        text: "React/Tailwind mockup compiled with original Evergreen emerald green branding. View preview link below.",
        timestamp: "2026-05-24T11:02:11Z"
      },
      {
        id: "c4",
        authorName: "Sarah Jenkins",
        authorType: "human",
        authorRole: "Head UI/UX Designer",
        text: "This layout looks exceptionally crisp! Excellent brand translation. HeyGen script is prepped.",
        timestamp: "2026-05-24T12:30:15Z"
      },
      {
        id: "c5",
        authorName: "Checker Agent",
        authorType: "agent",
        authorRole: "Automated QA & Visual Regression Node",
        text: "PageSpeed Insights post-audit executed. Score upgraded to 89. Zero console exceptions in sandbox. Validated walkthrough length at 48s.",
        timestamp: "2026-05-24T12:45:00Z"
      },
      {
        id: "c6",
        authorName: "Pitcher Agent",
        authorType: "agent",
        authorRole: "Cold Outreach Dispatcher",
        text: "Comment-to-DM trigger successfully initiated. Delivered audit, preview URL, and personalized HeyGen walkthrough. Client converted after 2 hours!",
        timestamp: "2026-05-24T14:50:00Z"
      }
    ],
    history: [
      { id: "h1", stage: "Scouting", description: "Harvested dental lead in Chicago area", timestamp: "2026-05-24T10:15:00Z", actor: "Scout" },
      { id: "h2", stage: "Diagnosis", description: "Completed structural layout audit and generated consultative remedies", timestamp: "2026-05-24T10:17:30Z", actor: "Diagnoser" },
      { id: "h3", stage: "Building", description: "Compiled React preview with original style matching", timestamp: "2026-05-24T11:02:11Z", actor: "Builder" },
      { id: "h4", stage: "Filming", description: "Rendered HeyGen video using Digital Twin avatar pitch", timestamp: "2026-05-24T11:45:00Z", actor: "Filmer" },
      { id: "h5", stage: "QA Check", description: "Enforced headless browser checks & verified 60s length", timestamp: "2026-05-24T12:45:00Z", actor: "Checker" },
      { id: "h6", stage: "Outreach", description: "Dispatched package via official Meta Graph API message", timestamp: "2026-05-24T14:50:00Z", actor: "Pitcher" }
    ]
  },
  {
    id: "lead-2",
    businessName: "Luxe Thread Salon",
    city: "Houston",
    niche: "Hair Salon",
    website: "https://luxethreadshouston.com",
    contactEmail: "booking@luxethreadshouston.com",
    status: "qa_check",
    originalPageSpeed: 45,
    newPageSpeed: 92,
    accessibilityScore: 61,
    auditIssues: [
      "Image-heavy grid layout lacking native lazy-loading.",
      "Critical CSS blocks render thread execution due to massive head script imports.",
      "Booking button touch targets are 24px wide, violating mobile target guidelines."
    ],
    auditFixes: [
      "Migrate block assets to decoupled layout wrappers.",
      "Optimized standard viewports with responsive tracking thresholds.",
      "Resized interactive icons to 46px target standard."
    ],
    redesignPageUrl: "https://luxethreads.agentpreview.com",
    heyGenStatus: "pending_approval",
    heyGenCost: 0.00,
    outreachChannel: "instagram",
    conversionStatus: "pipeline",
    assignedTo: "Sarah Jenkins (UI Coach)",
    comments: [
      {
        id: "l1",
        authorName: "Scout Agent",
        authorType: "agent",
        authorRole: "Lead Harvesting Node",
        text: "Luxe Thread Salon audit finished. PageSpeed score logged at 45.",
        timestamp: "2026-05-24T14:10:00Z"
      },
      {
        id: "l2",
        authorName: "Diagnoser Agent",
        authorType: "agent",
        authorRole: "Consulting Copywriting Node",
        text: "Personalized audit loaded. Heavy emphasis on page lag impacting conversion by 12%.",
        timestamp: "2026-05-24T14:12:00Z"
      },
      {
        id: "l3",
        authorName: "Builder Agent",
        authorType: "agent",
        authorRole: "React Frontend Compiler Node",
        text: "Builder finished design compilation. Embedded booking dynamic layouts in clean React hook.",
        timestamp: "2026-05-24T15:05:00Z"
      },
      {
        id: "l4",
        authorName: "Checker Agent",
        authorType: "agent",
        authorRole: "Automated QA & Visual Regression Node",
        text: "Screenshots generated. Multi-modal check detected desktop margin overlap on pricing cards. Self-correction executed with customized tailwind margins. New check passed! New score: 92.",
        timestamp: "2026-05-24T15:20:00Z"
      },
      {
        id: "l5",
        authorName: "Operator Alex",
        authorType: "human",
        authorRole: "System Admin / Owner",
        text: "Excellent recovery, Checker. Staging look is professional. Pausing pipeline to avoid accidental HeyGen video cost before lead review.",
        timestamp: "2026-05-24T15:45:00Z"
      }
    ],
    history: [
      { id: "lh1", stage: "Scouting", description: "Scraped Luxe Thread Salon in Houston", timestamp: "2026-05-24T14:10:00Z", actor: "Scout" },
      { id: "lh2", stage: "Diagnosis", description: "Audit created. Visual analysis highlighting booking friction", timestamp: "2026-05-24T14:12:00Z", actor: "Diagnoser" },
      { id: "lh3", stage: "Building", description: "Coded interactive booking landing page", timestamp: "2026-05-24T15:05:00Z", actor: "Builder" },
      { id: "lh4", stage: "QA Check", description: "Vectored vision-feedback self-correction completed", timestamp: "2026-05-24T15:20:00Z", actor: "Checker" }
    ]
  },
  {
    id: "lead-3",
    businessName: "Delta Plumbing & Rooter",
    city: "Seattle",
    niche: "Plumbing Services",
    website: "https://deltaseattleplumbers.com",
    contactEmail: "support@deltaseattleplumbers.com",
    status: "building",
    originalPageSpeed: 18,
    accessibilityScore: 42,
    auditIssues: [
      "Staggering 11.2s First Input Delay due to synchronous database script calls.",
      "Emergency dialer lacks simple human-readable link structures on mobile viewports.",
      "Low typography contrast on reviews container standard."
    ],
    auditFixes: [
      "Injected modern Inter and JetBrains structural spacing standards.",
      "Configured high contrast background-foreground utility matrices.",
      "Embedded direct touch dialer hooks."
    ],
    heyGenStatus: "none",
    heyGenCost: 0,
    outreachChannel: "facebook",
    conversionStatus: "pipeline",
    assignedTo: "Builder Agent",
    comments: [
      {
        id: "d1",
        authorName: "Scout Agent",
        authorType: "agent",
        authorRole: "Lead Harvesting Node",
        text: "Scouted Delta Plumbing. Emergency plumber. Severe lag detected: PSI score is 18.",
        timestamp: "2026-05-24T16:00:00Z"
      },
      {
        id: "d2",
        authorName: "Diagnoser Agent",
        authorType: "agent",
        authorRole: "Consulting Copywriting Node",
        text: "Computed audit. Focus on 'Call out fee' transparency and speed audits to catch urgent traffic.",
        timestamp: "2026-05-24T16:05:00Z"
      },
      {
        id: "d3",
        authorName: "Builder Agent",
        authorType: "agent",
        authorRole: "React Frontend Compiler Node",
        text: "Builder starting compilation. Pulling brand hex colors (#E04E24) and setting up emergency dispatch components.",
        timestamp: "2026-05-24T16:15:00Z"
      }
    ],
    history: [
      { id: "dh1", stage: "Scouting", description: "Harvested Delta Plumbing", timestamp: "2026-05-24T16:00:00Z", actor: "Scout" },
      { id: "dh2", stage: "Diagnosis", description: "Audit output loaded into state system", timestamp: "2026-05-24T16:05:00Z", actor: "Diagnoser" }
    ]
  },
  {
    id: "lead-4",
    businessName: "Radiant Skin MedSpa",
    city: "Miami",
    niche: "Cosmetic Medical Spa",
    website: "https://radiantskinmiami.com",
    contactEmail: "info@radiantskinmiami.com",
    status: "scouted",
    originalPageSpeed: 48,
    accessibilityScore: 66,
    auditIssues: [
      "Flickering banner animations causing layout shifts (CLS: 0.45).",
      "Massive uncompressed background video (34MB) blocking dynamic site initial load.",
      "Contact form submission triggers raw page jumps rather than clean React hooks validation."
    ],
    auditFixes: [
      "Introduce sleek Framer Motion fade-ins for banner animations.",
      "Replace raw video with beautiful optimized raster image layouts.",
      "Coded inline asynchronous submission validated containers."
    ],
    heyGenStatus: "none",
    heyGenCost: 0,
    outreachChannel: "instagram",
    conversionStatus: "pipeline",
    assignedTo: "Diagnoser Agent",
    comments: [],
    history: [
      { id: "rh1", stage: "Scouting", description: "Harvested Radiant Skin Spa in Miami", timestamp: "2026-05-24T18:30:00Z", actor: "Scout" }
    ]
  },
  {
    id: "lead-5",
    businessName: "Gourmet Garden Bistro",
    city: "Atlanta",
    niche: "Restaurants",
    website: "https://gourmetgardenatl.com",
    contactEmail: "hello@gourmetgardenatl.com",
    status: "complete",
    originalPageSpeed: 29,
    newPageSpeed: 94,
    accessibilityScore: 50,
    auditIssues: [
      "No dynamic menu listing; relies on a downloadable 8MB PDF menu card.",
      "Zero alt tags on culinary images impairing structural schema mappings.",
      "Slow Google Maps coordinate embed blocking execution stream."
    ],
    auditFixes: [
      "Convert raw PDF menu into beautiful, filterable menu grids built directly with Tailwind.",
      "Inject native map location scripts using cached coordinates.",
      "Add clean accessible tags to standard images."
    ],
    redesignPageUrl: "https://gourmetgarden.agentpreview.com",
    heyGenVideoUrl: "https://heygen.cdn.com/videos/gourmet_bistro_walkthrough.mp4",
    heyGenStatus: "ready",
    heyGenCost: 2.00,
    outreachChannel: "email",
    conversionStatus: "replied_interested",
    assignedTo: "Alex Rivera (Lead Rep)",
    comments: [
      {
        id: "g1",
        authorName: "Scout Agent",
        authorType: "agent",
        authorRole: "Lead Harvesting Node",
        text: "Bistro client captured in Atlanta. PageSpeed is 29.",
        timestamp: "2026-05-23T09:00:00Z"
      },
      {
        id: "g2",
        authorName: "Diagnoser Agent",
        authorType: "agent",
        authorRole: "Consulting Copywriting Node",
        text: "Audit compiled. Outlined severe client drop-off rate (estimated 40%) due to requiring PDF downloads on mobile devices.",
        timestamp: "2026-05-23T09:05:00Z"
      },
      {
        id: "g3",
        authorName: "Builder Agent",
        authorType: "agent",
        authorRole: "React Frontend Compiler Node",
        text: "React dynamic digital menu styled. Injected image grid with local responsive states.",
        timestamp: "2026-05-23T10:11:00Z"
      },
      {
        id: "g4",
        authorName: "Alex Rivera",
        authorType: "human",
        authorRole: "Client Representative",
        text: "Reviewing the digital menu. Unbelievably beautiful. Approving immediately to dispatch with Filmer walk.",
        timestamp: "2026-05-23T11:15:00Z"
      },
      {
        id: "g5",
        authorName: "Filmer Agent",
        authorType: "agent",
        authorRole: "Avatar Walkthrough Generation Node",
        text: "HeyGen Avatar walk generated. Length: 30s. Video URL rendered and bound.",
        timestamp: "2026-05-23T11:20:00Z"
      },
      {
        id: "g6",
        authorName: "Checker Agent",
        authorType: "agent",
        authorRole: "Automated QA & Visual Regression Node",
        text: "Automated QA checks completed. No accessibility issues detected. High contrast values verified. Ready for email dispatch.",
        timestamp: "2026-05-23T12:00:00Z"
      },
      {
        id: "g7",
        authorName: "Pitcher Agent",
        authorType: "agent",
        authorRole: "Cold Outreach Dispatcher",
        text: "Sent personalized package email details. Tracked mail opened. Lead has replied: 'We are blown away! Can we schedule a brief Zoom call?'",
        timestamp: "2026-05-23T14:40:00Z"
      }
    ],
    history: [
      { id: "gh1", stage: "Scouting", description: "Captured Gourmet Bistro", timestamp: "2026-05-23T09:00:00Z", actor: "Scout" },
      { id: "gh2", stage: "Diagnosis", description: "Audit completed with focus on restaurant menu conversion", timestamp: "2026-05-23T09:05:00Z", actor: "Diagnoser" },
      { id: "gh3", stage: "Building", description: "Coded filterable interactive dinner menu app", timestamp: "2026-05-23T10:11:00Z", actor: "Builder" },
      { id: "gh4", stage: "Filming", description: "Synthesized HeyGen video presenter walkthrough", timestamp: "2026-05-23T11:20:00Z", actor: "Filmer" },
      { id: "gh5", stage: "QA Check", description: "Passed automated schema and Contrast checks", timestamp: "2026-05-23T12:00:00Z", actor: "Checker" },
      { id: "gh6", stage: "Outreach", description: "Dispatched automated pitch email sequence", timestamp: "2026-05-23T14:40:00Z", actor: "Pitcher" }
    ]
  }
];

export const TEAM_MEMBERS: RemoteTeamMember[] = [
  { id: "t1", name: "Alex Rivera", type: "human", role: "Agency Director / Operator", status: "online", avatarColor: "bg-blue-600", lastActive: "Just now" },
  { id: "t2", name: "Sarah Jenkins", type: "human", role: "Head UI Designer", status: "busy", avatarColor: "bg-indigo-600", lastActive: "5m ago" },
  { id: "t3", name: "Scout Agent", type: "agent", role: "Local business scaper (Python)", status: "processing", avatarColor: "bg-emerald-600", lastActive: "Active now" },
  { id: "t4", name: "Diagnoser Agent", type: "agent", role: "Copywriter & Auditor (Claude)", status: "online", avatarColor: "bg-teal-600", lastActive: "Active now" },
  { id: "t5", name: "Builder Agent", type: "agent", role: "Vite + Tailwind compiler (LLM)", status: "online", avatarColor: "bg-amber-600", lastActive: "Active now" },
  { id: "t6", name: "Filmer Agent", type: "agent", role: "Walkthrough renderer (HeyGen)", status: "online", avatarColor: "bg-purple-600", lastActive: "Ready" },
  { id: "t7", name: "Pitcher Agent", type: "agent", role: "Meta Graph & Email Dispatch (API)", status: "online", avatarColor: "bg-pink-600", lastActive: "Ready" },
  { id: "t8", name: "Checker Agent", type: "agent", role: "QA & Visual self-correction (Playwright)", status: "online", avatarColor: "bg-cyan-600", lastActive: "Ready" }
];

export const RECENT_LOGS: AgentLog[] = [
  { id: "l-1", agentName: "Scout Agent", action: "Lead harvested in New York City niche 'Salon'", status: "success", timestamp: "19:54:12Z", details: "Found 12 candidate businesses with PageSpeed score < 50. Output written to local pipeline." },
  { id: "l-2", agentName: "Diagnoser Agent", action: "Calculated structural audit for Luxe Thread Salon", status: "success", timestamp: "19:55:00Z", details: "Generated consulting report. Extracted 3 critical friction points." },
  { id: "l-3", agentName: "Builder Agent", action: "Created React dynamic bookings modal", status: "info", timestamp: "19:55:40Z", details: "Injected local reservation states and cached coordinates for map widget." },
  { id: "l-4", agentName: "Checker Agent", action: "Executing mobile layout layout comparisons", status: "warning", timestamp: "19:56:10Z", details: "Detected layout displacement on screen sizes under 640px. Grid overlapping text." },
  { id: "l-5", agentName: "Checker Agent", action: "Executing self-correction loop visually", status: "success", timestamp: "19:56:55Z", details: "Dispatched patch layout to Builder: padding-bottom alignment and absolute overflow fix. New browser capture verified." },
  { id: "l-6", agentName: "Filmer Agent", action: "Suspended automatic video render for Luxe Salon", status: "info", timestamp: "19:57:15Z", details: "Pipeline paused by Operator Alex Jenkins. Manual validation gate is ACTIVE (Budget Safe Mode)." }
];

export const FINANCIAL_BREAKDOWN = {
  scraping: { title: "Lead Harvesting (Scout)", desc: "Proxy, gridding & contact extraction APIs", monthlyCost: 30.00, theoretical: 0 },
  diagnoser: { title: "Diagnostic Audits (Diagnoser)", desc: "Claude Sonnet text generation tokens", monthlyCost: 30.00, theoretical: 0 },
  builder: { title: "Frontend Mockups (Builder)", desc: "React file synchronization context tokens", monthlyCost: 250.00, theoretical: 0 },
  filming: { title: "Walkthrough Videos (Filmer)", desc: "HeyGen Avatar render (1080p high fidelity, $4/min)", monthlyCost: 2000.00, theoretical: 480.00 },
  host: { title: "Deployment Host (Serverless)", desc: "Vercel deployments, Supabase state database", monthlyCost: 50.00, theoretical: 0 },
};
export const TARGET_BUDGET = 480.00;
export const EMPIRICAL_BUDGET = 2360.00;
