"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar/NavBar";

// ─── Types ────────────────────────────────────────────────────
interface Order {
  phone: string;
  items: string;
  total: number;
  time: string;
  upsell: string | null;
  status: "confirmed" | "ai-upsold";
}

interface DailyStats {
  day: string;
  orders: number;
}

// ─── Hardcoded sample data ──────────────────────────────────────
const SAMPLE_ORDERS: Order[] = [
  { phone: "+1 (404) 555-0182", items: "Ribeye Steak, Caesar Salad", total: 45.00, time: "2 min ago",  upsell: "Add Dessert",       status: "ai-upsold" },
  { phone: "+1 (770) 867-5309", items: "2× Tacos, Fries",            total: 18.50, time: "8 min ago",  upsell: null,              status: "confirmed"  },
  { phone: "+1 (678) 234-7890", items: "Baja Blast Freeze, Mexican Pizza", total: 22.00, time: "14 min ago", upsell: "Add Nachos",  status: "ai-upsold" },
  { phone: "+1 (470) 555-0199", items: "Burrito Bowl",              total: 14.00, time: "23 min ago", upsell: null,              status: "confirmed"  },
  { phone: "+1 (770) 299-4421", items: "3× Crunchy Tacos",         total: 12.75, time: "31 min ago", upsell: "Upgrade to Combo", status: "ai-upsold" },
  { phone: "+1 (404) 867-3311", items: "Fish Tacos, Guac",          total: 21.50, time: "42 min ago", upsell: null,              status: "confirmed"  },
  { phone: "+1 (678) 555-2290", items: "Chicken Quesadilla",         total: 16.25, time: "55 min ago", upsell: "Add Chips & Salsa", status: "ai-upsold" },
  { phone: "+1 (770) 411-7788", items: "Loaded Nachos",             total: 11.00, time: "1 hr ago",  upsell: null,              status: "confirmed"  },
  { phone: "+1 (404) 555-9001", items: "Carnitas Bowl, Horchata",    total: 19.75, time: "1 hr 12 min ago", upsell: "Add Dessert", status: "ai-upsold" },
  { phone: "+1 (470) 788-3344", items: "Veggie Burrito",             total: 13.50, time: "1 hr 30 min ago", upsell: null,        status: "confirmed"  },
];

const WEEKLY_DATA: DailyStats[] = [
  { day: "Mon", orders: 34 },
  { day: "Tue", orders: 28 },
  { day: "Wed", orders: 41 },
  { day: "Thu", orders: 39 },
  { day: "Fri", orders: 52 },
  { day: "Sat", orders: 67 },
  { day: "Sun", orders: 48 },
];

// ─── Mask phone number ─────────────────────────────────────────
function maskPhone(phone: string): string {
  // e.g. "+1 (404) 555-0182" → "+1 (***) ***-0182"
  return phone.replace(/(\+\d)\s\((\d{3})\)\s\d{3}-(\d{4})/, "$1 (***) ***-$3");
}

// ─── Trend arrow ───────────────────────────────────────────────
function TrendArrow({ direction }: { direction: "up" | "down" | "neutral" }) {
  if (direction === "up")   return <span className="text-green-400 text-lg">↑</span>;
  if (direction === "down") return <span className="text-red-400 text-lg">↓</span>;
  return <span className="text-gray-500 text-lg">→</span>;
}

