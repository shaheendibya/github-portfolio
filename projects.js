// Shared content for portfolio cards and individual project pages.
// Add actual report/repository/demo links in resources and original images in gallery.
// Empty arrays produce no placeholder links or images.
'use strict';

window.portfolioProjects = [
  {
    "title": "EV Longitudinal Dynamics",
    "category": "simulation",
    "label": "EV SYSTEMS · FORMULA IUT",
    "art": "ev",
    "description": "Understanding how an electric vehicle moves, one model at a time.",
    "detail": "An EV longitudinal dynamics model developed in MATLAB/Simulink through Formula IUT’s electrical sub-team.",
    "contribution": "Developed the vehicle dynamics model and contributed to electric kart motor-controller analysis as a Sub-Executive on the simulation team.",
    "tags": [
      "MATLAB",
      "Simulink",
      "EV systems"
    ],
    "slug": "ev-longitudinal-dynamics",
    "role": "Sub-Executive · Simulation Team",
    "context": "Formula IUT · 2026–present",
    "overview": [
      "An electric-vehicle modeling project within Formula IUT’s electrical sub-team. The work combines longitudinal vehicle dynamics in MATLAB/Simulink with contributions to electric kart motor-controller analysis."
    ],
    "focus": [
      "EV longitudinal dynamics modeling",
      "MATLAB/Simulink simulation",
      "Electric kart motor-controller analysis"
    ],
    "highlights": [
      {
        "value": "Formula IUT",
        "label": "Electrical sub-team"
      },
      {
        "value": "2026–present",
        "label": "Simulation team experience"
      }
    ],
    "resources": [],
    "gallery": [],
    "evidence": [
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ]
  },
  {
    "title": "SAP-1 8-bit Computer",
    "category": "hardware",
    "label": "DIGITAL ELECTRONICS · 2026",
    "art": "computer",
    "description": "A computer architecture, extended with a multiplier and BCD conversion.",
    "detail": "An 8-bit SAP-1 computer architecture designed and simulated in Proteus for the Digital Electronics Lab.",
    "contribution": "Worked in a six-member team to design and simulate the system, extending the architecture with a 4-bit multiplier and binary-coded decimal conversion.",
    "tags": [
      "Proteus",
      "Computer architecture",
      "Digital electronics"
    ],
    "slug": "sap-1-computer",
    "role": "Six-member project team",
    "context": "Digital Electronics Lab · 2026",
    "overview": [
      "A digital electronics lab project to design and simulate a SAP-1 computer in Proteus. Working in a six-member team, we extended the 8-bit architecture with a 4-bit multiplier and binary-coded decimal conversion."
    ],
    "focus": [
      "8-bit SAP-1 computer architecture",
      "4-bit multiplier extension",
      "Binary-coded decimal (BCD) conversion",
      "Design and simulation in Proteus"
    ],
    "highlights": [
      {
        "value": "8-bit",
        "label": "Computer architecture"
      },
      {
        "value": "4-bit",
        "label": "Multiplier extension"
      },
      {
        "value": "6 members",
        "label": "Project team"
      }
    ],
    "resources": [],
    "gallery": [],
    "evidence": [
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ]
  },
  {
    "title": "Stock Market Crash Simulator",
    "category": "simulation",
    "label": "COMPUTATIONAL MODELING",
    "art": "market",
    "description": "An interactive MATLAB dashboard for simulated market regimes and crash detection.",
    "detail": "A MATLAB dashboard combining a three-state Markov chain, Geometric Brownian Motion, and rolling-window crash alerts, co-developed for an EEE 4408 group project.",
    "contribution": "Co-developed the MATLAB simulator with Ishrak Samin, combining Markov chains, Geometric Brownian Motion, and crash-detection logic in an interactive dashboard.",
    "tags": [
      "MATLAB",
      "Markov chains",
      "Stochastic modeling"
    ],
    "slug": "stock-market-crash-simulator",
    "role": "Co-developer · Two-person project team",
    "context": "IUT · EEE 4408 group project",
    "overview": [
      "An interactive MATLAB dashboard that simulates bull, bear, and crash regimes. A three-state Markov chain governs regime changes, Geometric Brownian Motion generates price paths, and rolling-window checks flag potential crashes in simulated data.",
      "Developed with Ishrak Samin for an EEE 4408 group project at the Islamic University of Technology. The application includes live parameter controls, simulation history, and CSV/Excel export."
    ],
    "focus": [
      "Three-state Markov chain: Bull, Bear, and Crash",
      "Geometric Brownian Motion price simulation",
      "Rolling variance, drawdown, and simulated-regime crash alerts",
      "Interactive MATLAB dashboard and parameter presets",
      "Simulation history and CSV/Excel export"
    ],
    "highlights": [
      {
        "value": "3 regimes",
        "label": "Bull, Bear & Crash"
      },
      {
        "value": "2-person team",
        "label": "EEE 4408 group project"
      },
      {
        "value": "13-page report",
        "label": "Theory, implementation & discussion"
      }
    ],
    "resources": [
      {
        "label": "Read the project report",
        "kind": "report",
        "url": "assets/projects/stock-market-crash-simulator/project-report.pdf",
        "description": "Original 13-page report, including the model, dashboard, and discussion."
      },
      {
        "label": "View the MATLAB source",
        "kind": "code",
        "url": "https://github.com/shaheendibya/Stock-Market-Crash-Simulator/blob/main/Market_Crash_Dashboard.m",
        "description": "Open the app source file on GitHub."
      },
      {
        "label": "View the GitHub repository",
        "kind": "code",
        "url": "https://github.com/shaheendibya/Stock-Market-Crash-Simulator",
        "description": "Browse the project files and README."
      }
    ],
    "gallery": [
      {
        "src": "assets/projects/stock-market-crash-simulator/dashboard.webp",
        "alt": "MATLAB dashboard showing a simulated price path and crash flags",
        "caption": "Dashboard with simulated price path and crash flags. Original project report, page 6."
      },
      {
        "src": "assets/projects/stock-market-crash-simulator/history.webp",
        "alt": "MATLAB simulation history log and inspector",
        "caption": "Simulation history log and inspector. Original project report, page 6."
      },
      {
        "src": "assets/projects/stock-market-crash-simulator/settings.webp",
        "alt": "MATLAB model configuration with parameters and presets",
        "caption": "Interactive model parameters and presets. Original project report, page 7."
      }
    ],
    "evidence": [
      {
        "label": "Read the original project report",
        "url": "assets/projects/stock-market-crash-simulator/project-report.pdf"
      },
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ],
    "cover": {
      "src": "assets/projects/stock-market-crash-simulator/dashboard.webp",
      "alt": "The MATLAB stock market simulator dashboard from the project report"
    }
  },
  {
    "title": "Residential Electrical Services",
    "category": "design",
    "label": "ELECTRICAL DESIGN",
    "art": "building",
    "description": "Designing the electrical services of a four-storied residential building.",
    "detail": "An AutoCAD electrical services design covering the electrical requirements of a four-storied residential building.",
    "contribution": "Designed the electrical services, including load calculations, distribution, wiring, and protection.",
    "tags": [
      "AutoCAD",
      "Load calculations",
      "Electrical protection"
    ],
    "slug": "residential-electrical-services",
    "role": "Electrical services design",
    "context": "Residential building · AutoCAD",
    "overview": [
      "An electrical services design for a four-storied residential building. The work covers load calculations, distribution, wiring, and protection, with the design developed in AutoCAD."
    ],
    "focus": [
      "Electrical load calculations",
      "Power distribution",
      "Wiring design",
      "Electrical protection"
    ],
    "highlights": [
      {
        "value": "4 stories",
        "label": "Residential building"
      },
      {
        "value": "AutoCAD",
        "label": "Electrical design toolkit"
      }
    ],
    "resources": [],
    "gallery": [],
    "evidence": [
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ]
  },
  {
    "title": "RC Racing & Soccerbot",
    "category": "hardware",
    "label": "ARDUINO ROBOTICS · TEAM PROJECTS",
    "art": "robotics",
    "description": "From the workbench to the competition floor. Three championship wins, built together.",
    "detail": "Collaborative Arduino robotics projects across RC racing and Soccerbot competitions.",
    "contribution": "Contributed to chassis design, wiring, soldering, and troubleshooting. The teams won Soccerbot at Intra IUT EEE Day 2025 and RC Racing at ACCELERATE 2025 and Techathon 2025.",
    "tags": [
      "Arduino",
      "Robotics",
      "Team engineering"
    ],
    "slug": "rc-racing-soccerbot",
    "role": "Robotics team contributor",
    "context": "Arduino robotics · 2025",
    "overview": [
      "Collaborative robotics work spanning RC racing and Soccerbot competitions. My contributions included chassis design, wiring, soldering, and troubleshooting.",
      "The teams won Soccerbot at Intra IUT EEE Day 2025 and RC Racing at ACCELERATE 2025 and Techathon 2.0. The achievement archive includes the supporting RC competition certificates and the Soccerbot result recorded in my CV."
    ],
    "focus": [
      "Chassis design",
      "Wiring and soldering",
      "Troubleshooting",
      "Collaborative competition builds"
    ],
    "highlights": [
      {
        "value": "3 wins",
        "label": "Competition championships"
      },
      {
        "value": "2025",
        "label": "Soccerbot & two RC racing events"
      }
    ],
    "resources": [],
    "gallery": [],
    "evidence": [
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      },
      {
        "label": "Explore robotics competition results",
        "url": "archive.html?category=engineering&year=2025"
      }
    ]
  }
];

