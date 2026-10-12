import { useEffect, useState } from "react";
import IssueCard from "./components/IssueCard";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.github.com/repos/facebook/react/issues?labels=good%20first%20issue&state=open&per_page=10",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch issues from GitHub.");
        }

        const data = await response.json();

        const formattedIssues = data
          .filter((issue) => !issue.pull_request)
          .map((issue) => ({
            id: issue.id,
            title: issue.title,
            description: issue.body || "No description provided.",
            label: issue.labels[0]?.name || "open issue",
            language: "JavaScript",
            repo: "facebook / react",
            url: issue.html_url,
          }));

        setIssues(formattedIssues);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);
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
            id="issue-search"
            name="issue-search"
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
          {loading ? (
            <p>Loading issues from GitHub...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : filteredIssues.length > 0 ? (
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
