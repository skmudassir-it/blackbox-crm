"use client";

import { useEffect, useState } from "react";
import { crmApi, type Todo } from "@/lib/crm-api";
import Modal from "@/components/dashboard/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCheck,
  faTrash,
  faPen,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleReg } from "@fortawesome/free-regular-svg-icons";

const priorityColors: Record<string, string> = { low: "#9CA3AF", medium: "#F59E0B", high: "#EF4444" };

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as Todo["priority"], dueDate: "", category: "" });

  useEffect(() => { fetchTodos(); }, [filter]);

  async function fetchTodos() {
    setLoading(true);
    const res = await crmApi.get<any>("/api/todos" + (filter ? `?status=${filter}` : ""));
    if (res.ok) setTodos(res.data || []);
    setLoading(false);
  }

  async function toggleComplete(todo: Todo) {
    const ns = todo.status === "completed" ? "pending" : "completed";
    await crmApi.put(`/api/todos/${todo._id}`, { status: ns });
    fetchTodos();
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", priority: "medium", dueDate: "", category: "" });
    setShowModal(true);
  }
  function openEdit(todo: Todo) {
    setEditing(todo);
    setForm({ title: todo.title, description: todo.description || "", priority: todo.priority, dueDate: todo.dueDate?.split("T")[0] || "", category: todo.category || "" });
    setShowModal(true);
  }
  async function handleSave() {
    setSaving(true);
    const body = { ...form };
    const res = editing ? await crmApi.put(`/api/todos/${editing._id}`, body) : await crmApi.post("/api/todos", body);
    if (res.ok) { fetchTodos(); setShowModal(false); }
    setSaving(false);
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await crmApi.delete(`/api/todos/${id}`);
    fetchTodos();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><FontAwesomeIcon icon={faTasks} className="text-secondary h-5 w-5" /> To-Do</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-all"><FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Add Task</button>
      </div>
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
        {statusFilters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
        ))}
      </div>
      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : todos.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4"><FontAwesomeIcon icon={faCheck} className="h-7 w-7 text-muted-foreground" /></div>
          <h3 className="text-base font-semibold text-foreground mb-2">No tasks yet</h3>
          <p className="text-sm text-muted-foreground">Create your first to-do item</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => {
            const isDone = todo.status === "completed";
            return (
              <div key={todo._id} className={`bg-card rounded-xl border border-border/50 p-4 flex items-start gap-4 hover:shadow-sm transition-all ${isDone ? "opacity-60" : ""}`}>
                <button onClick={() => toggleComplete(todo)} className="shrink-0 mt-0.5 text-muted-foreground hover:text-secondary transition-colors">
                  <FontAwesomeIcon icon={isDone ? faCheck : faCircleReg} className={`h-5 w-5 ${isDone ? "text-green-500" : ""}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>{todo.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${priorityColors[todo.priority]}15`, color: priorityColors[todo.priority] }}>{todo.priority}</span>
                    {todo.category && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{todo.category}</span>}
                  </div>
                  {todo.description && <p className="text-xs text-muted-foreground mb-2">{todo.description}</p>}
                  {todo.dueDate && <p className="text-xs text-muted-foreground">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(todo)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(todo._id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Task" : "New Task"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Follow up with client" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Details..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-foreground mb-1">Priority</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Todo["priority"] })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Sales, Admin, Personal" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-10 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 transition-all disabled:opacity-50">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
