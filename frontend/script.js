/* ==========================================================================
   PredictIQ — dashboard logic
   Consumes a Flask prediction API and renders the result across the UI.
   ========================================================================== */

// -----------------------------------------------------------------------
// CONFIG — point this at your Flask backend's prediction endpoint.
// -----------------------------------------------------------------------
const API_ENDPOINT = "http://127.0.0.1:5000/predict";

// Expected backend response shape:
// { machine_failure: bool, failure_probability: 0-1, failure_type: string, alert: "Red - Critical" }

// -----------------------------------------------------------------------
// Recommendation library — predefined, no AI model needed on the frontend
// -----------------------------------------------------------------------
const RECOMMENDATIONS = {
  "Power Failure": [
    { title: "Inspect electrical supply", desc: "Check incoming voltage and current draw at the machine's power unit." },
    { title: "Check voltage fluctuations", desc: "Log supply stability over the next few cycles to rule out grid noise." },
    { title: "Schedule maintenance", desc: "Book an electrical technician before the next production run." },
  ],
  "Tool Wear Failure": [
    { title: "Replace worn cutting tool", desc: "Tool wear has crossed the safe threshold for this operation." },
    { title: "Inspect lubrication", desc: "Confirm the lubrication system is delivering adequate coolant flow." },
    { title: "Recalibrate feed rate", desc: "Reduce feed rate slightly until the replacement tool is fitted." },
  ],
  "Heat Dissipation Failure": [
    { title: "Inspect cooling fan", desc: "Verify the fan is spinning freely and airflow isn't obstructed." },
    { title: "Clean ventilation", desc: "Clear dust and debris from vents and heat sinks." },
    { title: "Check ambient temperature", desc: "Confirm the shop floor temperature is within operating spec." },
  ],
  "Overstrain Failure": [
    { title: "Reduce mechanical load", desc: "Torque and speed combination is exceeding rated tool strain." },
    { title: "Inspect drive components", desc: "Check belts, couplings and bearings for early stress signs." },
    { title: "Review operating parameters", desc: "Confirm rotational speed matches the current workpiece spec." },
  ],
  "Random Failures": [
    { title: "Run full diagnostic sweep", desc: "No single sensor stands out — perform a full system diagnostic." },
    { title: "Review recent maintenance logs", desc: "Cross-check against any recent part replacements or service." },
  ],
  "No Failure": [
    { title: "Continue standard monitoring", desc: "All sensor readings are within safe operating thresholds." },
    { title: "Maintain routine service schedule", desc: "No immediate action required — keep to the planned maintenance calendar." },
  ],
};

const DEFAULT_RECS = [
  { title: "Run full diagnostic sweep", desc: "Failure type wasn't recognised — perform a general inspection." },
  { title: "Log this reading", desc: "Save this result and monitor the next few cycles closely." },
];

// -----------------------------------------------------------------------
// State
// -----------------------------------------------------------------------
const state = {
  history: [],       // { time, status, probability, failureType, alert }
  lastResult: null,  // most recent full result, for PDF export
  lastInputs: null,
  chart: null,
};

// -----------------------------------------------------------------------
// DOM refs
// -----------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

const el = {
  landing: $("landing"),
  app: $("app"),
  startBtn: $("start-btn"),
  clock: $("live-clock"),
  date: $("live-date"),
  themeToggle: $("theme-toggle"),
  themeIcon: $("theme-icon"),
  connectionPill: $("connection-pill"),
  connectionText: $("connection-text"),

  form: $("input-form"),
  analyzeBtn: $("analyze-btn"),

  statusCard: $("status-card"),
  statusIcon: $("status-icon"),
  statusLabel: $("status-label"),
  statusSub: $("status-sub"),
  alertChip: $("alert-chip"),

  gaugeArc: $("gauge-arc"),
  gaugeValue: $("gauge-value"),
  healthScore: $("health-score"),
  failureType: $("failure-type"),

  insightsEmpty: $("insights-empty"),
  insightsList: $("insights-list"),

  historyEmpty: $("history-empty"),
  historyList: $("history-list"),

  failureTimeline: $("failure-timeline"),
  smtpStatus: $("smtp-status"),
  smtpText: $("smtp-text"),

  downloadBtn: $("download-btn"),
  footerYear: $("footer-year"),
};

const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 80;

