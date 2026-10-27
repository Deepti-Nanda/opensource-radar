function IssueCard({ title, description, label, language, repo, url }) {
  const cleanDescription = (description || "No description provided.")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const preview =
    cleanDescription.length > 180
      ? cleanDescription.slice(0, 180).trimEnd() + "..."
      : cleanDescription;

  return (
    <article className="issue-card">
      <div className="issue-card-header">
        <span className="issue-label">{label}</span>
        <span className="issue-language">{language}</span>
      </div>

      <h2>{title}</h2>

      <p className="issue-description">{preview}</p>

      <div className="issue-card-footer">
        <span>{repo}</span>
        <a href={url} target="_blank" rel="noreferrer">
          View issue
        </a>
      </div>
    </article>
  );
}

export default IssueCard;
