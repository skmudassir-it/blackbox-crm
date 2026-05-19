"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding, faLock, faEnvelope, faSave, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAgency(user.agency || "");
    }
  }, [user]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const body: any = { name, agency };
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "New passwords don't match" });
        setSaving(false);
        return;
      }
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    const res = await api.put<any>("/api/auth/profile", body);
    if (res.ok && res.data) {
      setUser(res.data);
      setMessage({ type: "success", text: "Profile updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update profile" });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <FontAwesomeIcon icon={message.type === "success" ? faCheck : faLock} className="shrink-0" />
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faUser} className="text-secondary h-4 w-4" /> Profile
        </h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input value={user?.email || ""} disabled
                className="w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Agency Name</label>
            <div className="relative">
              <FontAwesomeIcon icon={faBuilding} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input value={agency} onChange={(e) => setAgency(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your agency" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 transition-all disabled:opacity-50">
            <FontAwesomeIcon icon={faSave} className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faLock} className="text-secondary h-4 w-4" /> Change Password
        </h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter current password" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Confirm new password" />
            </div>
          </div>
          <button type="submit" disabled={saving || !newPassword}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 transition-all disabled:opacity-50">
            <FontAwesomeIcon icon={faLock} className="h-3.5 w-3.5" />
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
