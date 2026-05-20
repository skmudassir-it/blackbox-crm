"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faBuilding, faLock, faEnvelope, faSave, faCheck,
  faCamera, faTrash, faCrown, faCircleCheck, faClock,
  faCalendarCheck, faCreditCard, faArrowUpRightFromSquare,
  faTriangleExclamation, faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile picture
  const [uploading, setUploading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAgency(user.agency || "");
      setProfilePicPreview(user.profilePicture || null);
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

  async function handleProfilePicUpload(file: File) {
    if (!file) return;
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.upload<{ url: string }>("/api/upload/profile-picture", formData);
    if (res.ok && res.data) {
      setProfilePicPreview(res.data.url);
      if (user) setUser({ ...user, profilePicture: res.data.url });
      setMessage({ type: "success", text: "Profile picture updated!" });
    } else {
      setMessage({ type: "error", text: res.error || "Upload failed" });
    }
    setUploading(false);
  }

  async function handleRemoveProfilePic() {
    setUploading(true);
    const res = await api.delete("/api/upload/profile-picture");
    if (res.ok) {
      setProfilePicPreview(null);
      if (user) setUser({ ...user, profilePicture: undefined });
      setMessage({ type: "success", text: "Profile picture removed" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to remove" });
    }
    setUploading(false);
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") {
      setMessage({ type: "error", text: "Type DELETE to confirm" });
      return;
    }
    setDeleting(true);
    setMessage(null);

    try {
      const token = useAuthStore.getState().token;
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (res.ok) {
        // Sign out and redirect
        useAuthStore.getState().logout();
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to delete account" });
        setDeleting(false);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
      setDeleting(false);
    }
  }

  const subscription = user?.subscription;
  const planName = subscription?.plan === "pro" ? "Professional" : subscription?.plan === "free" ? "Free" : "Trial";
  const statusColor = subscription?.status === "active"
    ? "text-emerald-600 bg-emerald-50"
    : subscription?.status === "trial"
    ? "text-amber-600 bg-amber-50"
    : "text-muted-foreground bg-muted";

  return (
    <>
    <div className="max-w-2xl space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <FontAwesomeIcon icon={message.type === "success" ? faCheck : faLock} className="shrink-0" />
          {message.text}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faCamera} className="text-secondary h-4 w-4" /> Profile Picture
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted border-2 border-border/50 flex items-center justify-center">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-muted-foreground/40" />
              )}
            </div>
            {/* Upload overlay */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <FontAwesomeIcon icon={uploading ? faClock : faCamera} className="h-5 w-5 text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleProfilePicUpload(file);
                e.target.value = "";
              }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-foreground font-medium">
              {uploading ? "Uploading..." : "Upload a profile photo"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP, or GIF — max 5 MB
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 transition-all disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faCamera} className="h-3 w-3" />
                {profilePicPreview ? "Change" : "Upload"}
              </button>
              {profilePicPreview && (
                <button
                  onClick={handleRemoveProfilePic}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium border border-input bg-background text-foreground hover:bg-muted h-8 px-3 transition-all disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faCrown} className="text-amber-500 h-4 w-4" /> Subscription
        </h3>

        <div className="space-y-4">
          {/* Current plan badge */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                subscription?.status === "active" ? "bg-emerald-100" : "bg-amber-100"
              }`}>
                <FontAwesomeIcon
                  icon={subscription?.status === "active" ? faCircleCheck : faClock}
                  className={`h-5 w-5 ${subscription?.status === "active" ? "text-emerald-600" : "text-amber-600"}`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{planName} Plan</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                  {subscription?.status || "trial"}
                </span>
              </div>
            </div>
            <div className="text-right">
              {subscription?.expiryDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarCheck} className="h-3 w-3" />
                  Expires {new Date(subscription.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Payment gateway placeholder */}
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto">
              <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Payment Gateway</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Payment gateway integration is ready to be plugged in. 
                When you have your gateway API (Stripe, Razorpay, etc.), 
                we&apos;ll connect it here to enable paid plans.
              </p>
            </div>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg text-xs font-medium border border-input bg-background text-muted-foreground h-9 px-4 opacity-50 cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
              Configure Payment Gateway
            </button>
          </div>

          {/* Plan features */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-emerald-500" />
              API access for payment gateway
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-emerald-500" />
              Subscription model ready (free / trial / pro)
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-emerald-500" />
              Auto-expiry and status management built in
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
              Awaiting payment gateway API credentials
            </div>
          </div>
        </div>
      </div>

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

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl border border-destructive/20 p-6">
        <h3 className="text-base font-semibold text-destructive flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" /> Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 h-9 px-4 transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
          Delete Account
        </button>
      </div>
    </div>

    {/* Delete Account Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5" />
              Delete Account
            </h3>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword("");
                setDeleteConfirm("");
              }}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account, contacts, emails, and all other data.
              <strong className="text-foreground"> This cannot be undone.</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Enter your password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your current password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Type <span className="font-mono text-destructive">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteConfirm("");
                }}
                className="rounded-md text-sm font-medium h-10 px-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword || deleteConfirm !== "DELETE"}
                className="inline-flex items-center gap-2 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-5 transition-all disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
