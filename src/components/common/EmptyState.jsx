function EmptyState({ title, description, note }) {
  return (
    <div className="card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {note && <small>{note}</small>}
    </div>
  );
}

export default EmptyState;
