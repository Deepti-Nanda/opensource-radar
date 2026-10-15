import { useEffect, useState } from "react";
import IssueCard from "./components/IssueCard";
import "./App.css";

const CACHE_KEY = "opensource-radar-issues-v9";
const CACHE_DURATION = 10 * 60 * 1000;
const REPOSITORIES = {
  "facebook/react": "JavaScript",
  "vuejs/core": "TypeScript",
  "pallets/flask": "Python",
  "spring-projects/spring-boot": "Java",
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("updated");
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchIssues() {
      setLoading(true);
      setError("");

      try {
        if (refreshKey === 0) {
          const cached = localStorage.getItem(CACHE_KEY);

          if (cached) {
            try {
              const { timestamp, data } = JSON.parse(cached);
              if (
                Date.now() - timestamp < CACHE_DURATION &&
                Array.isArray(data)
              ) {
                setIssues(data);
                setLoading(false);
                return;
              }
            } catch {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        }

        const repos = Object.keys(REPOSITORIES);

        const responses = await Promise.all(
          repos.map(async (repo) => {
            const labels = ["good first issue", "help wanted"];

            const results = await Promise.all(
              labels.map(async (label) => {
                const url = `https://api.github.com/repos/${repo}/issues?state=open&labels=${encodeURIComponent(label)}&sort=updated&direction=desc&per_page=100`;
                const response = await fetch(url);

                if (!response.ok) {
                  const details = await response.json().catch(() => ({}));

                  if (response.status === 403 || response.status === 429) {
                    throw new Error(
                      "GitHub API rate limit reached. Wait until the limit resets before trying again.",
                    );
                  }

                  throw new Error(
                    details.message ||
                      `GitHub request failed (${response.status}) for ${repo}.`,
                  );
                }

                return response.json();
              }),
            );

            return [
              ...new Map(
                results
                  .flat()
                  .filter((issue) => !issue.pull_request)
                  .map((issue) => [issue.id, issue]),
              ).values(),
            ];
          }),
        );

        const data = responses.flatMap((items) =>
          items
            .filter((issue) => !issue.pull_request)
            .map((issue) => {
              const repoPath = issue.repository_url.replace(
                "https://api.github.com/repos/",
                "",
              );
              const labels = issue.labels.map((label) => label.name);

              return {
                id: issue.id,
                updatedAt: issue.updated_at,
                title: issue.title,
                description: issue.body || "No description provided.",
                labels,
                label: labels.join(", ") || "Unlabeled",
                language: REPOSITORIES[repoPath] || "Unknown",
                repo: repoPath.replace("/", " / "),
                url: issue.html_url,
              };
            }),
        );

        if (cancelled) return;

        setIssues(data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data }),
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchIssues();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const languages = [
    "All",
    ...new Set(issues.map((issue) => issue.language).filter(Boolean)),
  ];

  const isBeginnerFriendly = (issue) =>
    issue.labels.some((label) =>
      ["good first issue", "help wanted"].includes(label.toLowerCase()),
    );

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
    const matchesBeginnerFilter = !beginnerOnly || isBeginnerFriendly(issue);

    return matchesSearch && matchesLanguage && matchesBeginnerFilter;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const beginnerDifference =
      Number(isBeginnerFriendly(b)) - Number(isBeginnerFriendly(a));

    if (beginnerDifference !== 0) return beginnerDifference;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "repo") return a.repo.localeCompare(b.repo);
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
          <label className="beginner-filter">
            <input
              id="beginner-only"
              name="beginner-only"
              type="checkbox"
              checked={beginnerOnly}
              onChange={(event) => setBeginnerOnly(event.target.checked)}
            />
            Beginner-friendly only
          </label>
          <button
            type="button"
            onClick={() => setSearchQuery(searchQuery.trim())}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(CACHE_KEY);
              setRefreshKey((key) => key + 1);
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh issues"}
          </button>
        </div>
        <p className="note">
          Built for curious developers and first-time contributors.
        </p>
      </section>
      <section className="issues-section">
        <h2>
          {beginnerOnly
            ? "Explore beginner-friendly issues"
            : "Explore open-source issues"}
        </h2>
        <div className="issues-list">
          {loading ? (
            <p>Loading issues from GitHub...</p>
          ) : error && issues.length === 0 ? (
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
              {error || "No issues found. Try a different search."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
