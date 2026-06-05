# Code Compiler

A full-stack online code compiler built with React, Vite, TypeScript, Express, and Docker. This project provides a browser-based editor, language selection, execution output, and secure Docker-backed code execution for supported languages.

## What this project does

- Provides a web interface to write and run code in the browser
- Sends code to a backend API for execution inside Docker containers
- Runs code securely with resource limits and isolated file mounts
- Pre-checks local Docker images and pulls missing images automatically

## Supported languages

- JavaScript
- C++
- Java
- Python

## Key features

- Code editor with auto-pairing brackets and quotes
- Theme toggle (dark/light)
- Run, clear, copy, and download code
- Output panel showing stdout/stderr
- Language list fetched dynamically from backend
- Docker-based execution sandbox with CPU, memory, and process limits

## Project structure

- `code-compiler-backend/`
  - `src/app.ts` - Express app setup and middleware
  - `src/index.ts` - server startup
  - `src/controllers/` - API handlers
  - `src/routes/` - compiler routes
  - `src/runners/` - language definitions and Docker execution logic
  - `src/utils/pre-pull-images.ts` - ensures Docker images exist before runtime

- `code-compiler-frontend/`
  - `src/App.tsx` - main React editor UI
  - `src/components/` - reusable UI components
  - `src/lib/` - helper utilities
  - `store/compiler.ts` - frontend state and API calls

## Prerequisites

- Node.js 18+ or compatible
- npm
- Docker installed and running

## Setup and run

### Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd code-compiler-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set the backend port (example):
   ```bash
   export PORT=5000
   ```

4. Start the backend in development mode:
   ```bash
   npm run dev
   ```

The backend exposes the compiler API and automatically pulls any missing Docker images on startup.

### Frontend

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd code-compiler-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open the local Vite URL shown in the terminal.

## API endpoints

- `GET /api/compiler/languages`
  - Returns the available languages and file extensions.

- `POST /api/compiler/compile`
  - Request body:
    ```json
    {
      "language_id": "javascript",
      "source_code": "console.log('Hello world')"
    }
    ```
  - Response body contains `stdout` and `stderr`.

## How code execution works

- The backend writes submitted source code into a temporary folder.
- It launches a Docker container for the requested language.
- Execution runs with:
  - `--network none`
  - 256 MB memory limit
  - 0.5 CPU limit
  - process limit of 64
- The temporary folder is mounted into the container for execution and removed after completion.

## Docker images used

- `node:22-alpine`
- `python:3.11-alpine`
- `eclipse-temurin:21-alpine`
- `gcc:13.2.0`

The backend startup script checks if these images already exist and only pulls them when needed.

## Notes

- If you plan to deploy or test in another environment, ensure Docker has permission to access the host filesystem.
- Java execution uses the submitted class name if a `public class` is found.

## Contribution

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Open a pull request with a short description.

## License

This project is licensed under the MIT License.
