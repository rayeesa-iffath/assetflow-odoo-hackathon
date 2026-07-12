/*
  ============================================================
  AssetFlow — Member 3's file
  ------------------------------------------------------------
  Owns: Design system tokens, shared mock data, shared UI atoms
        (Card, Btn, Field, AssetTag, StatusPill, SectionLabel,
        CurvedLoop), Auth screen, Dashboard, Org Setup,
        Asset Registry, Allocation & Transfer, Resource Booking.

  IMPORTANT: This file must sit in the SAME folder as
  "Member4_AssetFlowApp.jsx" (Member 4's file). Member 4's file
  imports the components, data, and style tokens defined here.
  Do not rename this file without also updating the import path
  at the top of Member 4's file.
  ============================================================
*/
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard, Building2, Boxes, CalendarClock, Wrench, ClipboardCheck,
  UserPlus, Search, Plus, X, Check, AlertTriangle, ChevronRight, LogOut,
  ShieldCheck, MapPin, Tag, Clock, ChevronDown, Filter, ArrowRight,
  Camera, QrCode, CircleDot, Lock, Mail, User, Repeat, Activity, ArrowLeftRight,
  BarChart3, Bell, Download, TrendingUp, PackageX
} from "lucide-react";

// ---------- Design tokens ----------
const C = {
  ink: "#171B24",
  inkSoft: "#20242F",
  canvas: "#EAE7DD",
  card: "#FFFFFF",
  line: "#D9D4C4",
  lineDark: "#2B3140",
  amber: "#C97E1E",
  amberBg: "#F6E7CE",
  teal: "#2F8F80",
  tealBg: "#DCEEEA",
  red: "#B5402F",
  redBg: "#F5DCD7",
  slate: "#6E6B5F",
  ink2: "#3A3F4B",
  textOnDark: "#F2F0E8",
  textOnDarkMuted: "#9AA0AE",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const display = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const body = { fontFamily: "'Inter', sans-serif" };

// ---------- Mock data ----------
const initialDepartments = [
  { id: "D1", name: "Operations", head: "Priya Nair", parent: null, status: "Active" },
  { id: "D2", name: "Engineering", head: "Raj Malhotra", parent: null, status: "Active" },
  { id: "D3", name: "Field Services", head: "—", parent: "D1", status: "Active" },
  { id: "D4", name: "Facilities", head: "Sana Iyer", parent: null, status: "Inactive" },
];

const initialCategories = [
  { id: "C1", name: "Electronics", extra: "Warranty period (months)" },
  { id: "C2", name: "Furniture", extra: "Material" },
  { id: "C3", name: "Vehicles", extra: "Registration no." },
  { id: "C4", name: "Meeting Rooms", extra: "Capacity" },
];

const initialEmployees = [
  { id: "E1", name: "Priya Nair", email: "priya.nair@org.com", dept: "Operations", role: "Department Head", status: "Active" },
  { id: "E2", name: "Raj Malhotra", email: "raj.malhotra@org.com", dept: "Engineering", role: "Employee", status: "Active" },
  { id: "E3", name: "Sana Iyer", email: "sana.iyer@org.com", dept: "Facilities", role: "Asset Manager", status: "Active" },
  { id: "E4", name: "Kabir Shah", email: "kabir.shah@org.com", dept: "Field Services", role: "Employee", status: "Active" },
  { id: "E5", name: "Meera Das", email: "meera.das@org.com", dept: "Engineering", role: "Employee", status: "Active" },
];

const initialAssets = [
  { tag: "AF-0114", name: "ThinkPad X1 Laptop", category: "Electronics", serial: "SN-88213", cost: 98000, condition: "Good", location: "Bengaluru HQ", shared: false, status: "Allocated", holder: "Priya Nair" },
  { tag: "AF-0092", name: "Conference Room Projector", category: "Electronics", serial: "SN-44120", cost: 42000, condition: "Fair", location: "Room B2", shared: true, status: "Available", holder: "—" },
  { tag: "AF-0055", name: "Toyota Innova (Fleet)", category: "Vehicles", serial: "KA-05-JT-4521", cost: 1450000, condition: "Good", location: "Bengaluru HQ", shared: true, status: "Reserved", holder: "—" },
  { tag: "AF-0201", name: "Ergonomic Chair", category: "Furniture", serial: "SN-90011", cost: 12500, condition: "Good", location: "Engineering Floor", shared: false, status: "Available", holder: "—" },
  { tag: "AF-0037", name: "Room B2 — Meeting Room", category: "Meeting Rooms", serial: "—", cost: 0, condition: "Good", location: "2nd Floor", shared: true, status: "Available", holder: "—" },
  { tag: "AF-0148", name: "Dell Precision Workstation", category: "Electronics", serial: "SN-77302", cost: 145000, condition: "Under review", location: "Bengaluru HQ", shared: false, status: "Under Maintenance", holder: "Kabir Shah" },
];

const initialBookings = [
  { id: "B1", resource: "Room B2 — Meeting Room", tag: "AF-0037", start: "09:00", end: "10:00", date: "12 Jul", bookedBy: "Priya Nair", status: "Upcoming" },
  { id: "B2", resource: "Toyota Innova (Fleet)", tag: "AF-0055", start: "13:00", end: "16:00", date: "12 Jul", bookedBy: "Kabir Shah", status: "Upcoming" },
  { id: "B3", resource: "Room B2 — Meeting Room", tag: "AF-0037", start: "11:00", end: "12:00", date: "12 Jul", bookedBy: "Meera Das", status: "Upcoming" },
];

const initialMaintenance = [
  { id: "M1", tag: "AF-0148", asset: "Dell Precision Workstation", issue: "Overheats after 20 min, fan noise", priority: "High", stage: "In Progress", requestedBy: "Kabir Shah" },
  { id: "M2", tag: "AF-0092", asset: "Conference Room Projector", issue: "Flickering image, faint blue tint", priority: "Medium", stage: "Pending", requestedBy: "Priya Nair" },
  { id: "M3", tag: "AF-0055", asset: "Toyota Innova (Fleet)", issue: "AC not cooling, service due", priority: "Low", stage: "Approved", requestedBy: "Raj Malhotra" },
  { id: "M4", tag: "AF-0201", asset: "Ergonomic Chair", issue: "Gas lift not holding height", priority: "Low", stage: "Resolved", requestedBy: "Meera Das" },
];

const MAINT_STAGES = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];

