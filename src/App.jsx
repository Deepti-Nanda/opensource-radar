import { useEffect, useState } from "react";
import IssueCard from "./components/IssueCard";
import "./App.css";

const CACHE_KEY = "opensource-radar-issues-v11";
const CACHE_DURATION = 10 * 60 * 1000;
const ISSUES_PER_PAGE = 10;
const BEGINNER_LABELS = ["good first issue", "help wanted"];
const REPOSITORIES = {
  "facebook/react": "JavaScript",
  "vuejs/core": "TypeScript",
  "pallets/flask": "Python",
  "spring-projects/spring-boot": "Java",
};

const normalizeLabel = (label) =>
  String(label || "")
    .trim()
    .toLowerCase();

const isBeginnerFriendly = (issue) =>
  (issue.labels || []).some((label) =>
    BEGINNER_LABELS.includes(normalizeLabel(label)),
  );

async function fetchGitHubIssues(url, repo) {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error(
        "GitHub API rate limit reached. Please wait before refreshing.",
      );
    }

    throw new Error(`GitHub request failed for ${repo} (${response.status}).`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected GitHub response for ${repo}.`);
  }

  return data;
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("updated");
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadIssues() {
      setLoading(true);
      let cachedData = null;
      setError("");

      try {
        if (refreshKey === 0) {
          try {
            const cached = localStorage.getItem(CACHE_KEY);

            if (cached) {
              const parsedCache = JSON.parse(cached);
              const { timestamp, data } = parsedCache;
              if (Array.isArray(data)) {
                cachedData = data;
              }

              if (
                Date.now() - timestamp < CACHE_DURATION &&
                Array.isArray(data)
              ) {
                if (!cancelled) {
                  setIssues(data);
                  setLoading(false);
                }
                return;
              }
            }
          } catch {
            localStorage.removeItem(CACHE_KEY);
          }
        }

        const repoResults = await Promise.all(
          Object.entries(REPOSITORIES).map(async ([repo, language]) => {
            const baseUrl = `https://api.github.com/repos/${repo}/issues`;
            const commonParams =
              "state=open&sort=updated&direction=desc&per_page=100";

            const urls = [
              `${baseUrl}?${commonParams}`,
              ...BEGINNER_LABELS.map(
                (label) =>
                  `${baseUrl}?${commonParams}&labels=${encodeURIComponent(label)}`,
              ),
            ];

            const responses = await Promise.all(
              urls.map((url) => fetchGitHubIssues(url, repo)),
            );

            const uniqueIssues = new Map();

            responses.flat().forEach((issue) => {
              if (!issue.pull_request) {
                uniqueIssues.set(issue.id, issue);
              }
            });

            return [...uniqueIssues.values()].map((issue) => {
              const labels = (issue.labels || []).map((label) =>
                typeof label === "string" ? label : label.name || "",
              );

              return {
                id: issue.id,
                updatedAt: issue.updated_at,
                title: issue.title || "Untitled issue",
                description: issue.body || "No description provided.",
                labels,
                label: labels.filter(Boolean).join(", ") || "Unlabeled",
                language,
                repo: repo.replace("/", " / "),
                url: issue.html_url,
              };
            });
          }),
        );

        const data = repoResults.flat();

        if (cancelled) return;

        setIssues(data);

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data }),
          );
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      } catch (err) {
        if (!cancelled) {
          if (cachedData && cachedData.length > 0) {
            setIssues(cachedData);
            setError("");
          } else {
            setError(err.message || "Unable to load issues from GitHub.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadIssues();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, languageFilter, sortBy, beginnerOnly, refreshKey]);

  const languages = [
    "All",
    ...new Set(issues.map((issue) => issue.language).filter(Boolean)),
  ];

  const query = searchQuery.trim().toLowerCase();
  console.log("Search:", searchQuery);
  console.log("Language:", languageFilter);
  console.log("Beginner only:", beginnerOnly);
  const filteredIssues = issues.filter((issue) => {
    const labels = (issue.labels || []).join(" ").toLowerCase();
    const matchesSearch =
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query) ||
      issue.repo.toLowerCase().includes(query) ||
      issue.language.toLowerCase().includes(query) ||
      labels.includes(query);

    const matchesLanguage =
      languageFilter === "All" || issue.language === languageFilter;

    const matchesBeginner = !beginnerOnly || isBeginnerFriendly(issue);

    return matchesSearch && matchesLanguage && matchesBeginner;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "repo") {
      return a.repo.localeCompare(b.repo);
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const totalPages = Math.ceil(sortedIssues.length / ISSUES_PER_PAGE);
  const startIndex = (currentPage - 1) * ISSUES_PER_PAGE;
  const currentIssues = sortedIssues.slice(
    startIndex,
    startIndex + ISSUES_PER_PAGE,
  );
  console.log("Total issues:", issues.length);
  console.log("Filtered issues:", filteredIssues.length);
  console.log("Sorted issues:", sortedIssues.length);
  console.log("Current page issues:", currentIssues.length);

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
            aria-label="Filter by programming language"
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
            currentIssues.map((issue) => (
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
              {error || "No issues found. Try changing your filters."}
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
