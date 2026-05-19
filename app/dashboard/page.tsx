"use client";

import { useEffect, useState } from "react";
import { crmApi, type DashboardStats, type Client, type Appointment } from "@/lib/crm-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserCheck,
  faTasks,
  faCalendarCheck,
  faPlus,
  faChevronRight,
  faEnvelope,
  faPhone,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}
        style={{ backgroundColor: `${color}15` }}
      >
        <FontAwesomeIcon icon={icon} className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const res = await crmApi.get<DashboardStats>("/api/dashboard");
      if (res.ok && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  const statCards = [
    {
      icon: faUsers,
      label: "Total Clients",
      value: stats?.totalClients ?? 0,
      color: "#3B82F6",
    },
    {
      icon: faUserCheck,
      label: "Active Clients",
      value: stats?.activeClients ?? 0,
      color: "#14B8A6",
    },
    {
      icon: faTasks,
      label: "Pending Tasks",
      value: stats?.pendingTodos ?? 0,
      color: "#F59E0B",
    },
    {
      icon: faCalendarCheck,
      label: "Upcoming Appointments",
      value: stats?.upcomingAppointments ?? 0,
      color: "#8B5CF6",
    },
  ];

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-600",
    prospect: "bg-amber-100 text-amber-700",
  };

  const appointmentTypeColors: Record<string, string> = {
    call: "bg-blue-100 text-blue-700",
    meeting: "bg-purple-100 text-purple-700",
    followup: "bg-teal-100 text-teal-700",
    renewal: "bg-amber-100 text-amber-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Add Client
        </a>
        <a
          href="/dashboard/todos"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <FontAwesomeIcon icon={faTasks} className="h-3.5 w-3.5" />
          View Tasks
        </a>
        <a
          href="/dashboard/messages"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border border-border/50 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5" />
          Check Messages
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent clients */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="text-base font-semibold text-foreground">
              Recent Clients
            </h2>
            <a
              href="/dashboard/clients"
              className="text-sm font-medium text-secondary hover:underline flex items-center gap-1"
            >
              View All{" "}
              <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Policy
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stats?.recentClients?.length ? (
                  stats.recentClients.slice(0, 5).map((client: Client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm font-medium text-foreground">
                        {client.firstName} {client.lastName}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {client.email}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {client.policyType || "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[client.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-muted-foreground"
                    >
                      No clients yet. Add your first client to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="text-base font-semibold text-foreground">
              Upcoming Appointments
            </h2>
            <a
              href="/dashboard/calendar"
              className="text-sm font-medium text-secondary hover:underline flex items-center gap-1"
            >
              View All{" "}
              <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
            </a>
          </div>
          <div className="p-4 space-y-3">
            {stats?.upcomingAppointmentsList?.length ? (
              stats.upcomingAppointmentsList
                .slice(0, 5)
                .map((apt: Appointment) => (
                  <div
                    key={apt._id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon
                        icon={faCalendarCheck}
                        className="h-4 w-4 text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {apt.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {apt.clientName || "No client"} •{" "}
                        {apt.startTime} – {apt.endTime}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-foreground">
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          appointmentTypeColors[apt.type] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {apt.type}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No upcoming appointments.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