const allocationHistory = {
  "AF-0114": [
    { date: "12 Mar", event: "Allocated to Priya Nair — Engineering" },
    { date: "04 Jan", event: "Returned by Arjun Rao — condition: good" },
    { date: "18 Nov", event: "Allocated to Arjun Rao — Operations" },
  ],
  "AF-0148": [
    { date: "02 Jul", event: "Allocated to Kabir Shah — Field Services" },
  ],
};

const initialTransferRequests = [
  { id: "T1", tag: "AF-0201", asset: "Ergonomic Chair", from: "—", to: "Meera Das", reason: "New desk setup", status: "Pending" },
];

const recentActivity = [
  { text: "Laptop AF-0114 assigned to Priya Nair", time: "2m ago", tone: "ink" },
  { text: "Maintenance request AF-0055 approved", time: "18m ago", tone: "amber" },
  { text: "Booking confirmed — Room B2, 2:00–3:00 PM", time: "1h ago", tone: "teal" },
  { text: "Transfer approved — AF-0033 to Facilities dept", time: "3h ago", tone: "ink" },
  { text: "Overdue return — AF-0148 was due 3 days ago", time: "1d ago", tone: "red" },
  { text: "Audit discrepancy flagged — AF-0092 damaged", time: "2d ago", tone: "red" },
];

const initialAudits = [
  {
    id: "AU1", name: "Q3 Bengaluru HQ Cycle", scope: "Bengaluru HQ · Electronics", dateRange: "1 Jul – 15 Jul",
    auditors: ["Sana Iyer", "Kabir Shah"], status: "In Progress",
    items: [
      { tag: "AF-0114", name: "ThinkPad X1 Laptop", result: "Verified" },
      { tag: "AF-0148", name: "Dell Precision Workstation", result: "Damaged" },
      { tag: "AF-0092", name: "Conference Room Projector", result: "Pending" },
    ],
  },
  {
    id: "AU2", name: "Fleet Verification — June", scope: "All locations · Vehicles", dateRange: "1 Jun – 10 Jun",
    auditors: ["Raj Malhotra"], status: "Closed",
    items: [
      { tag: "AF-0055", name: "Toyota Innova (Fleet)", result: "Verified" },
    ],
  },
];

const utilizationByDept = [
  { dept: "Engineering", value: 82 },
  { dept: "Operations", value: 64 },
  { dept: "Facilities", value: 47 },
  { dept: "Field Services", value: 71 },
  { dept: "Admin", value: 38 },
];

const maintenanceFrequency = [
  { month: "Feb", count: 3 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 4 },
  { month: "May", count: 7 },
  { month: "Jun", count: 6 },
  { month: "Jul", count: 9 },
];

const mostUsedAssets = [
  { tag: "AF-0037", name: "Room B2 — Meeting Room", detail: "34 bookings this month" },
  { tag: "AF-0055", name: "Toyota Innova (Fleet)", detail: "21 trips this month" },
  { tag: "AF-0092", name: "Conference Room Projector", detail: "18 uses this month" },
];

const idleAssets = [
  { tag: "AF-0301", name: "Spare camera kit", detail: "Unused 60+ days" },
  { tag: "AF-0410", name: "Reception chair", detail: "Unused 45 days" },
];

const dueForMaintenance = [
  { tag: "AF-0087", name: "Warehouse forklift", detail: "Service due in 5 days" },
  { tag: "AF-0020", name: "Legacy office laptop", detail: "4 years old — nearing retirement" },
];

