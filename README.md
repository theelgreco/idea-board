# Idea Board - ClearScore FED Test

This is my submission for the ClearScore Front-End Test. (Will add some more info later)

View the live project at: https://idea-board-eight.vercel.app/

## Environment

-   Node version: 22.12.0
-   Build tool: Vite
-   Package manager: NPM

## Features

-   Ideas
-   Collections
-   Mock API
-   Synchronised/persisted with localstorage
-   Fully responsive

## Getting Started

Firstly install the packages:

```
npm run install
```

Then start the local dev server:

```
npm run dev
```

Your local version should now be up and running at: http://localhost:5173

## Tests

All tests are located in the `__tests__` directory.
Playwright is used for End-To-End testing and Vitest is used for unit testing.

### End-To-End Tests - Playwright

Tests are located in the `__tests__/e2e` directory.

To run the playwright tests just use the following command

```
npm run tests:e2e
```

### Unit Tests - Vitest

Tests are located in the `__tests__/unit` directory.

To run the unit tests just use the following command

```
npm run tests:unit
```
