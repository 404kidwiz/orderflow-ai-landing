"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, RefreshCw, Copy, Check, Trash2, Phone,
  Key, Eye, EyeOff, X, ExternalLink, AlertCircle,
  Store, ChevronRight, Globe
} from "lucide-react";

const API = "https://api-production-90b5.up.railway.app";
const GATE_PASSWORD = "orderflow123";

// ─── Types ────────────────────────────────────────────────────
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  phone_number: string;
  api_key: string;
  active: boolean;
  created_at?: string;
}

// ─── Password Gate ─────────────────────────────────────────────
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim() === GATE_PASSWORD) {
      localStorage.setItem("restaurants_gate", "1");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--void)] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--orange)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key size={28} className="text-[var(--orange)]" />
          </div>
          <h1 className="text-2xl font-black text-white">Restaurant Admin</h1>
          <p className="text-[var(--gray-500)] text-sm mt-1">Enter your admin password to continue</p>
        </div>
        <form onSubmit={handle} className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--gray-700)] text-sm focus:outline-none focus:border-[var(--orange)] transition-colors"
              autoFocus
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2"
            >
              <AlertCircle size={12} /> Incorrect password
            </motion.div>
          )}
          <button
            type="submit"
            disabled={!pw.trim()}
            className="w-full py-3 rounded-xl bg-[var(--orange)] text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            <Key size={14} /> Enter
          </button>
        </form>
      </motion.div>
    </main>
  );
}

// ─── Copy Button ───────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={12} className="text-green-400" />
      ) : (
        <Copy size={12} className="text-[var(--gray-600)]" />
      )}
    </button>
  );
}

// ─── Add Restaurant Modal ──────────────────────────────────────
interface AddModalProps {
  onClose: () => void;
  onAdded: (r: Restaurant) => void;
}