// ==========================================================================
// LIVE CLOCK
// ==========================================================================
function updateClock() {
  const now = new Date();
  el.clock.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  el.date.textContent = now.toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}
updateClock();
setInterval(updateClock, 1000);
el.footerYear.textContent = new Date().getFullYear();

// ==========================================================================
// THEME TOGGLE
// ==========================================================================
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  el.themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  try { localStorage.setItem("predictiq-theme", theme); } catch (e) { /* ignore */ }
}

(function initTheme() {
  let saved = "dark";
  try { saved = localStorage.getItem("predictiq-theme") || "dark"; } catch (e) { /* ignore */ }
  applyTheme(saved);
})();

el.themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ==========================================================================
// LANDING → AUTH / DASHBOARD TRANSITION
// ==========================================================================
const authEl = $("auth");

el.startBtn.addEventListener("click", () => {
  el.landing.classList.add("landing-exit");
  setTimeout(() => {
    el.landing.style.display = "none";
    if (getSession()) {
      enterApp();
    } else {
      authEl.classList.remove("auth-hidden");
    }
  }, 350);
});

function enterApp() {
  authEl.classList.add("auth-hidden");
  el.landing.style.display = "none";
  el.app.classList.remove("app-hidden");
  const user = getSession();
  $("user-chip-name").textContent = user ? user.name : "Guest";
  if (!state.chart) initChart();
  checkBackendConnection();
  loadUserHistory();
}

// ==========================================================================
// AMBIENT PARTICLES (landing canvas)
// ==========================================================================
(function particles() {
  const canvas = $("particle-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, particlesArr;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((w * h) / 22000));
    particlesArr = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      vy: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    ctx.fillStyle = isLight ? "194,65,12" : "234,88,12";
    particlesArr.forEach((p) => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = h + 10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ctx.fillStyle === "194,65,12" ? "194,65,12" : "234,88,12"},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  createParticles();
  tick();
  window.addEventListener("resize", () => { resize(); createParticles(); });
})();

// ==========================================================================
// TOASTS
// ==========================================================================
function showToast(message, type = "info", duration = 4200) {
  const container = $("toast-container");
  const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 260);
  }, duration);
}

// ==========================================================================
// BACKEND CONNECTION CHECK (best-effort, non-blocking)
// ==========================================================================
async function checkBackendConnection() {
  try {
    const res = await fetch(API_ENDPOINT, { method: "OPTIONS" }).catch(() => null);
    // Many Flask setups won't answer OPTIONS cleanly — treat any response (even an error status) as "reachable".
    const reachable = !!res;
    setConnectionState(reachable);
  } catch (e) {
    setConnectionState(false);
  }
}

function setConnectionState(isLive) {
  el.connectionPill.setAttribute("data-live", String(isLive));
  el.connectionText.textContent = isLive ? "API Connected" : "Backend Offline";
}

// ==========================================================================
// STATUS DERIVATION
// ==========================================================================
function deriveStatus(data) {
  const alertStr = (data.alert || "").toLowerCase();
  if (alertStr.includes("critical") || alertStr.includes("red")) return "critical";
  if (alertStr.includes("warning") || alertStr.includes("orange")) return "warning";
  if (alertStr.includes("monitor") || alertStr.includes("yellow")) return "monitor";
  if (alertStr.includes("healthy") || alertStr.includes("green")) return "healthy";

  // Fallback purely on probability if the alert string is missing/unrecognised.
  // Thresholds are user-configurable via the Settings drawer (defaults match the original values).
  const p = (Number(data.failure_probability) || 0) * 100;
  const t = settingsState.thresholds;
  if (p >= t.critical) return "critical";
  if (p >= t.warning) return "warning";
  if (p >= t.monitor) return "monitor";
  return "healthy";
}

const STATUS_META = {
  healthy: { icon: "fa-circle-check", label: "Healthy", sub: "Machine is operating within normal parameters.", chip: "GREEN · NORMAL" },
  monitor: { icon: "fa-eye", label: "Monitor", sub: "Minor deviations detected — keep an eye on this machine.", chip: "YELLOW · MONITOR" },
  warning: { icon: "fa-triangle-exclamation", label: "Warning", sub: "Elevated failure risk — inspection recommended soon.", chip: "ORANGE · WARNING" },
  critical: { icon: "fa-radiation", label: "Critical", sub: "High failure risk — immediate action required.", chip: "RED · CRITICAL" },
};

