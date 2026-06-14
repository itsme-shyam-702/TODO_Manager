import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodoMutations";
import { useDebounce } from "../hooks/useDebounce";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";

export default function TodosPage() {
  const [searchText,     setSearchText]     = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showForm,       setShowForm]       = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  const filters = {};
  if (debouncedSearch) filters.search   = debouncedSearch;
  if (priorityFilter)  filters.priority = priorityFilter;

  const { data: todos, isLoading, isError } = useTodos(filters);
  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: updateTodo } = useUpdateTodo();

  function handleToggleComplete(todo) {
    updateTodo({ todoId: todo._id, updates: { isCompleted: !todo.isCompleted } });
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Todos</h2>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Todo"}
        </button>
      </div>

      {showForm && <TodoForm onSuccess={() => setShowForm(false)} />}

      {/* Filters */}
      <div className="row g-2 mb-4">
        <div className="col-md-7">
          <input
            className="form-control"
            placeholder="Search todos…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      {isLoading && <p>Loading…</p>}
      {isError   && <p className="text-danger">Failed to load todos.</p>}

      {todos?.length === 0 && (
        <p className="text-muted">No todos yet. Create one above!</p>
      )}

      <div className="row g-3">
        {todos?.map((todo) => (
          <div key={todo._id} className="col-md-6">
            <TodoCard
              todo={todo}
              onToggle={() => handleToggleComplete(todo)}
              onDelete={() => deleteTodo(todo._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