const notificationLog = [
  { text: "Laptop AF-0114 assigned to Priya Nair", time: "2m ago", type: "Approvals" },
  { text: "Maintenance request AF-0055 approved", time: "18m ago", type: "Approvals" },
  { text: "Booking confirmed — Room B2, 2:00–3:00 PM", time: "1h ago", type: "Bookings" },
  { text: "Transfer approved — AF-0033 to Facilities dept", time: "3h ago", type: "Approvals" },
  { text: "Overdue return — AF-0021 was due 3 days ago", time: "1d ago", type: "Alerts" },
  { text: "Audit discrepancy flagged — AF-0088 damaged", time: "2d ago", type: "Alerts" },
  { text: "Booking reminder — Toyota Innova starts in 30 min", time: "2d ago", type: "Bookings" },
  { text: "New employee account created — Meera Das", time: "3d ago", type: "Approvals" },
];

const ROLES = ["Admin", "Asset Manager", "Department Head", "Employee"];

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, num: "01" },
  { key: "orgsetup", label: "Org Setup", icon: Building2, num: "02", adminOnly: true },
  { key: "assets", label: "Asset Registry", icon: Boxes, num: "03" },
  { key: "allocation", label: "Allocation & Transfer", icon: ArrowLeftRight, num: "04" },
  { key: "booking", label: "Resource Booking", icon: CalendarClock, num: "05" },
  { key: "maintenance", label: "Maintenance", icon: Wrench, num: "06" },
  { key: "audits", label: "Audit Cycles", icon: ClipboardCheck, num: "07" },
  { key: "reports", label: "Reports & Analytics", icon: BarChart3, num: "08" },
  { key: "notifications", label: "Activity & Notifications", icon: Bell, num: "09" },
];

function statusColor(status) {
  switch (status) {
    case "Available": return { bg: C.tealBg, fg: "#1E5E52" };
    case "Allocated": return { bg: "#E3E6F2", fg: "#39406E" };
    case "Reserved": return { bg: C.amberBg, fg: "#7A5013" };
    case "Under Maintenance": return { bg: "#F0E0D2", fg: "#8A4A1B" };
    case "Lost": return { bg: C.redBg, fg: "#7A2A1F" };
    case "Retired": return { bg: "#E7E5DD", fg: "#5A574C" };
    case "Disposed": return { bg: "#E7E5DD", fg: "#5A574C" };
    default: return { bg: "#EEE", fg: "#555" };
  }
}

