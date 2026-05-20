"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faEnvelope,
  faPhone,
  faBuilding,
  faUser,
  faXmark,
  faSave,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  notes: "",
  tags: "",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await api.get<Contact[]>(`/api/contacts?${params}`);
      if (res.ok && res.data) setContacts(res.data);
    } catch {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditing(contact);
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      jobTitle: contact.jobTitle || "",
      notes: contact.notes || "",
      tags: contact.tags?.join(", ") || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editing) {
        const res = await api.put<Contact>(`/api/contacts/${editing._id}`, payload);
        if (res.ok) {
          setContacts((prev) =>
            prev.map((c) => (c._id === editing._id ? res.data! : c))
          );
          setModalOpen(false);
        } else {
          setFormError(res.error || "Update failed");
        }
      } else {
        const res = await api.post<Contact>("/api/contacts", payload);
        if (res.ok) {
          setContacts((prev) => [...prev, res.data!]);
          setModalOpen(false);
        } else {
          setFormError(res.error || "Create failed");
        }
      }
    } catch {
      setFormError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await api.delete(`/api/contacts/${id}`);
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      alert("Failed to delete contact");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your business contacts
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Add Contact
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
        />
        <input
          type="text"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
        />
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FontAwesomeIcon icon={faAddressBook} className="text-4xl mb-3 opacity-30" />
          <p>No contacts yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-card rounded-lg border border-border/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {contact.firstName} {contact.lastName}
                  </span>
                  {contact.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {contact.email && (
                    <span className="inline-flex items-center gap-1">
                      <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
                      {contact.email}
                    </span>
                  )}
                  {contact.phone && (
                    <span className="inline-flex items-center gap-1">
                      <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
                      {contact.phone}
                    </span>
                  )}
                  {contact.company && (
                    <span className="inline-flex items-center gap-1">
                      <FontAwesomeIcon icon={faBuilding} className="h-3 w-3" />
                      {contact.company}
                      {contact.jobTitle && ` — ${contact.jobTitle}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(contact)}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h3 className="text-lg font-semibold text-foreground">
                {editing ? "Edit Contact" : "New Contact"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    First Name *
                  </label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Last Name *
                  </label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Company
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Job Title
                  </label>
                  <input
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tags{" "}
                  <span className="text-muted-foreground font-normal">
                    (comma-separated)
                  </span>
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="client, vip, lead"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-md text-sm font-medium h-10 px-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 transition-all disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faSave} className="h-3.5 w-3.5" />
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
