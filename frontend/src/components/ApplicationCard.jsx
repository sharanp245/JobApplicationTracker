export default function ApplicationCard({ item, onDelete }) {
    // Only allow real web links, same rule as before
    const safeLink = item.jobUrl && /^https?:\/\//i.test(item.jobUrl);

    return (
        <div className="card">
            <h3>{item.company} - {item.role}</h3>
            <span className="badge">{item.status}</span>

            {item.dateApplied && <p>Applied: {item.dateApplied}</p>}

            {safeLink && (
                <a href={item.jobUrl} target="_blank" rel="noopener noreferrer">
                    Job posting
                </a>
            )}

            {item.notes && <p>{item.notes}</p>}

            <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
    );
}