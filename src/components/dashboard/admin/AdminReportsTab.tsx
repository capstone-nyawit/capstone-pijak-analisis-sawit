import {useState} from "react";
import {createPortal} from "react-dom";
import {motion} from "motion/react";
import {
  FileText,
  Download,
  Users,
  BarChart3,
  Loader2,
  ChevronDown,
  X,
  Eye,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface AdminReportsTabProps {
  reports?: Report[];
  triggerDownload?: (name: string, format: string) => void;
  selectedReportId?: string;
  setSelectedReportId?: (id: string) => void;
  logs?: any[];
  deleteReport?: (id: string) => void;
}

interface PrintableAdminReportProps {
  title: string;
  dateStr: string;
  reportKey: string;
  month?: string;
  data: any; // Aggregated real data
}

interface ReportTemplate {
  key: string;
  title: string;
  desc: string;
  frequency: string;
  target: string;
  icon: any;
  defaultFormat: string;
  lastGenerated?: string;
}

// ─── SVG Donut Chart Helper ──────────────────────────────────────────────────
function PrintableDonutChart({
  healthy,
  yellowing,
  smallCanopy,
  dead,
}: {
  healthy: number;
  yellowing: number;
  smallCanopy: number;
  dead: number;
}) {
  const total = healthy + yellowing + smallCanopy + dead || 1;
  const pHealthy = (healthy / total) * 100;
  const pSmall = (smallCanopy / total) * 100;
  const pYellow = (yellowing / total) * 100;
  const pDead = (dead / total) * 100;

  const radius = 40;
  const circ = 2 * Math.PI * radius; // ~251.32

  const sHealthy = (pHealthy / 100) * circ;
  const sSmall = (pSmall / 100) * circ;
  const sYellow = (pYellow / 100) * circ;
  const sDead = (pDead / 100) * circ;

  return (
    <div className="border border-[#E5E7EB] p-4 rounded-xl bg-white space-y-2 flex flex-col h-full justify-between">
      <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
        HEALTH DISTRIBUTION
      </span>
      <div className="flex items-center gap-6 pt-1">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="transform -rotate-90 shrink-0"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F9FAFB"
            strokeWidth="12"
          />

          {/* Healthy Segment */}
          {sHealthy > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10B981"
              strokeWidth="12"
              strokeDasharray={`${sHealthy} ${circ}`}
              strokeDashoffset={0}
            />
          )}

          {/* Small Canopy Segment */}
          {sSmall > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#3B82F6"
              strokeWidth="12"
              strokeDasharray={`${sSmall} ${circ}`}
              strokeDashoffset={-sHealthy}
            />
          )}

          {/* Yellowing Segment */}
          {sYellow > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#D97706"
              strokeWidth="12"
              strokeDasharray={`${sYellow} ${circ}`}
              strokeDashoffset={-(sHealthy + sSmall)}
            />
          )}

          {/* Dead Segment */}
          {sDead > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#DC2626"
              strokeWidth="12"
              strokeDasharray={`${sDead} ${circ}`}
              strokeDashoffset={-(sHealthy + sSmall + sYellow)}
            />
          )}
        </svg>

        <div className="space-y-1.5 text-[11px] font-bold text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
            <span className="text-[#111827]">
              Healthy ({pHealthy.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
            <span className="text-[#111827]">
              Small Canopy ({pSmall.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
            <span className="text-[#111827]">
              Yellowing ({pYellow.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
            <span className="text-[#111827]">
              Dead / Missing ({pDead.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Trend Line Helper ────────────────────────────────────────────────────
function PrintableTrendLine({
  points,
}: {
  points: {date: string; healthScore: number}[];
}) {
  if (!points || points.length === 0) return null;

  const width = 300;
  const height = 80;
  const padding = 5;

  const healthScores = points.map((p) => p.healthScore);
  const minVal = Math.min(...healthScores);
  const maxVal = Math.max(...healthScores);

  const minRange = minVal - 1;
  const maxRange = maxVal + 1;
  const range = maxRange - minRange || 1;

  const getX = (idx: number) =>
    padding + (idx / (points.length - 1)) * (width - 2 * padding);
  const getY = (val: number) =>
    height - padding - ((val - minRange) / range) * (height - 2 * padding);

  let pathD = "";
  points.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.healthScore);
    if (idx === 0) {
      pathD = `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });

  return (
    <div className="border border-[#E5E7EB] p-4 rounded-xl bg-white space-y-2 flex flex-col h-full justify-between">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em]">
          30-DAY HEALTH TREND
        </span>
        <span className="text-[10px] text-[#6B7280] font-bold">
          MIN: {minVal}% | MAX: {maxVal}%
        </span>
      </div>
      <div className="pt-2">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <path
            d={pathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-[#6B7280] font-semibold pt-1">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// Helper to get priority badge styles
const getPriorityBadgeStyle = (prio: string) => {
  switch (prio?.toUpperCase()) {
    case "CRITICAL":
      return {color: "#991B1B", backgroundColor: "#FEE2E2"};
    case "HIGH":
      return {color: "#C2410C", backgroundColor: "#FFEDD5"};
    case "MEDIUM":
      return {color: "#92400E", backgroundColor: "#FEF3C7"};
    case "LOW":
    default:
      return {color: "#065F46", backgroundColor: "#D1FAE5"};
  }
};

// ─── Printable Report Template (for window.print PDF) ────────────────────────
function PrintableAdminReport({
  title,
  dateStr,
  reportKey,
  month,
  data,
}: PrintableAdminReportProps) {
  if (!data) return null;

  const reportId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    },
  );
  const genTimestamp = new Date()
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  const getMonitoringPeriod = () => {
    const monthStr = month || "Jun 2026";
    const parts = monthStr.split(" ");
    if (parts.length !== 2) return monthStr;
    const filterMonthName = parts[0];
    const filterYear = parseInt(parts[1], 10);

    const monthNamesShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthNamesFull = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const filterMonthIdx = monthNamesShort.indexOf(filterMonthName);
    if (filterMonthIdx === -1) return monthStr;

    const today = new Date();
    const currentMonthIdx = today.getMonth();
    const currentYear = today.getFullYear();

    const lastDayOfCurrentMonth = new Date(
      currentYear,
      currentMonthIdx + 1,
      0,
    ).getDate();
    const isLastDay = today.getDate() === lastDayOfCurrentMonth;

    if (filterMonthIdx === currentMonthIdx && filterYear === currentYear) {
      if (isLastDay) {
        return `${monthNamesFull[currentMonthIdx]} ${currentYear} (Full Month)`;
      } else {
        const startOfStr = `${filterMonthName} 1`;
        const endOfStr = `${filterMonthName} ${today.getDate()}, ${currentYear}`;
        return `${startOfStr} – ${endOfStr} (Partial)`;
      }
    } else {
      return `${monthNamesFull[filterMonthIdx]} ${filterYear} (Full Month)`;
    }
  };

  const periodLabel = getMonitoringPeriod();

  return (
    <div
      className="printable-only p-10 bg-white text-[#111827] mx-auto space-y-5"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "210mm",
        minHeight: "297mm",
      }}
    >
      {/* SECTION 1: DOCUMENT HEADER */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-[20px] font-extrabold tracking-tight text-[#111827]"
              style={{fontSize: "20px"}}
            >
              {reportKey === "exec"
                ? "NyawitAI Agronomy Report"
                : "NyawitAI — Zone Intervention Priority Report"}
            </h1>
            <p className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] mt-0.5">
              PLANTATION INTELLIGENCE SYSTEMS
            </p>
            <p className="text-[11px] text-[#6B7280] font-semibold mt-1">
              {reportKey === "exec"
                ? "Health & Yield Summary  ·  Executive Summary Dashboard"
                : "Operational field priority dispatch"}
            </p>
          </div>
          <div className="text-right space-y-1 shrink-0">
            {reportKey === "exec" ? (
              <>
                <span className="text-[11px] font-extrabold text-[#991B1B] uppercase tracking-wider block">
                  CONFIDENTIAL
                </span>
                <p className="text-[11px] text-[#6B7280] font-semibold">
                  Report Cycle: Monthly
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-[#6B7280] font-semibold">
                  Report Cycle: On-Demand
                </p>
                <p className="text-[11px] text-[#111827] font-bold">
                  Monitoring Period: {periodLabel}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="border-t-2 border-emerald-800 w-full mt-3" />
      </div>

      {/* SECTION 2: CRITICAL INTERVENTION ALERT */}
      {reportKey === "zone" &&
        (() => {
          // Find CRITICAL zone with highest anomaly count (worst zone)
          const criticalZones = (data.zones || []).filter(
            (z: any) => z.priority === "CRITICAL",
          );
          const criticalZone =
            criticalZones.length > 0
              ? criticalZones.reduce(
                  (worst: any, z: any) =>
                    z.anomalies > worst.anomalies ? z : worst,
                  criticalZones[0],
                )
              : null;
          if (!criticalZone) return null;

          const plansText = criticalZone.treatmentPlans?.join(", ");

          return (
            <div
              className="bg-[#FEF2F2] p-[12px] px-[16px] rounded-[6px] border-l-[3px] border-l-[#DC2626] space-y-1"
              style={{borderLeft: "3px solid #DC2626"}}
            >
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#991B1B]">
                <span>⚠</span>
                <span>CRITICAL INTERVENTION ALERT</span>
              </div>
              <p className="text-[13px] text-[#111827] leading-[1.6] font-medium">
                {criticalZone.zone} terdeteksi memiliki tingkat kesehatan{" "}
                {criticalZone.healthy}% dengan anomali {criticalZone.anomalyPct}
                % dari total pohon. Tindakan segera diperlukan: {plansText}.
              </p>
            </div>
          );
        })()}

      {/* SECTION 3: KPI HERO ROW */}
      {reportKey === "exec" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
              <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                TOTAL UAV INFERENCES
              </span>
              <span className="text-[22px] font-bold text-[#111827]">
                {data.totalAnalyses} Runs
              </span>
            </div>
            <div className="border border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
              <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                TOTAL TREES MONITORED
              </span>
              <span className="text-[22px] font-bold text-[#111827]">
                {data.totalTrees?.toLocaleString()}
              </span>
            </div>
            <div className="border border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
              <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                PLANTATION HEALTH INDEX
              </span>
              <span className="text-[24px] font-black text-[#10B981]">
                {data.healthScore}%
              </span>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] w-full" />
        </div>
      )}

      {/* SECTION 3 (ZONE): KPI ROW */}
      {reportKey === "zone" &&
        (() => {
          const totalTreesAnalyzed =
            data.zones?.reduce(
              (sum: number, z: any) => sum + (z.trees || 0),
              0,
            ) || 0;
          const totalHealthyTrees =
            data.zones?.reduce(
              (sum: number, z: any) => sum + (z.healthy / 100) * z.trees,
              0,
            ) || 0;
          const avgHealthPct =
            totalTreesAnalyzed > 0
              ? (totalHealthyTrees / totalTreesAnalyzed) * 100
              : 0;
          const avgHealthFormatted = avgHealthPct.toFixed(1);

          let avgColor = "#DC2626";
          if (avgHealthPct > 85) avgColor = "#10B981";
          else if (avgHealthPct >= 80) avgColor = "#D97706";

          const criticalZone = data.zones?.find(
            (z: any) => z.priority === "CRITICAL",
          );
          const lowestHealthZone = data.zones?.length
            ? data.zones.reduce(
                (worst: any, cur: any) =>
                  cur.healthy < worst.healthy ? cur : worst,
                data.zones[0],
              )
            : null;
          const focusZone = criticalZone || lowestHealthZone;
          const focusValue = focusZone
            ? `${focusZone.zone} (${focusZone.healthy}%)`
            : "N/A";
          const focusColor =
            focusZone?.priority === "CRITICAL"
              ? "#DC2626"
              : focusZone?.priority === "HIGH"
                ? "#D97706"
                : "#111827";

          return (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="border-[0.5px] border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
                  <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                    TOTAL UAV TREES
                  </span>
                  <span className="text-[22px] font-bold text-[#111827]">
                    {totalTreesAnalyzed.toLocaleString()}
                  </span>
                </div>
                <div className="border-[0.5px] border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
                  <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                    AVERAGE HEALTH SCORE
                  </span>
                  <span
                    className="text-[22px] font-bold"
                    style={{color: avgColor}}
                  >
                    {avgHealthFormatted}%
                  </span>
                </div>
                <div className="border-[0.5px] border-[#E5E7EB] p-4 rounded-xl space-y-1 bg-white">
                  <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-[0.08em] block">
                    CRITICAL FOCUS ZONE
                  </span>
                  <span
                    className="text-[16px] font-bold truncate block"
                    style={{color: focusColor}}
                  >
                    {focusValue}
                  </span>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB] w-full" />
            </div>
          );
        })()}

      {/* SECTION 3: EXECUTIVE SUMMARY */}
      {reportKey === "exec" && (
        <div className="space-y-3">
          <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
            EXECUTIVE SUMMARY FINDINGS
          </span>
          <div className="bg-[#F9FAFB] border-[0.5px] border-[#E5E7EB] p-4 rounded-xl">
            <p className="text-[13px] text-[#111827] leading-[1.6] font-medium text-justify">
              {data.executiveSummaryText}
            </p>
          </div>
          <div className="border-t border-[#E5E7EB] w-full" />
        </div>
      )}

      {/* SECTION 4 (ZONE): PRIORITY SUMMARY ROW */}
      {reportKey === "zone" &&
        (() => {
          const sortedByHealth = [...(data.zones || [])].sort(
            (a, b) => a.healthy - b.healthy,
          );
          const worstZoneItem = sortedByHealth[0];
          const bestZoneItem = sortedByHealth[sortedByHealth.length - 1];

          return (
            <div className="space-y-5">
              <div className="border border-[#E5E7EB] p-4 rounded-xl bg-white space-y-4">
                <div className="grid grid-cols-4 gap-4 text-center font-bold text-[14px]">
                  <div className="p-2 border border-[#E5E7EB] rounded-lg">
                    <span className="block text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
                      CRITICAL
                    </span>
                    <span className="text-[16px] font-bold text-[#DC2626]">
                      {data.summary?.critical || 0}
                    </span>
                  </div>
                  <div className="p-2 border border-[#E5E7EB] rounded-lg">
                    <span className="block text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
                      HIGH
                    </span>
                    <span className="text-[16px] font-bold text-[#D97706]">
                      {data.summary?.high || 0}
                    </span>
                  </div>
                  <div className="p-2 border border-[#E5E7EB] rounded-lg">
                    <span className="block text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
                      MEDIUM
                    </span>
                    <span className="text-[16px] font-bold text-[#D97706]">
                      {data.summary?.medium || 0}
                    </span>
                  </div>
                  <div className="p-2 border border-[#E5E7EB] rounded-lg">
                    <span className="block text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
                      LOW
                    </span>
                    <span className="text-[16px] font-bold text-[#6B7280]">
                      {data.summary?.low || 0}
                    </span>
                  </div>
                </div>

                <div className="text-[12px] text-[#6B7280] font-semibold space-y-1 pl-1">
                  <div>
                    Worst Zone:{" "}
                    <span className="text-[#111827] font-bold">
                      {worstZoneItem?.zone || "N/A"}
                    </span>{" "}
                    ({worstZoneItem?.healthy ?? 0}% healthy,{" "}
                    {worstZoneItem?.anomalyPct ?? 0}% anomaly)
                  </div>
                  <div>
                    Best Zone:&#8194;
                    <span className="text-[#111827] font-bold">
                      {bestZoneItem?.zone || "N/A"}
                    </span>{" "}
                    ({bestZoneItem?.healthy ?? 0}% healthy,{" "}
                    {bestZoneItem?.anomalyPct ?? 0}% anomaly)
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB] w-full" />
            </div>
          );
        })()}

      {/* SECTION 4: HEALTH DISTRIBUTION + TREND CHART */}
      {reportKey === "exec" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6 items-stretch">
            <PrintableDonutChart
              healthy={data.healthDistribution.healthy}
              yellowing={data.healthDistribution.yellowing}
              smallCanopy={data.healthDistribution.smallCanopy}
              dead={data.healthDistribution.dead}
            />
            <PrintableTrendLine points={data.trend30Days} />
          </div>
          <div className="border-t border-[#E5E7EB] w-full" />
        </div>
      )}

      {/* SECTION: INFERENCE ACTIVITY — MONTHLY VOLUME CHART */}
      {reportKey === "exec" &&
        (() => {
          const items: any[] = data.inferenceByUser || [];
          const dailyVol: any[] = data.dailyInferenceVolume || [];
          const totalMonthCount = items.reduce(
            (s: number, u: any) => s + u.analysis_count,
            0,
          );

          // SVG chart config
          const svgW = 620;
          const svgH = 90;
          const axisH = 14; // space for day labels at bottom
          const chartH = svgH - axisH;
          const n = dailyVol.length || 1;
          const barSlot = svgW / n;
          const barW = Math.max(barSlot - 2, 2);
          const maxDailyCount = Math.max(
            ...dailyVol.map((d: any) => d.count),
            1,
          );

          const userColors: Record<string, string> = {};
          const palette = [
            "#10B981",
            "#3B82F6",
            "#8B5CF6",
            "#F59E0B",
            "#EF4444",
            "#06B6D4",
            "#EC4899",
          ];
          items.forEach((u: any, i: number) => {
            userColors[u.operator_name] = palette[i % palette.length];
          });

          return (
            <div className="space-y-3">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em]">
                  MONTHLY INFERENCE VOLUME
                </span>
                <span className="text-[10px] text-[#6B7280] font-semibold">
                  {month || "Jun 2026"} · {items.length} operator
                  {items.length !== 1 ? "s" : ""} · {totalMonthCount} total runs
                </span>
              </div>

              {/* Volume chart card */}
              <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
                {/* SVG bar chart — daily inference volume */}
                <div className="px-4 pt-4 pb-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider">
                      Daily Inference Count
                    </span>
                    <span className="text-[9px] text-[#9CA3AF] font-semibold">
                      Peak: {maxDailyCount} runs
                    </span>
                  </div>
                  <svg
                    width="100%"
                    height={svgH}
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    preserveAspectRatio="none"
                  >
                    {/* Subtle grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((frac) => {
                      const y = chartH - frac * chartH;
                      return (
                        <line
                          key={frac}
                          x1="0"
                          y1={y}
                          x2={svgW}
                          y2={y}
                          stroke="#F3F4F6"
                          strokeWidth="0.75"
                        />
                      );
                    })}

                    {/* Bars */}
                    {dailyVol.map((d: any, i: number) => {
                      const barH =
                        d.count > 0
                          ? Math.max((d.count / maxDailyCount) * chartH, 3)
                          : 0;
                      const x = i * barSlot + (barSlot - barW) / 2;
                      const y = chartH - barH;
                      const showLabel =
                        d.day === 1 ||
                        d.day % 5 === 0 ||
                        i === dailyVol.length - 1;
                      const isToday = i === dailyVol.length - 1;

                      return (
                        <g key={i}>
                          {/* Bar */}
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={barH}
                            fill={isToday ? "#059669" : "#10B981"}
                            opacity={isToday ? 1 : 0.65}
                            rx="1"
                          />
                          {/* Day label */}
                          {showLabel && (
                            <text
                              x={x + barW / 2}
                              y={svgH - 1}
                              textAnchor="middle"
                              fontSize="6.5"
                              fill={isToday ? "#059669" : "#9CA3AF"}
                              fontWeight={isToday ? "bold" : "normal"}
                              fontFamily="Inter, system-ui, sans-serif"
                            >
                              {d.day}
                            </text>
                          )}
                          {/* Count on top of tall bars */}
                          {barH > 18 && (
                            <text
                              x={x + barW / 2}
                              y={y - 2}
                              textAnchor="middle"
                              fontSize="6"
                              fill="#059669"
                              fontWeight="bold"
                              fontFamily="Inter, system-ui, sans-serif"
                            >
                              {d.count}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Baseline */}
                    <line
                      x1="0"
                      y1={chartH}
                      x2={svgW}
                      y2={chartH}
                      stroke="#E5E7EB"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>

                {/* Per-user summary strip — name + count + color dot */}
                <div className="border-t border-[#E5E7EB] px-4 py-3">
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {items.length === 0 ? (
                      <span className="text-[11px] text-slate-400 font-semibold">
                        No operator data this period.
                      </span>
                    ) : (
                      items.map((u: any, idx: number) => {
                        const color = palette[idx % palette.length];
                        const share =
                          totalMonthCount > 0
                            ? (
                                (u.analysis_count / totalMonthCount) *
                                100
                              ).toFixed(0)
                            : "0";
                        return (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{backgroundColor: color}}
                            />
                            <span className="text-[11px] font-bold text-[#111827]">
                              {u.operator_name}
                            </span>
                            <span className="text-[11px] text-[#6B7280] font-semibold">
                              {u.analysis_count} runs ({share}%)
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* KPI strip */}
                <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2.5 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider block">
                      Active Operators
                    </span>
                    <span className="text-[13px] font-black text-[#111827]">
                      {items.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider block">
                      Total Month Runs
                    </span>
                    <span className="text-[13px] font-black text-[#111827]">
                      {totalMonthCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider block">
                      Peak Day
                    </span>
                    <span className="text-[13px] font-black text-[#111827]">
                      {dailyVol.length > 0
                        ? (() => {
                            const peak = dailyVol.reduce(
                              (best: any, d: any) =>
                                d.count > best.count ? d : best,
                              dailyVol[0],
                            );
                            return `${peak.date} (${peak.count})`;
                          })()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] w-full" />
            </div>
          );
        })()}

      {/* SECTION 5: PRIORITY INTERVENTION ZONES */}
      {reportKey === "exec" && (
        <div className="space-y-4 pt-6" style={{pageBreakBefore: "always"}}>
          <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
            PRIORITY INTERVENTION ZONES
          </span>
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] font-bold uppercase text-[11px] tracking-wider">
                  <th className="px-4 py-3">ZONE</th>
                  <th className="px-4 py-3">PRIORITY</th>
                  <th className="px-4 py-3">RECOMMENDED ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827] text-[12px] font-medium">
                {data.priorityZones?.slice(0, 3).map((zone: any, i: number) => {
                  const prio = zone.priority;
                  return (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                    >
                      <td className="px-4 py-3 font-bold text-[#111827]">
                        {zone.block}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                          style={getPriorityBadgeStyle(prio)}
                        >
                          {prio}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#111827] font-semibold">
                        {zone.recommendation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#6B7280] italic pl-1 font-medium">
            Showing top 3 priority zones. See Zone Intervention Priority Report
            for full breakdown.
          </p>
          {data.allSamePriorityNote && (
            <p className="text-[10px] text-[#6B7280] italic pl-1 font-semibold">
              {data.allSamePriorityNote}
            </p>
          )}
        </div>
      )}

      {/* SECTION 5 (ZONE): ZONE INTERVENTION TABLE */}
      {reportKey === "zone" &&
        (() => {
          const getUrgencyBadgeStyle = (prio: string) => {
            switch (prio?.toUpperCase()) {
              case "CRITICAL":
                return {
                  color: "#991B1B",
                  backgroundColor: "#FEE2E2",
                  fontWeight: "bold",
                };
              case "HIGH":
                return {
                  color: "#92400E",
                  backgroundColor: "#FEF3C7",
                  fontWeight: "bold",
                };
              case "MEDIUM":
                return {
                  color: "#1D4ED8",
                  backgroundColor: "#EFF6FF",
                  fontWeight: "bold",
                };
              case "LOW":
              default:
                return {
                  color: "#166534",
                  backgroundColor: "#F0FDF4",
                  fontWeight: "bold",
                };
            }
          };

          return (
            <div className="space-y-4">
              <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
                ZONE INTERVENTION BREAKDOWN
              </span>
              <div className="border-[0.5px] border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F3F4F6] border-b border-[#E5E7EB] text-[#6B7280] font-bold uppercase text-[11px] tracking-wider">
                      <th className="px-4 py-3">ZONE / BLOCK</th>
                      <th className="px-4 py-3">URGENCY</th>
                      <th className="px-4 py-3">HEALTH SCORE</th>
                      <th className="px-4 py-3">COVERAGE</th>
                      <th className="px-4 py-3">TREATMENT PLAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#111827] text-[12px] font-medium">
                    {data.zones?.map((z: any, i: number) => {
                      // Coverage color rules
                      const countColor =
                        z.coverageCount === 1 ? "#D97706" : "#111827";
                      const dateColor =
                        z.daysSinceAnalysis > 30 ? "#DC2626" : "#6B7280";

                      return (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                          style={{minHeight: "48px"}}
                        >
                          {/* ZONE / BLOCK */}
                          <td className="px-4 py-3.5 font-bold text-[#111827]">
                            {z.zone}
                          </td>

                          {/* URGENCY badge */}
                          <td className="px-4 py-3.5">
                            <span
                              className="px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider block text-center max-w-[80px]"
                              style={getUrgencyBadgeStyle(z.priority)}
                            >
                              {z.priority}
                            </span>
                          </td>

                          {/* HEALTH SCORE — 2 lines only */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <div className="font-bold text-[12px] text-[#111827]">
                                {z.healthy}% Healthy
                              </div>
                              <div className="text-[11px] text-[#6B7280] font-semibold">
                                Anomaly: {z.anomalyPct}%
                              </div>
                            </div>
                          </td>

                          {/* COVERAGE — count + last date */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <div
                                className="font-bold text-[12px]"
                                style={{color: countColor}}
                              >
                                {z.coverageCount}x analyzed
                              </div>
                              <div
                                className="text-[11px] font-semibold"
                                style={{color: dateColor}}
                              >
                                Last: {z.lastAnalyzed}
                              </div>
                            </div>
                          </td>

                          {/* TREATMENT PLAN */}
                          <td className="px-4 py-3.5 text-[#111827] font-semibold text-[11px] leading-snug">
                            {z.treatmentPlans?.map(
                              (plan: string, pIdx: number) => (
                                <div key={pIdx}>{plan}</div>
                              ),
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#E5E7EB] w-full" />
            </div>
          );
        })()}

      {/* SECTION 6: INTERVENTION PROGRAM SUMMARY */}
      {reportKey === "exec" && (
        <div className="space-y-4">
          <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
            INTERVENTION PROGRAM SUMMARY
          </span>
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] font-bold uppercase text-[11px] tracking-wider">
                  <th className="px-4 py-3">PROGRAM NAME</th>
                  <th className="px-4 py-3">AFFECTED ZONES</th>
                  <th className="px-4 py-3 text-right">ESTIMATED TREES</th>
                  <th className="px-4 py-3">URGENCY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827] text-[12px] font-medium">
                {data.interventionSummary?.map((item: any, i: number) => {
                  const urg = item.urgency;
                  return (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                    >
                      <td className="px-4 py-3 font-bold text-[#111827]">
                        {item.programName}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] font-semibold">
                        {item.affectedZones}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#111827]">
                        {item.estimatedTrees}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                          style={getPriorityBadgeStyle(urg)}
                        >
                          {urg}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6 (ZONE): INTERVENTION DISPATCH SUMMARY */}
      {reportKey === "zone" &&
        (() => {
          const getUrgencyBadgeStyle = (prio: string) => {
            switch (prio?.toUpperCase()) {
              case "CRITICAL":
                return {
                  color: "#991B1B",
                  backgroundColor: "#FEE2E2",
                  fontWeight: "bold",
                };
              case "HIGH":
                return {
                  color: "#92400E",
                  backgroundColor: "#FEF3C7",
                  fontWeight: "bold",
                };
              case "MEDIUM":
                return {
                  color: "#1D4ED8",
                  backgroundColor: "#EFF6FF",
                  fontWeight: "bold",
                };
              case "LOW":
              default:
                return {
                  color: "#166534",
                  backgroundColor: "#F0FDF4",
                  fontWeight: "bold",
                };
            }
          };

          return (
            <div className="space-y-4">
              <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-[0.08em] block">
                INTERVENTION DISPATCH SUMMARY
              </span>
              <div className="border-[0.5px] border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F3F4F6] border-b border-[#E5E7EB] text-[#6B7280] font-bold uppercase text-[11px] tracking-wider">
                      <th className="px-4 py-3">PROGRAM NAME</th>
                      <th className="px-4 py-3">AFFECTED ZONES</th>
                      <th className="px-4 py-3 text-right">ESTIMATED TREES</th>
                      <th className="px-4 py-3">URGENCY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#111827] text-[12px] font-medium">
                    {data.dispatchSummary?.map((item: any, i: number) => {
                      const zoneText =
                        item.affectedCount === 1
                          ? "1 zone"
                          : `${item.affectedCount} zones`;
                      return (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                          style={{minHeight: "48px"}}
                        >
                          <td className="px-4 py-3.5 font-bold text-[#111827]">
                            {item.program}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="space-y-0.5">
                              <div className="font-bold">{zoneText}</div>
                              <div className="text-[10px] text-[#6B7280] font-semibold">
                                {item.affectedZonesList?.join(", ")}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-[#111827]">
                            {item.estimatedTrees}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                              style={getUrgencyBadgeStyle(item.urgency)}
                            >
                              {item.urgency}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

      {/* SECTION 7: FOOTER */}
      <div className="border-t-2 border-emerald-800 pt-6 text-center text-[10px] text-[#6B7280] font-semibold space-y-1">
        <p className="font-normal text-slate-500">
          Dokumen ini diproduksi secara otomatis oleh NyawitAI Plantation
          Intelligence Platform.
        </p>
        <p className="font-normal text-slate-500">
          Rekomendasi bersifat operasional berdasarkan hasil analisis citra UAV
          orthomosaic.
        </p>
      </div>
    </div>
  );
}

// ─── Preview Modal ───────────────────────────────────────────────────────────
interface PreviewModalProps {
  report: ReportTemplate;
  onClose: () => void;
  onDownload: () => void;
  isLoading: boolean;
  data: any;
}

function PreviewModal({
  report,
  onClose,
  onDownload,
  isLoading,
  data,
}: PreviewModalProps) {
  const getPreviewConfig = () => {
    if (!data) {
      return {
        headers: ["Loading...", "", "", ""],
        rows: [["Fetching data from API...", "", "", ""]],
      };
    }

    if (report.key === "exec") {
      return {
        headers: ["Block ID", "Anomalous Factor", "Priority", "Recommendation"],
        rows:
          data.priorityZones?.map((z: any) => [
            z.block,
            z.anomalousFactor || "N/A",
            z.priority,
            z.recommendation,
          ]) || [],
      };
    } else if (report.key === "user") {
      return {
        headers: ["Staff Name", "Role", "Total Analyses", "Success Rate"],
        rows: data.map((u: any) => [
          u.name,
          u.role,
          u.totalLogs.toString(),
          u.successRate,
        ]),
      };
    } else {
      return {
        headers: ["Zone", "Priority", "Healthy %", "Trend"],
        rows:
          data.zones?.map((z: any) => [
            z.zone,
            z.priority,
            `${z.healthy}%`,
            z.trend,
          ]) || [],
      };
    }
  };

  const preview = getPreviewConfig();

  return (
    <div className="fixed inset-0 z-[1000] bg-[#04211a]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{opacity: 0, scale: 0.95, y: 10}}
        animate={{opacity: 1, scale: 1, y: 0}}
        exit={{opacity: 0, scale: 0.95}}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <Eye className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#04211a]">
                Report Preview
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                {report.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="w-4 h-4 text-slate-450" />
          </button>
        </div>

        {/* Modal Body ── Summary Preview */}
        <div className="px-6 py-5 space-y-4">
          <div className="bg-[#fcfbf7] rounded-xl border border-[#e5e2d6] p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Description
            </span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {report.desc}
            </p>
          </div>

          {/* Mini Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0">
                  {preview.headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-3 py-2 font-semibold ${j === 0 ? "text-[#04211a] font-bold" : "text-slate-500"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 font-medium text-center">
            Showing real-time records aggregated directly from the database.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer border-none"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            disabled={isLoading || !data}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#04211a] hover:bg-emerald-950 text-white text-xs font-black rounded-xl transition-all cursor-pointer border-none shadow-md disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Download {report.defaultFormat}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section Table Component ─────────────────────────────────────────────────
interface SectionTableProps {
  templates: ReportTemplate[];
  loadingKey: string | null;
  onDownload: (tmpl: ReportTemplate) => void;
  onPreview: (tmpl: ReportTemplate) => void;
  monthFilter?: string;
  setMonthFilter?: (v: string) => void;
}

const getMonthOptions = () => {
  const options: string[] = [];
  const startYear = 2026;
  const startMonth = 5; // June (0-indexed)

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let y = currentYear;
  let m = currentMonth;

  while (y > startYear || (y === startYear && m >= startMonth)) {
    options.push(`${monthNames[m]} ${y}`);
    m--;
    if (m < 0) {
      m = 11;
      y--;
    }
  }

  return options.length > 0 ? options : ["Jun 2026"];
};

const MONTH_OPTIONS = getMonthOptions();

function SectionTable({
  templates,
  loadingKey,
  onDownload,
  onPreview,
  monthFilter,
  setMonthFilter,
}: SectionTableProps) {
  return (
    <div className="space-y-3">
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fcfbf9] border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
              <th className="px-6 py-4">Document Title</th>
              <th className="px-6 py-4">Cycle</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-[13px]">
            {templates.map((tmpl) => {
              const isLoading = loadingKey === tmpl.key;
              const Icon = tmpl.icon;
              return (
                <tr
                  key={tmpl.key}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 shrink-0">
                        <Icon className="w-[18px] h-[18px] text-slate-450" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-extrabold text-[#04211a] block leading-tight">
                          {tmpl.title}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200/60">
                      {tmpl.frequency}
                    </span>
                    {tmpl.lastGenerated && (
                      <span className="block text-[10px] text-slate-450 font-medium mt-1.5 pl-0.5">
                        Last generated: {tmpl.lastGenerated}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-slate-500 font-medium max-w-[280px] align-top">
                    <span
                      className="text-xs leading-relaxed block truncate"
                      title={tmpl.desc}
                    >
                      {tmpl.desc}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right align-top">
                    <div className="flex items-center justify-end gap-2">
                      {tmpl.key === "zone" && setMonthFilter && (
                        <div className="relative">
                          <select
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 cursor-pointer focus:outline-none focus:border-slate-350 min-w-[120px]"
                          >
                            {MONTH_OPTIONS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-450 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}

                      <button
                        onClick={() => onPreview(tmpl)}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold cursor-pointer transition-all border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>

                      <button
                        onClick={() => onDownload(tmpl)}
                        disabled={isLoading}
                        title={`Download ${tmpl.defaultFormat}`}
                        className="inline-flex items-center justify-center p-2.5 bg-[#04211a] hover:bg-emerald-950 text-white rounded-xl shadow-md shadow-emerald-950/10 cursor-pointer active:scale-95 transition-all border-none disabled:opacity-60 disabled:cursor-wait"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 text-emerald-450" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminReportsTab({
  reports = [],
  triggerDownload,
  selectedReportId,
  setSelectedReportId,
  deleteReport,
}: AdminReportsTabProps) {
  const [printReport, setPrintReport] =
    useState<PrintableAdminReportProps | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState(
    MONTH_OPTIONS[0] || "Jun 2026",
  );
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(
    null,
  );

  const [execData, setExecData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [zoneData, setZoneData] = useState<any>(null);

  const allReports: ReportTemplate[] = [
    {
      key: "exec",
      title: "Health & Yield Summary",
      desc: "Monthly health scores, priority zones, and yield estimations for review.",
      frequency: "Monthly",
      target: "Directors & Shareholders",
      icon: FileText,
      defaultFormat: "PDF",
      lastGenerated: "Jun 1, 2026",
    },
    {
      key: "user",
      title: "User Activity & Audit Log",
      desc: "System login, logout, user analyses, and security activity records.",
      frequency: "Monthly",
      target: "System Administrators",
      icon: Users,
      defaultFormat: "XLSX",
      lastGenerated: "Jun 1, 2026",
    },
    {
      key: "zone",
      title: "Zone Intervention Priority Report",
      desc: "Monthly zone health performance comparison and intervention dispatch.",
      frequency: "On-Demand",
      target: "Agronomists & Estate Managers",
      icon: BarChart3,
      defaultFormat: "PDF",
    },
  ];

  const fetchReportData = async (key: string, monthVal: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const headers = {Authorization: `Bearer ${token}`};
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8000/api";

      if (key === "exec") {
        const res = await fetch(`${apiUrl}/admin/reports/executive`, {headers});
        if (res.ok) {
          const data = await res.json();
          setExecData(data);
          return data;
        }
      } else if (key === "user") {
        const res = await fetch(`${apiUrl}/admin/reports/user-activity`, {
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          return data;
        }
      } else if (key === "zone") {
        const res = await fetch(
          `${apiUrl}/admin/reports/zone-comparison?month=${monthVal}`,
          {headers},
        );
        if (res.ok) {
          const data = await res.json();
          setZoneData(data);
          return data;
        }
      }
    } catch (err) {
      console.error(`Failed fetching report data for ${key}:`, err);
    }
    return null;
  };

  const handleDownload = async (tmpl: ReportTemplate) => {
    setLoadingKey(tmpl.key);
    if (triggerDownload) {
      // Just notify UI
      triggerDownload(tmpl.title, tmpl.defaultFormat.toLowerCase());
    }

    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const headers: Record<string, string> = token
      ? {Authorization: `Bearer ${token}`}
      : {};
    const dateStr = new Date().toLocaleDateString("en-US").replace(/\//g, "-");

    // ── User Activity & Audit Log: stream XLSX directly from backend ──────
    if (tmpl.key === "user") {
      try {
        const res = await fetch(`${apiUrl}/admin/reports/user-activity-xlsx`, {
          headers,
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nyawitai_user_audit_log_${dateStr}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("XLSX download failed:", err);
        alert("Gagal mengunduh laporan XLSX dari server.");
      } finally {
        setLoadingKey(null);
      }
      return;
    }

    // ── All other reports: fetch JSON data then render PDF or CSV ─────────
    const data = await fetchReportData(tmpl.key, monthFilter);

    if (!data) {
      alert("Gagal memproses data laporan dari server backend.");
      setLoadingKey(null);
      return;
    }

    if (tmpl.defaultFormat === "PDF") {
      setPrintReport({
        title: tmpl.title,
        dateStr: new Date().toLocaleDateString(),
        reportKey: tmpl.key,
        month: monthFilter,
        data: data,
      });
      setTimeout(() => {
        window.print();
        setPrintReport(null);
        setLoadingKey(null);
      }, 150);
      return;
    }

    setLoadingKey(null);
  };

  const handlePreview = async (tmpl: ReportTemplate) => {
    setPreviewReport(tmpl);
    await fetchReportData(tmpl.key, monthFilter);
  };

  const getActiveData = () => {
    if (!previewReport) return null;
    if (previewReport.key === "exec") return execData;
    if (previewReport.key === "user") return userData;
    return zoneData;
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 15}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -15}}
      className="bg-white flex flex-col h-full p-6 md:p-8 gap-6"
    >
      <div>
        <h3 className="text-base font-black text-[#04211a] uppercase tracking-wider">
          Report Management
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          View and export estate analytics, logs, and intervention data.
        </p>
      </div>

      <SectionTable
        templates={allReports}
        loadingKey={loadingKey}
        onDownload={handleDownload}
        onPreview={handlePreview}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />

      {printReport &&
        createPortal(<PrintableAdminReport {...printReport} />, document.body)}

      {previewReport && (
        <PreviewModal
          report={previewReport}
          onClose={() => setPreviewReport(null)}
          isLoading={loadingKey === previewReport.key}
          data={getActiveData()}
          onDownload={() => {
            setPreviewReport(null);
            handleDownload(previewReport);
          }}
        />
      )}

      {/* Generated Reports History Section */}
      {reports && reports.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-8">
          <h3 className="text-sm font-black text-[#04211a] uppercase tracking-wider mb-4">
            Generated Reports History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-[#fcfbf9] border border-slate-200 p-4 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.url && r.url !== '#' && (
                      <a href={r.url} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors" title="Download">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {deleteReport && r.id !== 'activity-log-xlsx' && (
                      <button onClick={() => deleteReport(r.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors" title="Delete">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#04211a] line-clamp-1 mb-1">{r.name || r.block}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                    <span className="uppercase tracking-wider">{r.type || 'PDF'}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                    {r.size && r.size !== 'N/A' && (
                      <>
                        <span>•</span>
                        <span>{r.size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
