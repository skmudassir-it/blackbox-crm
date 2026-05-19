"use client";

import { useEffect, useState } from "react";
import { crmApi, type Client } from "@/lib/crm-api";
import Modal from "@/components/dashboard/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faTrash,
  faPen,
  faEnvelope,
  faPhone,
  faShieldHalved,
  faLocationDot,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "prospect", label: "Prospect" },
];

const policyTypes = [
  { value: "", label: "All Policies" },
  { value: "life", label: "Life" },
  { value: "auto", label: "Auto" },
  { value: "home", label: "Home" },
  { value: "health", label: "Health" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-gray-100 text-gray-600",
  prospect: "bg-amber-100 text-amber-700",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    policyType: "life" as Client["policyType"],
    policyNumber: "",
    carrier: "",
    status: "active" as Client["status"],
    notes: "",
    tags: "",
  });

  useEffect(() => { fetchClients(); }, [statusFilter, policyFilter]);

  async function fetchClients() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (policyFilter) params.set("policyType", policyFilter);
    const qs = params.toString();
    const res = await crmApi.get<any>("/api/clients" + (qs ? `?${qs}` : ""));
    if (res.ok) setClients(res.data || []);
    setLoading(false);
  }

  const handleSearch = () => fetchClients();

  function openCreate() {
    setEditing(null);
    setForm({
      firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "",
      policyType: "life", policyNumber: "", carrier: "", status: "active", notes: "", tags: "",
    });
    setShowModal(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      zip: client.zip || "",
      policyType: client.policyType,
      policyNumber: client.policyNumber || "",
      carrier: client.carrier || "",
      status: client.status,
      notes: client.notes || "",
      tags: (client.tags || []).join(", "),
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = editing
      ? await crmApi.put(`/api/clients/${editing._id}`, body)
      : await crmApi.post("/api/clients", body);
    if (res.ok) {
      await fetchClients();
      setShowModal(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    const res = await crmApi.delete(`/api/clients/${id}`);
    if (res.ok) fetchClients();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faUserGroup} className="text-secondary h-5 w-5" /> Clients
        </h2>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-all">
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search clients..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={policyFilter} onChange={(e) => setPolicyFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          {policyTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Clients Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Policy</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">Loading...</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No clients found. Add your first client to get started.
                </td></tr>
              ) : (
                clients.map((client) => (
                  <tr key={client._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-foreground">{client.firstName} {client.lastName}</p>
                      {client.carrier && <p className="text-xs text-muted-foreground">{client.carrier}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />{client.email}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground hidden md:table-cell">
                      {client.phone ? (
                        <span className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />{client.phone}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
                        {client.policyType} {client.policyNumber ? `#${client.policyNumber}` : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[client.status] || "bg-gray-100 text-gray-600"}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(client)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(client._id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} title={editing ? "Edit Client" : "New Client"} onClose={() => setShowModal(false)}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">First Name *</label>
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Name *</label>
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Smith" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="(555) 123-4567" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ZIP</label>
                <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="12345" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Policy Type</label>
                <select value={form.policyType} onChange={(e) => setForm({ ...form, policyType: e.target.value as Client["policyType"] })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {policyTypes.filter((p) => p.value).map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Carrier</label>
                <input value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. State Farm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Policy Number</label>
                <input value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="POL-12345" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Client["status"] })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {statusOptions.filter((s) => s.value).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Any notes about this client..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="vip, renewal-due, referral" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-10 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.firstName || !form.lastName || !form.email}
                className="flex-1 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 transition-all disabled:opacity-50">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
}