// Concept illustrations, not photographs or measured project outputs.
window.portfolioProjectIllustrations = {
  "ev": "<path d=\"M98 174h278l-21-57c-4-12-15-20-28-20H186l-48 44-40 13z\"/><path d=\"m176 103-36 39h187l-15-39M239 104v38\"/><circle cx=\"158\" cy=\"176\" r=\"25\"/><circle cx=\"324\" cy=\"176\" r=\"25\"/><circle cx=\"158\" cy=\"176\" r=\"9\"/><circle cx=\"324\" cy=\"176\" r=\"9\"/><path d=\"M74 220h342M392 147h48m-10-9 10 9-10 9M70 145H34m9-9-9 9 9 9\"/><text x=\"52\" y=\"64\">F = m · a</text><text x=\"368\" y=\"64\">EV</text><path d=\"m218 160 13-13-3 12h14l-15 15 4-14z\"/>",
  "computer": "<rect x=\"167\" y=\"70\" width=\"146\" height=\"140\" rx=\"5\"/><rect x=\"190\" y=\"94\" width=\"100\" height=\"91\" rx=\"2\"/><path d=\"M183 70V47m28 23V47m29 23V47m29 23V47m28 23V47M183 210v23m28-23v23m29-23v23m29-23v23m28-23v23M167 87h-25m25 27h-25m25 27h-25m25 27h-25m25 27h-25m171-108h25m-25 27h25m-25 27h25m-25 27h25m-25 27h25\"/><text x=\"208\" y=\"134\">SAP-1</text><text x=\"216\" y=\"163\">8 BIT</text><path d=\"M82 93h35v48h25m196 0h34v47h31M82 188h33v-20h27\"/><circle cx=\"77\" cy=\"93\" r=\"5\"/><circle cx=\"408\" cy=\"188\" r=\"5\"/>",
  "market": "<path d=\"M69 55v171h345M75 187l24-10 17 15 21-31 24 8 20-39 19 19 20-15 21 27 17-51 17 18 20-27 22 38 23-14 21 45 19-12 18 38\"/><path d=\"M75 154l24-11 17 10 21-18 24 4 20-19 19 15 20-10 21 11 17-28 17 11 20-14 22 21 23-9 21 20 19-8 18 12\" stroke-dasharray=\"5 6\" opacity=\".45\"/><path d=\"M69 100h345M69 160h345\" opacity=\".2\"/><text x=\"326\" y=\"69\">P(t)</text><text x=\"60\" y=\"247\">0</text><text x=\"405\" y=\"247\">t</text>",
  "building": "<path d=\"M151 225V58h171v167M139 225h195M136 58h202M180 225v-32h34v32m37-32h36v32\"/><path d=\"M174 83h42v30h-42zm77 0h42v30h-42zm-77 54h42v30h-42zm77 0h42v30h-42z\"/><path d=\"M115 58v167m-8-161 8-6 8 6m-16 155 8 6 8-6M351 85v85m-7-77 7-8 7 8\"/><path d=\"m364 196 12-19-1 15h13l-16 23 3-19z\"/><path d=\"M91 225h31M91 58h31\"/><text x=\"41\" y=\"151\">4F</text>",
  "robotics": "<rect x=\"168\" y=\"97\" width=\"143\" height=\"91\" rx=\"15\"/><rect x=\"152\" y=\"108\" width=\"16\" height=\"29\" rx=\"4\"/><rect x=\"152\" y=\"153\" width=\"16\" height=\"29\" rx=\"4\"/><rect x=\"311\" y=\"108\" width=\"16\" height=\"29\" rx=\"4\"/><rect x=\"311\" y=\"153\" width=\"16\" height=\"29\" rx=\"4\"/><rect x=\"198\" y=\"114\" width=\"83\" height=\"58\" rx=\"4\"/><circle cx=\"214\" cy=\"130\" r=\"6\"/><circle cx=\"264\" cy=\"130\" r=\"6\"/><path d=\"M219 153h41m-20-56V70m-19 0h38M113 103l-15-15M106 145H85m28 41-15 15m266-98 15-15m-8 57h21m-28 41 15 15\"/><path d=\"M74 230h338\" stroke-dasharray=\"9 7\"/><text x=\"68\" y=\"56\">BUILD. TEST. RACE.</text>"
};
