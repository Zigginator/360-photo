# Multi-Framework Storybook Setup

This project includes multiple Storybook instances to showcase the 360-photo component across different frameworks.

## Available Storybooks

- **Main Storybook** (Port 6006): Preact - Full component documentation with all stories and controls
- **React Storybook** (Port 6007): React-specific integration example
- **Vue Storybook** (Port 6008): Vue-specific integration example

Each Storybook runs independently on its own port.

## Running Storybook

### Run All Frameworks

```bash
npm install
npm run storybook:all
```

This starts all 3 Storybook instances concurrently. Once loaded, you can access them at:

- **Main (Preact):** http://localhost:6006 - Complete documentation with all 17+ stories
- **React:** http://localhost:6007 - React integration example
- **Vue:** http://localhost:6008 - Vue integration example

Each Storybook is independent and showcases how to integrate the component in that specific framework.
There's a todo item to configure the other two storybook implementation to display in the sidebar of the main storybook using Storybook Composition

### Run Individual Instances

```bash
# Preact (main)
npm run storybook

# React
npm run storybook:react

# Vue
npm run storybook:vue
```

## Building for Production

```bash
# Build all Storybook instances
npm run build-storybook:all
```

This creates static builds in `storybook-static/` with subdirectories for each framework.

## Framework Integration

Each framework uses a wrapper component that integrates the framework-agnostic 360-photo component:

- **React**: Wrapper component that uses Preact's `render()` function
- **Vue**: Wrapper component that uses Preact's `render()` function

This demonstrates how the component can be integrated into other frameworks.
