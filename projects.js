// Shared content for portfolio cards and individual project pages.
// Add actual report/repository/demo links in resources and original images in gallery.
// Empty arrays produce no placeholder links or images.
'use strict';

window.portfolioProjects = [
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
        "kind": "repository",
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
    },
    "credits": [
      "Shaheen Rahman Dibya",
      "Ishrak Samin"
    ],
    "launch": {
      "label": "Run the dashboard in MATLAB",
      "command": "Market_Crash_Dashboard",
      "instructions": "Download or clone the repository, then open MATLAB and set the Current Folder to the directory containing Market_Crash_Dashboard.m. Enter the command below in the MATLAB Command Window.",
      "requirements": "MATLAB desktop with graphics and UI support. The app runs in MATLAB."
    },
    "featured": true
  },
  {
    "title": "SAP-1 8-bit Computer",
    "category": "hardware",
    "label": "DIGITAL ELECTRONICS · PROTEUS",
    "art": "computer",
    "slug": "sap-1-computer",
    "description": "An 8-bit computer simulated in Proteus, extended with multiplication and decimal output.",
    "detail": "A team-designed SAP-1 architecture with a shared 8-bit bus, 16-byte RAM, an add/subtract ALU, a 4-bit multiplier, and Double Dabble BCD conversion, documented and simulated in Proteus.",
    "role": "Team member · Silicon 6",
    "context": "IUT · EEE 4308 Digital Electronics Lab",
    "contribution": "Worked in a six-member team to design and simulate the SAP-1 system in Proteus, including the 4-bit multiplier extension and BCD decimal output. The submitted report documents the team’s integrated architecture and module circuits.",
    "overview": [
      "Developed by Team Silicon 6 for the Digital Electronics Lab at the Islamic University of Technology. The Proteus design connects the program counter, registers, 16-byte RAM, instruction register, ALU, controller, multiplier, and output unit through a common 8-bit bus.",
      "The architecture combines manual and automatic clocking with add/subtract operations. A 4-bit multiplier produces an 8-bit result, while a Shift-and-Add-3 (Double Dabble) converter makes binary output readable as decimal digits. The output circuit also includes magnitude conversion and a minus-sign display for negative subtraction results."
    ],
    "focus": [
      "Common 8-bit data bus and tri-state module control",
      "16-byte memory with manual programming and execution modes",
      "ALU addition and two’s-complement subtraction",
      "4-bit multiplication with an 8-bit result",
      "Double Dabble binary-to-BCD conversion and decimal display",
      "Manual/automatic clocking and controller sequencing"
    ],
    "highlights": [
      {
        "value": "8-bit",
        "label": "Shared data bus"
      },
      {
        "value": "16 bytes",
        "label": "RAM address space"
      },
      {
        "value": "4-bit × 4-bit",
        "label": "8-bit multiplication result"
      },
      {
        "value": "6 members",
        "label": "Team Silicon 6"
      }
    ],
    "tags": [
      "Proteus",
      "SAP-1 architecture",
      "Digital electronics",
      "BCD conversion"
    ],
    "resources": [
      {
        "label": "Read the project report",
        "kind": "report",
        "url": "assets/projects/sap-1-computer/project-report.pdf",
        "description": "Original 24-page team report with architecture, module circuits, and output logic."
      },
      {
        "label": "Download the Proteus project",
        "kind": "files",
        "url": "assets/projects/sap-1-computer/proteus-project.pdsprj",
        "description": "Original native Proteus project file. Open with Proteus to inspect the circuit."
      },
      {
        "label": "View the GitHub repository",
        "kind": "repository",
        "url": "https://github.com/shaheendibya/SAP-1-Architecture-based-8-bit-Computer-Design-and-Implementation-",
        "description": "Browse the source project, report, and other repository files."
      }
    ],
    "gallery": [
      {
        "src": "assets/projects/sap-1-computer/bus-integration.webp",
        "alt": "Integrated 8-bit SAP-1 computer schematic in Proteus, showing the common bus and output displays",
        "caption": "Integrated system and 8-bit bus connections. Original project report, page 18."
      },
      {
        "src": "assets/projects/sap-1-computer/alu.webp",
        "alt": "SAP-1 ALU schematic with XOR gates, cascaded 4008 adders and a tri-state buffer",
        "caption": "ALU add/subtract circuit with two 4-bit adders and XOR subtraction control. Original project report, page 12."
      },
      {
        "src": "assets/projects/sap-1-computer/multiplier.webp",
        "alt": "Internal 4-bit multiplier schematic excerpt with partial-product gates and adders",
        "caption": "Internal circuit detail of the 4-bit multiplier, producing an 8-bit result. Original project report, page 17."
      },
      {
        "src": "assets/projects/sap-1-computer/bcd-converter.webp",
        "alt": "Cascaded META correction blocks used for binary-to-BCD conversion",
        "caption": "Cascaded correction blocks for Shift-and-Add-3 (Double Dabble) BCD conversion. Original project report, page 20."
      }
    ],
    "cover": {
      "src": "assets/projects/sap-1-computer/bus-integration.webp",
      "alt": "Integrated 8-bit SAP-1 computer schematic in Proteus, showing the common bus and output displays"
    },
    "evidence": [
      {
        "label": "Read the original team report",
        "url": "assets/projects/sap-1-computer/project-report.pdf"
      },
      {
        "label": "Read the project summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ],
    "credits": [
      "Ishrak Samin",
      "Nafis Shahriar Ahmed",
      "Shaheen Rahman Dibya",
      "Mutassim Al Shahriar Zeem",
      "Raian Ratul",
      "Shaker Abdullah"
    ],
    "featured": true,
    "launch": {
      "label": "Open the circuit in Proteus",
      "instructions": "Download the Proteus project from the files section and open the .pdsprj file in Proteus. Use the report to follow the bus connections, controller, arithmetic modules, and decimal-output logic.",
      "requirements": "Proteus is required to inspect and simulate the native project."
    }
  },
  {
    "title": "Residential Electrical Services",
    "category": "design",
    "label": "ELECTRICAL DESIGN · AUTOCAD",
    "art": "building",
    "slug": "residential-electrical-services",
    "description": "An AutoCAD electrical-layout study for eight homes, connecting floor plans and fixture placement to normal and emergency distribution diagrams.",
    "detail": "Electrical layout design of a four-storied residential building",
    "role": "Team member · Group 4(C1)",
    "context": "EEE 4418 · Department of Electrical and Electronic Engineering, Islamic University of Technology",
    "contribution": "Completed with Ahnaf Kaiser, Ishrak Samin, and Nasif Faiyaz as Group 4(C1). The shared deliverables document architectural plans, electrical fixtures and wiring, load schedules, distribution diagrams, cable and conduit selection, communication networks, and lightning protection.",
    "overview": [
      "This course project develops an AutoCAD-based electrical-layout study for four residential floors with two mirrored units on each floor. A separate ground level accommodates parking and building services, while the rooftop includes the stair head and water-tank area.",
      "The drawings progress from the building and unit plans to lighting, fans, sockets, switchboards, and circuit routing. Normal and generator-backed emergency networks are documented through branch-board and building-wide single-line diagrams.",
      "The report and presentation also include load schedules, cable and conduit selections, telephone/TV/data layouts, and lightning-protection drawings. The original PDFs and editable DWG are provided alongside authentic drawing extracts."
    ],
    "focus": [
      "Typical-floor and representative-unit planning",
      "Fixture placement and normal/emergency wiring routes",
      "Branch-board and main-board distribution diagrams",
      "Load schedules, conductor selection, and auxiliary networks"
    ],
    "highlights": [
      {
        "value": "4",
        "label": "Residential floors"
      },
      {
        "value": "8",
        "label": "Residential units"
      },
      {
        "value": "AutoCAD",
        "label": "Editable source drawing"
      }
    ],
    "tags": [
      "AutoCAD",
      "Electrical layouts",
      "Load schedules"
    ],
    "resources": [
      {
        "label": "Project report",
        "kind": "report",
        "url": "assets/projects/residential-electrical-services/project-report.pdf",
        "description": "31-page group report covering the building plans, electrical layouts, schedules, and distribution systems."
      },
      {
        "label": "Project presentation",
        "kind": "presentation",
        "url": "assets/projects/residential-electrical-services/presentation.pdf",
        "description": "33-slide PDF with architectural, fixture, wiring, and distribution drawings."
      },
      {
        "label": "AutoCAD drawing",
        "kind": "files",
        "url": "assets/projects/residential-electrical-services/electrical-layout.dwg",
        "description": "Original DWG source from the project repository; download for a compatible CAD application."
      },
      {
        "label": "GitHub repository",
        "kind": "repository",
        "url": "https://github.com/shaheendibya/Electrical-Layout-Design-of-A-Four-Storied-Residential-Building-",
        "description": "Source repository containing the group report, presentation, and original AutoCAD drawing."
      }
    ],
    "gallery": [
      {
        "src": "assets/projects/residential-electrical-services/typical-floor-plan.webp",
        "alt": "AutoCAD floor plan showing two mirrored residential units around a shared central lobby and staircase.",
        "caption": "Typical residential floor with two mirrored units — project report, page 4, Figure 1."
      },
      {
        "src": "assets/projects/residential-electrical-services/fixture-layout.webp",
        "alt": "AutoCAD typical-floor electrical fixture plan with lighting points, fans, sockets, and switchboards.",
        "caption": "Typical-floor fixture layout — project report, page 8, Figure 5."
      },
      {
        "src": "assets/projects/residential-electrical-services/wiring-layout.webp",
        "alt": "AutoCAD residential-floor wiring plan using red routes for normal supply and cyan routes for emergency supply.",
        "caption": "Typical-floor normal and emergency wiring routes — project presentation, slide 9."
      },
      {
        "src": "assets/projects/residential-electrical-services/main-distribution-diagram.webp",
        "alt": "AutoCAD main distribution board single-line diagram showing the three-phase bus and outgoing branch connections.",
        "caption": "Building main distribution board single-line diagram — project report, page 25, Figure 17."
      }
    ],
    "cover": {
      "src": "assets/projects/residential-electrical-services/typical-floor-plan.webp",
      "alt": "Original AutoCAD plan of two mirrored homes around a central lobby and staircase."
    },
    "evidence": [
      {
        "label": "Team credit and course",
        "url": "assets/projects/residential-electrical-services/project-report.pdf#page=1"
      },
      {
        "label": "Building scope and distribution overview",
        "url": "assets/projects/residential-electrical-services/project-report.pdf#page=3"
      },
      {
        "label": "Original wiring-layout slide",
        "url": "assets/projects/residential-electrical-services/presentation.pdf#page=9"
      }
    ],
    "credits": [
      "Ahnaf Kaiser",
      "Ishrak Samin",
      "Nasif Faiyaz",
      "Shaheen Rahman Dibya"
    ],
    "featured": true,
    "launch": {
      "label": "Open the editable CAD drawing",
      "instructions": "Download the AutoCAD drawing from the files section and open the .dwg file in AutoCAD or a compatible CAD viewer. The report and slide presentation provide browser-readable plans and distribution diagrams.",
      "requirements": "AutoCAD or a DWG-compatible viewer is required for the editable drawing."
    }
  },
  {
    "title": "Golf Streak",
    "category": "software",
    "label": "MATLAB GUI · EEE 4416",
    "art": "golf",
    "slug": "golf-streak",
    "description": "A MATLAB mini-golf game with 10 procedural levels, custom physics, and two ways to line up a shot.",
    "detail": "An individual EEE 4416 mini-project combining a 2D mini-golf GUI, procedural course generation, trajectory previews, and custom ball physics in MATLAB.",
    "role": "Individual developer",
    "context": "IUT · EEE 4416 · September 2026",
    "contribution": "Designed and implemented the MATLAB GUI, game-state callbacks, procedural level generator, ball-motion and wall-collision logic, dual shot controls, trajectory preview, and particle effects as an individual EEE 4416 mini-project.",
    "overview": [
      "Golf Streak is a 2D mini-golf game built with standard MATLAB figure, axes, and UI controls. Its 10-level campaign generates new course layouts with bounce walls, interior obstacles, sand traps, and water hazards.",
      "The game connects custom ball-motion calculations with an interactive control dashboard. Players can aim and set power through sliders or drag directly from the ball, preview a possible wall bounce, select a club, and follow their strokes and remaining spare-shot budget."
    ],
    "focus": [
      "Procedural course generation across a 10-level campaign",
      "Velocity-based ball motion, surface-dependent friction, and wall-vector reflection",
      "Slider and mouse-drag controls connected to shared game-state callbacks",
      "Raycast trajectory preview with one predicted wall bounce",
      "Checkpoint recovery, club selection, and particle feedback",
      "Custom graphics using MATLAB figure, axes, uicontrol, and drawing primitives"
    ],
    "highlights": [
      {
        "value": "10 levels",
        "label": "Procedurally generated campaign"
      },
      {
        "value": "2 control modes",
        "label": "Aim/power sliders and mouse dragging"
      },
      {
        "value": "Individual project",
        "label": "EEE 4416 · Islamic University of Technology"
      }
    ],
    "tags": [
      "MATLAB",
      "Game physics",
      "Procedural generation"
    ],
    "resources": [
      {
        "label": "Read the project report",
        "kind": "report",
        "url": "assets/projects/golf-streak/project-report.pdf",
        "description": "Original 12-page report covering the GUI, physics, procedural generation, and gameplay demonstration."
      },
      {
        "label": "View the MATLAB source",
        "kind": "code",
        "url": "https://github.com/shaheendibya/MATLAB-GUI-Mini-Project-Golf-Streak/blob/abbe65a653f37053597b56f10160670b06d06c8a/golf_streak_procedural.m",
        "description": "Read the single-file game implementation and nested callbacks on GitHub."
      },
      {
        "label": "View the GitHub repository",
        "kind": "repository",
        "url": "https://github.com/shaheendibya/MATLAB-GUI-Mini-Project-Golf-Streak",
        "description": "Browse the project source and README."
      }
    ],
    "gallery": [
      {
        "src": "assets/projects/golf-streak/opening.webp",
        "alt": "Golf Streak opening Sector 1 layout with a ball, hole, trajectory preview, and challenge dashboard",
        "caption": "Figure 5. Opening view of Sector 1: dashboard on the right, ball and hole visible, trajectory-preview line showing before the first shot. Original project report, page 8."
      },
      {
        "src": "assets/projects/golf-streak/sand-trap.webp",
        "alt": "Golf Streak Sector 2 with the ball in a sand bunker and the dashboard reading Surface: Sand Trap!",
        "caption": "Figure 7. The dashboard’s surface indicator reading “Sand Trap!” while the ball sits in a bunker. Original project report, page 9."
      },
      {
        "src": "assets/projects/golf-streak/hole-in-one.webp",
        "alt": "Golf Streak displaying WOWW!! and HOLE IN ONE! after completing Sector 3 in one stroke",
        "caption": "Figure 8. The “HOLE IN ONE!” celebration text after sinking a hole on the first stroke. Original project report, page 10."
      },
      {
        "src": "assets/projects/golf-streak/victory.webp",
        "alt": "Golf Streak end-of-campaign screen showing VICTORY! at Sector 10 with the challenge dashboard",
        "caption": "Figure 10. The end-of-campaign VICTORY or GAME OVER screen. Original project report, page 11."
      }
    ],
    "cover": {
      "src": "assets/projects/golf-streak/opening.webp",
      "alt": "Golf Streak opening gameplay view with its course, trajectory preview, and challenge dashboard"
    },
    "evidence": [
      {
        "label": "Read the original project report",
        "url": "assets/projects/golf-streak/project-report.pdf"
      },
      {
        "label": "View the source implementation",
        "url": "https://github.com/shaheendibya/MATLAB-GUI-Mini-Project-Golf-Streak/blob/abbe65a653f37053597b56f10160670b06d06c8a/golf_streak_procedural.m"
      }
    ],
    "credits": [
      "Shaheen Rahman Dibya"
    ],
    "launch": {
      "label": "Run Golf Streak in MATLAB",
      "command": "golf_streak_procedural",
      "instructions": "Download or clone the repository, open MATLAB, and set the Current Folder to the directory containing golf_streak_procedural.m. Enter the command below in the MATLAB Command Window.",
      "requirements": "MATLAB desktop with standard graphics and UI controls."
    },
    "featured": true
  },
  {
    "title": "EV, PHEV & HEV Literature Review",
    "category": "research",
    "label": "LITERATURE REVIEW · MCE 4391",
    "art": "research",
    "slug": "ev-literature-review",
    "description": "A team review of electrified transport, with my focus on battery and energy storage systems.",
    "detail": "A faculty-supervised MCE 4391 course literature review of EV, PHEV, and HEV technologies, spanning vehicle powertrains, batteries, charging, grid interaction, sustainability, economics, and policy.",
    "role": "Co-author · Battery & Energy Storage Systems",
    "context": "IUT · MCE 4391 Basic Mechanical Engineering",
    "contribution": "Contributed the Battery & Energy Storage Systems section as part of an 11-member course review team. This section examines lithium-ion cell and pack design, battery-management functions, thermal management, fast-charging constraints, aging, recycling, and emerging storage technologies.",
    "overview": [
      "A Comprehensive Review of Electric Vehicles (EVs), Plug-in Hybrid Electric Vehicles (PHEVs), and Hybrid Electric Vehicles (HEVs) was prepared by an 11-member EEE team for MCE 4391: Basic Mechanical Engineering at the Islamic University of Technology.",
      "The review connects vehicle classification and powertrain architectures with batteries, electric motors, power electronics, charging infrastructure, grid interaction, efficiency, environmental impact, economics, and policy. My assigned contribution is the Battery & Energy Storage Systems section.",
      "The course review received the highest team mark, 14/15, as recorded in my CV. Explore the 112-page browser reading copy or download the original DOCX."
    ],
    "focus": [
      "Lithium-ion battery fundamentals and cell–module–pack integration",
      "Energy density, power capability, safety, lifetime, and cost trade-offs",
      "LFP, NMC/NCA, LTO, solid-state, and sodium-based storage technologies",
      "Battery management: SOC, SOH, SOP, balancing, and diagnostics",
      "Thermal management, fast charging, degradation, and recycling",
      "Literature synthesis within a broader EV, PHEV, and HEV systems review"
    ],
    "highlights": [
      {
        "value": "14/15",
        "label": "Highest team mark · recorded in CV"
      },
      {
        "value": "11 members",
        "label": "Collaborative course review team"
      },
      {
        "value": "112 pages",
        "label": "Browser reading copy of the source DOCX"
      }
    ],
    "tags": [
      "Literature review",
      "Battery systems",
      "BMS"
    ],
    "resources": [
      {
        "label": "Read the literature review",
        "kind": "report",
        "url": "assets/projects/ev-literature-review/literature-review.pdf",
        "description": "112-page browser reading copy, converted from the course review’s original DOCX. Original document also available."
      },
      {
        "label": "Download the original DOCX",
        "kind": "files",
        "url": "assets/projects/ev-literature-review/literature-review.docx",
        "description": "Original repository document, preserved byte for byte."
      },
      {
        "label": "View the GitHub repository",
        "kind": "repository",
        "url": "https://github.com/shaheendibya/MCE-4391-Review-Paper-Assignment",
        "description": "Browse the source document and project README on GitHub."
      }
    ],
    "gallery": [
      {
        "src": "assets/projects/ev-literature-review/battery-architecture.webp",
        "alt": "Review-paper diagram showing cells, modules, a battery pack, BMS, thermal controls, contactors, and vehicle interface",
        "caption": "Battery-section Figure 2: cell–module–pack architecture and supporting systems. Page 21 of the browser reading copy generated from the original DOCX."
      },
      {
        "src": "assets/projects/ev-literature-review/lithium-ion-cell.webp",
        "alt": "Review-paper schematic of a lithium-ion cell showing electrodes, separator, electron circuit, and lithium-ion transport",
        "caption": "Battery-section Figure 1: lithium-ion cell schematic. Page 20 of the browser reading copy generated from the original DOCX."
      },
      {
        "src": "assets/projects/ev-literature-review/battery-chemistry-comparison.webp",
        "alt": "Review-paper table comparing battery chemistries and storage alternatives by strengths, limitations, fast charging, and safety",
        "caption": "Battery-section Table I: traction-battery chemistries and emerging alternatives. Page 23 of the browser reading copy generated from the original DOCX."
      }
    ],
    "cover": {
      "src": "assets/projects/ev-literature-review/battery-architecture.webp",
      "alt": "Cell–module–pack battery-system diagram from the course literature review, browser reading copy page 21"
    },
    "evidence": [
      {
        "label": "Battery and energy storage section · browser PDF, page 19",
        "url": "assets/projects/ev-literature-review/literature-review.pdf#page=19"
      },
      {
        "label": "Team and section assignments · browser PDF, page 1",
        "url": "assets/projects/ev-literature-review/literature-review.pdf#page=1"
      },
      {
        "label": "Course result and research summary in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ],
    "credits": [
      "Md. Azmain Hasan",
      "Ishrak Samin",
      "Taqi Yasir",
      "Shaheen Rahman Dibya",
      "Nasif Faiyaz",
      "Samia Jahan Tisha",
      "Nafisa Naimun",
      "Sadia Afrin",
      "Atib Zawad Wasi",
      "Tall Ali Boureima",
      "Rifat Rahman Nirjhor"
    ],
    "featured": true
  },
  {
    "title": "Soccerbot — EEE Day Champion",
    "category": "hardware",
    "label": "ARDUINO ROBOTICS · SOCCERBOT",
    "art": "robotics",
    "slug": "soccerbot",
    "description": "A team-built Arduino Soccerbot and its championship at Intra IUT EEE Day 2025.",
    "detail": "Soccerbot hardware, supplied components, and original photographs from the Intra IUT EEE Day 2025 championship.",
    "role": "Team contributor · Chassis, wiring & troubleshooting",
    "context": "Intra IUT EEE Day 2025 · Soccerbot",
    "contribution": "Contributed to chassis design, wiring, soldering, and troubleshooting as part of the Soccerbot team.",
    "overview": [
      "A collaborative Soccerbot build developed for competition at IUT. The team won the Soccerbot championship at Intra IUT EEE Day 2025.",
      "The supplied hardware list uses an Arduino Uno, four 25 mm DC motors, 65 mm wheels, L298N motor drivers, buck converters, Bluetooth modules, and 3.7 V cells. The photos below document the award and event."
    ],
    "focus": [
      "Chassis construction and motor mounting",
      "Wiring, soldering, and electrical connections",
      "Power-conversion and motor-driver hardware",
      "Mechanical integration and competition troubleshooting"
    ],
    "tags": [
      "Arduino Uno",
      "Soccerbot",
      "Hardware integration"
    ],
    "highlights": [
      {
        "value": "Champion",
        "label": "Intra IUT EEE Day 2025 · Soccerbot"
      },
      {
        "value": "4 motors",
        "label": "25 mm DC · 500/600 RPM"
      },
      {
        "value": "65 mm",
        "label": "Wheel diameter · four wheels"
      }
    ],
    "cover": {
      "src": "assets/events/eee-day-2025/winner-portrait.webp",
      "alt": "Shaheen holding an award in front of the EEE Day backdrop"
    },
    "gallery": [
      {
        "src": "assets/events/eee-day-2025/winner-portrait.webp",
        "alt": "Shaheen holding an award in front of the EEE Day backdrop",
        "caption": "Shaheen with the award at the EEE Day display."
      },
      {
        "src": "assets/events/eee-day-2025/champion-trophy.webp",
        "alt": "EEE Day 2025 memento engraved Soccer Bot Champion",
        "caption": "The memento reads “Soccer Bot Champion” at EEE Day 2025."
      },
      {
        "src": "assets/events/eee-day-2025/ceremony.webp",
        "alt": "EEE Day 2025 prize-giving ceremony with participants and organizers",
        "caption": "The prize-giving ceremony beneath the EEE Day 2025 banner."
      },
      {
        "src": "assets/events/eee-day-2025/championship-collage.webp",
        "alt": "EEE Day Soccerbot championship collage with award portrait, robot, champion trophy and prize-giving ceremony",
        "caption": "EEE Day Soccerbot championship: award portrait, robot, champion trophy, and prize-giving ceremony in the original collage."
      }
    ],
    "resources": [
      {
        "label": "View the Soccerbot championship record",
        "kind": "achievement",
        "url": "archive.html?search=Soccerbot",
        "description": "The result is recorded in the CV and supported by the original event and trophy photographs."
      }
    ],
    "evidence": [
      {
        "label": "Soccerbot result and robotics contribution in my CV",
        "url": "assets/documents/cv.pdf#page=1"
      }
    ],
    "credits": [],
    "components": [
      {
        "name": "Arduino Uno",
        "details": "Microcontroller board"
      },
      {
        "name": "25 mm DC motors",
        "details": "4 motors · 500/600 RPM"
      },
      {
        "name": "65 mm wheels",
        "details": "4 wheels"
      },
      {
        "name": "L298N motor drivers",
        "details": "3 modules"
      },
      {
        "name": "Buck converters",
        "details": "2 modules"
      },
      {
        "name": "3.7 V batteries",
        "details": "3 cells · 3.7 V each"
      },
      {
        "name": "Bluetooth modules",
        "details": "2 modules"
      },
      {
        "name": "Battery holder and charger",
        "details": "Power accessories"
      },
      {
        "name": "Motor mounts and hex couplers",
        "details": "Mechanical mounting and shaft coupling"
      },
      {
        "name": "Jumper wires",
        "details": "Male-to-female and male-to-male"
      },
      {
        "name": "Regular wire",
        "details": "Wiring material"
      },
      {
        "name": "Heat shrink",
        "details": "Connection insulation"
      },
      {
        "name": "Scotch tape",
        "details": "Assembly material"
      },
      {
        "name": "Screws and bolts",
        "details": "Mechanical fasteners"
      },
      {
        "name": "PVC board",
        "details": "Chassis material"
      }
    ],
    "tools": [
      "Soldering iron",
      "Soldering lead and rosin flux (rojon)",
      "Voltmeter",
      "Screwdriver set",
      "Glue gun (optional)"
    ],
    "buildNote": "Source code is not available; this page documents the hardware, supplied component list, and competition record.",
    "featured": true
  },
  {
    "title": "RC Racing — Two Championship Wins",
    "category": "hardware",
    "label": "ESP32 ROBOTICS · RC RACING",
    "art": "robotics",
    "slug": "rc-racing",
    "description": "Collaborative RC racing builds with wins at ACCELERATE 2025 and Techathon 2.0.",
    "detail": "An ESP32-based RC racing hardware showcase with the supplied component list and curated photographs from two winning events.",
    "role": "Team contributor · Chassis, wiring & troubleshooting",
    "context": "ACCELERATE 2025 · Freshers RC Car; Techathon 2.0 · RC Racing",
    "contribution": "Contributed to chassis design, wiring, soldering, and troubleshooting in collaborative RC racing projects.",
    "overview": [
      "The teams achieved first place in the Freshers RC Car segment at ACCELERATE 2025 and champion in RC Racing at Techathon 2.0. The ACCELERATE certificate identifies Team Furiosa.",
      "The supplied RC car component list uses an ESP32, a BTW7960 motor driver, a 37GB high-torque DC motor, a 12 V 2200 mAh LiPo battery, four wheels, a mini breadboard, and a thin plywood chassis. Original event and workbench photos provide the visual record."
    ],
    "focus": [
      "Chassis construction and motor-bracket mounting",
      "Motor-driver and controller hardware integration",
      "Wiring, soldering, and troubleshooting",
      "Team preparation and RC course participation"
    ],
    "tags": [
      "ESP32",
      "RC racing",
      "Hardware integration"
    ],
    "highlights": [
      {
        "value": "1st place",
        "label": "ACCELERATE 2025 · RC Car, Freshers"
      },
      {
        "value": "Champion",
        "label": "Techathon 2.0 · RC Racing"
      },
      {
        "value": "ESP32",
        "label": "Controller in the supplied component list"
      }
    ],
    "cover": {
      "src": "assets/events/techathon-2025/champion-team.webp",
      "alt": "RC racing team holding a car, certificates and champion mementos at Techathon"
    },
    "gallery": [
      {
        "src": "assets/events/techathon-2025/champion-team.webp",
        "alt": "RC racing team holding a car, certificates and champion mementos at Techathon",
        "caption": "The team with the RC car, Techathon certificates, and champion mementos."
      },
      {
        "src": "assets/events/techathon-2025/award-presentation.webp",
        "alt": "Shaheen receiving a certificate and champion memento at Techathon",
        "caption": "Receiving the RC racing award at Techathon 2.0."
      },
      {
        "src": "assets/events/techathon-2025/workbench.webp",
        "alt": "Four-wheel robot with controller boards and wiring on a workbench",
        "caption": "Wiring and electronics on the four-wheel robot at the workbench."
      },
      {
        "src": "assets/events/techathon-2025/course.webp",
        "alt": "RC car on the Techathon course with participants and an official",
        "caption": "A run on the marked RC course during the event."
      },
      {
        "src": "assets/events/techathon-2025/event-group.webp",
        "alt": "Wide group photograph at the Techathon 2.0 event",
        "caption": "Participants and organizers gathered with robots and certificates."
      },
      {
        "src": "assets/events/accelerate-2025/team.webp",
        "alt": "Team with certificates and first-place mementos at ACCELERATE 2025",
        "caption": "Team members holding their ACCELERATE certificates and first-place mementos."
      },
      {
        "src": "assets/events/accelerate-2025/presentation.webp",
        "alt": "ACCELERATE award presentation with team members and certificates",
        "caption": "Award presentation in front of the ACCELERATE event banner."
      },
      {
        "src": "assets/events/accelerate-2025/car-and-controller.webp",
        "alt": "Shaheen holding an RC car and controller at ACCELERATE",
        "caption": "Shaheen with a four-wheel RC car and controller at the event."
      },
      {
        "src": "assets/events/accelerate-2025/electronics.webp",
        "alt": "Four-wheel robot with exposed wiring and electronics",
        "caption": "A close look at the robot electronics in the supplied ACCELERATE photo set."
      },
      {
        "src": "assets/events/accelerate-2025/race-grid.webp",
        "alt": "Three RC cars on the ACCELERATE competition floor",
        "caption": "RC cars on the marked competition floor."
      }
    ],
    "resources": [
      {
        "label": "ACCELERATE first-place certificate",
        "kind": "certificate",
        "url": "assets/documents/lifelong-achievements.pdf#page=5",
        "description": "First position in the Freshers RC Car segment, Team Furiosa."
      },
      {
        "label": "Techathon RC Racing champion certificate",
        "kind": "certificate",
        "url": "assets/documents/lifelong-achievements.pdf#page=4",
        "description": "Champion in the RC Racing segment at Techathon 2.0."
      }
    ],
    "evidence": [
      {
        "label": "ACCELERATE 2025 certificate · page 5",
        "url": "assets/documents/lifelong-achievements.pdf#page=5"
      },
      {
        "label": "Techathon 2.0 certificate · page 4",
        "url": "assets/documents/lifelong-achievements.pdf#page=4"
      }
    ],
    "credits": [],
    "components": [
      {
        "name": "ESP32",
        "details": "Microcontroller board"
      },
      {
        "name": "BTW7960 motor driver",
        "details": "Motor driver"
      },
      {
        "name": "37GB high-torque DC motor",
        "details": "Drive motor"
      },
      {
        "name": "Mini breadboard",
        "details": "Connection board"
      },
      {
        "name": "LiPo battery",
        "details": "12 V · 2200 mAh"
      },
      {
        "name": "Jumper wires",
        "details": "Male-to-male, female-to-female, and male-to-female"
      },
      {
        "name": "Thin white plywood board",
        "details": "Chassis material"
      },
      {
        "name": "Wheels",
        "details": "4 wheels"
      },
      {
        "name": "Motor bracket",
        "details": "Motor mounting"
      },
      {
        "name": "Screws, nuts and bolts",
        "details": "Mechanical fasteners"
      }
    ],
    "tools": [
      "Screwdriver set",
      "Utility knife (anti-cutter)",
      "Drill machine",
      "Glue gun with glue sticks",
      "Soldering iron with lead",
      "Digital multimeter"
    ],
    "buildNote": "Source code is not available; this page documents the hardware, supplied component list, and competition record.",
    "featured": true
  },
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
    ],
    "featured": false
  },
  {
    "title": "RC Racing & Soccerbot",
    "category": "hardware",
    "label": "ARDUINO & ESP32 · TEAM ROBOTICS",
    "art": "robotics",
    "description": "From the workbench to the competition floor. Three championship wins, built together.",
    "detail": "An overview of separate Soccerbot and RC racing builds, with original event photographs and component lists.",
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
      "Explore the separate Soccerbot and RC racing pages for their hardware, parts lists, and curated competition galleries. Contributions included chassis design, wiring, soldering, and troubleshooting."
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
    "resources": [
      {
        "label": "Explore the Soccerbot build",
        "kind": "files",
        "url": "project.html?project=soccerbot",
        "description": "Arduino components, EEE Day championship, and original photos."
      },
      {
        "label": "Explore the RC racing builds",
        "kind": "files",
        "url": "project.html?project=rc-racing",
        "description": "ESP32 component list and wins at ACCELERATE and Techathon."
      }
    ],
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
    ],
    "featured": false
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
