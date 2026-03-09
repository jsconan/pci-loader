# GitHub Copilot Instructions

You are an expert AI programming assistant working on the `pci-loader` project.
This project is a TypeScript library for loading and managing PCI runtimes in web applications.
Your task is to assist with code generation, documentation, and other programming tasks while adhering to the project's coding standards and guidelines.

## Project Overview

- **Language**: TypeScript (ES modules)
- **Runtime**: Node.js `>=20`
- **Build Tool**: `vite` + `typescript`
- **Linter/Formatter**: `eslint` + `prettier`
- **Testing**: `vitest` (with V8 coverage)
- **Documentation**: Markdown files in the repository root (e.g. `README.md`, `CHANGELOG.md`)

## Coding Standards

- **Style**: Follow TypeScript and project ESLint rules.
- **Formatting**: Let Prettier handle formatting.
- **Type Safety**: Keep strict typing; avoid `any` unless unavoidable and justified.
- **Imports**: Keep imports at the top, grouped and deduplicated.
- **Compatibility**: Ensure generated code remains compatible with the configured TypeScript target (`ES2022`) and bundler-mode module resolution.

## Documentation

- Update `README.md` and/or other relevant Markdown files when adding or changing user-facing features.
- Ensure exported/public APIs are documented with clear TSDoc/JSDoc comments when non-trivial.
- When modifying public APIs, update examples and usage snippets accordingly.

## Comments and API Docs

- Prefer concise TSDoc for exported classes, functions, and interfaces.
- Document parameters, return values, thrown errors, and key examples for public APIs.
- Keep comments focused on intent and behavior; avoid restating obvious code.

## Security

- **Domains**: Use controlled domains (e.g., `local.test`, `test.local`) in tests/runtime where network values are needed.
- **Secrets**: Never hardcode real secrets or keys. Use environment variables or mock values.

## Project Structure

- `docs/`: Markdown documentation files.
- `src/`: Main source code (`src/main.ts` as current library entry point).
- `tests/`: Unit tests.
- `public/`: Static HTML assets used for static build outputs.
- `vite.config.*.ts`: Build/test configurations.
- `package.json`: Project metadata, scripts, and dependencies.

## Development Workflow

- Use `npm install` to install dependencies.
- Use the following commands for development tasks (replace `$path` with the target file or directory):
    - **Dev server**: `npm run dev`
    - **Build (library + static)**: `npm run build`
    - **Build (library only)**: `npm run build:lib`
    - **Build (static only)**: `npm run build:static`
    - **Format**: `npm run format`
    - **Format check**: `npm run format:check`
    - **Lint**: `npm run lint`
    - **Tests**: `npm run test`
    - **Coverage**: `npm run test:coverage`
- Keep code aligned with strict TypeScript compiler options defined in `tsconfig.json`.

## Code Quality Checklist

Before finishing work on generated code:

**For code changes only:**

- **Format and lint check**: Run `npm run format:check` and `npm run lint`.
- **Tests and coverage**: Run `npm run test` and `npm run test:coverage` when applicable.
- **Build validation**: Run `npm run build` for changes that can affect bundling/output.

**Note**: Code checks (testing, linting, formatting, security checks) are only required when code changes are made. If changes are made only to non-code files (e.g., documentation, markdown files), these checks are not necessary.

## Testing

- Use `vitest` for testing.
- Ensure tests are placed in a `tests/` directory.
- **New/changed code coverage**: For any newly produced or modified code, add or update unit tests to provide complete coverage of that code's behavior and branches.
- **Coverage**: Respect configured thresholds (currently 100% for statements, functions, lines, and branches).
- **Mocking**:
    - Prefer `vi.mock`, `vi.spyOn`, and explicit test doubles from Vitest.
    - Only mock external dependencies; keep internal logic tests realistic when practical.
    - Prefer deterministic time control (mocked timers/time APIs) over real waits.
- **Test Execution Discipline**:
    - Always run tests after making code or test changes.
    - Always fix failing tests before finishing a code task.
    - Run coverage checks before finishing a code task when feasible; otherwise, note that coverage was skipped.
- **Structure**:
    - Keep tests close to public behavior and avoid testing private implementation details directly.
    - Keep test names explicit and behavior-focused.
    - Maintain a clear arrange/act/assert structure.
    - Keep test files ordered consistently with source behavior where helpful.
