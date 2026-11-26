# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JavaScript (vanilla ES modules), zero runtime dependencies. Node.js built-in test runner (`node --test`) for tests. GitHub Actions for CI and GitHub Pages for deployment. Local sandbox served with a zero-dependency Node script. Chosen with the user: simple, readable code with no install step for students.

## Users

- **Primary:** 5th–9th semester IT engineering students in a 130-minute in-person workshop, each on their own Windows laptop and their own GitHub account, editing in the browser with github.dev. Their job: find a visible bug in CampusFest, fix it, and get the fix through the GitHub Actions workflows (validate, build, backup, and CI/CD) until it is deployed to their own GitHub Pages URL.
- **Secondary:** the instructor, projecting the buggy app and a live scoreboard on a small or medium projector.

## Product Purpose

CampusFest is a **fictional** listing of events for an engineering week at a fictional university: hackathon, robotics, talks, e-sports tournament, and project fair. It exists only as teaching material. It must feel like a believable product worth fixing, while containing 8 deliberate bugs that are obvious at a glance. Success means each student sees their own fix go from red to green and then live.

## Positioning

A teaching app where every bug is visible in the UI **and** tied to a disabled test. The pipeline, not the instructor, decides whether a fix counts.

## Operating Context

- Students edit in github.dev (no local tooling) and open pull requests. Checks run on pull requests; merging to `main` triggers backup and CI/CD.
- The instructor projects the app locally (`node scripts/serve.mjs`) and runs a scoreboard that executes official tests against each student's deployed code.
- AI assistance is openly allowed; the official tests are the judge.

## Capabilities and Constraints

- Visitors can: view event cards (date, venue, available spots, price), search by text, filter by category, register (simulated in the browser, no server), and see a countdown or a "Finished" state.
- Out of scope: sorting controls (default sort is by date) and theme toggle.
- 1 guided bug and 7 free bugs (spots, date sort, accent-insensitive search, month offset, free price label, pluralization, past-event countdown, CSS contrast/responsive). Every bug is visible on screen.
- Code must stay simple, readable, and easy to debug. Logic lives in pure functions shared by the app and the tests.
- Spanish (Mexico) UI copy.
- Must stay robust: a broken edit must never take down the deployed site (deploy is gated by validation), and the app shows a friendly error instead of a blank page.
- Everything free: public repos, Actions, and Pages.

## Brand Commitments

- Name: **CampusFest** (fictional).
- No names, logos, or assets of Solera, Identifix, Navex, or the real host university.
- Legible on a projector from the back of a classroom.

## Evidence on Hand

None. All events, venues, and people are fictional and must be labeled as such; no real testimonials, sponsors, or logos.

## Product Principles

1. Bugs must be visible before they are explained.
2. Readability over cleverness: a student should find the bug's code in under a minute.
3. The pipeline is the judge: the official tests decide what counts as fixed.
4. Fail safe: student mistakes may turn a check red, but they never break the live site.
5. It should feel real enough to care about, but stay small enough to understand in 10 minutes.

## Accessibility & Inclusion

Target WCAG 2.2 AA in the fixed state (the contrast bug is intentional and must be fixable). Readable at projector distance; usable on mobile widths.