// ─── Metric Card ───────────────────────────────────────────────
function MetricCard({
  label, value, trend, prefix = "", suffix = ""
}: {
  label: string; value: string | number;
  trend?: "up" | "down" | "neutral";
  prefix?: string; suffix?: string;
}) {
  return (
    <motion.div
      className="bg-[#1C1B1B] hover:bg-[#2A2A2A] rounded-xl p-5 flex items-center gap-4 transition-colors cursor-default"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#E7BDB2] mb-1 font-medium">{label}</p>
        <p className="text-4xl font-extrabold text-white leading-none">
          {prefix}<span>{value}</span>{suffix}
        </p>
      </div>
      {trend && (
        <div className="flex flex-col items-center gap-0.5">
          <TrendArrow direction={trend} />
          <span className="text-[10px] text-[#666] font-medium">vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Order Row ─────────────────────────────────────────────────
function OrderRow({ order }: { order: Order }) {
  const isUpsold = order.status === "ai-upsold";
  return (
    <motion.div
      className="bg-[#201F1F] hover:bg-[#2A2A2A] rounded-xl px-4 py-3.5 transition-colors"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: phone + items */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-sm">{maskPhone(order.phone)}</p>
          <p className="text-xs text-[#888] mt-0.5 truncate">{order.items}</p>
        </div>

        {/* Right: total + badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-white font-extrabold text-sm">${order.total.toFixed(2)}</span>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Status badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isUpsold
                  ? "bg-[#8A2BE2]/20 text-[#8A2BE2]"
                  : "bg-[#FF6B35]/20 text-[#FF6B35]"
              }`}
            >
              {isUpsold ? "AI upsold" : "confirmed"}
            </span>
            {/* Upsell note */}
            {order.upsell && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8A2BE2]/20 text-[#8A2BE2]">
                {order.upsell} ✓
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#555]">{order.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Weekly Bar Chart ──────────────────────────────────────────
function WeeklyChart({ data }: { data: DailyStats[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);
  const todayIndex = data.length - 1; // Sunday = last

  return (
    <div className="bg-[#1C1B1B] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#E7BDB2]">Weekly Orders</h3>
        <span className="text-xs text-[#555]">This week</span>
      </div>

      {/* Y-axis labels */}
      <div className="flex gap-3">
        {/* Bars */}
        <div className="flex-1 flex items-end justify-between gap-2 h-32">
          {data.map((d, i) => {
            const heightPct = (d.orders / maxOrders) * 100;
            const isToday = i === todayIndex;
            return (
              <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] text-[#555] font-medium">{d.orders}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: "96px" }}>
                  <motion.div
                    className={`w-full rounded-t-md transition-colors ${
                      isToday ? "bg-[#FF6B35]" : "bg-[#2A2A2A] hover:bg-[#3A3A3A]"
                    }`}
                    style={{ height: `${heightPct}%`, minHeight: "4px" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${isToday ? "text-[#FF6B35]" : "text-[#555]"}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Live indicator ────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 ml-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function OpsDashboard() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [liveMode, setLiveMode] = useState(false);
  const [connected, setConnected] = useState(false);

  // ── Compute metrics from live/hardcoded orders ──
  const metrics = {
    ordersToday: orders.length,
    avgOrder: orders.length
      ? (orders.reduce((s, o) => s + o.total, 0) / orders.length).toFixed(2)
      : "0.00",
    upsellRate: orders.length
      ? Math.round((orders.filter((o) => o.status === "ai-upsold").length / orders.length) * 100)
      : 0,
    revenueToday: orders.reduce((s, o) => s + o.total, 0).toFixed(2),
  };

  // ── Try to fetch from Railway ──
  const fetchLiveOrders = useCallback(async () => {
    try {
      const res = await fetch("https://orderflow-ai.up.railway.app/api/orders/recent", {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Order[] = data.map((o: any) => ({
            phone: o.phone || o.customer_phone || "",
            items: Array.isArray(o.items)
              ? o.items.map((it: any) => `${it.quantity > 1 ? `${it.quantity}× ` : ""}${it.name}`).join(", ")
              : o.items || "",
            total: parseFloat(o.total) || 0,
            time: o.created_at
              ? new Date(o.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
              : "just now",
            upsell: o.ai_upsell || null,
            status: o.ai_upsell ? "ai-upsold" : "confirmed",
          }));
          setOrders(mapped);
          setConnected(true);
          setLiveMode(true);
        }
      }
    } catch {
      // Fall back to hardcoded sample data
    }
  }, []);

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveOrders]);

  return (
    <main className="min-h-screen bg-[#131313] font-['Manrope',sans-serif]">
      {/* Navbar */}
      <NavBar />

      {/* ── Hero Header ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Operations Dashboard
          </h1>
          {connected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <LiveDot />
              <span className="text-xs font-bold text-green-400">Live</span>
            </div>
          ) : (
            <span className="text-xs text-[#555] bg-[#1C1B1B] px-2.5 py-1 rounded-full border border-[#2A2A2A]">
              📡 Connecting to live data…
            </span>
          )}
        </div>
        <p className="text-[#E7BDB2] text-base font-medium">
          La Sabrosita · Real-time order intelligence
        </p>
      </section>

      {/* ── Metric Cards ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Orders Today"
            value={metrics.ordersToday}
            trend="up"
          />
          <MetricCard
            label="Avg Order Value"
            value={`$${metrics.avgOrder}`}
            trend="up"
          />
          <MetricCard
            label="AI Upsell Rate"
            value={`${metrics.upsellRate}%`}
            trend="neutral"
          />
          <MetricCard
            label="Revenue Today"
            value={`$${metrics.revenueToday}`}
            trend="up"
          />
        </div>
      </section>

      {/* ── Recent Orders ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#E7BDB2] uppercase tracking-widest">
            Recent Orders
          </h2>
          {liveMode && (
            <span className="text-xs text-green-400 font-medium flex items-center gap-1">
              <LiveDot /> Auto-refreshing
            </span>
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {orders.map((order, i) => (
              <OrderRow key={`${order.phone}-${i}`} order={order} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Weekly Chart ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <WeeklyChart data={WEEKLY_DATA} />
      </section>
    </main>
  );
}
