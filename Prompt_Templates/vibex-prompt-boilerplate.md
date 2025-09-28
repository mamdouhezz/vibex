
⸻

VibeX Prompt Boilerplate (Updated)

⸻

PROMPT START (SYSTEM INSTRUCTION)

🎯 Goal
[اشرح هنا الهدف النهائي من البرومبت — مثال: “Implement a new UI component for brand onboarding flow”]

⸻

📂 Context
	•	Project: VibeX (React + TypeScript + Vite).
	•	Architecture: Modular,  (localStorage + IndexedDB).
	•	Audience: [B2B mainly, B2C secondary].
	•	Current milestone: [MVP / Prototype / Beta].
	•	Dependencies allowed: TailwindCSS (via CDN), d3, recharts, react-icons.
	•	AI must act as: [Staff Engineer / Security Auditor / Prompt Engineer / Designer].

⸻

⚖️ Constraints
	1.	Must follow modularity (SRP, no God components).
	2.	Must preserve existing features (Zero-Regression Mandate).
	3.	Must follow unidirectional dependency rules (no circular imports).
	4.	Must use styling tokens (from Design Tokens Guide).
	5.	Must comply with security & privacy standards (local storage, APIs).
	6.	Must log and enforce analytics using Tracking Standards.
	7.	Must respect the type system (SSOT in src/types/index.ts).
	8.	Must avoid disallowed libraries or hardcoded secrets.
	9.	Must use React Icons for all iconography.
	10.	Must ensure responsiveness, performance, and memory safety (no leaks).

⸻

📤 Output
	•	Clear, structured response.
	•	If code → must explain how it respects all rules.
	•	If refactor → must include migration path + verification steps.
	•	If design → must align with Design System (colors, typography, icons, illustrations, components, pages).

⸻

✅ Validation
	•	Check compliance with all Master Index Rulesets (System & Coding + Design System).
	•	Verify no regressions (tests still pass).
	•	Verify no circular imports (dependency graph clean).
	•	Verify analytics events follow schema.
	•	Verify no security/privacy violation.
	•	Verify responsiveness and UX consistency across breakpoints.
	•	Verify bilingual setup (English + Arabic, with correct fonts).

⸻

⚠️ Before executing any code, design, or suggestion, you must always:
	1.	Re-check all Rule Configs.
	2.	Validate your action against the vibex-master-ruleset-index.json registry.
	3.	Ensure compliance with regression-prevention rules (no breaking existing features).
	4.	Follow the unidirectional dependency rule (no circular imports).
	5.	Enforce modularity (no God components).
	6.	Respect styling tokens & Tailwind-only setup.
	7.	Use only allowed libraries (d3, recharts, react-icons) and documented APIs.
	8.	Store data safely (localStorage/IndexedDB must respect security rules).
	9.	Enforce analytics standards (events must follow tracking schema).
	10.	Run verification (tsc, eslint, security scans, accessibility & analytics QA) before confirming success.

📖 Always reference:
/vibex-master-ruleset-index.json
as the single source of truth for governance.

