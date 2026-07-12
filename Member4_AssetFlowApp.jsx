/*
  ============================================================
  AssetFlow — Member 4's file
  ------------------------------------------------------------
  Owns: Maintenance Pipeline, Audit Cycles, Reports & Analytics,
        Activity Logs & Notifications, and the final App shell
        (sidebar navigation, role switcher, login gate, routing
        between every screen).

  IMPORTANT: This file must sit in the SAME folder as
  "Member3_AssetFlowCore.jsx" (Member 3's file). Everything
  imported below comes from that file — do not delete it or
  rename it without updating the import path.
  ============================================================
*/
import React, { useState } from "react";
import {
  Boxes, Plus, Check, AlertTriangle, LogOut, ChevronDown, ArrowRight,
  Lock, Download, TrendingUp, PackageX,
} from "lucide-react";
import {
  C, FONTS, display, mono, body,
  Card, Btn, AssetTag, StatusPill, SectionLabel,
  AuthScreen, Dashboard, OrgSetup, AssetRegistry, AllocationTransfer, BookingCalendar,
  initialDepartments, initialCategories, initialEmployees, initialAssets, initialBookings,
  initialTransferRequests,
  initialMaintenance, MAINT_STAGES, initialAudits,
  utilizationByDept, maintenanceFrequency, mostUsedAssets, idleAssets, dueForMaintenance,
  notificationLog, ROLES, NAV,
} from "./Member3_AssetFlowCore";
// ---------- Maintenance pipeline (table) ----------
function stageTone(stage) {
  switch (stage) {
    case "Pending": return { bg: C.amberBg, fg: "#7A5013" };
    case "Approved": return { bg: "#E3E6F2", fg: "#39406E" };
    case "Technician Assigned": return { bg: "#E3E6F2", fg: "#39406E" };
    case "In Progress": return { bg: "#F0E0D2", fg: "#8A4A1B" };
    case "Resolved": return { bg: C.tealBg, fg: "#1E5E52" };
    case "Rejected": return { bg: C.redBg, fg: "#7A2A1F" };
    default: return { bg: "#EEE", fg: "#555" };
  }
}

function MaintenancePipeline({ maintenance, setMaintenance }) {
  const advance = (id, dir) => {
    setMaintenance(maintenance.map(m => {
      if (m.id !== id) return m;
      const idx = MAINT_STAGES.indexOf(m.stage);
      const next = MAINT_STAGES[Math.min(MAINT_STAGES.length - 1, Math.max(0, idx + dir))];
      return { ...m, stage: next };
    }));
  };
  const reject = (id) => setMaintenance(maintenance.map(m => m.id === id ? { ...m, stage: "Rejected" } : m));

  const priorityColor = { High: C.red, Medium: C.amber, Low: C.slate };
  const stageCounts = MAINT_STAGES.map(s => ({ stage: s, count: maintenance.filter(m => m.stage === s).length }));

  return (
    <div>
      <SectionLabel num="06">Maintenance approval pipeline</SectionLabel>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {stageCounts.map(s => {
          const tone = stageTone(s.stage);
          return (
            <div key={s.stage} style={{ flex: 1, background: tone.bg, borderRadius: 8, padding: "9px 12px" }}>
              <div style={{ ...mono, fontSize: 18, fontWeight: 600, color: tone.fg }}>{s.count}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: tone.fg }}>{s.stage}</div>
            </div>
          );
        })}
      </div>

      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: C.slate, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
              <th style={{ padding: "10px 14px" }}>Tag</th>
              <th style={{ padding: "10px 14px" }}>Asset</th>
              <th style={{ padding: "10px 14px" }}>Issue</th>
              <th style={{ padding: "10px 14px" }}>Priority</th>
              <th style={{ padding: "10px 14px" }}>Requested by</th>
              <th style={{ padding: "10px 14px" }}>Stage</th>
              <th style={{ padding: "10px 14px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map(m => {
              const tone = stageTone(m.stage);
              const terminal = m.stage === "Resolved" || m.stage === "Rejected";
              return (
                <tr key={m.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "10px 14px" }}><AssetTag tag={m.tag} /></td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{m.asset}</td>
                  <td style={{ padding: "10px 14px", color: C.ink2, maxWidth: 220 }}>{m.issue}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: priorityColor[m.priority], fontSize: 12 }}>{m.priority}</td>
                  <td style={{ padding: "10px 14px", color: C.ink2 }}>{m.requestedBy}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ background: tone.bg, color: tone.fg, fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{m.stage}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    {!terminal && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {m.stage === "Pending" && (
                          <Btn small variant="danger" onClick={() => reject(m.id)}>Reject</Btn>
                        )}
                        <Btn small variant="amber" onClick={() => advance(m.id, 1)}>
                          {m.stage === "Pending" ? "Approve" : "Advance"} <ArrowRight size={11} />
                        </Btn>
                      </div>
                    )}
                    {m.stage === "Resolved" && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.teal, fontSize: 11.5, fontWeight: 700 }}>
                        <Check size={12} />Asset back to Available
                      </span>
                    )}
                    {m.stage === "Rejected" && <span style={{ fontSize: 11.5, color: C.slate }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <p style={{ fontSize: 11.5, color: C.slate, marginTop: 10 }}>
        Approving a request moves the asset to Under Maintenance. Resolving a request returns it to Available.
      </p>
    </div>
  );
}

