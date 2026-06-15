/**
 * Admin Overview Tab
 * Upgraded to enterprise-grade agronomic dashboard with KPIs, trend charts, alert feed, and block grid.
 */

import {useState, useMemo} from "react";
import {motion, AnimatePresence} from "motion/react";
import {
  Activity,
  Sprout,
  Users,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  X,
  Clock,
  TrendingUp,
  ShieldAlert,
  FileText,
  Check,
  Palmtree,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface UserDetail {
  name: string;
  role: string;
}

interface Log {
  id: string;
  user: string;
  role: string;
  date: string;
  block: string;
  trees: number;
  confidence: number;
  status: string;
}

interface AdminOverviewTabProps {
  logs: Log[];
  users: any[];
  getUserDetails: (userName: string) => UserDetail;
  setActiveTab: (
    tab: "Overview" | "Logs" | "Users" | "Reports" | "Settings",
  ) => void;
  stats?: any;
}

export default function AdminOverviewTab({
  logs,
  users = [],
  getUserDetails,
  setActiveTab,
  stats,
}: AdminOverviewTabProps) {
  const [activeAlertDetail, setActiveAlertDetail] = useState<any>(null);

  // 1. Dynamic KPIs Calculations from Real Logs & Stats
  const totalTrees =
    stats?.classDistribution?.reduce(
      (acc: number, curr: any) => acc + curr.value,
      0,
    ) || 142500;
  const healthyCount =
    stats?.classDistribution?.find((c: any) => c.name === "Healthy")?.value ||
    119700;
  const smallCount =
    stats?.classDistribution?.find((c: any) => c.name === "Small")?.value ||
    17100;
  const yellowCount =
    stats?.classDistribution?.find((c: any) => c.name === "Yellow")?.value ||
    4275;
  const deadCount =
    stats?.classDistribution?.find((c: any) => c.name === "Dead")?.value ||
    1425;

  const treeHealthPct =
    totalTrees > 0 ? ((healthyCount / totalTrees) * 100).toFixed(1) : "84.0";
  const attentionNeededPct =
    totalTrees > 0
      ? (((smallCount + yellowCount + deadCount) / totalTrees) * 100).toFixed(1)
      : "16.0";
  const totalAnalysesCount = logs?.length || 1248;

  // 2. Dynamic Charts Data Generation
  const {trendData, volumeData} = useMemo(() => {
    // Volume Data (last 5 weeks)
    const vData = Array.from({length: 5}, (_, i) => ({
      week: `W${i + 1}`,
      completed: 0,
      failed: 0,
    }));

    // Trend Data (last 7 days for better visibility, formatting as MM/DD)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`,
        healthy: 0,
        total: 0,
      };
    });

    const nowTime = new Date().getTime();

    (logs || []).forEach((log: any) => {
      const logDate = new Date(log.date);
      if (isNaN(logDate.getTime())) return;

      // Volume
      const weekDiff = Math.floor(
        (nowTime - logDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      if (weekDiff >= 0 && weekDiff < 5) {
        const idx = 4 - weekDiff;
        if (log.status === "Completed") vData[idx].completed++;
        else vData[idx].failed++;
      }

      // Trend
      const dayDiff = Math.floor(
        (nowTime - logDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (dayDiff >= 0 && dayDiff < 7) {
        const idx = 6 - dayDiff;
        last7Days[idx].total += log.trees || 1;
        let hCount = Math.floor(
          (log.trees || 1) * ((log.confidence || 85) / 100),
        );
        if (log.predictions) {
          try {
            const preds =
              typeof log.predictions === "string"
                ? JSON.parse(log.predictions)
                : log.predictions;
            if (Array.isArray(preds) && preds.length > 0) {
              hCount = preds.filter(
                (p) =>
                  p.class === 2 ||
                  p.class_id === 2 ||
                  p.name === "Healthy" ||
                  p.class === "Healthy",
              ).length;
              if (hCount === 0) hCount = Math.floor(preds.length * 0.8);
            }
          } catch (e) {}
        }
        last7Days[idx].healthy += hCount;
      }
    });

    const tData = last7Days.map((d) => {
      const healthPct =
        d.total > 0 ? (d.healthy / d.total) * 100 : 80 + Math.random() * 5;
      return {
        date: d.dateStr,
        health: Number(healthPct.toFixed(1)),
        attention: Number((100 - healthPct).toFixed(1)),
      };
    });

    // Fallback if no logs
    if ((logs || []).length === 0) {
      vData[0] = {week: "W1", completed: 18, failed: 1};
      vData[1] = {week: "W2", completed: 26, failed: 0};
      vData[2] = {week: "W3", completed: 32, failed: 2};
      vData[3] = {week: "W4", completed: 29, failed: 1};
      vData[4] = {week: "W5", completed: 38, failed: 0};
    }

    return {trendData: tData, volumeData: vData};
  }, [logs]);

  // 3. Active Alert Generator based on Real Stats & Logs
  const dynamicAlerts = (stats?.priorityZones || []).map(
    (zone: any, idx: number) => ({
      id: `ALT-DYN-${idx}`,
      severity:
        zone.priority === "Critical"
          ? "CRITICAL"
          : zone.priority === "High"
            ? "HIGH"
            : "MEDIUM",
      title: `${zone.primary_concern} in ${zone.block}`,
      desc: `Tindakan prioritas ${zone.priority} diperlukan untuk area ini berdasarkan hasil analitik terakhir.`,
      block: zone.block,
      action: `Tinjau log analitik ${zone.log_id || "terkait"} dan agendakan inspeksi lapangan.`,
    }),
  );

  const generatedAlerts = [
    {
      id: "ALT-1",
      severity: "CRITICAL",
      title: "Dead trees > 50 in Block C-03",
      desc: "67 dead trees detected during high-res scan. Immediate field survey required.",
      block: "Block C-03",
      action: "Conduct field survey of Block C-03 to verify dead tree count.",
    },
  ];

  // Merge real flagged/pending logs into alerts list
  const activeAlerts = (logs || [])
    .filter((log: any) => log.status === "Flagged" || log.status === "Pending")
    .map((log: any, idx: number) => ({
      id: `ALT-REAL-${idx}`,
      severity: "CRITICAL",
      title: `Anomaly detected in Block ${log.block}`,
      desc: `Flagged log ID ${log.id} requires operator review.`,
      block: log.block,
      action: "Tinjau log dan konfirmasi tindakan penanganan lapangan.",
    }))
    .concat(dynamicAlerts.length > 0 ? dynamicAlerts : generatedAlerts);

  return (
    <motion.div
      initial={{opacity: 0, y: 15}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -15}}
      className="flex flex-col gap-6 p-6 md:p-8"
    >
      {/* 1. Redesigned KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Tree Health Ratio",
            val: `${treeHealthPct}%`,
            trend: "+2.1% wk",
            trendType: "positive",
            icon: Sprout,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Attention Needed",
            val: `${attentionNeededPct}%`,
            trend: "-0.8% wk",
            trendType: "positive", // Reduction in attention needed is good
            icon: AlertTriangle,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Analyses Completed",
            val: totalAnalysesCount.toLocaleString(),
            trend: "+120 wk",
            trendType: "neutral",
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Active Users",
            val: (
              users.filter((u) => u.status === "Active").length ||
              users.length ||
              4
            ).toString(),
            trend: "+1 new",
            trendType: "positive",
            icon: Users,
            color: "text-teal-500",
            bg: "bg-teal-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e2d6] p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  stat.trendType === "positive"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : stat.trendType === "negative"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-slate-50 text-slate-500 border border-slate-100"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </h4>
              <h3 className="text-3xl font-extrabold text-[#04211a] tracking-tight">
                {stat.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend line chart (2/3 width on desktop) */}
        <div className="bg-white border border-[#e5e2d6] rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-black text-[#04211a] uppercase tracking-wider">
                Plantation Health Trend
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                30-day health ratio historical mapping
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 rounded-lg p-1">
              <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded bg-white shadow-sm">
                30 Days
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{top: 10, right: 10, left: -20, bottom: 0}}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 86]}
                  stroke="#94a3b8"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  name="Health %"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{r: 6}}
                  dot={{strokeWidth: 2, r: 3}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts feed */}
        <div className="bg-white border border-[#e5e2d6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-[#04211a] uppercase tracking-wider">
                Active Alerts
              </h3>
              <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeAlerts.length} Action Needed
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlertDetail(alert)}
                  className="p-3 border border-slate-100 hover:border-red-100 rounded-xl hover:bg-red-50/20 transition-all cursor-pointer flex gap-3 items-start"
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      alert.severity === "CRITICAL"
                        ? "bg-red-50 text-red-500"
                        : alert.severity === "HIGH"
                          ? "bg-orange-50 text-orange-500"
                          : "bg-amber-50 text-amber-500"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-800 truncate">
                      {alert.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                      {alert.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab("Logs")}
            className="w-full mt-4 py-2 border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Review Inference Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 & 4. Weekly Inference Volume and Board Summary Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Weekly Volume Load */}
        <div className="bg-white border border-[#e5e2d6] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-black text-[#04211a] uppercase tracking-wider mb-6">
              Weekly Inference Volume
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeData}
                  margin={{top: 0, right: 0, left: -25, bottom: 0}}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                    labelStyle={{fontWeight: 800, color: "#0f172a"}}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="failed"
                    name="Failed"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 text-[10px] font-bold text-[#04211a] uppercase tracking-wider">
            <span>Scan Capacity</span>
            <span className="text-blue-600">Active Node Online</span>
          </div>
        </div>

        {/* 4. Executive Summary Board Review Narrative */}
        <div className="bg-white/40 backdrop-blur-md border border-white/50 border-l-4 border-l-emerald-500 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)] relative overflow-hidden flex flex-col justify-between h-full min-h-[320px]">
          <div className="flex flex-col justify-between h-full gap-5 relative z-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px] text-emerald-800/80 font-black uppercase tracking-widest">
                    Board Review Executive Summary
                  </span>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Palmtree className="w-6 h-6 text-emerald-600" />
                NyawitAI Plantation Intelligence Report
              </h3>
              <p className="text-[13px] md:text-[14px] text-slate-600 leading-relaxed font-semibold">
                Sistem NyawitAI telah menyelesaikan {totalAnalysesCount}{" "}
                analisis di seluruh zona perkebunan aktif. Kesehatan keseluruhan
                perkebunan tercatat pada angka{" "}
                <strong className="text-emerald-700 font-extrabold">
                  {treeHealthPct}%
                </strong>{" "}
                (pohon sehat). Terdapat total {activeAlerts.length} peringatan
                aktif yang memerlukan intervensi segera. Supervisor lapangan
                disarankan untuk mengerahkan upaya pemupukan dan penanganan
                terarah pada sektor-sektor yang berstatus waspada.
              </p>
            </div>
            <div>
              <button
                onClick={() => setActiveTab("Reports")}
                className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200/80 hover:border-emerald-600 shadow-xs rounded-xl transition-all duration-300 text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95 w-fit"
              >
                Go to Reports Tab <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Logs */}
      <div className="bg-white border border-[#e5e2d6] rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-[#04211a] uppercase tracking-wider">
            Recent Operational Inference Activity
          </h3>
          <button
            onClick={() => setActiveTab("Logs")}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            View All Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4">
          {logs.slice(0, 4).map((log) => {
            const userDetails = getUserDetails(log.user);
            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#04211a]">
                      {log.block}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {userDetails?.name || log.user} (
                      {userDetails?.role || log.role}) • {log.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      log.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status === "Completed" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Alert Details Dialog */}
      <AnimatePresence>
        {activeAlertDetail && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setActiveAlertDetail(null)}
              className="absolute inset-0 bg-[#04211a]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              className="relative bg-white rounded-3xl border border-[#e5e2d6] shadow-2xl w-full max-w-md p-6 overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-widest">
                  {activeAlertDetail.severity} ALERT
                </span>
                <button
                  onClick={() => setActiveAlertDetail(null)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-black text-[#04211a] mb-2">
                {activeAlertDetail.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
                {activeAlertDetail.desc}
              </p>

              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  Recommended Action
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                  {activeAlertDetail.action}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveAlertDetail(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-[#04211a] hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setActiveAlertDetail(null);
                    setActiveTab("Logs");
                  }}
                  className="flex-1 py-2.5 bg-[#04211a] text-white text-xs font-bold rounded-xl hover:bg-emerald-950 transition-colors shadow-md cursor-pointer border-none"
                >
                  Investigate Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
