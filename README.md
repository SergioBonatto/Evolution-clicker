# Evolution Clicker

Evolution Clicker is a modern incremental clicker game focused on the evolution of life, developed using React, TypeScript, and Tailwind CSS. The project emphasizes code quality, scalability, and a professional user experience.

**Live Demo:** [https://evolutionclicker.vercel.app/](https://evolutionclicker.vercel.app/)

**Repository:** [https://github.com/SergioBonatto/Evolution-clicker](https://github.com/SergioBonatto/Evolution-clicker)

---

## Overview

Evolution Clicker allows players to guide life through a series of evolutionary eras. Users produce resources, purchase upgrades, complete missions, evolve to new stages, and unlock prestige for permanent bonuses. The application features a responsive interface, multi-language support, and persistent browser-based progress.

## Features

- **Multiple Evolutionary Stages:** Advance through distinct eras, each with unique upgrades and resources.
- **Upgrades and Automation:** Acquire upgrades to enhance production and automate resource generation.
- **Mission System:** Complete era-specific missions to earn rewards and progress.
- **Evolution and Prestige:** Evolve to subsequent eras and reset progress for permanent advantages.
- **Modern User Interface:** Fully responsive and mobile-friendly, with support for both dark and light themes.
- **Localization:** Available in English, Portuguese, and Spanish.
- **Persistent Progress:** Game state is automatically saved in the browser.

## Demo

Access the latest version online: [https://evolutionclicker.vercel.app/](https://evolutionclicker.vercel.app/)

## Technology Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [i18next](https://www.i18next.com/) (localization)
- [fixed-precision](https://www.npmjs.com/package/fixed-precision) (arbitrary-precision arithmetic)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/SergioBonatto/Evolution-clicker.git
cd Evolution-clicker
npm install # or yarn install
```

### Running Locally

```bash
npm run dev # or yarn dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build # or yarn build
```

### Linting and Formatting

```bash
npm run lint
```

## Project Structure

```
├── public/           # Static assets and translation files
├── src/
│   ├── components/   # React UI components
│   ├── data/         # Game data (stages, upgrades, missions)
│   ├── hooks/        # Custom React hooks (game logic)
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── App.tsx       # Main application component
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Localization

- English, Portuguese, and Spanish are supported by default.
- To add a new language, include the appropriate translation files in `public/locales/`.

## Contributing

Contributions are welcome. Please submit issues or pull requests via [GitHub](https://github.com/SergioBonatto/Evolution-clicker).

## License

This project is licensed under the MIT License.

---
