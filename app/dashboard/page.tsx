"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, DollarSign, Clock, CheckCircle, Phone, RefreshCw,
  Users, MessageSquare, TrendingUp, ChevronRight,
  Copy, Check, ExternalLink, BarChart3, LogIn, Key
} from "lucide-react";

const API = "https://api-production-90b5.up.railway.app";
const TOKEN_KEY = "orderflow_token";
const RESTAURANT_KEY = "orderflow_restaurant";

// ─── Types ────────────────────────────────────────────────────
interface Stats {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  pending_orders: number;
  completed_orders: number;
}

interface Order {
  id: string; call_sid?: string; customer_phone?: string; items: any[];
  total: number; status: string; created_at: string;
}

interface Lead {
  id: string; name: string; email: string; phone: string;
  restaurant?: string; status: string; created_at: string;
}

interface Call {
  id: string; call_sid?: string; from_number?: string; to_number?: string;
  duration_seconds?: number; status?: string; transcript?: string;
  recording_url?: string; created_at: string;
}

interface Analytics {
  call_stats: { total_calls: number; avg_duration_seconds: number; completion_rate: number };
  revenue_per_day: { date: string; revenue: number }[];
  top_items: { name: string; count: number }[];
  lead_funnel: { new: number; contacted: number; qualified: number; converted: number };
  lead_conversion_rate: number;
}

