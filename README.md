# 🔎 OpenSource Radar

**Find your next open-source contribution.**

OpenSource Radar is a React-based web application that helps developers discover open GitHub issues and explore opportunities to contribute to open-source projects. It fetches issues from selected repositories and provides tools to search, filter, sort, and browse issues in one place.

🌐 **Live Demo:** [OpenSource Radar](https://opensource-radar-nine.vercel.app/)

## ✨ Features

- 🔗 Fetch open issues from selected GitHub repositories using the GitHub REST API
- 🌱 Discover beginner-friendly issues using labels such as `good first issue` and `help wanted`
- 🔍 Search issues by keywords
- 🏷️ Filter issues by programming language
- ↕️ Sort issues using available sorting options
- 📄 Browse issues through pagination
- 🧩 Display issue details using reusable React components
- ⏳ Handle loading and error states
- 💾 Cache issue data to reduce repeated API requests
- 📱 Responsive user interface

## 🛠️ Tech Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| React            | Component-based user interface         |
| Vite             | Development server and build tooling   |
| JavaScript (JSX) | Application logic and UI rendering     |
| CSS3             | Layout, styling, and responsiveness    |
| GitHub REST API  | Fetching open-source issues            |
| Git & GitHub     | Version control and repository hosting |
| Vercel           | Application deployment                 |

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)

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

**5. Open the application**

Visit the local URL printed in your terminal, usually `http://localhost:5173/`.

### Production Build

To create a production build, run:

```bash
npm run build
```

The generated production files are placed in the `dist` directory.

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

*Note: This shows the main application files. Other configuration and project files may also be present.*

## ⚙️ How It Works

- **`App.jsx`** — Manages issue data, fetching, searching, filtering, sorting, pagination, and application states.
- **`IssueCard.jsx`** — Reusable component that displays an issue's title, description, labels, language, repository, and link.
- **`App.css`** — Contains application-specific styling.
- **`index.css`** — Defines global styles and the page foundation.

OpenSource Radar retrieves issues from configured GitHub repositories and presents them in a browsable interface. Users can explore issues, narrow the results using filters, and open the original GitHub issue to learn more or contribute.

## 🗺️ Roadmap

- [x] Build the landing page and responsive interface
- [x] Set up the React + Vite project
- [x] Create reusable issue cards
- [x] Integrate the GitHub REST API
- [x] Add search and language filtering
- [x] Implement sorting options
- [x] Add beginner-friendly filtering
- [x] Implement pagination
- [x] Add loading and error handling
- [x] Improve caching and repository-fetch error handling
- [x] Deploy the application to Vercel
- [ ] Expand repository coverage
- [ ] Improve issue discovery and user experience

## 🎯 Vision

OpenSource Radar aims to help developers move from wanting to contribute to actually finding open-source projects and issues where they can make a difference.

The long-term goal is to create a simple, accessible starting point for discovering open-source contribution opportunities.

## 👩‍💻 Author

**Deepti Nanda**

- GitHub: [@Deepti-Nanda](https://github.com/Deepti-Nanda)
- Project Repository: [opensource-radar](https://github.com/Deepti-Nanda/opensource-radar)
- Live Demo: [OpenSource Radar](https://opensource-radar-nine.vercel.app/)

---

⭐ If you find this project interesting, consider starring the repository and following its development.

*Built step by step while learning React, frontend development, and open-source project workflows.*