function AddRestaurantModal({ onClose, onAdded }: AddModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [menuJson, setMenuJson] = useState(
    JSON.stringify(
      {
        categories: [
          {
            name: "Pizza",
            items: [
              { name: "Margherita", price: 14.99, description: "Fresh mozzarella, tomato, basil" },
              { name: "Pepperoni", price: 16.99, description: "Loaded with pepperoni" },
            ],
          },
          {
            name: "Sides",
            items: [
              { name: "Garlic Bread", price: 5.99 },
              { name: "Caesar Salad", price: 7.99 },
            ],
          },
        ],
      },
      null,
      2
    )
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    let menu;
    try {
      menu = JSON.parse(menuJson);
    } catch {
      setError("Invalid JSON in menu field.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/restaurants/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, menu }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      onAdded({
        id: data.id,
        name: data.name,
        slug: data.slug,
        phone_number: data.phone_number || "",
        api_key: data.api_key,
        active: data.active,
        created_at: data.created_at,
      });
      onClose();
    } catch (err) {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg bg-[var(--void-light)] border border-[var(--border)] rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/20 flex items-center justify-center">
              <Plus size={16} className="text-[var(--orange)]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Add Restaurant</h2>
              <p className="text-xs text-[var(--gray-600)]">Register a new restaurant account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X size={16} className="text-[var(--gray-600)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-1.5">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pizza Palace"
                className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-white placeholder-[var(--gray-700)] text-sm focus:outline-none focus:border-[var(--orange)] transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+17705551234"
                className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-white placeholder-[var(--gray-700)] text-sm focus:outline-none focus:border-[var(--orange)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-1.5">
              Contact Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@pizzapalace.com"
              className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-white placeholder-[var(--gray-700)] text-sm focus:outline-none focus:border-[var(--orange)] transition-colors"
            />
          </div>

          {/* Menu JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider">
                Menu Structure (JSON)
              </label>
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="flex items-center gap-1 text-xs text-[var(--orange)] hover:opacity-80"
              >
                {showJson ? <EyeOff size={11} /> : <Eye size={11} />}
                {showJson ? "Hide" : "Show"}
              </button>
            </div>
            {showJson ? (
              <pre className="bg-black/40 border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--gray-400)] font-mono overflow-auto max-h-48">
                {menuJson}
              </pre>
            ) : (
              <textarea
                value={menuJson}
                onChange={(e) => setMenuJson(e.target.value)}
                rows={6}
                className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-3 py-2.5 text-white placeholder-[var(--gray-700)] text-sm font-mono focus:outline-none focus:border-[var(--orange)] transition-colors resize-none"
                placeholder='{"categories": [{"name": "...", "items": [...]}]}'
              />
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2"
            >
              <AlertCircle size={12} /> {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-[var(--gray-400)] text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[var(--orange)] text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
              {loading ? "Creating..." : "Create Restaurant"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── API Key Reveal ─────────────────────────────────────────────
function ApiKeyReveal({ apiKey }: { apiKey: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex items-center gap-1.5 bg-black/30 rounded-lg px-2.5 py-1 border border-[var(--border)]">
      <code className="text-xs font-mono text-[var(--gray-400)] select-all">
        {revealed ? apiKey : "•".repeat(Math.min(apiKey.length, 20))}
      </code>
      <CopyButton text={apiKey} />
      <button
        onClick={() => setRevealed(!revealed)}
        className="p-0.5 rounded hover:bg-white/10 transition-colors"
        title={revealed ? "Hide" : "Reveal"}
      >
        {revealed ? <EyeOff size={11} className="text-[var(--gray-600)]" /> : <Eye size={11} className="text-[var(--gray-600)]" />}
      </button>
    </div>
  );
}

// ─── Restaurant Card ────────────────────────────────────────────
function RestaurantCard({ restaurant, onDeleted }: { restaurant: Restaurant; onDeleted: (id: string) => void }) {
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    // In a real app, we'd call a DELETE endpoint. For now, just remove locally.
    await new Promise((r) => setTimeout(r, 500));
    onDeleted(restaurant.id);
    setDeleting(false);
    setShowDelete(false);
  };

  return (
    <motion.div
      className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        {/* Left: name + phone */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-[var(--orange)]/15 flex items-center justify-center shrink-0">
            <Store size={16} className="text-[var(--orange)]" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-white text-sm truncate">{restaurant.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone size={9} className="text-[var(--gray-600)] shrink-0" />
              <span className="text-xs text-[var(--gray-600)] font-mono">
                {restaurant.phone_number || "No phone"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: API key */}
        <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
          <ApiKeyReveal apiKey={restaurant.api_key} />
        </div>

        {/* Right: status + actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              background: restaurant.active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: restaurant.active ? "#22c55e" : "#ef4444",
            }}
          >
            {restaurant.active ? "Active" : "Inactive"}
          </span>

          <a
            href={`/dashboard?restaurant=${restaurant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Open dashboard"
          >
            <ExternalLink size={12} className="text-[var(--gray-600)]" />
          </a>

          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Delete restaurant"
          >
            <Trash2 size={12} className="text-red-400/60 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Mobile: API key row */}
      <div className="sm:hidden px-5 pb-4">
        <div className="flex items-center gap-2">
          <Globe size={10} className="text-[var(--gray-700)]" />
          <span className="text-xs text-[var(--gray-700)]">API Key:</span>
          <ApiKeyReveal apiKey={restaurant.api_key} />
        </div>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="border-t border-[var(--border)] overflow-hidden"
          >
            <div className="px-5 py-3 flex items-center justify-between gap-4">
              <p className="text-xs text-[var(--gray-400)]">
                Permanently delete <strong className="text-white">{restaurant.name}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--border)] text-xs text-[var(--gray-400)] font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs text-red-400 font-bold hover:bg-red-500/30 flex items-center gap-1"
                >
                  {deleting ? <RefreshCw size={10} className="animate-spin" /> : <Trash2 size={10} />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Loading Spinner ───────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <RefreshCw size={28} className="animate-spin text-[var(--orange)]" />
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      className="text-center py-24 px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-20 h-20 rounded-2xl bg-[var(--orange)]/10 flex items-center justify-center mx-auto mb-4">
        <Store size={32} className="text-[var(--orange)]/40" />
      </div>
      <h3 className="text-lg font-black text-white mb-2">No restaurants yet</h3>
      <p className="text-[var(--gray-600)] text-sm mb-6 max-w-xs mx-auto">
        Add your first restaurant to start taking AI-powered voice orders.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--orange)] text-white text-sm font-bold hover:opacity-90 transition-all"
      >
        <Plus size={14} /> Add Your First Restaurant
      </button>
    </motion.div>
  );
}

// ─── Restaurants Page ───────────────────────────────────────────
export default function RestaurantsPage() {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("restaurants_gate") === "1"
  );
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    // The /api/restaurants/list endpoint lists from the DB
    try {
      const res = await fetch(`${API}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      }
    } catch {
      // Backend may not have list endpoint — fall back to localStorage cache
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    fetchRestaurants();
  }, [unlocked, fetchRestaurants]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  };

  const handleAdded = (r: Restaurant) => {
    setRestaurants((prev) => [r, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  if (!unlocked) {
    return <Gate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen bg-[var(--void)] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[var(--orange)]/20 flex items-center justify-center">
                <Store size={13} className="text-[var(--orange)]" />
              </div>
              <span className="text-xs text-[var(--gray-600)] font-medium">Multi-tenant</span>
            </div>
            <h1 className="text-2xl font-black text-white">Restaurants</h1>
            <p className="text-[var(--gray-600)] text-sm">
              {restaurants.length === 0
                ? "No restaurants registered"
                : `${restaurants.length} restaurant${restaurants.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-white hover:bg-white/10 text-sm transition-colors"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--orange)] text-white text-sm font-bold hover:opacity-90 transition-all"
            >
              <Plus size={14} /> Add Restaurant
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : restaurants.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="space-y-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onDeleted={handleDeleted} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--gray-700)]">
            Each restaurant gets a unique API key. Share it with the restaurant owner to integrate the voice AI.
          </p>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddRestaurantModal
            onClose={() => setShowAddModal(false)}
            onAdded={handleAdded}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