// ==========================================================================
// FORM SUBMIT → ANALYZE
// ==========================================================================
el.form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = {
    "Type": $("machine-type").value,
    "Air temperature [K]": parseFloat($("air-temp").value),
    "Process temperature [K]": parseFloat($("process-temp").value),
    "Rotational speed [rpm]": parseFloat($("rot-speed").value),
    "Torque [Nm]": parseFloat($("torque").value),
    "Tool wear [min]": parseFloat($("tool-wear").value),
  };

  for (const [key, val] of Object.entries(inputs)) {
    if (key !== "Type" && (val === null || Number.isNaN(val))) {
      showToast(`Please enter a valid value for ${key.replace(/_/g, " ")}.`, "error");
      return;
    }
  }

  state.lastInputs = inputs;
  setAnalyzing(true);

  let data;
  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    data = await res.json();
    setConnectionState(true);
  } catch (err) {
    // Real-time app — no fake fallback data. Surface the failure and stop.
    setConnectionState(false);
    setAnalyzing(false);
    showToast("Couldn't reach the backend. Confirm Flask is running and CORS is enabled, then try again.", "error", 6000);
    return;
  }

  setAnalyzing(false);
  handleResult(data);
});

function setAnalyzing(isLoading) {
  el.analyzeBtn.disabled = isLoading;
  el.app.classList.toggle("is-analyzing", isLoading);
  el.analyzeBtn.innerHTML = isLoading
    ? `<i class="fa-solid fa-spinner fa-spin"></i><span>Analyzing…</span>`
    : `<i class="fa-solid fa-bolt"></i><span>Analyze Machine</span>`;
}

// ==========================================================================
// RENDER RESULT
// ==========================================================================
function handleResult(data) {
  const status = deriveStatus(data);
  const probabilityPct = Math.round((Number(data.failure_probability) || 0) * 100);
  const healthScore = Math.max(0, 100 - probabilityPct);
  const timestamp = new Date();

  state.lastResult = { ...data, status, probabilityPct, healthScore, timestamp };

  updateStatusCard(status, data);
  updateGauge(probabilityPct, status);
  updateSideStats(healthScore, data.failure_type);
  updateInsights(data.failure_type);
  renderFactors(data.top_factors);
  addHistoryEntry(status, probabilityPct, data.failure_type, timestamp);
  updateChart(probabilityPct, timestamp);
  updateFailureTimeline(status);
  renderSmtpStatus(data, status);
  alertEffects(status, data);
}

function updateStatusCard(status, data) {
  const meta = STATUS_META[status];
  el.statusCard.setAttribute("data-status", status);
  el.statusIcon.innerHTML = `<i class="fa-solid ${meta.icon}"></i>`;
  el.statusLabel.textContent = meta.label;
  el.statusSub.textContent = meta.sub;
  el.alertChip.textContent = data.alert ? data.alert.toUpperCase() : meta.chip;
}

function updateGauge(percent, status) {
  const offset = GAUGE_CIRCUMFERENCE - (percent / 100) * GAUGE_CIRCUMFERENCE;
  el.gaugeArc.style.strokeDashoffset = String(offset);
  el.gaugeArc.classList.remove("g-healthy", "g-monitor", "g-warning", "g-critical");
  el.gaugeArc.classList.add(`g-${status}`);
  animateCount(el.gaugeValue, percent, "%");
}

function updateSideStats(healthScore, failureType) {
  animateCount(el.healthScore, healthScore, "", " / 100");
  el.failureType.textContent = failureType || "—";
}

