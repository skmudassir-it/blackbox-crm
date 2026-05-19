"use client";

import { useEffect, useState } from "react";
import { crmApi, type Appointment, type Client } from "@/lib/crm-api";
import Modal from "@/components/dashboard/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlus, faClock, faUser, faCalendarDay, faTrash, faPen, faCircle } from "@fortawesome/free-solid-svg-icons";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const typeColors: Record<string, string> = { call: "#3B82F6", meeting: "#0D9488", followup: "#F59E0B", renewal: "#8B5CF6" };

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", clientId: "", clientName: "", date: "", startTime: "09:00", endTime: "10:00", type: "meeting" as Appointment["type"], notes: "" });

  useEffect(() => { fetchAppointments(); fetchClients(); }, []);

  async function fetchAppointments() { const r = await crmApi.get<any>("/api/appointments"); if (r.ok) setAppointments(r.data || []); }
  async function fetchClients() { const r = await crmApi.get<any>("/api/clients"); if (r.ok) setClients(r.data || []); }

  function daysInMonth(m: number, y: number) { return new Date(y, m + 1, 0).getDate(); }
  function firstDayOfMonth(m: number, y: number) { return new Date(y, m, 1).getDay(); }
  function fmt(y: number, m: number, d: number) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  const dateAppts = selectedDate ? appointments.filter((a) => a.date?.startsWith(selectedDate)) : [];
  const daysWithAppts = new Set(appointments.map((a) => a.date?.split("T")[0]).filter(Boolean));

  function prev() { if (currentMonth===0) { setCurrentMonth(11); setCurrentYear(currentYear-1); } else setCurrentMonth(currentMonth-1); setSelectedDate(null); }
  function next() { if (currentMonth===11) { setCurrentMonth(0); setCurrentYear(currentYear+1); } else setCurrentMonth(currentMonth+1); setSelectedDate(null); }

  function openCreate() {
    setEditing(null);
    setForm({ title: "", clientId: "", clientName: "", date: selectedDate || fmt(currentYear, currentMonth, today.getDate()), startTime: "09:00", endTime: "10:00", type: "meeting", notes: "" });
    setShowModal(true);
  }
  function openEdit(a: Appointment) {
    setEditing(a);
    setForm({ title: a.title, clientId: typeof a.clientId === "object" ? (a.clientId as Client)._id : (a.clientId as string) || "", clientName: a.clientName || "", date: a.date?.split("T")[0] || "", startTime: a.startTime, endTime: a.endTime, type: a.type, notes: a.notes || "" });
    setShowModal(true);
  }
  async function handleSave() {
    setLoading(true);
    const res = editing ? await crmApi.put(`/api/appointments/${editing._id}`, form) : await crmApi.post("/api/appointments", form);
    if (res.ok) { fetchAppointments(); setShowModal(false); }
    setLoading(false);
  }
  async function handleDelete(id: string) { if (!confirm("Delete?")) return; await crmApi.delete(`/api/appointments/${id}`); fetchAppointments(); }

  const totalDays = daysInMonth(currentMonth, currentYear);
  const startDay = firstDayOfMonth(currentMonth, currentYear);
  const cells: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDay} className="text-secondary h-5 w-5" />{MONTHS[currentMonth]} {currentYear}</h2>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 rounded-lg hover:bg-muted transition-colors"><FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" /></button>
          <button onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelectedDate(null); }} className="text-sm font-medium text-secondary hover:underline px-2">Today</button>
          <button onClick={next} className="p-2 rounded-lg hover:bg-muted transition-colors"><FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" /></button>
          <button onClick={openCreate} className="ml-4 inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-all"><FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Add</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 p-4">
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>)}
            {cells.map((day, i) => {
              const ds = day ? fmt(currentYear, currentMonth, day) : "";
              const isToday = ds === fmt(today.getFullYear(), today.getMonth(), today.getDate());
              const hasAppt = daysWithAppts.has(ds);
              const isSel = ds === selectedDate;
              return (
                <button key={i} onClick={() => day && setSelectedDate(ds)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${!day ? "" : isSel ? "bg-primary text-primary-foreground font-semibold" : isToday ? "bg-secondary/10 text-secondary font-bold ring-1 ring-secondary/30" : "hover:bg-muted text-foreground"}`}>
                  {day && <span>{day}</span>}
                  {hasAppt && <FontAwesomeIcon icon={faCircle} className={`h-1.5 w-1.5 mt-0.5 ${isSel ? "text-primary-foreground" : "text-secondary"}`} />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            {selectedDate ? `Appointments — ${new Date(selectedDate+"T12:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}` : "Select a date"}
          </h3>
          {dateAppts.length === 0 ? <p className="text-sm text-muted-foreground">No appointments</p> : (
            <div className="space-y-3">
              {dateAppts.map((a) => (
                <div key={a._id} className="border border-border/40 rounded-xl p-3 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[a.type] || "#6B7280" }} />
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(a)} className="p-1 rounded hover:bg-muted transition-colors"><FontAwesomeIcon icon={faPen} className="h-3 w-3 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(a._id)} className="p-1 rounded hover:bg-muted transition-colors"><FontAwesomeIcon icon={faTrash} className="h-3 w-3 text-muted-foreground" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faClock} className="h-3 w-3" />{a.startTime} – {a.endTime}</span>
                    {a.clientName && <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUser} className="h-3 w-3" />{a.clientName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Appointment" : "New Appointment"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Client meeting" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Client</label><select value={form.clientId} onChange={(e) => { const c = clients.find((x)=>x._id===e.target.value); setForm({...form,clientId:e.target.value,clientName:c?`${c.firstName} ${c.lastName}`:""}); }} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Select client...</option>{clients.map((c) => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-foreground mb-1">Date *</label><input type="date" value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Type</label><select value={form.type} onChange={(e) => setForm({...form,type:e.target.value as Appointment["type"]})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="meeting">Meeting</option><option value="call">Call</option><option value="followup">Follow-up</option><option value="renewal">Renewal</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-foreground mb-1">Start *</label><input type="time" value={form.startTime} onChange={(e) => setForm({...form,startTime:e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">End *</label><input type="time" value={form.endTime} onChange={(e) => setForm({...form,endTime:e.target.value})} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({...form,notes:e.target.value})} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Meeting notes..." /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-10 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={loading || !form.title} className="flex-1 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 transition-all disabled:opacity-50">{loading ? "Saving..." : editing ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
