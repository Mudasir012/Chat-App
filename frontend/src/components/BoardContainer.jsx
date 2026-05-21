import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, X, Trash2 } from "lucide-react";

const COLUMNS = [
  { key: "todo", label: "To Do", color: "bg-gray-500" },
  { key: "inprogress", label: "In Progress", color: "bg-blue-500" },
  { key: "done", label: "Done", color: "bg-green-500" },
];

const BoardContainer = () => {
  const { boardTasks, fetchBoardTasks, createTask, updateTask, deleteTask, selectedGroup } = useChatStore();
  const { authUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBoardTasks();
  }, []);

  const isAdmin = selectedGroup?.members?.some(
    (m) => m.user?._id === authUser._id && m.role === "admin"
  );
  const canDelete = (task) =>
    task.createdBy?._id === authUser._id || task.createdBy === authUser._id || isAdmin;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      await createTask({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = (task, newStatus) => {
    if (task.status === newStatus) return;
    updateTask(task._id, { status: newStatus });
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Delete this task?")) {
      deleteTask(taskId);
    }
  };

  const getNextStatus = (current) => {
    const order = ["todo", "inprogress", "done"];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Task Board</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-content)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-95"
        >
          <Plus className={`size-4 transition-transform duration-300 ${showForm ? "rotate-45" : ""}`} />
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={handleCreate}
            className="mb-6 p-4 bg-[var(--secondary-bg)] rounded-2xl border border-[var(--border)] space-y-3 overflow-hidden"
          >
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base"
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-base"
            />
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-content)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 active:scale-95"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Board Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {COLUMNS.map((col) => {
          const tasks = boardTasks.filter((t) => t.status === col.key);
          const colorMap = {
            todo: "bg-[var(--text-muted)]",
            inprogress: "bg-[var(--accent)]",
            done: "bg-[var(--green)]",
          };
          const headerBgMap = {
            todo: "bg-[var(--text-muted)]/5",
            inprogress: "bg-[var(--accent)]/5",
            done: "bg-[var(--green)]/5",
          };

          return (
            <div key={col.key} className="flex flex-col bg-[var(--secondary-bg)]/30 rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className={`px-4 py-3 ${headerBgMap[col.key]} border-b border-[var(--border)]`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${colorMap[col.key]}`} />
                    <span className="text-sm font-bold">{col.label}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-semibold bg-[var(--bg)] px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence>
                  {tasks.map((task) => {
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group bg-[var(--bg)] rounded-xl p-3 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>
                            )}
                            {task.assignedTo && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <img
                                  src={task.assignedTo.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${task.assignedTo.fullName}`}
                                  alt=""
                                  className="size-4 rounded-full"
                                />
                                <span className="text-[10px] text-[var(--text-muted)]">{task.assignedTo.fullName}</span>
                              </div>
                            )}
                          </div>
                          {canDelete(task) && (
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>

                        {nextStatus && (
                          <button
                            onClick={() => handleStatusChange(task, nextStatus)}
                            className="mt-2 w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all active:scale-95"
                          >
                            Move to {COLUMNS.find((c) => c.key === nextStatus)?.label}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-[var(--text-muted)]">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardContainer;
