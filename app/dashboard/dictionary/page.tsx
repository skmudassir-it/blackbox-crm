"use client";

import { useEffect, useState } from "react";
import { crmApi, type CrmDocument } from "@/lib/crm-api";
import Modal from "@/components/dashboard/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faThumbTack, faTrash, faPen, faFileLines, faClock } from "@fortawesome/free-solid-svg-icons";

export default function DictionaryPage() {
  const [docs, setDocs] = useState<CrmDocument[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CrmDocument | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  useEffect(() => { fetchDocs(); }, [tagFilter]);

  async function fetchDocs() {
    setLoading(true);
    const qs = tagFilter ? `?tag=${encodeURIComponent(tagFilter)}` : "";
    const res = await crmApi.get<any>("/api/documents" + qs);
    if (res.ok) setDocs(res.data || []);
    setLoading(false);
  }

  const allTags = [...new Set(docs.flatMap((d) => d.tags || []))].sort();
  const filteredDocs = docs.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q);
  });
  const sorted = [...filteredDocs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  function openCreate() {
    setEditing(null);
    setForm({ title: "", content: "", tags: "" });
    setShowModal(true);
  }
  function openEdit(doc: CrmDocument) {
    setEditing(doc);
    setForm({ title: doc.title, content: doc.content, tags: doc.tags.join(", ") });
    setShowModal(true);
  }
  async function handleSave() {
    setSaving(true);
    const body = { title: form.title, content: form.content, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const res = editing ? await crmApi.put(`/api/documents/${editing._id}`, body) : await crmApi.post("/api/documents", body);
    if (res.ok) { fetchDocs(); setShowModal(false); }
    setSaving(false);
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await crmApi.delete(`/api/documents/${id}`);
    fetchDocs();
  }
  async function togglePin(doc: CrmDocument) {
    await crmApi.put(`/api/documents/${doc._id}`, { isPinned: !doc.isPinned });
    fetchDocs();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><FontAwesomeIcon icon={faFileLines} className="text-secondary h-5 w-5" /> Dictionary</h2>
        <div className="flex items-center gap-3">
          <div className="relative"><FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search documents..." /></div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-all"><FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> New Doc</button>
        </div>
      </div>
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setTagFilter("")} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!tagFilter ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setTagFilter(tag === tagFilter ? "" : tag)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${tagFilter === tag ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{tag}</button>
          ))}
        </div>
      )}
      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : sorted.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4"><FontAwesomeIcon icon={faFileLines} className="h-7 w-7 text-muted-foreground" /></div>
          <h3 className="text-base font-semibold text-foreground mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground">Save notes, scripts, templates, and quick-reference docs</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((doc) => {
            const isExpanded = expanded === doc._id;
            return (
              <div key={doc._id} className={`bg-card rounded-2xl border ${doc.isPinned ? "border-secondary/30 shadow-sm" : "border-border/50"} p-5 hover:shadow-md transition-all`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {doc.isPinned && <FontAwesomeIcon icon={faThumbTack} className="h-3.5 w-3.5 text-secondary shrink-0" />}
                    <button onClick={() => setExpanded(isExpanded ? null : doc._id)} className="text-left"><h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">{doc.title}</h3></button>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => togglePin(doc)} className="p-1 rounded hover:bg-muted transition-colors"><FontAwesomeIcon icon={faThumbTack} className={`h-3 w-3 ${doc.isPinned ? "text-secondary" : "text-muted-foreground"}`} /></button>
                    <button onClick={() => openEdit(doc)} className="p-1 rounded hover:bg-muted transition-colors"><FontAwesomeIcon icon={faPen} className="h-3 w-3 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(doc._id)} className="p-1 rounded hover:bg-muted transition-colors"><FontAwesomeIcon icon={faTrash} className="h-3 w-3 text-muted-foreground" /></button>
                  </div>
                </div>
                <div className={`text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}>{doc.content || "No content"}</div>
                {!isExpanded && doc.content.length > 120 && <button onClick={() => setExpanded(doc._id)} className="text-xs text-secondary hover:underline mt-1">Read more</button>}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {doc.tags.map((tag: string) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><FontAwesomeIcon icon={faClock} className="h-3 w-3" />{new Date(doc.updatedAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Document" : "New Document"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Policy renewal script" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Content</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono" placeholder="Write your notes, script, or reference material here..." /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="sales, renewal, script" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-10 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 transition-all disabled:opacity-50">{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