function AssetTag({ tag }) {
  return (
    <span
      style={{
        ...mono,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.5,
        padding: "3px 8px",
        background: C.ink,
        color: C.textOnDark,
        borderRadius: 3,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Tag size={11} />{tag}
    </span>
  );
}

function StatusPill({ status }) {
  const c = statusColor(status);
  return (
    <span
      style={{
        background: c.bg, color: c.fg, fontSize: 12, fontWeight: 600,
        padding: "3px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6,
      }}
    >
      <CircleDot size={10} />{status}
    </span>
  );
}

function SectionLabel({ num, children }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
      <span style={{ ...mono, fontSize: 12, color: C.amber, fontWeight: 600 }}>{num}</span>
      <h2 style={{ ...display, fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>{children}</h2>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18, ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small, disabled, style }) {
  const base = {
    ...body, fontWeight: 600, fontSize: small ? 12.5 : 13.5, cursor: disabled ? "not-allowed" : "pointer",
    padding: small ? "6px 12px" : "9px 16px", borderRadius: 7, border: "1px solid transparent",
    display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1, ...style,
  };
  const variants = {
    primary: { background: C.ink, color: C.textOnDark },
    amber: { background: C.amber, color: "#fff" },
    outline: { background: "transparent", color: C.ink, borderColor: C.line },
    danger: { background: "transparent", color: C.red, borderColor: C.red },
    ghost: { background: "transparent", color: C.slate },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, color: C.slate, fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  ...body, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.line}`, fontSize: 13.5, color: C.ink, background: "#fff",
};

// ---------- Curved marquee (signature hero element) ----------
function CurvedLoop({ marqueeText = "", speed = 0.6, curveAmount = 60, direction = "left", fontSize = 34, fill = C.textOnDark }) {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const idRef = useRef("curve-" + Math.random().toString(36).slice(2));
  const dirRef = useRef(direction);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);

  const pathId = idRef.current;
  const pathD = `M-100,60 Q720,${60 + curveAmount} 1540,60`;
  const totalText = spacing ? Array(Math.ceil(2600 / spacing) + 2).fill(text).join("") : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, fontSize]);

  useEffect(() => {
    if (!spacing) return;
    const initial = -spacing;
    if (textPathRef.current) textPathRef.current.setAttribute("startOffset", initial + "px");
    setOffset(initial);
  }, [spacing]);

  useEffect(() => {
    if (!spacing) return;
    let frame;
    const step = () => {
      if (textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let next = cur + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", next + "px");
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed]);

  return (
    <div style={{ width: "100%", overflow: "visible", visibility: ready ? "visible" : "hidden" }}>
      <svg viewBox="0 0 1440 130" style={{ width: "100%", display: "block", overflow: "visible" }}>
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: "hidden", fontSize, fontWeight: 700 }}>{text}</text>
        <defs><path id={pathId} d={pathD} fill="none" stroke="none" /></defs>
        {ready && (
          <text
            fontWeight="700"
            xmlSpace="preserve"
            style={{ fontSize, fill, fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: 1 }}
          >
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + "px"} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}

// ---------- Auth screen ----------
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  return (
    <div style={{ ...body, minHeight: 560, display: "flex", background: C.ink, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ flex: 1.1, padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: `linear-gradient(180deg, ${C.ink}, ${C.inkSoft})` }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: C.amber, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Boxes size={17} color="#fff" />
            </div>
            <span style={{ ...display, fontSize: 18, fontWeight: 700, color: C.textOnDark }}>AssetFlow</span>
          </div>
          <p style={{ ...mono, fontSize: 11, color: C.textOnDarkMuted, marginTop: 4, letterSpacing: 1 }}>ENTERPRISE ASSET & RESOURCE MANAGEMENT</p>
        </div>
        <div>
          <p style={{ ...display, fontSize: 22, lineHeight: 1.35, color: C.textOnDark, fontWeight: 500, maxWidth: 360, marginBottom: 8 }}>
            Every asset tagged. Every booking accounted for.
          </p>
          <div style={{ margin: "6px -12px 10px" }}>
            <CurvedLoop marqueeText="TRACK ✦ ALLOCATE ✦ BOOK ✦ MAINTAIN ✦ AUDIT ✦" fontSize={30} curveAmount={46} speed={0.5} fill={C.amber} />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            {[["1,204", "assets tracked"], ["36", "departments"], ["0", "double-allocations"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ ...mono, fontSize: 20, fontWeight: 600, color: C.amber }}>{n}</div>
                <div style={{ fontSize: 11.5, color: C.textOnDarkMuted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, background: C.canvas, padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 8, padding: 3, width: "fit-content" }}>
          {["login", "signup"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              ...body, fontWeight: 600, fontSize: 13, padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer",
              background: mode === m ? C.ink : "transparent", color: mode === m ? C.textOnDark : C.slate,
            }}>
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.tealBg, border: `1px solid ${C.teal}33`, borderRadius: 8, padding: "10px 12px", marginBottom: 20 }}>
            <ShieldCheck size={16} color={C.teal} style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 12.5, color: "#1E5E52", margin: 0, lineHeight: 1.5 }}>
              New accounts are created as <b>Employee</b> only. Department Head and Asset Manager roles are assigned later by an Admin from the Employee Directory — there's no role picker here.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <Field label="Full name">
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: 10, top: 11, color: C.slate }} />
                <input style={{ ...inputStyle, width: "100%", paddingLeft: 30, boxSizing: "border-box" }} placeholder="Meera Das" />
              </div>
            </Field>
          )}
          <Field label="Work email">
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 10, top: 11, color: C.slate }} />
              <input style={{ ...inputStyle, width: "100%", paddingLeft: 30, boxSizing: "border-box" }} placeholder="you@org.com" defaultValue="priya.nair@org.com" />
            </div>
          </Field>
          <Field label="Password">
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 10, top: 11, color: C.slate }} />
              <input type="password" style={{ ...inputStyle, width: "100%", paddingLeft: 30, boxSizing: "border-box" }} defaultValue="••••••••" />
            </div>
          </Field>
          {mode === "login" && (
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 12, color: C.amber, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
            </div>
          )}
          <Btn variant="amber" onClick={() => onLogin("Admin")} style={{ justifyContent: "center", marginTop: 6 }}>
            {mode === "login" ? "Log in" : "Create employee account"} <ArrowRight size={14} />
          </Btn>
          <p style={{ fontSize: 11.5, color: C.slate, textAlign: "center" }}>
            Demo: pick a role from the switcher after entering to preview Admin / Asset Manager / Department Head / Employee views.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ assets, bookings, maintenance, setView }) {
  const kpis = [
    { label: "Assets available", value: assets.filter(a => a.status === "Available").length, tone: "teal" },
    { label: "Assets allocated", value: assets.filter(a => a.status === "Allocated").length, tone: "ink" },
    { label: "Maintenance today", value: maintenance.filter(m => m.stage !== "Resolved").length, tone: "amber" },
    { label: "Active bookings", value: bookings.filter(b => b.status === "Upcoming").length, tone: "ink" },
    { label: "Pending transfers", value: 1, tone: "amber" },
    { label: "Upcoming returns", value: 2, tone: "ink" },
  ];
  const overdue = [
    { tag: "AF-0148", holder: "Kabir Shah", due: "08 Jul", days: 4 },
  ];
  const upcoming = [
    { tag: "AF-0114", holder: "Priya Nair", due: "18 Jul" },
  ];

  const toneHex = { amber: C.amber, teal: C.teal, ink: C.ink };

  return (
    <div>
      <SectionLabel num="01">Dashboard</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: "14px 18px 14px 16px", borderLeft: `3px solid ${toneHex[k.tone]}`, borderRadius: "4px 10px 10px 4px" }}>
            <div style={{ fontSize: 11.5, color: C.slate, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>{k.label}</div>
            <div style={{ ...display, fontSize: 30, fontWeight: 700, color: toneHex[k.tone] === C.amber ? C.amber : toneHex[k.tone] === C.teal ? C.teal : C.ink }}>
              {k.value}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.8fr 0.9fr", gap: 14 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={15} color={C.red} />
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>Overdue returns</span>
          </div>
          {overdue.map((o) => (
            <div key={o.tag} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <AssetTag tag={o.tag} />
                <span style={{ fontSize: 13, color: C.ink2 }}>held by {o.holder}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>{o.days} days overdue · was due {o.due}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 12.5, color: C.slate, fontWeight: 600, marginBottom: 6 }}>Upcoming returns</div>
            {upcoming.map((o) => (
              <div key={o.tag} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                <AssetTag tag={o.tag} />
                <span style={{ fontSize: 13, color: C.ink2 }}>{o.holder} · due {o.due}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 12 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn variant="outline" onClick={() => setView("assets")} style={{ justifyContent: "space-between" }}>
              Register asset <ChevronRight size={14} />
            </Btn>
            <Btn variant="outline" onClick={() => setView("booking")} style={{ justifyContent: "space-between" }}>
              Book resource <ChevronRight size={14} />
            </Btn>
            <Btn variant="outline" onClick={() => setView("maintenance")} style={{ justifyContent: "space-between" }}>
              Raise maintenance request <ChevronRight size={14} />
            </Btn>
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Activity size={15} color={C.ink2} />
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>Recent activity</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: toneHex[a.tone] || C.slate, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ ...mono, fontSize: 10, color: C.slate, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- Org Setup ----------
function OrgSetup({ departments, setDepartments, categories, employees, setEmployees }) {
  const [tab, setTab] = useState("dept");
  const [promoteTarget, setPromoteTarget] = useState(null);

  const promote = (id, role) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, role } : e));
    setPromoteTarget(null);
  };

  return (
    <div>
      <SectionLabel num="02">Organization setup</SectionLabel>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 8, padding: 3, width: "fit-content" }}>
        {[["dept", "Departments"], ["cat", "Asset categories"], ["emp", "Employee directory"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            ...body, fontWeight: 600, fontSize: 13, padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer",
            background: tab === k ? C.ink : "transparent", color: tab === k ? C.textOnDark : C.slate,
          }}>{l}</button>
        ))}
      </div>

      {tab === "dept" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Departments</span>
            <Btn small variant="amber"><Plus size={13} />New department</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: C.slate, fontSize: 11.5, fontWeight: 700 }}>
                <th style={{ padding: "6px 8px" }}>Name</th>
                <th style={{ padding: "6px 8px" }}>Department head</th>
                <th style={{ padding: "6px 8px" }}>Parent</th>
                <th style={{ padding: "6px 8px" }}>Status</th>
                <th style={{ padding: "6px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "9px 8px", fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: "9px 8px", color: C.ink2 }}>{d.head}</td>
                  <td style={{ padding: "9px 8px", color: C.ink2 }}>{departments.find(p => p.id === d.parent)?.name || "—"}</td>
                  <td style={{ padding: "9px 8px" }}>
                    <StatusPill status={d.status === "Active" ? "Available" : "Retired"} />
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "right" }}>
                    <Btn small variant="ghost">Edit</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "cat" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {categories.map(c => (
            <Card key={c.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
                <Btn small variant="ghost">Edit</Btn>
              </div>
              <div style={{ fontSize: 12.5, color: C.slate, marginTop: 6 }}>Custom field: {c.extra}</div>
            </Card>
          ))}
          <button style={{
            border: `1.5px dashed ${C.line}`, borderRadius: 10, background: "transparent", color: C.slate,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", minHeight: 74, fontWeight: 600,
          }}>
            <Plus size={15} /> New category
          </button>
        </div>
      )}

      {tab === "emp" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Employee directory</span>
            <span style={{ fontSize: 11.5, color: C.slate }}>Roles are assigned here — nowhere else</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
            <thead>
              <tr style={{ textAlign: "left", color: C.slate, fontSize: 11.5, fontWeight: 700 }}>
                <th style={{ padding: "6px 8px" }}>Name</th>
                <th style={{ padding: "6px 8px" }}>Email</th>
                <th style={{ padding: "6px 8px" }}>Department</th>
                <th style={{ padding: "6px 8px" }}>Role</th>
                <th style={{ padding: "6px 8px" }}>Status</th>
                <th style={{ padding: "6px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "9px 8px", fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: "9px 8px", color: C.ink2, ...mono, fontSize: 12 }}>{e.email}</td>
                  <td style={{ padding: "9px 8px", color: C.ink2 }}>{e.dept}</td>
                  <td style={{ padding: "9px 8px" }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                      background: e.role === "Employee" ? "#EEECE3" : C.amberBg,
                      color: e.role === "Employee" ? C.slate : "#7A5013",
                    }}>{e.role}</span>
                  </td>
                  <td style={{ padding: "9px 8px" }}>
                    <StatusPill status={e.status === "Active" ? "Available" : "Retired"} />
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "right", position: "relative" }}>
                    {e.role === "Employee" ? (
                      <Btn small variant="outline" onClick={() => setPromoteTarget(promoteTarget === e.id ? null : e.id)}>
                        <UserPlus size={13} />Promote
                      </Btn>
                    ) : <span style={{ fontSize: 12, color: C.slate }}>—</span>}
                    {promoteTarget === e.id && (
                      <div style={{
                        position: "absolute", right: 8, top: "100%", zIndex: 10, background: "#fff",
                        border: `1px solid ${C.line}`, borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.1)", padding: 6, marginTop: 4, minWidth: 170,
                      }}>
                        {["Department Head", "Asset Manager"].map(r => (
                          <div key={r} onClick={() => promote(e.id, r)} style={{
                            padding: "8px 10px", fontSize: 12.5, fontWeight: 600, borderRadius: 6, cursor: "pointer", color: C.ink,
                          }} onMouseEnter={ev => ev.currentTarget.style.background = C.canvas}
                             onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                            Promote to {r}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ---------- Asset Registration ----------
function AssetRegistry({ assets, setAssets, categories }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shared, setShared] = useState(false);
  const [form, setForm] = useState({ name: "", category: categories[0]?.name || "", serial: "", location: "", condition: "Good" });

  const nextTag = `AF-${String(150 + assets.length).padStart(4, "0")}`;

  const filtered = assets.filter(a => {
    const matchesQ = !query || a.tag.toLowerCase().includes(query.toLowerCase()) || a.name.toLowerCase().includes(query.toLowerCase()) || a.serial.toLowerCase().includes(query.toLowerCase());
    const matchesS = statusFilter === "All" || a.status === statusFilter;
    return matchesQ && matchesS;
  });

  const register = () => {
    if (!form.name) return;
    setAssets([{
      tag: nextTag, name: form.name, category: form.category, serial: form.serial || "—",
      cost: 0, condition: form.condition, location: form.location || "Unassigned", shared,
      status: "Available", holder: "—",
    }, ...assets]);
    setForm({ name: "", category: categories[0]?.name || "", serial: "", location: "", condition: "Good" });
    setShared(false);
  };

  return (
    <div>
      <SectionLabel num="03">Asset registry</SectionLabel>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Register new asset</span>
          <AssetTag tag={nextTag} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <Field label="Asset name">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dell XPS 15 Laptop" />
          </Field>
          <Field label="Category">
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Serial number">
            <input style={inputStyle} value={form.serial} onChange={e => setForm({ ...form, serial: e.target.value })} placeholder="SN-00000" />
          </Field>
          <Field label="Acquisition date">
            <input style={inputStyle} type="date" />
          </Field>
          <Field label="Acquisition cost (₹, for reporting only)">
            <input style={inputStyle} type="number" placeholder="0" />
          </Field>
          <Field label="Condition">
            <select style={inputStyle} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
              <option>Good</option><option>Fair</option><option>Under review</option>
            </select>
          </Field>
          <Field label="Location">
            <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bengaluru HQ" />
          </Field>
          <Field label="Photo / documents">
            <div style={{
              ...inputStyle, display: "flex", alignItems: "center", gap: 6, color: C.slate, cursor: "pointer", justifyContent: "center",
            }}><Camera size={14} />Attach file</div>
          </Field>
          <Field label="Shared / bookable resource">
            <div
              onClick={() => setShared(!shared)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6,
                border: `1px solid ${C.line}`, cursor: "pointer", height: 20,
              }}
            >
              <div style={{
                width: 34, height: 18, borderRadius: 20, background: shared ? C.teal : "#DEDBCF", position: "relative", transition: "background 0.15s",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2,
                  left: shared ? 18 : 2, transition: "left 0.15s",
                }} />
              </div>
              <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 600 }}>{shared ? "Bookable by others" : "Assigned only"}</span>
            </div>
          </Field>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="amber" onClick={register}><Plus size={14} />Register asset</Btn>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.slate }} />
          <input
            style={{ ...inputStyle, width: "100%", paddingLeft: 30, boxSizing: "border-box" }}
            placeholder="Search by tag, serial, or name…"
            value={query} onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select style={inputStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Btn variant="outline" small><QrCode size={13} />Scan QR</Btn>
      </div>

      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: C.slate, fontSize: 11.5, fontWeight: 700 }}>
              <th style={{ padding: "10px 14px" }}>Tag</th>
              <th style={{ padding: "10px 14px" }}>Asset</th>
              <th style={{ padding: "10px 14px" }}>Category</th>
              <th style={{ padding: "10px 14px" }}>Location</th>
              <th style={{ padding: "10px 14px" }}>Holder</th>
              <th style={{ padding: "10px 14px" }}>Bookable</th>
              <th style={{ padding: "10px 14px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.tag} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={{ padding: "10px 14px" }}><AssetTag tag={a.tag} /></td>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{a.name}</td>
                <td style={{ padding: "10px 14px", color: C.ink2 }}>{a.category}</td>
                <td style={{ padding: "10px 14px", color: C.ink2 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{a.location}</span>
                </td>
                <td style={{ padding: "10px 14px", color: C.ink2 }}>{a.holder}</td>
                <td style={{ padding: "10px 14px" }}>{a.shared ? <Check size={14} color={C.teal} /> : <X size={14} color={C.slate} />}</td>
                <td style={{ padding: "10px 14px" }}><StatusPill status={a.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: C.slate }}>No assets match this search.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------- Asset Allocation & Transfer ----------
function AllocationTransfer({ assets, setAssets, employees, transferRequests, setTransferRequests }) {
  const allocatable = assets.filter(a => !a.shared);
  const [selectedTag, setSelectedTag] = useState(allocatable[0]?.tag);
  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const asset = assets.find(a => a.tag === selectedTag);
  const blocked = asset && asset.status === "Allocated";
  const history = allocationHistory[selectedTag] || [];

  const submitTransfer = () => {
    if (!toEmployee) return;
    if (blocked) {
      setTransferRequests([
        { id: "T" + (transferRequests.length + 1), tag: asset.tag, asset: asset.name, from: asset.holder, to: toEmployee, reason, status: "Pending" },
        ...transferRequests,
      ]);
    } else {
      setAssets(assets.map(a => a.tag === asset.tag ? { ...a, holder: toEmployee, status: "Allocated" } : a));
    }
    setSubmitted(true);
    setReason("");
    setToEmployee("");
  };

  const decide = (id, status) => {
    setTransferRequests(transferRequests.map(t => {
      if (t.id !== id) return t;
      if (status === "Approved") {
        setAssets(assets.map(a => a.tag === t.tag ? { ...a, holder: t.to, status: "Allocated" } : a));
      }
      return { ...t, status };
    }));
  };

  const returnAsset = () => {
    setAssets(assets.map(a => a.tag === selectedTag ? { ...a, holder: "—", status: "Available" } : a));
  };

  return (
    <div>
      <SectionLabel num="04">Asset allocation & transfer</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.9fr", gap: 16 }}>
        <Card>
          <Field label="Asset">
            <select style={inputStyle} value={selectedTag} onChange={e => { setSelectedTag(e.target.value); setSubmitted(false); }}>
              {allocatable.map(a => <option key={a.tag} value={a.tag}>{a.tag} — {a.name}</option>)}
            </select>
          </Field>

          {blocked ? (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.redBg, borderRadius: 8, padding: "12px 14px", margin: "14px 0" }}>
              <AlertTriangle size={15} color={C.red} style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#7A2A1F" }}>Already allocated to {asset.holder}</div>
                <div style={{ fontSize: 12, color: "#7A2A1F", marginTop: 2 }}>Direct re-allocation is blocked — submit a transfer request below instead.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", background: C.tealBg, borderRadius: 8, padding: "10px 14px", margin: "14px 0" }}>
              <Check size={15} color={C.teal} />
              <span style={{ fontSize: 12.5, color: "#1E5E52", fontWeight: 600 }}>Available — can be allocated directly.</span>
            </div>
          )}

          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Repeat size={14} />{blocked ? "Transfer request" : "Allocate asset"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Field label="From">
              <input style={{ ...inputStyle, background: C.canvas, color: C.slate }} value={blocked ? asset.holder : "Unassigned"} readOnly />
            </Field>
            <Field label="To">
              <select style={inputStyle} value={toEmployee} onChange={e => setToEmployee(e.target.value)}>
                <option value="">Select employee…</option>
                {employees.map(e => <option key={e.id} value={e.name}>{e.name} — {e.dept}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Reason">
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" }}
              value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Why is this transfer needed?"
            />
          </Field>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn variant="amber" onClick={submitTransfer} disabled={!toEmployee}>
              {blocked ? "Submit transfer request" : "Allocate asset"}
            </Btn>
            {blocked && (
              <Btn variant="outline" onClick={returnAsset}>Mark returned</Btn>
            )}
          </div>
          {submitted && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.teal, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <Check size={13} />Request submitted — awaiting Asset Manager / Department Head approval.
            </div>
          )}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Allocation history — {selectedTag}</div>
          {history.length === 0 && <div style={{ fontSize: 12.5, color: C.slate }}>No history recorded for this asset yet.</div>}
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <span style={{ ...mono, fontSize: 11, color: C.slate, width: 44, flexShrink: 0 }}>{h.date}</span>
              <span style={{ fontSize: 12.5, color: C.ink2 }}>{h.event}</span>
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: 13.5, margin: "18px 0 10px", paddingTop: 14, borderTop: `1px solid ${C.line}` }}>Pending transfer requests</div>
          {transferRequests.filter(t => t.status === "Pending").length === 0 && (
            <div style={{ fontSize: 12.5, color: C.slate }}>No pending requests.</div>
          )}
          {transferRequests.filter(t => t.status === "Pending").map(t => (
            <div key={t.id} style={{ padding: "10px 0", borderTop: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <AssetTag tag={t.tag} />
                <span style={{ fontSize: 11, color: C.slate }}>{t.from} → {t.to}</span>
              </div>
              {t.reason && <div style={{ fontSize: 12, color: C.ink2, marginBottom: 6 }}>{t.reason}</div>}
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="amber" onClick={() => decide(t.id, "Approved")}>Approve</Btn>
                <Btn small variant="danger" onClick={() => decide(t.id, "Rejected")}>Reject</Btn>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ---------- Resource Booking Calendar ----------
function BookingCalendar({ assets, bookings, setBookings }) {
  const resources = assets.filter(a => a.shared);
  const [resource, setResource] = useState(resources[0]?.tag);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [error, setError] = useState("");

  const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8am-6pm
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

  const resourceBookings = bookings.filter(b => b.tag === resource);

  const submit = () => {
    setError("");
    const s = toMin(start), e = toMin(end);
    if (e <= s) { setError("End time must be after start time."); return; }
    const overlap = resourceBookings.some(b => {
      const bs = toMin(b.start), be = toMin(b.end);
      return s < be && bs < e;
    });
    if (overlap) {
      setError(`Blocked — this resource is already booked in that window.`);
      return;
    }
    const asset = assets.find(a => a.tag === resource);
    setBookings([...bookings, {
      id: "B" + (bookings.length + 1), resource: asset?.name, tag: resource, start, end, date: "12 Jul", bookedBy: "You", status: "Upcoming",
    }]);
  };

  return (
    <div>
      <SectionLabel num="05">Resource booking</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Book a resource</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Resource">
              <select style={inputStyle} value={resource} onChange={e => { setResource(e.target.value); setError(""); }}>
                {resources.map(r => <option key={r.tag} value={r.tag}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="Start time">
              <input style={inputStyle} type="time" value={start} onChange={e => setStart(e.target.value)} />
            </Field>
            <Field label="End time">
              <input style={inputStyle} type="time" value={end} onChange={e => setEnd(e.target.value)} />
            </Field>
            {error && (
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start", background: C.redBg, borderRadius: 6, padding: "8px 10px" }}>
                <AlertTriangle size={13} color={C.red} style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#7A2A1F" }}>{error}</span>
              </div>
            )}
            <Btn variant="amber" onClick={submit} style={{ justifyContent: "center" }}>Confirm booking</Btn>
            <p style={{ fontSize: 11.5, color: C.slate, margin: 0 }}>Try 9:30–10:30 on Room B2 — it overlaps an existing 9:00–10:00 booking and gets rejected.</p>
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>{assets.find(a => a.tag === resource)?.name} — 12 Jul</span>
            <span style={{ fontSize: 11.5, color: C.slate }}>08:00 – 18:00</span>
          </div>
          <div style={{ position: "relative", border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden" }}>
            {hours.map((h, i) => (
              <div key={h} style={{
                display: "flex", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, height: 40,
              }}>
                <div style={{ width: 56, ...mono, fontSize: 11, color: C.slate, padding: "4px 8px", borderRight: `1px solid ${C.line}`, background: C.canvas }}>
                  {String(h).padStart(2, "0")}:00
                </div>
                <div style={{ flex: 1, position: "relative" }} />
              </div>
            ))}
            {resourceBookings.map(b => {
              const top = ((toMin(b.start) - 8 * 60) / 60) * 40;
              const height = ((toMin(b.end) - toMin(b.start)) / 60) * 40;
              return (
                <div key={b.id} style={{
                  position: "absolute", left: 60, right: 8, top, height: height - 2,
                  background: b.bookedBy === "You" ? C.tealBg : C.amberBg,
                  border: `1px solid ${b.bookedBy === "You" ? C.teal : C.amber}`,
                  borderRadius: 5, padding: "3px 8px", fontSize: 11.5, fontWeight: 600,
                  color: b.bookedBy === "You" ? "#1E5E52" : "#7A5013", overflow: "hidden",
                }}>
                  {b.start}–{b.end} · {b.bookedBy}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}


// ---------- Exports (used by Member 4's file to assemble the final app) ----------
export {
  C, FONTS, display, mono, body,
  Card, Btn, Field, inputStyle, AssetTag, StatusPill, SectionLabel, statusColor, CurvedLoop,
  AuthScreen, Dashboard, OrgSetup, AssetRegistry, AllocationTransfer, BookingCalendar,
  initialDepartments, initialCategories, initialEmployees, initialAssets, initialBookings,
  initialTransferRequests, allocationHistory, recentActivity,
  initialMaintenance, MAINT_STAGES, initialAudits,
  utilizationByDept, maintenanceFrequency, mostUsedAssets, idleAssets, dueForMaintenance,
  notificationLog, ROLES, NAV,
};
