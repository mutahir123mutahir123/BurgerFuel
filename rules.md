# BurgerFuel Website --- AI Development Rules





You have to act as a senior web developer.The first thing you have to do is to check the skills folder first.And for the each problem use the dedicated skill.for example skill folder has uiuxpromax skill.use this skill for frontend development,use ponytail,use impeccable for taste.like see the skills folder and make sure the function,problem,or error yyou are going to resolve,use skill folder so that you have more context.





## 1\. Write Clean Code

* Prefer **clean, simple, readable code over clever code**.
* Write code as a senior frontend developer would: clear naming, small
focused functions, reusable components, and predictable behavior.
* Do not over-engineer simple requirements.
* Follow the existing project structure and conventions before
introducing a new pattern.

## 2\. Think Before Coding

* Before writing or changing code, understand the existing
implementation and the actual problem.
* Before fixing an error, identify the root cause instead of applying
a quick workaround.
* Consider how a change affects the rest of the codebase before
implementing it.
* Never rewrite working code unnecessarily.

## 3\. Maintain the Codebase

* Keep components modular and focused on one responsibility.
* Reuse existing components, utilities, hooks, and patterns whenever
appropriate.
* Avoid duplicated logic.
* Keep data, UI, business logic, and configuration separated where
practical.
* Remove unused code, imports, and dead logic when making changes.

## 4\. Libraries

* **Do not install a library for small functionality without checking
the existing project first.**
* First determine whether the requirement can be implemented cleanly
with installed libraries, browser APIs, React, or existing
utilities.
* Add a dependency only when it provides meaningful value that cannot
reasonably be achieved with what is already available.
* Avoid dependency bloat.

## 5\. React Architecture

* Use proper React concepts and patterns.
* Avoid unnecessary prop drilling. Use `useContext` when shared state
genuinely belongs in context.
* Do not use Context for state that only a small component tree needs.
* Use `useMemo`, `useCallback`, and memoization when they solve a real
rendering or computation problem---not automatically everywhere.
* Keep state as local as possible.
* Prefer derived values over duplicated state.
* Avoid unnecessary client components and unnecessary re-renders.

## 6\. Rendering \& Performance

* **Do not render everything when everything is not needed.**
* Render only the data and UI required for the current view.
* Optimize images and use responsive/lazy-loaded images where
appropriate.
* Avoid expensive calculations during render.
* Keep animations performant and avoid unnecessary animation work.
* Prefer efficient data filtering, stable keys, and predictable
rendering.
* Performance should be considered during implementation, not added as
an afterthought.

## 7\. UI \& Components

* Build reusable components based on actual reuse, not premature
abstraction.
* Keep components readable; split large components when they have
multiple responsibilities.
* Use the project's existing styling and animation systems before
adding alternatives.
* Ensure responsive behavior from the beginning, especially mobile and
desktop layouts.

## 8\. Changes \& Verification

* Make the smallest safe change that solves the requirement.
* After significant changes, verify affected functionality and check
for TypeScript, lint, build, and runtime issues when available.
* Do not hide errors or suppress warnings without understanding why
they exist.
* Preserve existing functionality unless the requirement explicitly
changes it.

## Core Principle

**Think first. Keep it simple. Reuse what exists. Write maintainable
code. Optimize what matters. Never choose clever code when clean code
solves the problem.**

