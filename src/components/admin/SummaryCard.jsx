function SummaryCard({ title, value, note, icon }) {
  return (
    <div className="card summary-card">
      <div className="summary-card-top">
        {icon && <div className="summary-card-icon">{icon}</div>}

        <div>
          <div className="summary-card-value">{value ?? 0}</div>
          <h3>{title}</h3>
        </div>
      </div>

      {note && <p>{note}</p>}
    </div>
  );
}

export default SummaryCard;
