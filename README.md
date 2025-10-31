# Tic-Tac-Toe Online - Frontend

This is the frontend for a real-time multiplayer Tic-Tac-Toe game. It's built with React, Vite, and TypeScript, and uses Socket.IO for communication with the backend server. The UI is crafted using the excellent [shadcn/ui](https://ui.shadcn.com/) component library and styled with [Tailwind CSS](https://tailwindcss.com/).

## ✨ Features

- **Real-time Gameplay**: Play Tic-Tac-Toe with another player in real-time.
- **Game Lobby**: View a list of available game rooms to join.
- **Create & Join Rooms**: Easily create your own game room or join an existing one.
- **Modern UI**: A clean, responsive, and modern user interface.
- **Form Handling**: Robust form validation using React Hook Form and Zod.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Real-time Communication**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get the frontend development server up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:

    Create a `.env` file in the `frontend` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and set the `VITE_BACKEND_URL` to the address of your running backend server.

    ```env
    # .env
    VITE_BACKEND_URL=http://localhost:3000
    ```

4.  **Run the development server**:

    ```bash
    npm run dev
    ```

    The application should now be running and accessible at `http://localhost:8080` (or another port if 8080 is in use).

## 📜 Available Scripts

In the `frontend` directory, you can run the following scripts:

- **`npm run dev`**
  Starts the development server with Hot Module Replacement (HMR).

- **`npm run build`**
  Builds the app for production to the `dist` folder.

- **`npm run lint`**
  Lints the codebase using ESLint to find and fix problems.

- **`npm run preview`**
  Serves the production build locally to preview it before deployment.

## 📁 Project Structure

The `src` folder is organized as follows:

```
src/
├── components/   # Reusable UI components (buttons, inputs, etc.)
├── contexts/     # React contexts for global state
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and library configurations
├── pages/        # Top-level page components for routing
├── App.jsx       # Main application component with router setup
└── main.jsx      # Entry point of the application
```
