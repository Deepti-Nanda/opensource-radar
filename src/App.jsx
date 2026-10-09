
import './App.css'

function App() {
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
          Discover beginner-friendly GitHub issues and take your first
          step toward contributing to open source.
        </p>

        <div className="search">
          <input
            type="text"
            placeholder="Search issues, repositories, or technologies..."
            aria-label="Search issues"
          />
          <button type="button">Search</button>
        </div>

        <p className="note">
          Built for curious developers and first-time contributors.
        </p>
      </section>
    </main>
  )
}

export default App