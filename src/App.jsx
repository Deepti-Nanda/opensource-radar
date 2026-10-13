import { useEffect, useState } from "react";
import IssueCard from "./components/IssueCard";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("updated");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchIssues() {
      const repositories = [
        { owner: "facebook", name: "react" },
        { owner: "vuejs", name: "core" },
        { owner: "pallets", name: "flask" },
        { owner: "spring-projects", name: "spring-boot" },
      ];

      try {
        setLoading(true);
        setError("");

        const results = await Promise.all(
          repositories.map(async ({ owner, name }) => {
            const repoUrl = `https://api.github.com/repos/${owner}/${name}`;

            const [repoResponse, issuesResponse] = await Promise.all([
              fetch(repoUrl),
              fetch(
                `${repoUrl}/issues?labels=good%20first%20issue&state=open&per_page=10`,
              ),
            ]);

            if (!repoResponse.ok || !issuesResponse.ok) {
              throw new Error(`Failed to fetch issues for ${owner}/${name}.`);
            }

            const repoData = await repoResponse.json();
            const issueData = await issuesResponse.json();

            return issueData
              .filter((issue) => !issue.pull_request)
              .map((issue) => ({
                id: issue.id,
                updatedAt: issue.updated_at,
                title: issue.title,
                description: issue.body || "No description provided.",
                label:
                  issue.labels.find((label) =>
                    label.name.toLowerCase().includes("good first issue"),
                  )?.name || "open issue",
                language: repoData.language || "Unknown",
                repo: `${owner} / ${name}`,
                url: issue.html_url,
              }));
          }),
        );

        setIssues(results.flat());
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);
  const languages = ["All", ...new Set(issues.map((issue) => issue.language))];

  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query) ||
      issue.repo.toLowerCase().includes(query) ||
      issue.language.toLowerCase().includes(query) ||
      issue.label.toLowerCase().includes(query);

    const matchesLanguage =
      languageFilter === "All" || issue.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "repo") {
      return a.repo.localeCompare(b.repo);
    }

    return new Date(b.updatedAt) - new Date(a.updatedAt);
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
          <select
            id="sort-by"
            name="sort-by"
            aria-label="Sort issues"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="updated">Recently updated</option>
            <option value="title">Title (A–Z)</option>
            <option value="repo">Repository (A–Z)</option>
          </select>
          <select
            id="language-filter"
            name="language-filter"
            aria-label="Filter issues by programming language"
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language === "All" ? "All languages" : language}
              </option>
            ))}
          </select>
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
          ) : sortedIssues.length > 0 ? (
            sortedIssues.map((issue) => (
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
