"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, DollarSign, Clock, CheckCircle, XCircle, RefreshCw,
  Phone, Lock, X, Users, MessageSquare, TrendingUp, ChevronRight,
  Copy, Check, ExternalLink
} from "lucide-react";

const DASHBOARD_PASSWORD = "pizza2026";
const API = "https://api-production-90b5.up.railway.app";

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

// ─── Orders View ───────────────────────────────────────────────
function OrdersView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sr, or] = await Promise.all([
        fetch(`${API}/api/dashboard/stats`),
        fetch(`${API}/api/dashboard/orders?limit=100`),
      ]);
      setStats(await sr.json());
      const d = await or.json();
      setOrders(d.orders || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 15000); return () => clearInterval(t); }, [fetchData]);

  const handleStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/dashboard/orders/${id}/status?status=${status}`, { method: "PATCH" });
    fetchData();
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;
  const nextStatus: Record<string, string> = { received: "preparing", preparing: "ready", ready: "completed" };

  return (
    <div>
      {/* Stats */}
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
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={Package} msg="No orders yet" sub="Call +17705255393 to test" /> : (
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
function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [lr, cr] = await Promise.all([
        fetch(`${API}/api/dashboard/leads?limit=100`),
        fetch(`${API}/api/dashboard/leads/count`),
      ]);
      const ld = await lr.json();
      setLeads(ld.leads || []);
      setCounts(await cr.json());
    } finally { setLoading(false); }
  }, []);

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
function CallsView() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/dashboard/calls?limit=100`);
      const d = await r.json();
      setCalls(d.calls || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 20000); return () => clearInterval(t); }, [fetchData]);

  return (
    <div>
      {loading ? <LoadingSpinner /> : calls.length === 0 ? <EmptyState icon={Phone} msg="No calls yet" sub="Call +17705255393 to test the voice AI" /> : (
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
type Tab = "orders" | "leads" | "calls";
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "leads",  label: "Leads",  icon: Users },
  { id: "calls",  label: "Calls",  icon: Phone },
];

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const [refreshing, setRefreshing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) { setAuthenticated(true); setWrong(false); }
    else setWrong(true);
  };

  // ─── Login Gate ────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[var(--void)] flex items-center justify-center p-6">
        <motion.div className="w-full max-w-sm bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--orange)]/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-[var(--orange)]" />
            </div>
            <h2 className="text-2xl font-black text-white">OrderFlow Dashboard</h2>
            <p className="text-[var(--gray-600)] mt-1 text-sm">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setWrong(false); }}
              placeholder="Password" autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white placeholder-[var(--gray-700)] focus:outline-none focus:border-[var(--orange)] transition-colors mb-3 text-center text-lg tracking-widest" />
            {wrong && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center mb-3 flex items-center justify-center gap-1">
                <X size={13} /> Incorrect password
              </motion.p>
            )}
            <button type="submit" className="w-full py-3 rounded-xl bg-[var(--orange)] text-white font-bold hover:opacity-90 transition-opacity">
              Unlock
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  // ─── Main Dashboard ────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--void)] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">OrderFlow Dashboard</h1>
            <p className="text-[var(--gray-600)] text-sm">Pizza Palace · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); window.location.reload(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-white hover:bg-white/10 text-sm transition-colors">
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
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
            {tab === "orders" && <OrdersView />}
            {tab === "leads"  && <LeadsView />}
            {tab === "calls"  && <CallsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
