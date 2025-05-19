import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const createTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setTodos(data);
      setText("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const updateTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const filteredTodos = () => {
    switch (activeTab) {
      case "todo":
        return todos.filter((t) => !t.done);
      case "done":
        return todos.filter((t) => t.done);
      default:
        return todos;
    }
  };

  return (
    <div className="container">
      <div className="jumbotron text-center">
        <h1>
          nodeTODO <span className="label label-info">{todos.length}</span>
        </h1>
        <div id="todo-form" className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
            <input
              type="text"
              className="form-control text-center"
              placeholder="What do you need to do?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTodo()}
            />
            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={createTodo}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs">
        <li className={activeTab === "all" ? "active" : ""}>
          <a
            href="#all"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("all");
            }}
          >
            All ({todos.length})
          </a>
        </li>
        <li className={activeTab === "todo" ? "active" : ""}>
          <a
            href="#todo"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("todo");
            }}
          >
            Todo ({todos.filter((t) => !t.done).length})
          </a>
        </li>
        <li className={activeTab === "done" ? "active" : ""}>
          <a
            href="#done"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("done");
            }}
          >
            Done ({todos.filter((t) => t.done).length})
          </a>
        </li>
      </ul>

      <div className="tab-content" style={{ marginTop: "20px" }}>
        <div id={activeTab} className="tab-pane active">
          <div className="todo-section">
            <h3 className="section-header">
              {activeTab === "all"
                ? "All Tasks"
                : activeTab === "todo"
                ? "Todo Tasks"
                : "Done Tasks"}
            </h3>
            <div className="todo-list row">
              <div className="col-sm-6 col-sm-offset-3">
                {filteredTodos().map((todo) => (
                  <div className="checkbox" key={todo._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => updateTodo(todo._id)}
                      />
                      <span
                        className={
                          todo.done
                            ? "text-muted text-decoration-line-through"
                            : ""
                        }
                      >
                        {todo.text}
                      </span>
                    </label>
                    <span
                      className="pull-right"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteTodo(todo._id)}
                    >
                      X
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