function animateCount(node, target, suffix = "", tail = "") {
  const start = 0;
  const duration = 700;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    node.innerHTML = `${value}${suffix ? `<small>${suffix}</small>` : ""}${tail}`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ==========================================================================
// AI INSIGHTS PANEL
// ==========================================================================
function updateInsights(failureType) {
  const steps = RECOMMENDATIONS[failureType] || DEFAULT_RECS;

  el.insightsEmpty.hidden = true;
  el.insightsList.hidden = false;
  el.insightsList.innerHTML = `
    <li class="insights-heading">Recommended actions for <strong>${failureType || "Unknown"}</strong></li>
  ` + steps.map((s) => `
    <li class="insight-step">
      <span class="insight-marker"><i class="fa-solid fa-arrow-right"></i></span>
      <span class="insight-body">
        <span class="insight-title">${s.title}</span>
        <span class="insight-desc">${s.desc}</span>
      </span>
    </li>
  `).join("");
}

// ==========================================================================
// PREDICTION HISTORY
// ==========================================================================
function addHistoryEntry(status, probabilityPct, failureType, timestamp) {
  state.history.unshift({ status, probabilityPct, failureType, timestamp });
  if (state.history.length > 25) state.history.pop();

  el.historyEmpty.hidden = true;
  el.historyList.hidden = false;
  el.historyList.innerHTML = state.history.map((h) => `
    <li class="history-item" data-status="${h.status}">
      <span class="hi-status-dot"></span>
      <span class="hi-type">${h.failureType || "—"}</span>
      <span class="hi-prob" data-mono>${h.probabilityPct}%</span>
      <span class="hi-time" data-mono>${h.timestamp.toLocaleTimeString("en-GB", { hour12: false })}</span>
    </li>
  `).join("");

  saveUserHistory();
}

// ==========================================================================
// TREND CHART (Chart.js)
// ==========================================================================
function initChart() {
  const ctx = $("trend-chart").getContext("2d");
  state.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Failure Probability (%)",
        data: [],
        borderColor: "#EA580C",
        backgroundColor: "rgba(234, 88, 12, 0.14)",
        pointBackgroundColor: "#EA580C",
        pointBorderColor: "#18181B",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutCubic" },
      scales: {
        x: {
          ticks: { color: "#A1A1AA", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
        y: {
          min: 0, max: 100,
          ticks: { color: "#A1A1AA", font: { family: "JetBrains Mono", size: 10 }, callback: (v) => v + "%" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#27272A",
          borderColor: "#52525B",
          borderWidth: 1,
          titleFont: { family: "Inter" },
          bodyFont: { family: "JetBrains Mono" },
        },
      },
    },
  });
}

function updateChart(percent, timestamp) {
  if (!state.chart) return;
  const label = timestamp.toLocaleTimeString("en-GB", { hour12: false });
  state.chart.data.labels.push(label);
  state.chart.data.datasets[0].data.push(percent);
  if (state.chart.data.labels.length > 12) {
    state.chart.data.labels.shift();
    state.chart.data.datasets[0].data.shift();
  }
  state.chart.update();
}

// ==========================================================================
// FAILURE TIMELINE STEPPER
// ==========================================================================
function updateFailureTimeline(status) {
  const order = ["healthy", "monitor", "warning", "critical"];
  const currentIndex = order.indexOf(status);
  el.failureTimeline.querySelectorAll(".ft-step").forEach((stepEl) => {
    const stage = stepEl.getAttribute("data-stage");
    stepEl.classList.toggle("active", order.indexOf(stage) === currentIndex);
  });
}

// ==========================================================================
// SMTP STATUS — reflects the backend's real email_status field.
// Expects (optionally) data.email_status = "sent" | "failed" | "not_attempted".
// If your backend doesn't send this field yet, add it to the JSON response
// from process_prediction() so this card shows real delivery status.
// ==========================================================================
function renderSmtpStatus(data, status) {
  const icon = el.smtpStatus.querySelector(".smtp-icon");
  const reported = data.email_status;

  if (status === "healthy" || status === "monitor") {
    el.smtpStatus.setAttribute("data-state", "waiting");
    icon.innerHTML = `<i class="fa-regular fa-clock"></i>`;
    el.smtpText.textContent = "No Alert Email Required";
    return;
  }

  if (reported === "sent") {
    el.smtpStatus.setAttribute("data-state", "sent");
    icon.innerHTML = `<i class="fa-solid fa-envelope-circle-check"></i>`;
    el.smtpText.textContent = "Email Alert Sent";
  } else if (reported === "failed") {
    el.smtpStatus.setAttribute("data-state", "failed");
    icon.innerHTML = `<i class="fa-solid fa-envelope-circle-exclamation"></i>`;
    el.smtpText.textContent = "Email Failed to Send";
  } else {
    // Backend didn't report a status — say so honestly instead of guessing.
    el.smtpStatus.setAttribute("data-state", "waiting");
    icon.innerHTML = `<i class="fa-solid fa-circle-question"></i>`;
    el.smtpText.textContent = "Delivery Status Not Reported by Backend";
  }
}

// ==========================================================================
// DOWNLOAD REPORT (PDF via jsPDF)
// ==========================================================================
el.downloadBtn.addEventListener("click", () => {
  if (!state.lastResult || !state.lastInputs) {
    showToast("Run an analysis first — there's no result to report yet.", "error");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const r = state.lastResult;
  const inputs = state.lastInputs;
  const margin = 18;
  let y = 22;

  // Header
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(250, 250, 250);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PredictIQ", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(194, 65, 12);
  doc.text("Machine Health Report", margin, 25);

  doc.setTextColor(20, 20, 20);
  y = 44;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Report Generated", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(r.timestamp.toLocaleString(), margin, y + 6);
  y += 16;

  doc.setDrawColor(210, 210, 210);
  doc.line(margin, y, 210 - margin, y);
  y += 10;

  // Machine inputs
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Machine Inputs", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const inputRows = [
    ["Machine Type", inputs["Type"]],
    ["Air Temperature", `${inputs["Air temperature [K]"]} K`],
    ["Process Temperature", `${inputs["Process temperature [K]"]} K`],
    ["Rotational Speed", `${inputs["Rotational speed [rpm]"]} rpm`],
    ["Torque", `${inputs["Torque [Nm]"]} Nm`],
    ["Tool Wear", `${inputs["Tool wear [min]"]} min`],
  ];
  inputRows.forEach(([label, val]) => {
    doc.text(String(label), margin, y);
    doc.text(String(val), margin + 70, y);
    y += 6.5;
  });
  y += 6;

  doc.line(margin, y, 210 - margin, y);
  y += 10;

  // Prediction
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Prediction Result", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const resultRows = [
    ["Machine Status", STATUS_META[r.status].label],
    ["Failure Probability", `${r.probabilityPct}%`],
    ["Machine Health Score", `${r.healthScore} / 100`],
    ["Predicted Failure Type", r.failure_type || "—"],
    ["Alert Level", r.alert || "—"],
  ];
  resultRows.forEach(([label, val]) => {
    doc.text(String(label), margin, y);
    doc.text(String(val), margin + 70, y);
    y += 6.5;
  });
  y += 6;

  doc.line(margin, y, 210 - margin, y);
  y += 10;

  // Recommendations
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("AI Recommendations", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const recs = RECOMMENDATIONS[r.failure_type] || DEFAULT_RECS;
  recs.forEach((rec, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${rec.title} — ${rec.desc}`, 210 - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 5.5 + 2;
  });

  y += 6;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, 210 - margin, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("Generated by PredictIQ — AI Powered Predictive Maintenance System.", margin, y);

  const fileStamp = r.timestamp.toISOString().replace(/[:.]/g, "-");
  doc.save(`PredictIQ_Report_${fileStamp}.pdf`);
  showToast("Machine health report downloaded.", "success");
});

// ==========================================================================
// SETTINGS (thresholds, sound, notifications) — persisted per browser
// ==========================================================================
const SETTINGS_KEY = "predictiq-settings";
const DEFAULT_SETTINGS = {
  thresholds: { monitor: 20, warning: 45, critical: 75 },
  soundEnabled: true,
  notifyEnabled: false,
};

let settingsState = loadSettings();

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved && saved.thresholds) return { ...DEFAULT_SETTINGS, ...saved };
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState)); } catch (e) { /* ignore */ }
}

function applySettingsToUI() {
  $("th-monitor").value = settingsState.thresholds.monitor;
  $("th-warning").value = settingsState.thresholds.warning;
  $("th-critical").value = settingsState.thresholds.critical;
  $("th-monitor-val").textContent = settingsState.thresholds.monitor;
  $("th-warning-val").textContent = settingsState.thresholds.warning;
  $("th-critical-val").textContent = settingsState.thresholds.critical;
  $("toggle-sound").checked = settingsState.soundEnabled;
  $("toggle-notify").checked = settingsState.notifyEnabled;
}
applySettingsToUI();

$("th-monitor").addEventListener("input", (e) => {
  settingsState.thresholds.monitor = Number(e.target.value);
  $("th-monitor-val").textContent = e.target.value;
  saveSettings();
});
$("th-warning").addEventListener("input", (e) => {
  settingsState.thresholds.warning = Number(e.target.value);
  $("th-warning-val").textContent = e.target.value;
  saveSettings();
});
$("th-critical").addEventListener("input", (e) => {
  settingsState.thresholds.critical = Number(e.target.value);
  $("th-critical-val").textContent = e.target.value;
  saveSettings();
});

$("toggle-sound").addEventListener("change", (e) => {
  settingsState.soundEnabled = e.target.checked;
  saveSettings();
});

$("toggle-notify").addEventListener("change", async (e) => {
  if (e.target.checked && "Notification" in window) {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      e.target.checked = false;
      showToast("Desktop notifications were blocked in your browser settings.", "error");
      settingsState.notifyEnabled = false;
      saveSettings();
      return;
    }
  }
  settingsState.notifyEnabled = e.target.checked;
  saveSettings();
});

$("settings-reset").addEventListener("click", () => {
  settingsState = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  saveSettings();
  applySettingsToUI();
  showToast("Settings reset to defaults.", "info");
});

// Drawer open/close
$("settings-toggle").addEventListener("click", () => {
  $("settings-drawer").hidden = false;
  $("settings-overlay").hidden = false;
});
function closeSettings() {
  $("settings-drawer").hidden = true;
  $("settings-overlay").hidden = true;
}
$("settings-close").addEventListener("click", closeSettings);
$("settings-overlay").addEventListener("click", closeSettings);

// ==========================================================================
// SOUND + DESKTOP NOTIFICATION ALERTS (fires once per new result)
// ==========================================================================
function playAlertTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch (e) { /* audio not available — ignore */ }
}

function alertEffects(status, data) {
  if (status === "critical" && settingsState.soundEnabled) {
    playAlertTone();
  }
  if ((status === "critical" || status === "warning") && settingsState.notifyEnabled && "Notification" in window && Notification.permission === "granted") {
    new Notification(`PredictIQ — ${STATUS_META[status].label} Alert`, {
      body: `${data.failure_type || "Unspecified failure"} · ${Math.round((data.failure_probability || 0) * 100)}% failure probability`,
      icon: undefined,
    });
  }
}

// ==========================================================================
// FEATURE SIGNAL FACTORS — renders backend-provided contribution weights.
// Expects (optionally) data.top_factors = [{ name: "Torque", weight: 0.42 }, ...]
// Hidden gracefully if the backend doesn't send this field.
// ==========================================================================
function renderFactors(topFactors) {
  const section = $("factors-section");
  const list = $("factors-list");

  if (!Array.isArray(topFactors) || topFactors.length === 0) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  const maxWeight = Math.max(...topFactors.map((f) => f.weight || 0), 0.0001);
  list.innerHTML = topFactors.slice(0, 5).map((f) => {
    const pct = Math.round((f.weight / maxWeight) * 100);
    const actualPct = Math.round((f.weight || 0) * 100);
    return `
      <div class="factor-row">
        <div class="factor-top">
          <span class="factor-name">${f.name}</span>
          <span class="factor-pct" data-mono>${actualPct}%</span>
        </div>
        <div class="factor-bar-track"><div class="factor-bar-fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }).join("");
}

// ==========================================================================
// PER-USER HISTORY PERSISTENCE (localStorage, keyed by logged-in username)
// ==========================================================================
function historyKey() {
  const user = getSession();
  return `predictiq-history-${user ? user.username : "guest"}`;
}

function saveUserHistory() {
  try {
    localStorage.setItem(historyKey(), JSON.stringify(state.history));
  } catch (e) { /* ignore */ }
}

function loadUserHistory() {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(historyKey())) || [];
  } catch (e) { saved = []; }

  state.history = saved.map((h) => ({ ...h, timestamp: new Date(h.timestamp) }));

  if (state.history.length === 0) {
    el.historyEmpty.hidden = false;
    el.historyList.hidden = true;
    el.historyList.innerHTML = "";
    return;
  }

  el.historyEmpty.hidden = true;
  el.historyList.hidden = false;
  el.historyList.innerHTML = state.history.map((h) => `
    <li class="history-item" data-status="${h.status}">
      <span class="hi-status-dot"></span>
      <span class="hi-type">${h.failureType || "—"}</span>
      <span class="hi-prob" data-mono>${h.probabilityPct}%</span>
      <span class="hi-time" data-mono>${h.timestamp.toLocaleTimeString("en-GB", { hour12: false })}</span>
    </li>
  `).join("");

  // Repopulate the trend chart from saved history (oldest first, last 12)
  if (state.chart) {
    const chronological = [...state.history].reverse().slice(-12);
    state.chart.data.labels = chronological.map((h) => h.timestamp.toLocaleTimeString("en-GB", { hour12: false }));
    state.chart.data.datasets[0].data = chronological.map((h) => h.probabilityPct);
    state.chart.update();
  }
}

// ==========================================================================
// CSV EXPORT — prediction history
// ==========================================================================
$("csv-btn").addEventListener("click", () => {
  if (state.history.length === 0) {
    showToast("No prediction history yet — run an analysis first.", "error");
    return;
  }
  const header = ["Time", "Status", "Failure Probability (%)", "Failure Type"];
  const rows = state.history.map((h) => [
    h.timestamp.toLocaleString(),
    STATUS_META[h.status] ? STATUS_META[h.status].label : h.status,
    h.probabilityPct,
    h.failureType || "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `PredictIQ_History_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Prediction history exported as CSV.", "success");
});

// ==========================================================================
// AUTH SYSTEM
// Demo-grade, browser-local authentication — no backend auth endpoint exists
// yet, so accounts + sessions are stored in this browser's localStorage.
// Passwords are hashed with SHA-256 before storage (not plaintext), but this
// is still NOT a substitute for real server-side authentication.
// ==========================================================================
const USERS_KEY = "predictiq-users";
const SESSION_KEY = "predictiq-session";

async function hashPassword(password) {
  try {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    // Fallback for non-secure contexts where crypto.subtle is unavailable.
    return "plain:" + btoa(unescape(encodeURIComponent(password)));
  }
}

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) { /* ignore */ }
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch (e) { return null; }
}
function setSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (e) { /* ignore */ }
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

// ---------- Tab switching ----------
document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const target = tab.getAttribute("data-tab");
    $("signin-form").hidden = target !== "signin";
    $("signup-form").hidden = target !== "signup";
  });
});

