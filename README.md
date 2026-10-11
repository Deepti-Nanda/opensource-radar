# 🔎 OpenSource Radar

**Find your next open-source contribution.**

OpenSource Radar is a React-based web application in development that aims to help developers discover beginner-friendly open-source issues and find opportunities to contribute to projects on GitHub.

The goal is to make the first step into open source simpler, more approachable, and easier to navigate.

> 🚧 **Project status:** Early development — the landing page and reusable issue cards are implemented. GitHub API integration is planned.

## ✨ Features

### Implemented

* 🏠 Landing page with a hero section, navigation, and search interface
* 🧩 Reusable React `IssueCard` component
* 📋 Dynamic rendering of issue cards using JavaScript arrays and `.map()`
* 🎨 Custom CSS styling with a consistent light theme
* 📱 Responsive styling for different screen sizes

### Planned

* 🔗 Fetch real issues from the GitHub API
* 🏷️ Discover issues using labels such as `good first issue` and `help wanted`
* 🔍 Search and filter issues by programming language, repository, and labels
* 🔗 Open the original GitHub issue directly
* ⏳ Add loading, empty, and error states
* 🌱 Improve the contribution discovery experience

## 🛠️ Tech Stack

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| React            | Component-based user interface       |
| Vite             | Development server and build tooling |
| JavaScript (JSX) | Application logic and UI rendering   |
| CSS3             | Layout, styling, and responsiveness  |
| Git & GitHub     | Version control and project hosting  |

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm, which is included with Node.js
* [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Deepti-Nanda/opensource-radar.git
```

**2. Navigate to the project directory**

```bash
cd opensource-radar
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the local URL**

Visit the URL printed in your terminal, usually `http://localhost:5173/`.

## 📂 Project Structure

```text
opensource-radar/
├── public/
├── src/
│   ├── components/
│   │   └── IssueCard.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

*Note: The structure above shows the main application files; other files may be present in the repository.*

### How It Works

* **`App.jsx`** — Renders the landing page and supplies issue data to the cards.
* **`IssueCard.jsx`** — Reusable component that displays an issue's title, description, labels, language, repository, and link.
* **`App.css`** — Contains application-specific styling.
* **`index.css`** — Defines global styles and the page foundation.

Currently, the cards use sample data. Live GitHub issue data will be integrated in a future development stage.

## 🗺️ Roadmap

* [x] Build the initial landing page
* [x] Set up a React + Vite project
* [x] Create a reusable issue card component
* [x] Pass issue information through React props
* [x] Render multiple cards using `.map()`
* [ ] Fetch issues from the GitHub API
* [ ] Add functional search and filtering
* [ ] Implement loading, empty, and error states
* [ ] Test and refine the responsive interface

## 🎯 Vision

OpenSource Radar aims to help developers move from wanting to contribute to actually finding projects and issues where they can make a difference.

The long-term goal is to create a simple, accessible starting point for discovering open-source contribution opportunities.

## 👩‍💻 Author

**Deepti Nanda**

* GitHub: [@Deepti-Nanda](https://github.com/Deepti-Nanda)
* Project Repository: [opensource-radar](https://github.com/Deepti-Nanda/opensource-radar)

---

⭐ If you find this project interesting, follow its development and watch this repository for updates.

*Built step by step while learning React, frontend development, and open-source project workflows.*