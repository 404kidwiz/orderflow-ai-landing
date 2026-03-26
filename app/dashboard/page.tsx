"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, DollarSign, Clock, CheckCircle, XCircle, RefreshCw, Phone, ExternalLink } from "lucide-react";

const API = "https://api-production-90b5.up.railway.app";

interface Stats {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  pending_orders: number;
  completed_orders: number;
}

interface Order {
  id: string;
  customer_phone: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  created_at: string;
  call_sid?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  received: { label: "Received", color: "#f97316", bg: "rgba(249,115,22,0.15)", icon: Clock },
  preparing: { label: "Preparing", color: "#eab308", bg: "rgba(234,179,8,0.15)", icon: Package },
  ready: { label: "Ready", color: "#22c55e", bg: "rgba(34,197,94,0.15)", icon: CheckCircle },
  completed: { label: "Completed", color: "#6b7280", bg: "rgba(107,114,128,0.15)", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.15)", icon: XCircle },
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <motion.div
      className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 flex items-center gap-4"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-[var(--gray-600)] text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: (id: string, status: string) => void }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
  const Icon = cfg.icon;
  const [expanded, setExpanded] = useState(false);

  const nextStatus: Record<string, string> = {
    received: "preparing",
    preparing: "ready",
    ready: "completed",
  };

  return (
    <motion.div
      className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: cfg.bg }}
          >
            <Icon size={18} style={{ color: cfg.color }} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">#{order.id}</p>
            <p className="text-xs text-[var(--gray-600)] flex items-center gap-1">
              <Phone size={10} /> {order.customer_phone || "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-[var(--gray-600)]">
              {formatDate(order.created_at)} · {formatTime(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-white">${(order.total || 0).toFixed(2)}</p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
          {nextStatus[order.status] && (
            <button
              className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--orange)] text-white hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(order.id, nextStatus[order.status]);
              }}
            >
              → {STATUS_CONFIG[nextStatus[order.status]]?.label}
            </button>
          )}
        </div>
      </div>

      {/* Expanded items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[var(--border)] px-6 py-4"
          >
            <div className="flex justify-between font-medium text-xs text-[var(--gray-600)] mb-2 px-2">
              <span>Item</span>
              <span>Qty</span>
              <span className="text-right">Price</span>
            </div>
            {(order.items || []).map((item: any, i: number) => (
              <div key={i} className="flex justify-between py-2 px-2 rounded-lg hover:bg-white/5">
                <span className="text-sm text-white">{item.name}</span>
                <span className="text-sm text-[var(--gray-600)]">×{item.quantity || 1}</span>
                <span className="text-sm text-white text-right">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-[var(--border)] mt-2 pt-2 flex justify-between px-2">
              <span className="font-bold text-white">Total</span>
              <span className="font-bold text-[var(--orange)]">${(order.total || 0).toFixed(2)}</span>
            </div>
            {order.call_sid && (
              <p className="text-xs text-[var(--gray-600)] mt-2 px-2">
                Call SID: {order.call_sid}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API}/api/dashboard/stats`),
        fetch(`${API}/api/dashboard/orders?limit=50`),
      ]);
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      setStats(statsData);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`${API}/api/dashboard/orders/${orderId}/status?status=${status}`, { method: "PATCH" });
      fetchData();
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <main className="min-h-screen bg-[var(--void)] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Order Dashboard</h1>
            <p className="text-[var(--gray-600)] mt-1">Pizza Palace — Real-time orders</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Revenue" value={`$${stats.total_revenue.toFixed(2)}`} icon={DollarSign} color="#FF6B35" />
            <StatCard label="Total Orders" value={stats.total_orders} icon={Package} color="#8b5cf6" />
            <StatCard label="Pending" value={stats.pending_orders} icon={Clock} color="#f97316" />
            <StatCard label="Avg. Order" value={`$${stats.avg_order_value.toFixed(2)}`} icon={CheckCircle} color="#22c55e" />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${!filter ? "bg-[var(--orange)] text-white" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)] hover:text-white"}`}
          >
            All
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(filter === key ? null : key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === key ? "" : "bg-[var(--glass)] text-[var(--gray-400)] border border-[var(--border)] hover:text-white"}`}
                style={filter === key ? { background: cfg.color } : {}}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-[var(--orange)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-[var(--gray-600)] mb-4" />
            <p className="text-[var(--gray-600)]">No orders yet</p>
            <p className="text-sm text-[var(--gray-700)] mt-1">Call +17705255393 to place an order</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((order) => (
                <OrderRow key={order.id} order={order} onUpdate={handleUpdateStatus} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