// ---------- Audit cycles ----------
function AuditCycles({ audits, setAudits }) {
  const [openId, setOpenId] = useState(audits[0]?.id);

  const markItem = (auditId, tag, result) => {
    setAudits(audits.map(a => a.id !== auditId ? a : {
      ...a, items: a.items.map(it => it.tag === tag ? { ...it, result } : it),
    }));
  };

  const resultColor = { Verified: C.teal, Missing: C.red, Damaged: C.amber, Pending: C.slate };

  return (
    <div>
      <SectionLabel num="07">Asset audit cycles</SectionLabel>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn variant="amber" small><Plus size={13} />New audit cycle</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {audits.map(a => {
          const open = openId === a.id;
          const flagged = a.items.filter(i => i.result === "Missing" || i.result === "Damaged").length;
          return (
            <Card key={a.id} style={{ padding: 0, overflow: "hidden" }}>
              <div onClick={() => setOpenId(open ? null : a.id)} style={{ padding: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</span>
                    <StatusPill status={a.status === "Closed" ? "Retired" : "Reserved"} />
                  </div>
                  <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>
                    {a.scope} · {a.dateRange} · auditors: {a.auditors.join(", ")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {flagged > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: C.red }}>
                      <AlertTriangle size={13} />{flagged} discrepancies
                    </span>
                  )}
                  <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", color: C.slate }} />
                </div>
              </div>
              {open && (
                <div style={{ borderTop: `1px solid ${C.line}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: C.slate, fontSize: 11.5, fontWeight: 700 }}>
                        <th style={{ padding: "8px 16px" }}>Tag</th>
                        <th style={{ padding: "8px 16px" }}>Asset</th>
                        <th style={{ padding: "8px 16px" }}>Auditor result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.items.map(it => (
                        <tr key={it.tag} style={{ borderTop: `1px solid ${C.line}` }}>
                          <td style={{ padding: "9px 16px" }}><AssetTag tag={it.tag} /></td>
                          <td style={{ padding: "9px 16px", fontWeight: 600 }}>{it.name}</td>
                          <td style={{ padding: "9px 16px" }}>
                            {a.status === "Closed" ? (
                              <span style={{ fontSize: 12, fontWeight: 700, color: resultColor[it.result] }}>{it.result}</span>
                            ) : (
                              <div style={{ display: "flex", gap: 6 }}>
                                {["Verified", "Missing", "Damaged"].map(r => (
                                  <button key={r} onClick={() => markItem(a.id, it.tag, r)} style={{
                                    fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 20, cursor: "pointer",
                                    border: `1px solid ${it.result === r ? resultColor[r] : C.line}`,
                                    background: it.result === r ? `${resultColor[r]}1A` : "transparent",
                                    color: it.result === r ? resultColor[r] : C.slate,
                                  }}>{r}</button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {a.status !== "Closed" && (
                    <div style={{ padding: 14, display: "flex", justifyContent: "flex-end" }}>
                      <Btn variant="primary" small onClick={() => setAudits(audits.map(x => x.id === a.id ? { ...x, status: "Closed" } : x))}>
                        <Lock size={12} />Close audit cycle
                      </Btn>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Reports & Analytics ----------
function BarChart({ data, valueKey, labelKey, color }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "0 4px" }}>
      {data.map(d => (
        <div key={d[labelKey]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            width: "100%", maxWidth: 30, background: color, borderRadius: "3px 3px 0 0",
            height: `${(d[valueKey] / max) * 92}px`,
          }} />
          <span style={{ fontSize: 10.5, color: C.slate, fontWeight: 600 }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, valueKey, labelKey, color }) {
  const w = 320, h = 110, pad = 10;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => [pad + i * step, h - pad - (d[valueKey] / max) * (h - pad * 2)]);
  const path = points.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h + 16}`} style={{ width: "100%", height: 126 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
      {data.map((d, i) => (
        <text key={d[labelKey]} x={points[i][0]} y={h + 12} fontSize="10.5" fill={C.slate} textAnchor="middle">{d[labelKey]}</text>
      ))}
    </svg>
  );
}

function ListCard({ icon: Icon, title, items, tone }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={14} color={tone} />
        <span style={{ fontWeight: 700, fontSize: 13.5, color: C.ink }}>{title}</span>
      </div>
      {items.map((it, i) => (
        <div key={it.tag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <AssetTag tag={it.tag} />
            <span style={{ fontSize: 12, color: C.ink2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</span>
          </div>
          <span style={{ fontSize: 11, color: C.slate, fontWeight: 600, flexShrink: 0 }}>{it.detail}</span>
        </div>
      ))}
    </Card>
  );
}

function ReportsAnalytics() {
  return (
    <div>
      <SectionLabel num="08">Reports & analytics</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Utilization by department</div>
          <BarChart data={utilizationByDept} valueKey="value" labelKey="dept" color={C.amber} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Maintenance frequency</div>
          <LineChart data={maintenanceFrequency} valueKey="count" labelKey="month" color={C.red} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <ListCard icon={TrendingUp} title="Most used assets" items={mostUsedAssets} tone={C.teal} />
        <ListCard icon={PackageX} title="Idle assets" items={idleAssets} tone={C.slate} />
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Due for maintenance / nearing retirement</div>
        {dueForMaintenance.map((it, i) => (
          <div key={it.tag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AssetTag tag={it.tag} />
              <span style={{ fontSize: 12.5, color: C.ink2 }}>{it.name}</span>
            </div>
            <span style={{ fontSize: 12, color: C.amber, fontWeight: 700 }}>{it.detail}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn variant="amber"><Download size={14} />Export report</Btn>
      </div>
    </div>
  );
}

// ---------- Activity Logs & Notifications ----------
function NotificationsLog() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? notificationLog : notificationLog.filter(n => n.type === filter);
  const typeColor = { Alerts: C.red, Approvals: C.teal, Bookings: C.amber };

  return (
    <div>
      <SectionLabel num="09">Activity logs & notifications</SectionLabel>

      <div style={{ display: "flex", gap: 4, marginBottom: 14, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 8, padding: 3, width: "fit-content" }}>
        {["All", "Alerts", "Approvals", "Bookings"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...body, fontWeight: 600, fontSize: 12.5, padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            background: filter === f ? C.ink : "transparent", color: filter === f ? C.textOnDark : C.slate,
          }}>{f}</button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        {filtered.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: typeColor[n.type] || C.slate, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: C.ink2, flex: 1 }}>{n.text}</span>
            <span style={{
              fontSize: 10.5, fontWeight: 700, color: typeColor[n.type] || C.slate,
              background: `${typeColor[n.type] || C.slate}1A`, padding: "2px 8px", borderRadius: 20,
            }}>{n.type}</span>
            <span style={{ ...mono, fontSize: 11, color: C.slate, width: 60, textAlign: "right", flexShrink: 0 }}>{n.time}</span>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.slate, fontSize: 13 }}>No notifications in this category.</div>}
      </Card>
    </div>
  );
}

// ---------- App shell ----------
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("Admin");
  const [view, setView] = useState("dashboard");

  const [departments, setDepartments] = useState(initialDepartments);
  const [categories] = useState(initialCategories);
  const [employees, setEmployees] = useState(initialEmployees);
  const [assets, setAssets] = useState(initialAssets);
  const [bookings, setBookings] = useState(initialBookings);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [audits, setAudits] = useState(initialAudits);
  const [transferRequests, setTransferRequests] = useState(initialTransferRequests);

  const currentUser = employees[0];

  if (!authed) {
    return (
      <div style={{ background: C.canvas, padding: 24, minHeight: 640, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{FONTS}</style>
        <div style={{ width: "100%", maxWidth: 860 }}>
          <AuthScreen onLogin={(r) => { setRole(r); setAuthed(true); }} />
        </div>
      </div>
    );
  }

  const nav = NAV.filter(n => !n.adminOnly || role === "Admin");

  return (
    <div style={{ ...body, background: C.canvas, minHeight: 640, display: "flex", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{FONTS}</style>
      <div style={{ width: 224, background: C.ink, padding: "20px 14px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 26 }}>
          <div style={{ width: 26, height: 26, background: C.amber, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Boxes size={15} color="#fff" />
          </div>
          <span style={{ ...display, fontSize: 15.5, fontWeight: 700, color: C.textOnDark }}>AssetFlow</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => {
            const Icon = n.icon;
            const active = view === n.key;
            return (
              <button key={n.key} onClick={() => setView(n.key)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px 9px 8px", borderRadius: 0, cursor: "pointer",
                background: active ? "rgba(201,126,30,0.12)" : "transparent",
                border: "none", borderLeft: `2px solid ${active ? C.amber : "transparent"}`,
                color: active ? C.textOnDark : C.textOnDarkMuted, textAlign: "left",
              }}>
                <span style={{ ...mono, fontSize: 10, color: active ? C.amber : "#5B606E", width: 16 }}>{n.num}</span>
                <Icon size={15} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.lineDark}` }}>
          <div style={{ fontSize: 10.5, color: "#5B606E", fontWeight: 700, padding: "0 8px", marginBottom: 6 }}>VIEW AS (DEMO)</div>
          <select value={role} onChange={e => { setRole(e.target.value); if (e.target.value !== "Admin" && view === "orgsetup") setView("dashboard"); }} style={{
            width: "100%", background: C.inkSoft, color: C.textOnDark, border: `1px solid ${C.lineDark}`, borderRadius: 6,
            padding: "7px 8px", fontSize: 12.5, fontWeight: 600, marginBottom: 12,
          }}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.amberBg, color: "#7A5013", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              {currentUser.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textOnDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
            </div>
            <LogOut size={14} color="#5B606E" style={{ cursor: "pointer" }} onClick={() => setAuthed(false)} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "22px 26px", overflow: "auto" }}>
        {view === "dashboard" && <Dashboard assets={assets} bookings={bookings} maintenance={maintenance} setView={setView} />}
        {view === "orgsetup" && role === "Admin" && (
          <OrgSetup departments={departments} setDepartments={setDepartments} categories={categories} employees={employees} setEmployees={setEmployees} />
        )}
        {view === "assets" && <AssetRegistry assets={assets} setAssets={setAssets} categories={categories} />}
        {view === "allocation" && (
          <AllocationTransfer assets={assets} setAssets={setAssets} employees={employees} transferRequests={transferRequests} setTransferRequests={setTransferRequests} />
        )}
        {view === "booking" && <BookingCalendar assets={assets} bookings={bookings} setBookings={setBookings} />}
        {view === "maintenance" && <MaintenancePipeline maintenance={maintenance} setMaintenance={setMaintenance} />}
        {view === "audits" && <AuditCycles audits={audits} setAudits={setAudits} />}
        {view === "reports" && <ReportsAnalytics />}
        {view === "notifications" && <NotificationsLog />}
      </div>
    </div>
  );
}
