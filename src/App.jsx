import { useState } from "react";
import IssueCard from "./components/IssueCard";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const issues = [
    {
      id: 1,
      title: "Add a welcome message to the homepage",
      description: "Make the homepage friendlier for new users.",
      label: "good first issue",
      language: "JavaScript",
      repo: "community-project / website",
      url: "https://github.com",
    },
    {
      id: 2,
      title: "Improve mobile navigation",
      description: "Make the navigation menu easier to use on small screens.",
      label: "help wanted",
      language: "CSS",
      repo: "open-web / frontend",
      url: "https://github.com",
    },
    {
      id: 3,
      title: "Add input validation",
      description: "Show helpful error messages when form inputs are invalid.",
      label: "good first issue",
      language: "React",
      repo: "dev-tools / dashboard",
      url: "https://github.com",
    },
  ];
  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query) ||
      issue.repo.toLowerCase().includes(query) ||
      issue.language.toLowerCase().includes(query) ||
      issue.label.toLowerCase().includes(query)
    );
  });
  return (
    <main className="app">
      <nav className="navbar">
        <h2>OpenSource Radar</h2>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
      <section className="hero">
        <p className="eyebrow">YOUR OPEN-SOURCE JOURNEY STARTS HERE</p>
        <h1>Find your first open-source issue.</h1>
        <p className="description">
          Discover beginner-friendly GitHub issues and take your first step
          toward contributing to open source.
        </p>
        <div className="search">
          <input
            type="text"
            placeholder="Search issues, repositories, or technologies..."
            aria-label="Search issues"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="button">Search</button>
        </div>
        <p className="note">
          Built for curious developers and first-time contributors.
        </p>
      </section>
      <section className="issues-section">
        <h2>Explore beginner-friendly issues</h2>
        <div className="issues-list">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                title={issue.title}
                description={issue.description}
                label={issue.label}
                language={issue.language}
                repo={issue.repo}
                url={issue.url}
              />
            ))
          ) : (
            <p className="empty-state">
              No issues found. Try a different search.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
