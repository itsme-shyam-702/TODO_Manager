import { useState } from "react";
import { useCreateTodo } from "../hooks/useTodoMutations";

export default function TodoForm({ onSuccess }) {
  const [formData,     setFormData]     = useState({ title: "", description: "", priority: "medium" });
  const [attachedFile, setAttachedFile] = useState(null);
  const [errorMsg,     setErrorMsg]     = useState("");

  const { mutate: createTodo, isPending } = useCreateTodo();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const payload = new FormData();
    payload.append("title",       formData.title);
    payload.append("description", formData.description);
    payload.append("priority",    formData.priority);
    if (attachedFile) payload.append("attachment", attachedFile);

    createTodo(payload, {
      onSuccess: () => { onSuccess(); setFormData({ title: "", description: "", priority: "medium" }); },
      onError:   (err) => setErrorMsg(err.response?.data?.message || "Failed to create todo"),
    });
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">New Todo</h5>

        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              name="title"
              className="form-control"
              placeholder="Title *"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              name="description"
              className="form-control"
              placeholder="Description (optional)"
              rows={2}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-8">
              <input
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={(e) => setAttachedFile(e.target.files[0])}
              />
            </div>
          </div>
          <button className="btn btn-primary" disabled={isPending}>
            {isPending ? "Creating…" : "Create Todo"}
          </button>
        </form>
      </div>
    </div>
  );
}
