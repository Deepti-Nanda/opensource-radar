
function IssueCard({ title, description, label, language, repo, url }) {
  return (
    <article className="issue-card">
      <div className="issue-card-header">
        <span className="issue-label">{label}</span>
        <span className="issue-language">{language}</span>
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

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