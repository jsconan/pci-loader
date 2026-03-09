# Scripts

This page lists the `npm` scripts available in the project (taken from `package.json`) and a short description of each. Run them with `npm run <script>`.

- `npm run dev`

    Start the development server (Vite) using the library config.

    ```sh
    vite --config vite.config.lib.ts
    ```

- `npm run docs:api`

    Generate API documentation with TypeDoc using the provided config.

    ```sh
    typedoc --options typedoc.json
    ```

- `npm run build`

    Build both the library and the static site (runs `build:lib` and `build:static`).

    ```sh
    npm run build:lib && npm run build:static
    ```

- `npm run build:lib`

    Compile TypeScript and build the library bundle.

    ```sh
    tsc && vite build --config vite.config.lib.ts
    ```

- `npm run build:static`

    Build the static site/bundles for the documentation/demo.

    ```sh
    tsc && vite build --config vite.config.static.ts
    ```

- `npm run preview`

    Preview the static build locally.

    ```sh
    vite preview --config vite.config.static.ts
    ```

- `npm run format`

    Format the repository files with Prettier.

    ```sh
    prettier --write .
    ```

- `npm run format:check`

    Check formatting without changing files.

    ```sh
    prettier --check .
    ```

- `npm run lint`

    Run Prettier check and ESLint to validate code style and quality.

    ```sh
    prettier --check . && eslint .
    ```

- `npm run lint:report`

    Run ESLint and create a JSON report file.

    ```sh
    eslint . --output-file eslint_report.json --format json
    ```

- `npm run test`

    Run tests with Vitest once.

    ```sh
    vitest run --config vite.config.lib.ts
    ```

- `npm run test:watch`

    Run tests in watch mode and output coverage in text format.

    ```sh
    vitest run --config vite.config.lib.ts --watch --coverage --coverage.reporter text
    ```

- `npm run test:coverage`

    Run tests and output coverage as text.

    ```sh
    vitest run --config vite.config.lib.ts --coverage --coverage.reporter text
    ```

- `npm run test:report`

    Run tests with coverage and open an HTML coverage report (macOS `open` used).

    ```sh
    vitest run --config vite.config.lib.ts --coverage --coverage.reporter text --coverage.reporter html && open .coverage/index.html
    ```

- `npm run test:ci`

    Run tests for CI with Clover coverage reporting.

    ```sh
    vitest run --config vite.config.lib.ts --coverage --coverage.reporter text --coverage.reporter clover
    ```

- `npm run prepack`

    Run linting, tests, and build before `npm pack` / publishing.

    ```sh
    npm run lint && npm run test && npm run build
    ```

- `npm run prepare`

    Install or ensure Husky hooks are set up (no-op if Husky already configured).

    ```sh
    husky || true
    ```