// ---------- Sign up ----------
$("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = $("signup-error");
  errorEl.hidden = true;

  const name = $("signup-name").value.trim();
  const username = $("signup-username").value.trim().toLowerCase();
  const password = $("signup-password").value;
  const confirm = $("signup-confirm").value;

  if (!name || !username || !password) {
    errorEl.textContent = "Please fill in every field.";
    errorEl.hidden = false;
    return;
  }
  if (password.length < 4) {
    errorEl.textContent = "Password must be at least 4 characters.";
    errorEl.hidden = false;
    return;
  }
  if (password !== confirm) {
    errorEl.textContent = "Passwords do not match.";
    errorEl.hidden = false;
    return;
  }

  const users = loadUsers();
  if (users[username]) {
    errorEl.textContent = "That username is already taken.";
    errorEl.hidden = false;
    return;
  }

  users[username] = { name, username, passwordHash: await hashPassword(password) };
  saveUsers(users);
  setSession({ name, username });
  showToast(`Account created — welcome, ${name}!`, "success");
  enterApp();
});

// ---------- Sign in ----------
$("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = $("signin-error");
  errorEl.hidden = true;

  const username = $("signin-username").value.trim().toLowerCase();
  const password = $("signin-password").value;

  const users = loadUsers();
  const record = users[username];
  if (!record) {
    errorEl.textContent = "No account found with that username.";
    errorEl.hidden = false;
    return;
  }

  const hashed = await hashPassword(password);
  if (hashed !== record.passwordHash) {
    errorEl.textContent = "Incorrect password.";
    errorEl.hidden = false;
    return;
  }

  setSession({ name: record.name, username: record.username });
  showToast(`Welcome back, ${record.name}!`, "success");
  enterApp();
});

// ---------- Back to landing ----------
$("auth-back").addEventListener("click", () => {
  authEl.classList.add("auth-hidden");
  el.landing.style.display = "flex";
  el.landing.classList.remove("landing-exit");
});

// ---------- Logout ----------
$("logout-btn").addEventListener("click", () => {
  clearSession();
  el.app.classList.add("app-hidden");
  el.landing.style.display = "flex";
  el.landing.classList.remove("landing-exit");
  showToast("Signed out.", "info");
});