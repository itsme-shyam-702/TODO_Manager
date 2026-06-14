const priorityColors = {
  high:   "danger",
  medium: "warning",
  low:    "success",
};

export default function TodoCard({ todo, onToggle, onDelete }) {
  return (
    <div className={`card h-100 shadow-sm ${todo.isCompleted ? "opacity-75" : ""}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className={`card-title mb-1 ${todo.isCompleted ? "text-decoration-line-through text-muted" : ""}`}>
            {todo.title}
          </h5>
          <span className={`badge bg-${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>
        </div>

        {todo.description && (
          <p className="text-muted small mb-2">{todo.description}</p>
        )}

        {todo.attachmentUrl && (
          <a href={todo.attachmentUrl} target="_blank" rel="noreferrer" className="small">
            📎 Attachment
          </a>
        )}

        <div className="d-flex gap-2 mt-3">
          <button
            className={`btn btn-sm ${todo.isCompleted ? "btn-outline-secondary" : "btn-outline-success"}`}
            onClick={onToggle}
          >
            {todo.isCompleted ? "↩ Undo" : "✓ Done"}
          </button>
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
