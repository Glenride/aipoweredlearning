Product Requirements Document (PRD)

**Project Name:** AETHER (MVP)
**Core Function:** An AI-driven interactive "Business Architect" that helps users define their One-Person Business.
**Tech Stack:** Laravel (Starter Kit), MySQL, TailwindCSS, OpenAI API (or Anthropic).

## 1. User Flow (The "Happy Path")

1. **Landing:** User reads copy  clicks "Initialize."
2. **Onboarding (Auth):** User registers (standard Laravel Auth).
3. **The Interface:** User is dropped immediately into "The Architect" (a chat-like interface).
4. **The Session:**
* AI asks: "Tell me what you have been obsessed with for the last 6 months."
* User answers.
* AI probes deeper to find "Specific Knowledge."
* AI generates a "Strategy Card" (Business Concept, Target Audience, MVP feature).


5. **The Dashboard:** The "Strategy Card" is saved to the user's dashboard for future reference.

## 2. Core Features & Technical Specs

### **A. The Chat Interface (The "Wrapper")**

* **Description:** A clean, terminal-style chat window.
* **Laravel Component:** Livewire or Vue/React (depending on your kit).
* **Behavior:**
* Streaming text response (for the "futuristic" feel).
* Markdown support (for structured output).
* **CRITICAL:** This is *not* a generic chatbot. It must feel like a guided interview.



### **B. The AI Logic (The "Brain")**

* **Service:** `App\Services\AIService.php`
* **Model:** GPT-4o or Claude 3.5 Sonnet (recommended for better nuance).
* **System Prompt Strategy:**
* Role: "You are a ruthless but empathetic business strategist."
* Constraint: "Do not give generic advice. Do not suggest dropshipping or affiliate marketing. Focus on high-leverage digital assets."
* Goal: "Extract the user's unfair advantage and package it into a Micro-SaaS or Productized Service idea."



### **C. The "Strategy Card" (The Artifact)**

* **Description:** When the conversation concludes, the AI extracts structured data to save a "Project."
* **Output Format:** JSON.
* `project_name`
* `tagline`
* `target_audience`
* `monetization_model`
* `mvp_features`



## 3. Database Schema (Laravel Migrations)

You likely have `users` table. You need to add:

**Table: `sessions` (or `chats`)**

* `id` (BigInt, PK)
* `user_id` (FK -> users)
* `title` (String, nullable)
* `status` (Enum: 'active', 'completed', 'archived')
* `timestamps`

**Table: `messages**`

* `id` (BigInt, PK)
* `session_id` (FK -> sessions)
* `role` (Enum: 'user', 'assistant', 'system')
* `content` (Text/LongText)
* `meta_data` (JSON, nullable - for storing specific extracted insights per message)
* `timestamps`

**Table: `blueprints` (The saved output)**

* `id` (BigInt, PK)
* `user_id` (FK -> users)
* `session_id` (FK -> sessions)
* `niche` (String)
* `problem_statement` (Text)
* `solution_concept` (Text)
* `roadmap_json` (JSON - allows flexibility for the step-by-step plan)
* `timestamps`

## 4. UI/UX Directives (For Tailwind)

* **Background:** `bg-zinc-950`
* **Text Primary:** `text-zinc-200`
* **Text Accent:** `text-amber-500` (Use sparingly for buttons or key insights).
* **Borders:** `border-zinc-800` (Thin, subtle borders).
* **Font:** Google Fonts `Space Mono` or `JetBrains Mono` for all data/inputs.

## 5. Development Phases (Sprint Plan)

* **Phase 1 (Day 1-2):**
* Install Laravel Starter Kit.
* Set up Database Migrations.
* Build the basic Chat UI (Livewire/Vue).


* **Phase 2 (Day 3-4):**
* Integrate OpenAI API.
* **Focus:** Refine the System Prompt (this is the most important step). Test it manually in ChatGPT first until it gives the "Dan Koe" style advice.


* **Phase 3 (Day 5):**
* Implement the "Save Blueprint" logic (parsing the AI response into the database).
* Build the Dashboard view to display saved blueprints.


* **Phase 4 (Day 6):**
* Apply the "AETHER" dark mode styling.
* Deploy Landing Page.



