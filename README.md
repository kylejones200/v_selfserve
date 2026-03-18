# Skill Builder — v_selfserve

A self-service web app where you describe your industry or company, define what data you have, and build **skills** — AI agents you can use in Cursor and other tools. You stay in control: your context and data drive the output, and only you (or people you allow) can use the app.

**Sign in with Google** to get started.

---

## Who it’s for

- **Teams** that want AI assistants tuned to their domain, data, and tools  
- **Developers** who use Cursor and want skills that know about their codebase, APIs, and conventions  
- **Anyone** who has structured data (APIs, docs, databases) and wants to turn that into reusable, shareable AI behaviors  

You don’t need to write YAML or prompts from scratch. You describe your world; the app helps you turn that into a skill you can run where you work.

---

## How it works

The app is built around three panels that work together:

### 1. Context (left panel)

**“Tell me about your industry or company.”**

Here you set the baseline: what you do, what your stack looks like, how your team works, or what your product is. This context is used whenever the app suggests data to include or generates a skill, so the result matches your reality instead of generic examples.

- Keep it in plain language.  
- You can mention tech stack, domain, internal tools, naming conventions, or processes.  
- This text is saved with your conversation so you can refine it over time.

### 2. Data (middle panel)

**What data or systems do you have?**

List the things an AI assistant could use: APIs, databases, docs, file layouts, environment variables, or other sources of truth. Each item can be a short label and a description (or a URL, path, or snippet).

- **Get recommendations** — The app uses your context and what you’ve already listed to suggest more data items you might want to add.  
- You can accept, edit, or ignore suggestions and keep building the list.  
- The goal is a clear picture of “what the AI is allowed to know about” when you generate a skill.

### 3. Generated skill (right panel)

**Your skill, ready to use.**

Once your context and data are in place, **Generate skill** produces a full skill definition — the kind you can drop into Cursor (e.g. as a SKILL.md or rule) or reuse elsewhere. It’s tailored to your context and the data you defined.

- **Download** — Save the skill as a file (e.g. for Cursor’s skills or rules).  
- **Copy** — Paste it into an editor, doc, or another tool.  
- You can regenerate after changing context or data to get an updated version.

---

## What you get out of it

- **Skills that match your world** — Generated from your own context and data, not generic templates.  
- **One place to iterate** — Change context or data, hit Generate again, and get a new skill without editing YAML by hand.  
- **Reusable and shareable** — Download or copy the skill and use it in Cursor, docs, or with your team.  
- **Privacy and control** — Sign-in is required; only authenticated users can use the app and generate skills. Your conversations and data stay in your session (and in your browser’s local storage for that device).

---

## Using the skill in Cursor

The generated skill is written so you can use it with Cursor’s agent skills or rules:

- Put the content in a **SKILL.md** (or similar) in your project or in Cursor’s skills directory.  
- The skill describes when to use it, what it can do, and what data or APIs it can rely on — all based on what you defined in the app.  
- Cursor can then suggest or use this skill when it’s relevant to the task.

You can maintain multiple conversations in the app (e.g. one per project or team) and generate different skills for each.

---

## Summary

**Skill Builder** helps you go from “here’s my company and my data” to “here’s a skill I can use in Cursor (or elsewhere)” without writing skill definitions from scratch. You set the context, define the data, and get a ready-to-use skill you can download, copy, and plug into your workflow.