// ─── Config ────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  received:    { label: "Received",    color: "#f97316", bg: "rgba(249,115,22,0.15)"  },
  preparing:   { label: "Preparing",   color: "#eab308", bg: "rgba(234,179,8,0.15)"   },
  ready:       { label: "Ready",       color: "#22c55e", bg: "rgba(34,197,94,0.15)"   },
  completed:   { label: "Completed",   color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  cancelled:   { label: "Cancelled",  color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
  new:         { label: "New",         color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  contacted:   { label: "Contacted",   color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  qualified:   { label: "Qualified",   color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  converted:   { label: "Converted",  color: "#22c55e", bg: "rgba(34,197,94,0.15)"  },
};

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted"];

// ─── Utils ────────────────────────────────────────────────────
function formatTime(s: string) {
  return new Date(s).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtPhone(n?: string) {
  if (!n) return "—";
  return n.startsWith("+1") ? n : `+1 ${n}`;
}
function fmtDuration(s?: number) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
function getAuthHeaders(token: string) {
  return { "Authorization": `Bearer ${token}` };
}

// ─── Login View ────────────────────────────────────────────────
function LoginView({ onLogin }: { onLogin: (token: string, name: string, slug: string) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/dashboard/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid API key");
        return;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(RESTAURANT_KEY, JSON.stringify({
        name: data.restaurant_name,
        slug: data.restaurant_slug,
        id: data.restaurant_id,
      }));
      onLogin(data.token, data.restaurant_name, data.restaurant_slug);
    } catch {
      setError("Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-black text-white">OrderFlow Dashboard</h1>
          <p className="text-[var(--gray-500)] text-sm mt-1">Enter your restaurant API key to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_live_..."
              className="w-full bg-black/30 border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--gray-700)] text-sm focus:outline-none focus:border-[var(--orange)] transition-colors"
              autoFocus
            />
          </div>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              {error}
            </motion.div>
          )}
          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="w-full py-3 rounded-xl bg-[var(--orange)] text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <LogIn size={14} />}
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-[var(--gray-700)] text-xs mt-4">Your API key is stored locally in your browser</p>
      </motion.div>
    </main>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <motion.div
      className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[var(--gray-600)] text-xs font-medium truncate">{label}</p>
        <p className="text-xl font-black text-white truncate">{value}</p>
      </div>
    </motion.div>
  );
}

// ─── Copy Button ───────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded hover:bg-white/10 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-[var(--gray-600)]" />}
    </button>
  );
}

// ─── Orders View ────────────────────────────────────────────────
function OrdersView({ token, restaurantSlug }: { token: string; restaurantSlug: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sr, or] = await Promise.all([
        fetch(`${API}/api/dashboard/stats?restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) }),
        fetch(`${API}/api/dashboard/orders?limit=100&restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) }),
      ]);
      setStats(await sr.json());
      const d = await or.json();
      setOrders(d.orders || []);
    } finally { setLoading(false); }
  }, [token, restaurantSlug]);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 15000); return () => clearInterval(t); }, [fetchData]);

  const handleStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/dashboard/orders/${id}/status?status=${status}`, { method: "PATCH" });
    fetchData();
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;
  const nextStatus: Record<string, string> = { received: "preparing", preparing: "ready", ready: "completed" };

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Revenue" value={`$${stats.total_revenue.toFixed(2)}`} icon={DollarSign} color="#FF6B35" />
          <StatCard label="Total Orders" value={stats.total_orders} icon={Package} color="#8b5cf6" />
          <StatCard label="Pending" value={stats.pending_orders} icon={Clock} color="#f97316" />
          <StatCard label="Avg. Order" value={`$${stats.avg_order_value.toFixed(2)}`} icon={TrendingUp} color="#22c55e" />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilter(null)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${!filter ? "bg-[var(--orange)] text-white" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)]"}`}>All</button>
        {Object.entries(STATUS_CONFIG).filter(([k]) => ["received","preparing","ready","completed"].includes(k)).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(filter === k ? null : k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === k ? "" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)]"}`}
            style={filter === k ? { background: v.color } : {} }>
            {v.label} ({orders.filter((o) => o.status === k).length})
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={Package} msg="No orders yet" sub="Call your voice number to test" /> : (
        <div className="space-y-2">
          {filtered.map((o) => {
            const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.received;
            const [expanded, setExpanded] = useState(false);
            return (
              <motion.div key={o.id} className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/5" onClick={() => setExpanded(!expanded)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                      <CheckCircle size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">#{o.id}</span>
                        <CopyButton text={o.id} />
                      </div>
                      <p className="text-xs text-[var(--gray-600)] flex items-center gap-1"><Phone size={9} /> {fmtPhone(o.customer_phone)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--gray-600)] hidden sm:block">{formatDate(o.created_at)} · {formatTime(o.created_at)}</span>
                    <span className="font-bold text-white text-sm">${(o.total || 0).toFixed(2)}</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    {nextStatus[o.status] && (
                      <button onClick={(e) => { e.stopPropagation(); handleStatus(o.id, nextStatus[o.status]); }}
                        className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--orange)] text-white hover:opacity-90">
                        → {STATUS_CONFIG[nextStatus[o.status]]?.label}
                      </button>
                    )}
                    <ChevronRight size={14} className={`text-[var(--gray-600)] transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </div>
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="border-t border-[var(--border)] px-5 py-3">
                      {(o.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between py-1.5 text-sm">
                          <span className="text-white">{item.name} {item.quantity > 1 ? `×${item.quantity}` : ""}</span>
                          <span className="text-[var(--gray-400)]">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 mt-2 border-t border-[var(--border)]">
                        <span className="font-bold text-white">Total</span>
                        <span className="font-bold text-[var(--orange)]">${(o.total || 0).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Leads View ────────────────────────────────────────────────
function LeadsView({ token, restaurantSlug }: { token: string; restaurantSlug: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [lr, cr] = await Promise.all([
        fetch(`${API}/api/dashboard/leads?limit=100&restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) }),
        fetch(`${API}/api/dashboard/leads/count?restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) }),
      ]);
      const ld = await lr.json();
      setLeads(ld.leads || []);
      setCounts(await cr.json());
    } finally { setLoading(false); }
  }, [token, restaurantSlug]);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 20000); return () => clearInterval(t); }, [fetchData]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/dashboard/leads/${id}/status?status=${status}`, { method: "PATCH" });
    fetchData();
  };

  const filtered = filter ? leads.filter((l) => l.status === filter) : leads;

  return (
    <div>
      {/* Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total Leads" value={counts.total || 0} icon={Users} color="#8b5cf6" />
        {LEAD_STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s] || STATUS_CONFIG.new;
          return (
            <StatCard key={s} label={cfg.label} value={counts[s] || 0} icon={s === "converted" ? CheckCircle : MessageSquare} color={cfg.color} />
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilter(null)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${!filter ? "bg-[var(--orange)] text-white" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)]"}`}>All</button>
        {LEAD_STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilter(filter === s ? null : s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === s ? "" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)]"}`}
              style={filter === s ? { background: cfg.color } : {}}>
              {cfg.label} ({leads.filter((l) => l.status === s).length})
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={Users} msg="No leads yet" sub="Submit the lead form on the landing page" /> : (
        <div className="space-y-2">
          {filtered.map((lead) => {
            const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const nextLeadStatus: Record<string, string> = { new: "contacted", contacted: "qualified", qualified: "converted" };
            return (
              <motion.div key={lead.id} className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl px-5 py-3.5 flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/20 flex items-center justify-center shrink-0 text-[var(--orange)] font-black text-sm">
                    {lead.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-[var(--gray-600)] flex items-center gap-1">
                      <Phone size={9} /> {lead.phone} · {lead.email}
                      {lead.restaurant && <span className="text-[var(--orange)]"> · {lead.restaurant}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  <span className="text-xs text-[var(--gray-600)] whitespace-nowrap">{formatDate(lead.created_at)}</span>
                  {nextLeadStatus[lead.status] && (
                    <button onClick={() => updateStatus(lead.id, nextLeadStatus[lead.status])}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--orange)] text-white hover:opacity-90 whitespace-nowrap">
                      → {STATUS_CONFIG[nextLeadStatus[lead.status]]?.label}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Calls View ───────────────────────────────────────────────
function CallsView({ token, restaurantSlug }: { token: string; restaurantSlug: string }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/dashboard/calls?limit=100&restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) });
      const d = await r.json();
      setCalls(d.calls || []);
    } finally { setLoading(false); }
  }, [token, restaurantSlug]);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 20000); return () => clearInterval(t); }, [fetchData]);

  return (
    <div>
      {loading ? <LoadingSpinner /> : calls.length === 0 ? <EmptyState icon={Phone} msg="No calls yet" sub="Call your voice number to test the AI" /> : (
        <div className="space-y-2">
          {calls.map((call) => {
            const statusColor = call.status === "completed" ? "#22c55e" : call.status === "failed" ? "#ef4444" : "#f97316";
            return (
              <motion.div key={call.id} className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl px-5 py-3.5"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${statusColor}20` }}>
                      <Phone size={14} style={{ color: statusColor }} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{fmtPhone(call.from_number)}</p>
                      <p className="text-xs text-[var(--gray-600)]">to {call.to_number || "—"} · {call.call_sid?.slice(0, 20) || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--gray-600)]">{call.created_at ? `${formatDate(call.created_at)} · ${formatTime(call.created_at)}` : "—"}</span>
                    <span className="text-sm font-bold text-white">{fmtDuration(call.duration_seconds)}</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${statusColor}20`, color: statusColor }}>{call.status || "unknown"}</span>
                    {call.recording_url && (
                      <a href={call.recording_url} target="_blank" rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                        <ExternalLink size={12} className="text-[var(--gray-400)]" />
                      </a>
                    )}
                  </div>
                </div>
                {call.transcript && (
                  <div className="mt-2 text-xs text-[var(--gray-400)] bg-black/20 rounded-lg px-3 py-2 max-h-20 overflow-y-auto">
                    <span className="text-[var(--gray-600)] font-medium">Transcript: </span>{call.transcript.slice(0, 300)}{call.transcript.length > 300 ? "..." : ""}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Analytics View ────────────────────────────────────────────
function AnalyticsView({ token, restaurantSlug }: { token: string; restaurantSlug: string }) {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/dashboard/analytics?restaurant_id=${restaurantSlug}`, { headers: getAuthHeaders(token) });
      const json = await r.json();
      setData(json);
    } finally { setLoading(false); }
  }, [token, restaurantSlug]);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  const maxRevenue = data ? Math.max(...data.revenue_per_day.map((d) => d.revenue), 1) : 1;

  // Lead funnel values
  const funnel = data?.lead_funnel ?? { new: 0, contacted: 0, qualified: 0, converted: 0 };
  const funnelMax = Math.max(funnel.new, funnel.contacted, funnel.qualified, funnel.converted, 1);

  const funnelSteps = [
    { label: "New", value: funnel.new, color: "#8b5cf6" },
    { label: "Contacted", value: funnel.contacted, color: "#3b82f6" },
    { label: "Qualified", value: funnel.qualified, color: "#10b981" },
    { label: "Converted", value: funnel.converted, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      {/* Call Stats */}
      <div>
        <h3 className="text-sm font-bold text-[var(--gray-500)] uppercase tracking-wider mb-3">📞 Call Performance</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-white">{data?.call_stats.total_calls ?? 0}</p>
            <p className="text-xs text-[var(--gray-600)] mt-1">Total Calls</p>
          </div>
          <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-white">{fmtDuration(data?.call_stats.avg_duration_seconds)}</p>
            <p className="text-xs text-[var(--gray-600)] mt-1">Avg Duration</p>
          </div>
          <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-white">{Math.round((data?.call_stats.completion_rate ?? 0) * 100)}%</p>
            <p className="text-xs text-[var(--gray-600)] mt-1">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div>
        <h3 className="text-sm font-bold text-[var(--gray-500)] uppercase tracking-wider mb-3">💰 Revenue — Last 7 Days</h3>
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-5">
          {data?.revenue_per_day && data.revenue_per_day.length > 0 ? (
            <>
              <div className="flex items-end gap-1 h-24 mb-3">
                {data.revenue_per_day.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[var(--orange)] rounded-t transition-all hover:opacity-80"
                      style={{ height: `${Math.max((d.revenue / maxRevenue) * 96, 4)}px` }}
                      title={`$${d.revenue.toFixed(2)}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {data.revenue_per_day.map((d, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className="text-[10px] text-[var(--gray-700)]">
                      {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-[var(--gray-600)] text-sm py-8">No revenue data yet</p>
          )}
        </div>
      </div>

      {/* Top Items */}
      <div>
        <h3 className="text-sm font-bold text-[var(--gray-500)] uppercase tracking-wider mb-3">🔥 Top Items</h3>
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {data?.top_items && data.top_items.length > 0 ? data.top_items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[var(--orange)]/20 text-[var(--orange)] text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-white font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-[var(--gray-400)]">{item.count} orders</span>
            </div>
          )) : (
            <p className="text-center text-[var(--gray-600)] text-sm py-6">No item data yet</p>
          )}
        </div>
      </div>

      {/* Lead Funnel */}
      <div>
        <h3 className="text-sm font-bold text-[var(--gray-500)] uppercase tracking-wider mb-3">🎯 Lead Funnel</h3>
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            {funnelSteps.map((step, i) => {
              const pct = funnelMax > 0 ? (step.value / funnelMax) * 100 : 0;
              const isLast = i === funnelSteps.length - 1;
              return (
                <div key={step.label} className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="h-2 rounded-full bg-black/30 overflow-hidden flex-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: step.color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-white">{step.value}</span>
                    <span className="text-[10px] text-[var(--gray-700)]">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--gray-600)]">Conversion Rate</span>
            <span className="font-black text-[var(--orange)]">{Math.round((data?.lead_conversion_rate ?? 0) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ─────────────────────────────────────────
function LoadingSpinner() {
  return <div className="flex items-center justify-center py-20"><RefreshCw size={28} className="animate-spin text-[var(--orange)]" /></div>;
}
function EmptyState({ icon: Icon, msg, sub }: { icon: any; msg: string; sub?: string }) {
  return (
    <div className="text-center py-20">
      <Icon size={40} className="mx-auto text-[var(--gray-700)] mb-3" />
      <p className="text-[var(--gray-500)]">{msg}</p>
      {sub && <p className="text-xs text-[var(--gray-700)] mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────
type Tab = "orders" | "leads" | "calls" | "analytics";
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "orders",    label: "Orders",    icon: Package },
  { id: "leads",     label: "Leads",     icon: Users },
  { id: "calls",     label: "Calls",     icon: Phone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("Pizza Palace");
  const [restaurantSlug, setRestaurantSlug] = useState("sample");

  // Check for existing token on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      const storedRest = localStorage.getItem(RESTAURANT_KEY);
      if (storedRest) {
        try {
          const rest = JSON.parse(storedRest);
          setRestaurantName(rest.name || "Restaurant");
          setRestaurantSlug(rest.slug || "sample");
        } catch {}
      }
    }
  }, []);

  const handleLogin = (newToken: string, name: string, slug: string) => {
    setToken(newToken);
    setRestaurantName(name);
    setRestaurantSlug(slug);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(RESTAURANT_KEY);
    setToken(null);
  };

  // Not logged in → show login
  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Logged in → show dashboard
  return (
    <main className="min-h-screen bg-[var(--void)] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">OrderFlow Dashboard</h1>
            <p className="text-[var(--gray-600)] text-sm">
              {restaurantName} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); window.location.reload(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-white hover:bg-white/10 text-sm transition-colors">
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-[var(--gray-500)] hover:text-red-400 hover:border-red-500/30 text-sm transition-colors">
              Sign Out
            </button>
            <a href="/" target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-white hover:bg-white/10 text-sm transition-colors">
              Landing <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white/5 rounded-2xl p-1.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === id ? "bg-[var(--orange)] text-white shadow-lg shadow-[var(--orange)]/20" : "text-[var(--gray-500)] hover:text-white"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === "orders"    && <OrdersView token={token} restaurantSlug={restaurantSlug} />}
            {tab === "leads"     && <LeadsView token={token} restaurantSlug={restaurantSlug} />}
            {tab === "calls"     && <CallsView token={token} restaurantSlug={restaurantSlug} />}
            {tab === "analytics" && <AnalyticsView token={token} restaurantSlug={restaurantSlug} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
