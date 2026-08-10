const I = {
  dashboard:
    '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  megaphone:
    '<path d="M3 10v4a1 1 0 001 1h2l5 4V5L6 9H4a1 1 0 00-1 1z"/><path d="M14 8a4 4 0 010 8"/><path d="M18 5a8 8 0 010 14"/>',
  chevronR: '<path d="M9 6l6 6-6 6"/>',
  chevronD: '<path d="M6 9l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  trash:
    '<path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H7a1 1 0 01-1-1V6h12z"/><path d="M10 11v6M14 11v6"/>',
  pencil:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  arrowL: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  printer:
    '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M6 17h12v5H6z"/>',
  save: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M7 3v6h8V3M7 21v-8h10v8"/>',
  bell: '<path d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 21a2 2 0 004 0"/>',
  alertC: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
  checkC: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  grad: '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11.5V17c0 1.4 3 3 6 3s6-1.6 6-3v-5.5"/>',
  checkS:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
  square: '<rect x="3" y="3" width="18" height="18" rx="3"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  archive:
    '<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>',
};
function svg(e, t = 16) {
  return `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[e] || ""}</svg>`;
}
function uid(e) {
  return e + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
}
function esc(e) {
  return null == e
    ? ""
    : String(e).replace(
        /[&<>"']/g,
        (e) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[e],
      );
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
const PHASES = [
    { key: "planificacion", label: "Planificación" },
    { key: "preparacion", label: "Preparación" },
    { key: "ejecucion", label: "Ejecución" },
    { key: "evaluacion", label: "Evaluación" },
  ],
  RATING_LABELS = {
    5: "Excelente",
    4: "Muy bueno",
    3: "Bueno",
    2: "Regular",
    1: "Malo",
  };
function calcPhase(e) {
  const t = todayISO(),
    a =
      e.rolesTree &&
      (e.rolesTree.studentRoles?.length > 0 ||
        (e.rolesTree.children || []).some((e) => e.studentRoles?.length > 0));
  return e.eventDate && e.eventDate < t
    ? 3
    : e.eventDate && e.eventDate <= t
      ? 2
      : a
        ? 1
        : 0;
}
function calcStatus(e) {
  if (e.urgent) return "Urgente";
  const t = calcPhase(e);
  return 3 === t ? "Completado" : t >= 1 ? "En Proceso" : "Pendiente";
}
function hasStudentRoles(e) {
  return (
    !!(e.studentRoles && e.studentRoles.length > 0) ||
    (e.children || []).some((e) => hasStudentRoles(e))
  );
}
function countStudents(e) {
  let t = (e.studentRoles || []).length;
  for (const a of e.children || []) t += countStudents(a);
  return t;
}
function toast(e, t) {
  const a = document.getElementById("toast-root"),
    n = document.createElement("div");
  ((n.className = "toast" + (t ? " " + t : "")),
    (n.textContent = e),
    a.appendChild(n),
    setTimeout(() => {
      ((n.style.opacity = "0"),
        (n.style.transition = "opacity .2s"),
        setTimeout(() => n.remove(), 200));
    }, 2600));
}
const STATUS_CFG = {
  Completado: { label: "COMPLETADO", bg: "#ECFDF5", text: "#059669" },
  "En Proceso": { label: "EN PROCESO", bg: "#FFFBEB", text: "#D97706" },
  Urgente: { label: "URGENTE", bg: "#FEF2F2", text: "#DC2626" },
  Pendiente: { label: "PENDIENTE", bg: "#F1F5F9", text: "#64748B" },
  URGENTE: { label: "URGENTE", bg: "#FEF2F2", text: "#DC2626" },
  INFORMATIVO: { label: "INFORMATIVO", bg: "#EFF6FF", text: "#2563EB" },
  RECORDATORIO: { label: "RECORDATORIO", bg: "#FFFBEB", text: "#D97706" },
};
function badge(e) {
  const t = STATUS_CFG[e] || {
    label: String(e).toUpperCase(),
    bg: "#F1F5F9",
    text: "#64748B",
  };
  return `<span class="badge" style="background:${t.bg};color:${t.text}">${t.label}</span>`;
}
const TYPE_CFG = {
  Academico: { bg: "#EFF6FF", text: "#1D4ED8" },
  Cultural: { bg: "#FDF4FF", text: "#9333EA" },
  Deportivo: { bg: "#F0FDF4", text: "#16A34A" },
  Social: { bg: "#FFF7ED", text: "#EA580C" },
  Administrativo: { bg: "#F8FAFC", text: "#64748B" },
};
function typeBadge(e) {
  const t = TYPE_CFG[e] || { bg: "#F1F5F9", text: "#64748B" };
  return `<span class="type-badge" style="background:${t.bg};color:${t.text}">${esc(e)}</span>`;
}
function progressHtml(e) {
  const t = calcPhase(e),
    a = Math.round((t / 3) * 100),
    n =
      3 === t
        ? "#059669"
        : 2 === t
          ? "#3B82F6"
          : 1 === t
            ? "#D97706"
            : "#94A3B8";
  return `<div class="progress-wrap"><div class="flex justify-between mb-1"><span class="text-xs text-slate-500 dark:text-slate-400">${PHASES[t].label}</span><span class="text-xs font-bold" style="color:${n}">${a}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${a}%;background:${n}"></div></div></div>`;
}
function defaultRolesTree(e) {
  return {
    id: "node_root",
    title: "Coordinador General",
    assignee: e || "",
    children: [],
    studentRoles: [],
  };
}
function seedData() {
  if (null !== localStorage.getItem("sioci_events_v2")) return;
  const e = [
      {
        id: uid("evt"),
        title: "Dia del Idioma",
        type: "Cultural",
        urgent: !1,
        eventDate: "2026-09-23",
        prepDeadline: "2026-09-18",
        leaderTeacher: "Prof. Erika Villafane",
        phase: 0,
        rating: null,
        description:
          "Jornada cultural con presentaciones literarias y artisticas de todos los grados.",
        objectives: [
          "Fomentar el amor por la lectura entre estudiantes",
          "Reconocer las lenguas originarias de nuestra region",
          "Promover la expresion artistica a traves de la palabra",
        ],
        resources: [
          {
            id: uid("res"),
            name: "Micrófono inalámbrico",
            qty: 2,
            unit: "pza",
            area: "Sonido",
            status: "pendiente",
          },
          {
            id: uid("res"),
            name: "Sillas plegables",
            qty: 40,
            unit: "pza",
            area: "Logística",
            status: "pendiente",
          },
          {
            id: uid("res"),
            name: "Afiches impresos",
            qty: 15,
            unit: "pza",
            area: "Decoración",
            status: "pendiente",
          },
        ],
        observations:
          "El evento inicia a las 8:00 AM. Los grados deben estar en la cancha a las 7:45.",
        backupPlan: {
          weather: {
            enabled: !0,
            venue: "Sala de conversatorio (solo actividades de presentación)",
            notes:
              "Las actividades artísticas se mueven a sala. Se hace horario rotativo: 20 min por grado.",
          },
          medical: {
            enabled: !0,
            protocol:
              "Punto de atención en Coordinación. Contactar Emergencias 123 si es grave. Agua y botiquín disponibles.",
          },
          sound: {
            enabled: !0,
            fallback:
              "Megáfono de emergencia + 2 estudiantes ayudantes como voceadores",
          },
          communication: {
            enabled: !0,
            fallback:
              "Lista impresa del cronograma en cada grado + carteles visuales en la cancha",
          },
          custom: [
            {
              title: "Salida anticipada",
              description:
                "Si el evento se extiende, a las 12:15 se hace cierre obligatorio. Actividades pendientes se posponen.",
            },
          ],
        },
        rolesTree: {
          id: "node_root",
          title: "Coordinador General",
          assignee: "Prof. Erika Villafane",
          studentRoles: [],
          children: [
            {
              id: uid("node"),
              title: "Logistica",
              assignee: "Prof. Juan Ramirez",
              studentRoles: [
                {
                  id: uid("sr"),
                  studentName: "Sofia Martinez",
                  grade: "10-1",
                  role: "Maestra de ceremonias",
                },
                {
                  id: uid("sr"),
                  studentName: "Juan Pablo Rojas",
                  grade: "11-2",
                  role: "Encargado de sonido",
                },
              ],
              children: [],
            },
            {
              id: uid("node"),
              title: "Decoracion",
              assignee: "Prof. Ana Gomez",
              studentRoles: [
                {
                  id: uid("sr"),
                  studentName: "Valentina Cruz",
                  grade: "9-3",
                  role: "Decoracion de escenario",
                },
              ],
              children: [],
            },
          ],
        },
      },
      {
        id: uid("evt"),
        title: "Feria de la Ciencia y la Tecnologia",
        type: "Academico",
        urgent: !1,
        eventDate: "2026-10-14",
        prepDeadline: "2026-10-05",
        leaderTeacher: "Prof. Carlos Mendoza",
        phase: 0,
        rating: null,
        description:
          "Exposicion de proyectos cientificos de basica secundaria y media.",
        rolesTree: defaultRolesTree("Prof. Carlos Mendoza"),
      },
      {
        id: uid("evt"),
        title: "Copa Interclases de Futbol",
        type: "Deportivo",
        urgent: !0,
        eventDate: "2026-08-12",
        prepDeadline: "2026-08-08",
        leaderTeacher: "Prof. Diego Salazar",
        phase: 0,
        rating: null,
        description:
          "Torneo deportivo entre los cursos de bachillerato, fase de cuartos de final.",
        rolesTree: {
          id: "node_root",
          title: "Coordinador General",
          assignee: "Prof. Diego Salazar",
          studentRoles: [],
          children: [
            {
              id: uid("node"),
              title: "Arbitraje y Cancha",
              assignee: "Prof. Diego Salazar",
              studentRoles: [
                {
                  id: uid("sr"),
                  studentName: "Mateo Londono",
                  grade: "11-1",
                  role: "Anotador oficial",
                },
              ],
              children: [],
            },
          ],
        },
      },
      {
        id: uid("evt"),
        title: "Jornada de Integracion Familiar",
        type: "Social",
        urgent: !1,
        eventDate: "2026-06-20",
        prepDeadline: "2026-06-14",
        leaderTeacher: "Prof. Erika Villafane",
        phase: 3,
        rating: 5,
        description:
          "Encuentro deportivo y cultural con las familias de la comunidad pilarista.",
        rolesTree: defaultRolesTree("Prof. Erika Villafane"),
      },
      {
        id: uid("evt"),
        title: "Consejo Academico Mensual",
        type: "Administrativo",
        urgent: !1,
        eventDate: "2026-08-28",
        prepDeadline: "2026-08-26",
        leaderTeacher: "Prof. Erika Villafane",
        phase: 0,
        rating: null,
        description:
          "Revision de indicadores academicos del bimestre y casos de convivencia.",
        rolesTree: defaultRolesTree("Prof. Erika Villafane"),
      },
      {
        id: uid("evt"),
        title: "Izada de Bandera - Mes de la Paz",
        type: "Cultural",
        urgent: !1,
        eventDate: "2026-08-20",
        prepDeadline: "2026-08-19",
        leaderTeacher: "Prof. Ana Gomez",
        phase: 0,
        rating: null,
        description: "Acto civico conmemorativo a cargo del grado 9-2.",
        rolesTree: defaultRolesTree("Prof. Ana Gomez"),
      },
    ],
    t = [
      {
        id: uid("ann"),
        title: "Suspension de clases por mantenimiento",
        category: "URGENTE",
        content:
          "El dia viernes no habra actividad academica presencial debido a labores de mantenimiento.",
        date: todayISO(),
        author: "Rectoria",
        readBy: [],
      },
      {
        id: uid("ann"),
        title: "Recordatorio: entrega de planillas",
        category: "RECORDATORIO",
        content:
          "Se recuerda a todos los docentes entregar las planillas de seguimiento antes del cierre del bimestre.",
        date: todayISO(),
        author: "Coordinacion Academica",
        readBy: ["usr_01"],
      },
      {
        id: uid("ann"),
        title: "Nuevo horario de atencion",
        category: "INFORMATIVO",
        content:
          "A partir del proximo mes la atencion a padres sera los martes y jueves de 2:00 p.m. a 4:00 p.m.",
        date: todayISO(),
        author: "Secretaria Academica",
        readBy: [],
      },
      {
        id: uid("ann"),
        title: "Capacitacion docente",
        category: "INFORMATIVO",
        content:
          "Invitamos a toda la planta docente a la jornada de capacitacion en herramientas digitales.",
        date: todayISO(),
        author: "Prof. Erika Villafane",
        readBy: ["usr_01"],
      },
    ];
  (localStorage.setItem("sioci_events_v2", JSON.stringify(e)),
    localStorage.setItem("sioci_announcements", JSON.stringify(t)));
}
const DB = {
  _cache: null,
  _cacheKey: "sioci_events_v2",
  listEvents() {
    return (
      this._cache ||
        (this._cache = JSON.parse(
          localStorage.getItem(this._cacheKey) || "[]",
        )),
      this._cache
    );
  },
  saveEvents(e) {
    ((this._cache = e),
      localStorage.setItem(this._cacheKey, JSON.stringify(e)));
  },
  invalidateCache() {
    this._cache = null;
  },
  getEvent(e) {
    return this.listEvents().find((t) => t.id === e) || null;
  },
  createEvent(e) {
    const t = this.listEvents(),
      a = {
        id: uid("evt"),
        title: e.title,
        type: e.type,
        eventDate: e.eventDate,
        prepDeadline: e.prepDeadline,
        urgent: e.urgent || !1,
        description: e.description || "",
        leaderTeacher: e.leaderTeacher,
        phase: 0,
        rating: null,
        archived: !1,
        rolesTree: defaultRolesTree(e.leaderTeacher),
        objectives: e.objectives || [],
        resources: e.resources || [],
        observations: e.observations || "",
        backupPlan: e.backupPlan || {
          weather: { enabled: !1, venue: "", notes: "" },
          medical: { enabled: !1, protocol: "" },
          sound: { enabled: !1, fallback: "" },
          communication: { enabled: !1, fallback: "" },
          custom: [],
        },
      };
    return (t.push(a), this.saveEvents(t), a);
  },
  updateEvent(e, t) {
    const a = this.listEvents(),
      n = a.findIndex((t) => t.id === e);
    return -1 === n
      ? null
      : ((a[n] = { ...a[n], ...t }),
        t.leaderTeacher &&
          a[n].rolesTree &&
          (a[n].rolesTree.assignee = t.leaderTeacher),
        this.saveEvents(a),
        a[n]);
  },
  deleteEvent(e) {
    this.saveEvents(this.listEvents().filter((t) => t.id !== e));
  },
  archiveEvent(e) {
    const t = this.listEvents(),
      a = t.findIndex((t) => t.id === e);
    -1 !== a && ((t[a].archived = !0), this.saveEvents(t));
  },
  unarchiveEvent(e) {
    const t = this.listEvents(),
      a = t.findIndex((t) => t.id === e);
    -1 !== a && ((t[a].archived = !1), this.saveEvents(t));
  },
  autoArchive() {
    const e = this.listEvents(),
      t = todayISO();
    let a = !1;
    (e.forEach((e) => {
      if (!e.archived && e.eventDate) {
        const n = new Date(e.eventDate);
        (n.setDate(n.getDate() + 30),
          n.toISOString().slice(0, 10) < t && ((e.archived = !0), (a = !0)));
      }
    }),
      a && this.saveEvents(e));
  },
  listActive() {
    return this.listEvents().filter((e) => !e.archived);
  },
  listArchived() {
    return this.listEvents().filter((e) => e.archived);
  },
  getSummary() {
    const e = this.listActive(),
      t = {};
    let a = 0;
    e.forEach((e) => {
      const n = calcStatus(e);
      ((t[n] = (t[n] || 0) + 1), (a += calcPhase(e)));
    });
    const n = todayISO();
    return {
      total: e.length,
      byStatus: t,
      avg: e.length ? Math.round((a / e.length / 3) * 100) : 0,
      upcoming: e.filter(
        (e) => e.eventDate >= n && "Completado" !== calcStatus(e),
      ).length,
    };
  },
  getPrintData(e) {
    const t = this.getEvent(e);
    if (!t) return null;
    const a = [];
    !(function e(t, n) {
      t &&
        ((t.studentRoles || []).forEach((e) =>
          a.push({
            name: e.studentName,
            grade: e.grade,
            role: e.role,
            area: n,
          }),
        ),
        (t.children || []).forEach((t) => e(t, t.title || n)));
    })(t.rolesTree, t.leaderTeacher);
    const n = t.backupPlan || {},
      s = [];
    return (
      n.weather?.enabled &&
        s.push({ icon: "🌧️", text: n.weather.venue || "Ver plan de lluvia" }),
      n.medical?.enabled &&
        s.push({ icon: "🏥", text: "Pto. atención: Coordinación" }),
      n.sound?.enabled &&
        s.push({ icon: "🔊", text: n.sound.fallback || "Ver plan de sonido" }),
      n.communication?.enabled &&
        s.push({
          icon: "📢",
          text: n.communication.fallback || "Ver plan de comunicación",
        }),
      {
        title: t.title,
        date: t.eventDate,
        objectives: t.objectives || [],
        resources: t.resources || [],
        observations: t.observations || "",
        backupPlan: s,
        cards: a,
      }
    );
  },
  listAnn: () =>
    JSON.parse(localStorage.getItem("sioci_announcements") || "[]"),
  saveAnn(e) {
    localStorage.setItem("sioci_announcements", JSON.stringify(e));
  },
  createAnn(e) {
    const t = this.listAnn(),
      a = {
        id: uid("ann"),
        title: e.title,
        content: e.content || "",
        category: e.category,
        date: e.date || todayISO(),
        author: e.author,
        readBy: [],
      };
    return (t.push(a), this.saveAnn(t), a);
  },
  deleteAnn(e) {
    this.saveAnn(this.listAnn().filter((t) => t.id !== e));
  },
  markRead(e) {
    const t = this.listAnn(),
      a = t.findIndex((t) => t.id === e);
    a >= 0 &&
      !t[a].readBy.includes("usr_01") &&
      (t[a].readBy.push("usr_01"), this.saveAnn(t));
  },
};
function setTheme(e) {
  (localStorage.setItem("sioci_theme", e),
    ["light", "dark", "system"].forEach((t) => {
      const a = document.getElementById("theme-" + t);
      a &&
        (a.classList.toggle("bg-white", t === e),
        a.classList.toggle("dark:bg-slate-700", t === e),
        a.classList.toggle("shadow-sm", t === e),
        a.classList.toggle("text-neon-cyan", t === e));
    }),
    "dark" === e
      ? document.documentElement.classList.add("dark")
      : "light" === e
        ? document.documentElement.classList.remove("dark")
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? document.documentElement.classList.add("dark")
          : document.documentElement.classList.remove("dark"));
}
function checkSession() {
  const e = "true" === localStorage.getItem("sioci_logged"),
    t = "true" === localStorage.getItem("sioci_welcome_seen");
  (document.getElementById("view-login").classList.toggle("hidden", e),
    document.getElementById("view-welcome").classList.toggle("hidden", !e || t),
    document
      .getElementById("app-container")
      .classList.toggle("hidden", !e || !t),
    (document.getElementById("webgl-canvas").style.display =
      e && t ? "none" : ""),
    e && !t ? initWelcomeCanvas() : destroyWelcomeCanvas(),
    e && t && (window.__stopWebGL && window.__stopWebGL(), initMainApp()));
}
function initWelcomeStars() {}
let wCanvas,
  wCtx,
  wAnimId = null,
  wMouse = { x: -1e3, y: -1e3 },
  wPhase = 0,
  wTime = 0,
  wStartTime = 0,
  wWaves = [],
  wParticles = [],
  wCoreRadius = 0,
  wCorePulse = 0,
  wRevealed = [!1, !1, !1],
  wDone = !1;
const WAVE_DATA = [
  { text: "120+", sub: "Eventos Coordinados" },
  { text: "45", sub: "Coordinadores Activos" },
  { text: "8", sub: "Areas del Sistema" },
];
function initWelcomeCanvas() {
  ((wCanvas = document.getElementById("welcome-canvas")),
    wCanvas &&
      ((wCtx = wCanvas.getContext("2d")),
      wResize(),
      window.addEventListener("resize", wResize),
      wCanvas.addEventListener("mousemove", (e) => {
        const t = wCanvas.getBoundingClientRect();
        ((wMouse.x = e.clientX - t.left), (wMouse.y = e.clientY - t.top));
      }),
      wCanvas.addEventListener("mouseleave", () => {
        ((wMouse.x = -1e3), (wMouse.y = -1e3));
      }),
      wReset()));
}
function wResize() {
  wCanvas &&
    ((wCanvas.width = window.innerWidth),
    (wCanvas.height = window.innerHeight));
}
function wReset() {
  ((wPhase = 0),
    (wTime = 0),
    (wStartTime = performance.now()),
    (wWaves = []),
    (wParticles = []),
    (wCoreRadius = 0),
    (wCorePulse = 0),
    (wRevealed = [!1, !1, !1]),
    (wDone = !1),
    wSpawnParticles(),
    (wPhase = 1),
    wAnimate());
}
function wSpawnParticles() {
  if (!wCanvas) return;
  const e = wCanvas.width,
    t = wCanvas.height;
  wParticles = [];
  for (let a = 0; a < 120; a++) {
    const n = Math.random() * Math.PI * 2,
      s = 200 + 400 * Math.random();
    (wParticles.push({
      x: e / 2 + Math.cos(n) * s,
      y: t / 2 + Math.sin(n) * s,
      ox: 0,
      oy: 0,
      vx: 0.3 * (Math.random() - 0.5),
      vy: 0.3 * (Math.random() - 0.5),
      size: 1 + 2 * Math.random(),
      alpha: 0.2 + 0.5 * Math.random(),
      speed: 0.2 + 0.4 * Math.random(),
      angle: Math.random() * Math.PI * 2,
      orbit: 150 + 300 * Math.random(),
      delay: 2e3 * Math.random(),
    }),
      (wParticles[a].ox = wParticles[a].x),
      (wParticles[a].oy = wParticles[a].y));
  }
}
function wAnimate() {
  if (!wCtx) return;
  const e = wCanvas.width,
    t = wCanvas.height,
    a = performance.now(),
    n = a - wStartTime,
    s = e / 2,
    o = t / 2;
  ((wCtx.fillStyle = "#0a0a1a"),
    wCtx.fillRect(0, 0, e, t),
    (wCtx.strokeStyle = "rgba(37,99,235,0.03)"),
    (wCtx.lineWidth = 1));
  for (let a = 0; a < e; a += 60)
    (wCtx.beginPath(), wCtx.moveTo(a, 0), wCtx.lineTo(a, t), wCtx.stroke());
  for (let a = 0; a < t; a += 60)
    (wCtx.beginPath(), wCtx.moveTo(0, a), wCtx.lineTo(e, a), wCtx.stroke());
  for (let n = 0; n < 60; n++) {
    const s = (137.5 * n + 3e-4 * a) % e,
      o = (97.3 * n) % t,
      l = 0.1 + 0.06 * Math.sin(0.001 * a + n);
    ((wCtx.fillStyle = `rgba(255,255,255,${l})`), wCtx.fillRect(s, o, 1, 1));
  }
  for (const e of wParticles) {
    const t = n - e.delay;
    if (t < 0) continue;
    const l = Math.min(1, t / 1500);
    ((e.angle += 0.01 * e.speed),
      (e.x = s + Math.cos(e.angle) * e.orbit * (0.3 + 0.7 * l)),
      (e.y = o + Math.sin(0.7 * e.angle) * e.orbit * 0.6 * (0.3 + 0.7 * l)),
      (e.x += 8 * Math.sin(5e-4 * a + e.delay)),
      (e.y += 5 * Math.cos(7e-4 * a + e.delay)));
    const r = e.x - wMouse.x,
      i = e.y - wMouse.y,
      d = Math.sqrt(r * r + i * i);
    (d < 100 && d > 0 && ((e.x += (r / d) * 3), (e.y += (i / d) * 3)),
      (wCtx.fillStyle = `rgba(37,99,235,${e.alpha * l})`),
      wCtx.beginPath(),
      wCtx.arc(e.x, e.y, e.size, 0, 2 * Math.PI),
      wCtx.fill());
  }
  if (1 === wPhase) {
    ((wCorePulse += 0.03), (wCoreRadius = 4 + 3 * Math.sin(wCorePulse)));
    const e = wCtx.createRadialGradient(s, o, 0, s, o, 60);
    (e.addColorStop(0, "rgba(37,99,235,0.8)"),
      e.addColorStop(0.4, "rgba(124,58,237,0.3)"),
      e.addColorStop(1, "rgba(37,99,235,0)"),
      (wCtx.fillStyle = e),
      wCtx.beginPath(),
      wCtx.arc(s, o, 60, 0, 2 * Math.PI),
      wCtx.fill(),
      (wCtx.fillStyle = "#fff"),
      wCtx.beginPath(),
      wCtx.arc(s, o, wCoreRadius, 0, 2 * Math.PI),
      wCtx.fill(),
      n > 1800 && ((wPhase = 2), (wStartTime = a)));
  }
  if (wPhase >= 2 && wPhase <= 4) {
    const n = wCtx.createRadialGradient(s, o, 0, s, o, 50);
    (n.addColorStop(0, "rgba(37,99,235,0.6)"),
      n.addColorStop(0.5, "rgba(124,58,237,0.15)"),
      n.addColorStop(1, "rgba(37,99,235,0)"),
      (wCtx.fillStyle = n),
      wCtx.beginPath(),
      wCtx.arc(s, o, 50, 0, 2 * Math.PI),
      wCtx.fill(),
      (wCtx.fillStyle = "#fff"),
      wCtx.beginPath(),
      wCtx.arc(s, o, 3, 0, 2 * Math.PI),
      wCtx.fill());
    const l = wPhase - 2;
    (wWaves[l] && !wWaves[l].done) ||
      (wWaves[l] = { r: 0, alpha: 1, done: !1, born: a });
    const r = 0.55 * Math.sqrt(e * e + t * t);
    for (let e = 0; e < wWaves.length; e++) {
      const t = wWaves[e];
      if (t && !t.done)
        if (
          ((t.r += r / 2.2), (t.alpha = Math.max(0, 1 - t.r / r)), t.alpha <= 0)
        )
          t.done = !0;
        else if (
          (wCtx.save(),
          (wCtx.strokeStyle = `rgba(37,99,235,${0.8 * t.alpha})`),
          (wCtx.lineWidth = 3),
          (wCtx.shadowColor = "rgba(37,99,235,0.6)"),
          (wCtx.shadowBlur = 20),
          wCtx.beginPath(),
          wCtx.arc(s, o, t.r, 0, 2 * Math.PI),
          wCtx.stroke(),
          wCtx.restore(),
          (wCtx.strokeStyle = `rgba(124,58,237,${0.3 * t.alpha})`),
          (wCtx.lineWidth = 1),
          wCtx.beginPath(),
          wCtx.arc(s, o, 0.98 * t.r, 0, 2 * Math.PI),
          wCtx.stroke(),
          t.r > 0.45 * r && !wRevealed[e])
        ) {
          wRevealed[e] = !0;
          const t = document.getElementById("welcome-stats");
          t && t.classList.remove("hidden");
          const a = document.querySelector(
            `.welcome-stat[data-wave="${e + 1}"]`,
          );
          a && a.classList.add("show");
        }
    }
    const i = wWaves[l];
    i && i.done && ((wPhase = l < 2 ? 3 + l : 5), (wStartTime = a));
  }
  if (5 === wPhase) {
    const e = wCtx.createRadialGradient(s, o, 0, s, o, 40);
    if (
      (e.addColorStop(0, "rgba(37,99,235,0.3)"),
      e.addColorStop(1, "rgba(37,99,235,0)"),
      (wCtx.fillStyle = e),
      wCtx.beginPath(),
      wCtx.arc(s, o, 40, 0, 2 * Math.PI),
      wCtx.fill(),
      n > 1500)
    ) {
      const e = document.getElementById("welcome-phrase"),
        t = document.getElementById("btn-enter-dashboard");
      (e && (e.classList.remove("hidden"), e.classList.add("show")),
        t && (t.classList.remove("hidden"), t.classList.add("show")),
        (wPhase = 6),
        (wStartTime = a));
    }
  }
  if (6 === wPhase) {
    const e = wCtx.createRadialGradient(s, o, 0, s, o, 30);
    (e.addColorStop(0, "rgba(37,99,235,0.15)"),
      e.addColorStop(1, "rgba(37,99,235,0)"),
      (wCtx.fillStyle = e),
      wCtx.beginPath(),
      wCtx.arc(s, o, 30, 0, 2 * Math.PI),
      wCtx.fill());
  }
  wAnimId = requestAnimationFrame(wAnimate);
}
function destroyWelcomeCanvas() {
  (wAnimId && (cancelAnimationFrame(wAnimId), (wAnimId = null)),
    (wParticles = []),
    (wWaves = []));
  const e = document.getElementById("welcome-stats"),
    t = document.getElementById("welcome-phrase"),
    a = document.getElementById("btn-enter-dashboard");
  (e &&
    (e.classList.add("hidden"),
    e
      .querySelectorAll(".welcome-stat")
      .forEach((e) => e.classList.remove("show"))),
    t && t.classList.add("hidden"),
    a && a.classList.add("hidden"));
}
function handleLogin(e) {
  (e.preventDefault(),
    localStorage.setItem("sioci_logged", "true"),
    localStorage.setItem("sioci_welcome_seen", "false"),
    checkSession());
}
function enterDashboard() {
  (destroyWelcomeCanvas(),
    localStorage.setItem("sioci_welcome_seen", "true"),
    checkSession());
}
async function handleLogout() {
  if (treeDirty) {
    ((await confirmModal(
      "Cambios sin guardar",
      "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
      { confirmText: "Guardar y salir", type: "warning", icon: "alert" },
    )) &&
      workingTree &&
      workingTreeEventId &&
      (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
      toast("Cambios guardados automaticamente")),
      (treeDirty = !1));
  }
  (localStorage.removeItem("sioci_logged"),
    localStorage.removeItem("sioci_welcome_seen"),
    window.__stopWebGL && window.__stopWebGL(),
    initWebGL(),
    checkSession());
}
function initWebGL() {
  const e = document.getElementById("webgl-canvas");
  if (!e || "undefined" == typeof THREE) return;
  const t = new THREE.Scene();
  ((t.background = new THREE.Color(198418)),
    (t.fog = new THREE.FogExp2(198418, 0.018)));
  const a = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1e3,
  );
  a.position.z = 32;
  const n = new THREE.WebGLRenderer({ canvas: e, antialias: !0, alpha: !0 });
  (n.setSize(window.innerWidth, window.innerHeight),
    n.setPixelRatio(Math.min(window.devicePixelRatio, 2)),
    t.add(new THREE.AmbientLight(440020, 0.8)));
  const s = new THREE.PointLight(3900150, 6, 70);
  (s.position.set(12, 12, 12), t.add(s));
  const o = new THREE.PointLight(9133302, 4, 60);
  (o.position.set(-10, -8, 10), t.add(o));
  const l = new THREE.PointLight(440020, 3, 50);
  (l.position.set(0, 15, -10), t.add(l));
  const r = new THREE.IcosahedronGeometry(10, 1),
    i = new THREE.MeshStandardMaterial({
      color: 1973067,
      emissive: 3900150,
      emissiveIntensity: 0.4,
      roughness: 0.05,
      metalness: 0.95,
      wireframe: !0,
    }),
    d = new THREE.Mesh(r, i);
  t.add(d);
  const c = new THREE.TorusGeometry(16, 0.15, 16, 100),
    u = new THREE.MeshStandardMaterial({
      color: 9133302,
      emissive: 9133302,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
    }),
    v = new THREE.Mesh(c, u);
  ((v.rotation.x = Math.PI / 3), t.add(v));
  const m = new THREE.TorusGeometry(20, 0.08, 16, 120),
    p = new THREE.MeshStandardMaterial({
      color: 440020,
      emissive: 440020,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.8,
    }),
    b = new THREE.Mesh(m, p);
  ((b.rotation.x = -Math.PI / 4), (b.rotation.y = Math.PI / 6), t.add(b));
  const g = 200,
    h = new THREE.BufferGeometry(),
    f = new Float32Array(600),
    y = new Float32Array(600),
    w = [
      new THREE.Color(3900150),
      new THREE.Color(9133302),
      new THREE.Color(440020),
    ];
  for (let e = 0; e < g; e++) {
    ((f[3 * e] = 80 * (Math.random() - 0.5)),
      (f[3 * e + 1] = 80 * (Math.random() - 0.5)),
      (f[3 * e + 2] = 80 * (Math.random() - 0.5)));
    const t = w[Math.floor(Math.random() * w.length)];
    ((y[3 * e] = t.r), (y[3 * e + 1] = t.g), (y[3 * e + 2] = t.b));
  }
  (h.setAttribute("position", new THREE.BufferAttribute(f, 3)),
    h.setAttribute("color", new THREE.BufferAttribute(y, 3)));
  const x = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: !0,
    transparent: !0,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  t.add(new THREE.Points(h, x));
  const E = [];
  for (let e = 0; e < 8; e++) {
    const a = new THREE.OctahedronGeometry(0.6 + 0.8 * Math.random(), 0),
      n = new THREE.MeshStandardMaterial({
        color: 1973067,
        emissive: w[e % 3],
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: Math.random() > 0.5,
      }),
      s = new THREE.Mesh(a, n);
    (s.position.set(
      40 * (Math.random() - 0.5),
      40 * (Math.random() - 0.5),
      30 * (Math.random() - 0.5),
    ),
      (s.userData = {
        speed: 0.3 + 0.7 * Math.random(),
        orbit: 8 + 15 * Math.random(),
        phase: Math.random() * Math.PI * 2,
      }),
      t.add(s),
      E.push(s));
  }
  let k = 0,
    $ = 0,
    T = 0,
    I = 0;
  window.addEventListener("mousemove", (e) => {
    ((k = 0.002 * (e.clientX - window.innerWidth / 2)),
      ($ = 0.002 * (e.clientY - window.innerHeight / 2)));
  });
  const S = new THREE.Clock();
  let C = null;
  (!(function e() {
    C = requestAnimationFrame(e);
    const s = S.getElapsedTime();
    ((T += 0.08 * (k - T)),
      (I += 0.08 * ($ - I)),
      (d.rotation.x = 0.3 * s + 2 * I),
      (d.rotation.y = 0.4 * s + 2 * T),
      d.scale.setScalar(1 + 0.05 * Math.sin(0.8 * s)),
      (v.rotation.z = 0.15 * s),
      (b.rotation.z = 0.1 * -s),
      E.forEach((e) => {
        const t = e.userData;
        ((e.position.x = Math.cos(s * t.speed + t.phase) * t.orbit),
          (e.position.y =
            Math.sin(s * t.speed * 0.7 + t.phase) * t.orbit * 0.6),
          (e.position.z =
            Math.sin(s * t.speed * 0.5 + t.phase) * t.orbit * 0.3),
          (e.rotation.x = s * t.speed),
          (e.rotation.y = s * t.speed * 0.7));
      }));
    const o = h.attributes.position.array;
    for (let e = 0; e < g; e++) o[3 * e + 1] += 0.005 * Math.sin(s + e);
    ((h.attributes.position.needsUpdate = !0), n.render(t, a));
  })(),
    (window.__stopWebGL = () => {
      C && cancelAnimationFrame(C);
    }),
    window.addEventListener("resize", () => {
      ((a.aspect = window.innerWidth / window.innerHeight),
        a.updateProjectionMatrix(),
        n.setSize(window.innerWidth, window.innerHeight));
    }));
}
let currentView = "dashboard";
const VIEWS = [
    "dashboard",
    "events",
    "calendar",
    "announcements",
    "archive",
    "print",
  ],
  VIEW_IDS = {
    dashboard: "view-dashboard",
    events: "view-events",
    calendar: "view-calendar",
    announcements: "view-announcements",
    archive: "view-archive",
    print: "view-print",
  },
  NAV_LABELS = {
    dashboard: "Vista General",
    events: "Eventos Institucionales",
    calendar: "Cronograma",
    announcements: "Comunicados",
    archive: "Archivo",
    print: "Impresion",
  };
function switchView(e) {
  ((currentView = e),
    VIEWS.forEach((t) => {
      const a = document.getElementById(VIEW_IDS[t]);
      a && a.classList.toggle("hidden", t !== e);
    }),
    ["dashboard", "events", "calendar", "announcements"].forEach((t) => {
      const a = document.getElementById("btn-nav-" + t);
      a && a.classList.toggle("active", t === e);
    }),
    (document.getElementById("header-title").textContent = NAV_LABELS[e] || ""),
    "calendar" === e && renderCalendar());
}
const CAL_MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  CAL_DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
  CAL_DAYS_SHORT = ["D", "L", "M", "X", "J", "V", "S"],
  TYPE_COLORS = {
    Academico: "#3B82F6",
    Cultural: "#8B5CF6",
    Deportivo: "#059669",
    Social: "#EA580C",
    Administrativo: "#64748B",
  };
let calYear,
  calMonth,
  calMode = "monthly";
function todayISOCol() {
  const e = new Date(),
    t = e.getTime() + 6e4 * e.getTimezoneOffset();
  return new Date(t - 18e6).toISOString().slice(0, 10);
}
function initCalendar() {
  const e = new Date(),
    t = e.getTime() + 6e4 * e.getTimezoneOffset(),
    a = new Date(t - 18e6);
  ((calYear = a.getFullYear()), (calMonth = a.getMonth()));
  populateYearSelect();
}
function populateYearSelect() {
  const sel = document.getElementById("cal-year-select");
  if (!sel) return;
  const thisYear = new Date().getFullYear();
  const years = [];
  for (let y = thisYear - 5; y <= thisYear + 5; y++) years.push(y);
  sel.innerHTML = years.map(y => `<option value="${y}" ${y === calYear ? "selected" : ""}>${y}</option>`).join("");
}
function onYearSelectChange() {
  const sel = document.getElementById("cal-year-select");
  if (!sel) return;
  calYear = parseInt(sel.value);
  renderCalendar();
}
function renderCalendar() {
  (calYear || initCalendar(),
    "monthly" === calMode ? renderCalMonth() : renderCalYear());
}
function renderCalMonth() {
  const e = document.getElementById("cal-grid"),
    t = document.getElementById("cal-month-label"),
    a = document.getElementById("cal-monthly-view"),
    n = document.getElementById("cal-yearly-view");
  if (!e || !t) return;
  (a.classList.remove("hidden"), n.classList.add("hidden"));
  const s = DB.listActive(),
    o = todayISOCol(),
    l = window.innerWidth < 768,
    r = window.innerWidth < 480;
  t.textContent = CAL_MONTHS[calMonth] + " " + calYear;
  const i = new Date(calYear, calMonth, 1).getDay(),
    d = new Date(calYear, calMonth + 1, 0).getDate(),
    c = new Date(calYear, calMonth, 0).getDate();
  let u = '<div class="grid grid-cols-7">';
  (l ? CAL_DAYS_SHORT : CAL_DAYS).forEach((e) => {
    u += `<div class="cal-header-cell">${e}</div>`;
  });
  const v = 7 * Math.ceil((i + d) / 7);
  for (let e = 0; e < v; e++) {
    let t,
      a,
      n = !1;
    if (e < i) {
      t = c - i + e + 1;
      ((a = `${0 === calMonth ? calYear - 1 : calYear}-${String((0 === calMonth ? 11 : calMonth - 1) + 1).padStart(2, "0")}-${String(t).padStart(2, "0")}`),
        (n = !0));
    } else if (e >= i + d) {
      t = e - i - d + 1;
      ((a = `${11 === calMonth ? calYear + 1 : calYear}-${String((11 === calMonth ? 0 : calMonth + 1) + 1).padStart(2, "0")}-${String(t).padStart(2, "0")}`),
        (n = !0));
    } else
      ((t = e - i + 1),
        (a = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(t).padStart(2, "0")}`));
    const v = a === o,
      m = s.filter((e) => e.eventDate === a);
    u += `<div class="${n ? "cal-cell cal-cell-other" : v ? "cal-cell cal-cell-today" : "cal-cell"}" data-date="${a}">\n      <div class="flex items-center justify-between mb-1">\n        <span class="${v ? "cal-day-num cal-day-today" : n ? "cal-day-num cal-day-other" : "cal-day-num"}">${t}</span>\n        ${m.length > 0 && !r ? `<span class="cal-event-count">${m.length}</span>` : ""}\n      </div>\n      <div class="cal-cell-events">`;
    const p = r ? 0 : l ? 2 : 4;
    (m.slice(0, p).forEach((e) => {
      const t = TYPE_COLORS[e.type] || "#64748B";
      u += r
        ? `<div class="cal-dot" style="background:${t}" title="${esc(e.title)}"></div>`
        : `<div class="cal-pill" style="background:${t}" data-event-id="${e.id}" onclick="event.stopPropagation();location.hash='event:${e.id}'" title="${esc(e.title)}">${esc(e.title)}</div>`;
    }),
      m.length > p && (u += `<div class="cal-more">+${m.length - p}</div>`),
      (u += "</div></div>"));
  }
  ((u += "</div>"),
    (e.innerHTML = u),
    e.querySelectorAll(".cal-cell").forEach((e) => {
      e.addEventListener("click", () => {
        const t = e.dataset.date;
        t && openDayForm(t);
      });
    }),
    setupCalTooltip());
}
function renderCalYear() {
  const e = document.getElementById("cal-monthly-view"),
    t = document.getElementById("cal-yearly-view"),
    a = document.getElementById("cal-year-label"),
    n = document.getElementById("cal-year-grid");
  if (!t || !n) return;
  (e.classList.add("hidden"),
    t.classList.remove("hidden"),
    (a.textContent = calYear));
  const s = DB.listActive(),
    o = todayISOCol();
  let l = "";
  for (let e = 0; e < 12; e++) {
    const t = new Date(calYear, e, 1).getDay(),
      a = new Date(calYear, e + 1, 0).getDate();
    s.filter((t) => {
      if (!t.eventDate) return !1;
      const [a, n] = t.eventDate.split("-").map(Number);
      return a === calYear && n === e + 1;
    });
    ((l += `<div class="cal-year-month">\n      <div class="cal-year-month-title">${CAL_MONTHS[e]}</div>\n      <div class="cal-year-month-grid">`),
      CAL_DAYS_SHORT.forEach((e) => {
        l += `<div class="cal-year-day-header">${e}</div>`;
      }));
    const n = 7 * Math.ceil((t + a) / 7);
    for (let r = 0; r < n; r++) {
      let n,
        i = !1;
      r < t || r >= t + a ? ((n = -1), (i = !0)) : (n = r - t + 1);
      const d =
          n > 0
            ? `${calYear}-${String(e + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`
            : "",
        c = d === o,
        u = n > 0 ? s.filter((e) => e.eventDate === d) : [];
      if (i) l += '<div class="cal-year-cell cal-year-other"></div>';
      else {
        const t = c ? "cal-year-cell cal-year-today" : "cal-year-cell",
          a = u
            .slice(0, 3)
            .map(
              (e) =>
                `<span class="cal-year-dot" style="background:${TYPE_COLORS[e.type] || "#64748B"}" title="${esc(e.title)}"></span>`,
            )
            .join("");
        l += `<div class="${t}" data-date="${d}" onclick="calGoToMonth(${e})">${n}${a ? '<div class="cal-year-dots">' + a + "</div>" : ""}</div>`;
      }
    }
    l += "</div></div>";
  }
  n.innerHTML = l;
}
function calGoToMonth(e) {
  ((calMonth = e), (calMode = "monthly"), updateCalToggle(), renderCalendar());
}
function updateCalToggle() {
  document
    .querySelectorAll(".cal-toggle-btn")
    .forEach((e) => e.classList.remove("active"));
  const e =
    "monthly" === calMode
      ? document.getElementById("cal-btn-monthly")
      : document.getElementById("cal-btn-yearly");
  e && e.classList.add("active");
}
function setupCalSwipe(e) {
  let t = 0,
    a = 0,
    n = !1,
    s = !1;
  const o = document.getElementById("cal-grid"),
    l = document.getElementById("cal-swipe-left"),
    r = document.getElementById("cal-swipe-right");
  function i(e) {
    (l && l.classList.toggle("visible", "left" === e),
      r && r.classList.toggle("visible", "right" === e));
  }
  function d() {
    (l && l.classList.remove("visible"), r && r.classList.remove("visible"));
  }
  function c() {
    o &&
      ((o.style.transition = "transform .3s cubic-bezier(.4,0,.2,1)"),
      (o.style.transform = "translateX(0)"));
  }
  function u(e, l) {
    calAnimating ||
      ((t = e),
      (a = l),
      (n = !0),
      (s = !1),
      o && ((o.style.transition = "none"), (o.style.transform = "")));
  }
  function v(a) {
    if (!n) return;
    if (
      ((n = !1),
      (document.body.style.userSelect = ""),
      (e.style.cursor = ""),
      d(),
      !s)
    )
      return void c();
    const l = a - t;
    Math.abs(l) >= 80
      ? (o &&
          ((o.style.transition =
            "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
          (o.style.transform = `translateX(${l < 0 ? "-100%" : "100%"})`),
          (o.style.opacity = "0")),
        setTimeout(() => {
          (l < 0 ? calNext() : calPrev(),
            o &&
              ((o.style.transition = "none"),
              (o.style.transform = `translateX(${l < 0 ? "100%" : "-100%"})`),
              (o.style.opacity = "0")),
            requestAnimationFrame(() => {
              o &&
                ((o.style.transition =
                  "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
                (o.style.transform = "translateX(0)"),
                (o.style.opacity = "1"));
            }));
        }, 300))
      : c();
  }
  function m(l, r) {
    if (!n) return;
    const u = l - t,
      v = r - a;
    if (!s && Math.abs(v) > Math.abs(u) && Math.abs(v) > 10)
      return (
        (n = !1),
        (document.body.style.userSelect = ""),
        (e.style.cursor = ""),
        d(),
        void c()
      );
    if (Math.abs(u) > 8 || s) {
      ((s = !0),
        (document.body.style.userSelect = "none"),
        (e.style.cursor = "grabbing"),
        o && (o.style.transform = `translateX(${u}px)`));
      const t = Math.min(Math.abs(u) / 80, 1);
      (o && (o.style.opacity = String(1 - 0.3 * t)),
        u < -20 ? i("right") : u > 20 ? i("left") : d());
    }
  }
  (e.addEventListener(
    "touchstart",
    (e) => u(e.touches[0].clientX, e.touches[0].clientY),
    { passive: !0 },
  ),
    e.addEventListener(
      "touchmove",
      (e) => m(e.touches[0].clientX, e.touches[0].clientY),
      { passive: !0 },
    ),
    e.addEventListener("touchend", (e) => v(e.changedTouches[0].clientX), {
      passive: !0,
    }),
    e.addEventListener("mousedown", (e) => {
      0 === e.button && u(e.clientX, e.clientY);
    }),
    document.addEventListener("mousemove", (e) => m(e.clientX, e.clientY)),
    document.addEventListener("mouseup", (e) => v(e.clientX)));
}
let calSwipeInit = !1,
  calAnimating = !1;
function calPrev() {
  if (calAnimating) return;
  const e = document.getElementById("cal-grid");
  ((calAnimating = !0),
    e &&
      ((e.style.transition =
        "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
      (e.style.transform = "translateX(100%)"),
      (e.style.opacity = "0")),
    setTimeout(() => {
      (calMonth--,
        calMonth < 0 && ((calMonth = 11), calYear--),
        populateYearSelect(),
        renderCalendar(),
        e &&
          ((e.style.transition = "none"),
          (e.style.transform = "translateX(-100%)"),
          (e.style.opacity = "0")),
        requestAnimationFrame(() => {
          (e &&
            ((e.style.transition =
              "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
            (e.style.transform = "translateX(0)"),
            (e.style.opacity = "1")),
            setTimeout(() => {
              calAnimating = !1;
            }, 300));
        }));
    }, 300));
}
function calNext() {
  if (calAnimating) return;
  const e = document.getElementById("cal-grid");
  ((calAnimating = !0),
    e &&
      ((e.style.transition =
        "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
      (e.style.transform = "translateX(-100%)"),
      (e.style.opacity = "0")),
    setTimeout(() => {
      (calMonth++,
        calMonth > 11 && ((calMonth = 0), calYear++),
        populateYearSelect(),
        renderCalendar(),
        e &&
          ((e.style.transition = "none"),
          (e.style.transform = "translateX(100%)"),
          (e.style.opacity = "0")),
        requestAnimationFrame(() => {
          (e &&
            ((e.style.transition =
              "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease"),
            (e.style.transform = "translateX(0)"),
            (e.style.opacity = "1")),
            setTimeout(() => {
              calAnimating = !1;
            }, 300));
        }));
    }, 300));
}
function calToday() {
  calAnimating ||
    (initCalendar(),
    (calMode = "monthly"),
    updateCalToggle(),
    renderCalendar());
}
function openDayForm(e) {
  const t = document.getElementById("cal-day-form"),
    a = document.getElementById("cal-day-label"),
    n = document.getElementById("cal-d-name");
  if (!t || !a) return;
  const [s, o, l] = e.split("-").map(Number);
  ((a.textContent = `${l} de ${CAL_MONTHS[o - 1]} ${s}`),
    (t.dataset.date = e),
    t.classList.remove("hidden"),
    (n.value = ""),
    n.focus(),
    document.getElementById("cal-quick-form").classList.add("hidden"));
}
function calDaySave() {
  const e = document.getElementById("cal-day-form"),
    t = document.getElementById("cal-d-name").value.trim(),
    a = document.getElementById("cal-d-type").value,
    n = e.dataset.date;
  if (!t || !n) return;
  const s = document.getElementById("user-name")?.textContent || "Sin asignar";
  (DB.createEvent({
    title: t,
    type: a,
    urgent: !1,
    eventDate: n,
    prepDeadline: "",
    leaderTeacher: s,
    description: "",
  }),
    toast("Agregado al cronograma"),
    e.classList.add("hidden"),
    renderCalendar());
}
function calDayCancel() {
  document.getElementById("cal-day-form").classList.add("hidden");
}
let calTooltipEl = null;
function setupCalTooltip() {
  (calTooltipEl ||
    ((calTooltipEl = document.createElement("div")),
    (calTooltipEl.className = "cal-tooltip"),
    (calTooltipEl.innerHTML =
      '<div class="cal-tooltip-title"></div><div class="cal-tooltip-meta"></div><div class="cal-tooltip-status"></div>'),
    document.body.appendChild(calTooltipEl)),
    document.querySelectorAll(".cal-pill, .cal-dot").forEach((e) => {
      e.classList.contains("cal-pill") &&
        (e.addEventListener("mouseenter", () => {
          const t = DB.listEvents().find((t) => t.id === e.dataset.eventId);
          if (!t) return;
          const a = {
              Pendiente: "#64748B",
              "En Proceso": "#D97706",
              Urgente: "#DC2626",
              Completado: "#059669",
            },
            n = calcStatus(t);
          ((calTooltipEl.querySelector(".cal-tooltip-title").textContent =
            t.title),
            (calTooltipEl.querySelector(".cal-tooltip-meta").innerHTML =
              `${t.type} · ${t.leaderTeacher}<br>${t.eventDate}`));
          const s = calTooltipEl.querySelector(".cal-tooltip-status");
          ((s.textContent = n),
            (s.style.background = (a[n] || "#64748B") + "18"),
            (s.style.color = a[n] || "#64748B"),
            calTooltipEl.classList.add("visible"));
        }),
        e.addEventListener("mousemove", (e) => {
          ((calTooltipEl.style.left =
            Math.min(e.clientX + 12, window.innerWidth - 290) + "px"),
            (calTooltipEl.style.top =
              (e.clientY - 60 < 10 ? e.clientY + 16 : e.clientY - 60) + "px"));
        }),
        e.addEventListener("mouseleave", () =>
          calTooltipEl.classList.remove("visible"),
        ));
    }));
}
function calPrev() {
  (calMonth--, calMonth < 0 && ((calMonth = 11), calYear--), populateYearSelect(), renderCalendar());
}
function calNext() {
  (calMonth++, calMonth > 11 && ((calMonth = 0), calYear++), populateYearSelect(), renderCalendar());
}
function calToday() {
  (initCalendar(), (calMode = "monthly"), updateCalToggle(), renderCalendar());
}
function calToggleYearly() {
  ((calMode = "monthly" === calMode ? "yearly" : "monthly"),
    updateCalToggle(),
    renderCalendar());
}
function calQuickAdd() {
  const e = document.getElementById("cal-quick-form");
  e &&
    (e.classList.toggle("hidden"),
    e.classList.contains("hidden") ||
      ((document.getElementById("cal-q-name").value = ""),
      (document.getElementById("cal-q-date").value =
        `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`),
      document.getElementById("cal-q-name").focus(),
      document.getElementById("cal-day-form").classList.add("hidden")));
}
function calQuickSave() {
  const e = document.getElementById("cal-q-name").value.trim(),
    t = document.getElementById("cal-q-date").value,
    a = document.getElementById("cal-q-type").value;
  if (!e || !t) return;
  const n = document.getElementById("user-name")?.textContent || "Sin asignar";
  (DB.createEvent({
    title: e,
    type: a,
    urgent: !1,
    eventDate: t,
    prepDeadline: "",
    leaderTeacher: n,
    description: "",
  }),
    toast("Agregado al cronograma"),
    document.getElementById("cal-quick-form").classList.add("hidden"),
    renderCalendar());
}
function renderArchive() {
  const e = document.getElementById("archive-list-container"),
    t = document.getElementById("archive-count"),
    a = (document.getElementById("archive-search")?.value || "").toLowerCase(),
    n = document.getElementById("archive-type-filter")?.value || "",
    s = document.getElementById("archive-year-filter")?.value || "";
  if (!e) return;
  let o = DB.listArchived().sort((e, t) =>
    (t.eventDate || "").localeCompare(e.eventDate || ""),
  );
  const l = document.getElementById("archive-year-filter");
  if (l && l.options.length <= 1) {
    [
      ...new Set(
        o
          .map((e) => (e.eventDate ? e.eventDate.slice(0, 4) : ""))
          .filter(Boolean),
      ),
    ]
      .sort()
      .reverse()
      .forEach((e) => {
        const t = document.createElement("option");
        ((t.value = e), (t.textContent = e), l.appendChild(t));
      });
  }
  if (
    (a &&
      (o = o.filter(
        (e) =>
          e.title.toLowerCase().includes(a) ||
          e.leaderTeacher.toLowerCase().includes(a),
      )),
    n && (o = o.filter((e) => e.type === n)),
    s && (o = o.filter((e) => e.eventDate && e.eventDate.startsWith(s))),
    (t.textContent =
      o.length +
      " evento" +
      (1 !== o.length ? "s" : "") +
      " archivado" +
      (1 !== o.length ? "s" : "")),
    0 === o.length)
  )
    return void (e.innerHTML =
      '<div class="empty-state"><svg class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg><p class="font-semibold dark:text-white">Sin resultados</p><p class="text-sm text-slate-500 dark:text-slate-400">No hay eventos archivados que coincidan</p></div>');
  e.innerHTML = o
    .map((e) => {
      e.type;
      return `<div class="event-card flex items-center justify-between gap-3">\n      <div class="flex-1 min-w-0">\n        <p class="font-semibold text-sm dark:text-white truncate">${esc(e.title)}</p>\n        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${esc(e.leaderTeacher)} · ${esc(e.eventDate)} · ${esc(e.type)}</p>\n      </div>\n      <button data-action="restore-event" data-id="${e.id}" data-title="${esc(e.title)}" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-all whitespace-nowrap">Restaurar</button>\n    </div>`;
    })
    .join("");
}
function renderDashboard() {
  const e = DB.listActive(),
    t = DB.getSummary(),
    a = DB.listAnn(),
    n = todayISO(),
    s = e
      .filter((e) => e.eventDate >= n && "Completado" !== calcStatus(e))
      .sort((e, t) => e.eventDate.localeCompare(t.eventDate)),
    o = e.filter((e) => "Completado" !== calcStatus(e));
  (e.filter((e) => "Urgente" === calcStatus(e)),
    a.filter((e) => !e.readBy.includes("usr_01")));
  ((document.getElementById("dashboard-subtitle").textContent =
    e.length + " eventos registrados · " + t.upcoming + " proximos"),
    (document.getElementById("stats-grid").innerHTML = [
      {
        label: "Eventos Totales",
        value: t.total,
        icon: "calendar",
        color: "#3B82F6",
      },
      { label: "Proximos", value: t.upcoming, icon: "clock", color: "#D97706" },
      {
        label: "Completados",
        value: t.byStatus.Completado || 0,
        icon: "checkC",
        color: "#059669",
      },
      {
        label: "Avance Promedio",
        value: Math.round(t.avg) + "%",
        icon: "trend",
        color: "#8B5CF6",
      },
    ]
      .map(
        (e) =>
          `<div class="stat-card"><div class="flex items-center justify-between"><span class="stat-card-label">${esc(e.label)}</span><div class="stat-card-icon" style="background:${e.color}18;color:${e.color}">${svg(e.icon, 20)}</div></div><div class="stat-card-value" style="color:${e.color}">${esc(String(e.value))}</div></div>`,
      )
      .join("")),
    (document.getElementById("dashboard-events-container").innerHTML =
      0 === o.length
        ? '<div class="empty-state" style="padding:24px 0"><p>No hay eventos activos</p></div>'
        : o
            .slice(0, 4)
            .map(
              (e) =>
                `<div class="event-card" onclick="location.hash='event:${e.id}'"><div class="flex items-start justify-between gap-2 mb-2"><div class="flex-1 min-w-0"><p class="font-semibold text-sm dark:text-white truncate">${esc(e.title)}</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${esc(e.leaderTeacher)} · ${esc(e.eventDate)}</p></div><div class="flex gap-1.5 flex-shrink-0">${typeBadge(e.type)}${badge(calcStatus(e))}</div></div>${progressHtml(e)}</div>`,
            )
            .join("")),
    (document.getElementById("dashboard-timeline-container").innerHTML =
      0 === s.length
        ? '<div class="empty-state" style="padding:24px 0"><p>Sin eventos proximos</p></div>'
        : '<div class="timeline">' +
          s
            .map(
              (e) =>
                `<div class="timeline-item"><div class="timeline-dot dot-${{ Academico: "blue", Cultural: "purple", Deportivo: "green", Social: "orange", Administrativo: "gray" }[e.type] || "gray"}"></div><div class="event-card" onclick="location.hash='event:${e.id}'"><div class="flex items-start justify-between gap-2 mb-1"><span class="font-semibold text-sm dark:text-white">${esc(e.title)}</span><div class="flex gap-1.5 flex-shrink-0">${typeBadge(e.type)}${badge(calcStatus(e))}</div></div><div class="flex gap-4 text-xs text-slate-500 dark:text-slate-400"><span>${esc(e.eventDate)}</span><span>${esc(e.leaderTeacher)}</span></div><div class="mt-2">${progressHtml(e)}</div></div></div>`,
            )
            .join("") +
          "</div>"));
  const l = [];
  (e
    .filter((e) => "Completado" !== calcStatus(e))
    .forEach((e) => {
      const t = calcPhase(e),
        a = Math.ceil((new Date(e.eventDate) - new Date(n)) / 864e5),
        s = e.rolesTree && hasStudentRoles(e.rolesTree),
        o =
          e.rolesTree &&
          e.rolesTree.children &&
          e.rolesTree.children.length > 0,
        r = e.rolesTree ? countStudents(e.rolesTree) : 0;
      "Urgente" === calcStatus(e)
        ? l.push({
            ev: e,
            msg: "Este evento esta marcado como urgente. Requiere atencion inmediata.",
            icon: "alertC",
            color: "#DC2626",
            severity: "critical",
          })
        : e.leaderTeacher
          ? o
            ? o && !s
              ? l.push({
                  ev: e,
                  msg: `Tiene ${e.rolesTree.children.length} area(s) pero ninguna tiene estudiantes asignados. Agrega roles para avanzar a preparacion.`,
                  icon: "user",
                  color: "#D97706",
                  severity: "warning",
                })
              : a <= 7 && a >= 0 && t < 2
                ? l.push({
                    ev: e,
                    msg: `Faltan ${a} dia(s) para el evento pero solo esta en "${PHASES[t].label}". No esta listo para ejecutarse.`,
                    icon: "clock",
                    color: "#DC2626",
                    severity: "critical",
                  })
                : a < 0 && t < 3
                  ? l.push({
                      ev: e,
                      msg: `El evento ya paso (hace ${Math.abs(a)} dia(s)) pero no se ha cerrado. Marcalo como finalizado y calificalo.`,
                      icon: "checkC",
                      color: "#8B5CF6",
                      severity: "warning",
                    })
                  : 3 !== t || e.rating
                    ? 1 === t &&
                      r < 3 &&
                      l.push({
                        ev: e,
                        msg: `Solo hay ${r} estudiante(s) asignado(s). Se recomienda al menos 3 para cubrir todas las areas.`,
                        icon: "alertC",
                        color: "#D97706",
                        severity: "info",
                      })
                    : l.push({
                        ev: e,
                        msg: "El evento finalizado no tiene calificacion. Calificalo con 1 a 5 estrellas para completar el ciclo.",
                        icon: "checkC",
                        color: "#8B5CF6",
                        severity: "info",
                      })
            : l.push({
                ev: e,
                msg: "No se han creado areas de trabajo. Crea al menos un area para organizar los roles.",
                icon: "plus",
                color: "#D97706",
                severity: "warning",
              })
          : l.push({
              ev: e,
              msg: "No hay coordinador asignado. Asigna un docente responsable para poder avanzar.",
              icon: "user",
              color: "#D97706",
              severity: "warning",
            });
    }),
    (document.getElementById("dashboard-alerts-container").innerHTML =
      0 === l.length
        ? '<div class="text-xs text-slate-400 text-center py-4">Sin alertas</div>'
        : l
            .slice(0, 6)
            .map(
              (e) =>
                `\n      <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer" style="${("critical" === e.severity || e.severity, `border-left: 3px solid ${e.color}`)}" onclick="location.hash='event:${e.ev.id}'">\n        <div class="flex items-start gap-3">\n          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${e.color}15;color:${e.color}">\n            ${svg(e.icon, 16)}\n          </div>\n          <div class="flex-1 min-w-0">\n            <p class="text-sm font-semibold dark:text-white truncate">${esc(e.ev.title)}</p>\n            <p class="text-xs mt-1 leading-relaxed" style="color:${e.color}88">${e.msg}</p>\n          </div>\n          <span class="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">${svg("chevronR", 14)}</span>\n        </div>\n      </div>`,
            )
            .join("")),
    (document.getElementById("dashboard-announcements-container").innerHTML =
      0 === a.length
        ? '<div class="text-xs text-slate-400 text-center py-4">Sin comunicados</div>'
        : a
            .slice(0, 3)
            .map((e) => {
              const t = !e.readBy.includes("usr_01");
              return `<button class="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${t ? "border-l-2 border-neon-blue" : ""}" data-action="mark-read" data-id="${e.id}"><div class="flex items-center gap-2">${t ? '<span class="w-2 h-2 rounded-full bg-neon-blue flex-shrink-0"></span>' : ""}<div class="flex-1 min-w-0"><p class="text-sm font-medium truncate ${t ? "dark:text-white" : "text-slate-500 dark:text-slate-400"}">${esc(e.title)}</p><p class="text-xs text-slate-400 dark:text-slate-500">${esc(e.author)} · ${esc(e.date)}</p></div>${badge(e.category)}</div></button>`;
            })
            .join("")));
}
const evtFilters = { search: "", status: "all", type: "all" };
function renderEvents() {
  const e = DB.listActive();
  document.getElementById("events-count").textContent =
    e.length + " eventos activos";
  const t = evtFilters.search.toLowerCase(),
    a = e.filter((e) => {
      const a =
          e.title.toLowerCase().includes(t) ||
          e.leaderTeacher.toLowerCase().includes(t),
        n = "all" === evtFilters.status || calcStatus(e) === evtFilters.status,
        s = "all" === evtFilters.type || e.type === evtFilters.type;
      return a && n && s;
    }),
    n = document.getElementById("events-list-container");
  if (0 === a.length) {
    const e =
      evtFilters.search ||
      "all" !== evtFilters.status ||
      "all" !== evtFilters.type;
    return void (n.innerHTML = `<div class="empty-state">${svg("calendar", 48)}<p class="empty-title">No hay eventos</p><p>${e ? "Intenta con otros filtros" : "Crea el primer evento"}</p></div>`);
  }
  n.innerHTML = a
    .map(
      (e) =>
        `\n    <div class="event-row">\n      <div class="flex items-start gap-4">\n        <div class="flex-1 min-w-0">\n          <div class="flex gap-2 mb-1 flex-wrap">${typeBadge(e.type)}${badge(calcStatus(e))}</div>\n          <h3 class="font-bold text-base dark:text-white">${esc(e.title)}</h3>\n          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">\n            <span>Coordinador: <b class="dark:text-white">${esc(e.leaderTeacher)}</b></span>\n            <span>Evento: <b class="dark:text-white">${esc(e.eventDate)}</b></span>\n          </div>\n          ${e.description ? `<p class="text-xs text-slate-400 dark:text-slate-500 mt-2 truncate">${esc(e.description)}</p>` : ""}\n          <div class="mt-3 max-w-sm">${progressHtml(e)}</div>\n        </div>\n        <div class="flex flex-col gap-1 flex-shrink-0">\n          <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-action="edit-event" data-id="${e.id}" title="Editar">${svg("pencil", 15)}</button>\n          <button class="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 transition-all" data-action="archive-event" data-id="${e.id}" title="Archivar">${svg("archive", 15)}</button>\n          <button class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-all" data-action="delete-event" data-id="${e.id}" data-title="${esc(e.title)}" title="Eliminar">${svg("trash", 15)}</button>\n          <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-action="open-detail" data-id="${e.id}" title="Ver detalle">${svg("eye", 15)}</button>\n        </div>\n      </div>\n    </div>`,
    )
    .join("");
}
let workingTree = null,
  workingTreeEventId = null,
  treeDirty = !1;
function countRoles(e) {
  if (!e) return { areas: 0, students: 0, subtasks: 0, subtasksDone: 0 };
  let t = 1,
    a = (e.studentRoles || []).length,
    n = 0,
    s = 0;
  return (
    (e.studentRoles || []).forEach((e) => {
      ((n += (e.subtasks || []).length),
        (s += (e.subtasks || []).filter((e) => e.done).length));
    }),
    (e.children || []).forEach((e) => {
      const o = countRoles(e);
      ((t += o.areas),
        (a += o.students),
        (n += o.subtasks),
        (s += o.subtasksDone));
    }),
    { areas: t, students: a, subtasks: n, subtasksDone: s }
  );
}
function refreshRolesTree() {
  const e = document.getElementById("roles-tree-container");
  e &&
    workingTree &&
    ((e.innerHTML = renderTreeSection(workingTree, 0, !0)), updateTreeStats());
}
function updateTreeStats() {
  const e = document.getElementById("roles-tree-stats");
  if (!e || !workingTree) return;
  const t = countRoles(workingTree);
  let a = t.areas + " area(s) · " + t.students + " estudiante(s)";
  (t.subtasks > 0 &&
    (a += " · " + t.subtasksDone + "/" + t.subtasks + " subtareas"),
    (e.textContent = a));
}
function renderTreeSection(e, t, a) {
  const n = (e.children || []).length,
    s = (e.studentRoles || []).length,
    o = (e.children || []).map((e) => renderTreeSection(e, t + 1, !1)).join(""),
    l = (e.studentRoles || [])
      .map((t) => {
        const a = t.subtasks || [],
          n =
            (a.filter((e) => e.done).length,
            a
              .map(
                (a) =>
                  `\n      <div class="roles-tree-subtask ${a.done ? "is-done" : ""}" data-st-id="${a.id}" data-sr-id="${t.id}" data-area-id="${e.id}">\n        <button class="roles-tree-subtask-check" data-action="toggle-subtask" data-st-id="${a.id}" data-sr-id="${t.id}" data-area-id="${e.id}">\n          ${a.done ? svg("checkC", 14) : '<span class="roles-tree-subtask-uncheck"></span>'}\n        </button>\n        <div class="roles-tree-subtask-info">\n          <p class="roles-tree-subtask-title">${esc(a.title)}</p>\n          ${a.dueDate ? `<p class="roles-tree-subtask-date">${esc(a.dueDate)}</p>` : ""}\n        </div>\n        <div class="roles-tree-student-actions">\n          <button class="roles-tree-action" data-action="edit-subtask" data-st-id="${a.id}" data-sr-id="${t.id}" data-area-id="${e.id}" title="Editar">${svg("pencil", 13)}</button>\n          <button class="roles-tree-action is-delete" data-action="delete-subtask" data-st-id="${a.id}" data-sr-id="${t.id}" data-area-id="${e.id}" title="Eliminar">${svg("trash", 13)}</button>\n        </div>\n      </div>\n    `,
              )
              .join(""));
        return `\n    <div class="roles-tree-student-block">\n      <div class="roles-tree-student-row" data-sr-id="${t.id}" data-area-id="${e.id}">\n        <div class="roles-tree-student-icon">${svg("grad", 14)}</div>\n        <div class="roles-tree-student-info">\n          <p class="roles-tree-student-name">${esc(t.studentName)}</p>\n          <p class="roles-tree-student-meta">${esc(t.grade)} · ${esc(t.role)}</p>\n        </div>\n        <div class="roles-tree-student-actions">\n          <button class="roles-tree-action" data-action="add-subtask-to-student" data-sr-id="${t.id}" data-area-id="${e.id}" title="Subtareas">${svg("checkC", 13)}</button>\n          <button class="roles-tree-action" data-action="edit-student" data-sr-id="${t.id}" data-area-id="${e.id}" title="Editar">${svg("pencil", 13)}</button>\n          <button class="roles-tree-action is-delete" data-action="delete-student" data-sr-id="${t.id}" data-area-id="${e.id}" title="Eliminar">${svg("trash", 13)}</button>\n        </div>\n      </div>\n      ${a.length > 0 ? `<div class="roles-tree-subtasks">${n}</div>` : ""}\n    </div>`;
      })
      .join("");
  return `\n    <div class="roles-tree-section ${a || t > 0 ? "expanded" : "collapsed"}" data-node-id="${e.id}" data-depth="${t}">\n      <div class="roles-tree-header" data-action="toggle-section" data-node-id="${e.id}">\n        <div class="roles-tree-chevron">${svg("chevronD", 16)}</div>\n        <div class="roles-tree-avatar ${a ? "is-root" : ""}">${e.assignee ? e.assignee.charAt(0) : "?"}</div>\n        <div class="roles-tree-info">\n          <p class="roles-tree-title">${esc(e.title)}</p>\n          ${e.assignee ? `<p class="roles-tree-assignee text-xs text-slate-400 dark:text-slate-500">${esc(e.assignee)}</p>` : ""}\n        </div>\n        <span class="roles-tree-count">${n} area(s) · ${s} est.</span>\n        <div class="roles-tree-actions">\n          <button class="roles-tree-action" data-action="edit-node" data-node-id="${e.id}" title="Editar">${svg("pencil", 13)}</button>\n          ${a ? "" : `<button class="roles-tree-action is-delete" data-action="delete-node" data-node-id="${e.id}" title="Eliminar">${svg("trash", 13)}</button>`}\n        </div>\n      </div>\n      <div class="roles-tree-students">\n        ${l}\n        <button class="roles-tree-add-btn" data-action="add-student-to-node" data-node-id="${e.id}">\n          ${svg("plus", 14)} Agregar Estudiante\n        </button>\n      </div>\n      ${o ? `<div class="roles-tree-children">${o}</div>` : ""}\n    </div>`;
}
function toggleSection(e) {
  const t = document.querySelector(`.roles-tree-section[data-node-id="${e}"]`);
  t && (t.classList.toggle("collapsed"), t.classList.toggle("expanded"));
}
function deleteNodeFromTree(e) {
  if (!workingTree || "node_root" === e) return;
  const t = findParentInTree(e);
  (t && (t.children = t.children.filter((t) => t.id !== e)),
    (treeDirty = !0),
    refreshRolesTree(),
    updateSaveBtnVisibility());
}
function deleteStudentFromTree(e) {
  workingTree &&
    (!(function t(a) {
      const n = (a.studentRoles || []).length;
      if (
        ((a.studentRoles = (a.studentRoles || []).filter((t) => t.id !== e)),
        a.studentRoles.length < n)
      )
        return !0;
      for (const e of a.children || []) if (t(e)) return !0;
      return !1;
    })(workingTree),
    (treeDirty = !0),
    refreshRolesTree(),
    updateSaveBtnVisibility());
}
function renderPhaseBar(e) {
  return `<div class="phase-bar"><div class="phase-track"><div class="phase-line"><div class="phase-line-fill" style="width:${(e / (PHASES.length - 1)) * 100}%"></div></div>${PHASES.map(
    (t, a) => {
      const n = a < e ? "completed" : a === e ? "active" : "pending";
      return `<div class="phase-dot-wrap"><div class="phase-dot ${n}">${a < e ? svg("checkC", 11) : `<span style="font-size:10px;font-weight:700;color:inherit">${a + 1}</span>`}</div><span class="phase-label ${n}">${t.label}</span></div>`;
    },
  ).join("")}</div></div>`;
}
function renderStarRating(e) {
  if (e.phase < 3) return "";
  const t = e.rating || 0;
  return `<div class="rating-wrap"><div class="rating-stars">${[1, 2, 3, 4, 5].map((a) => `<div class="rating-star ${a <= t ? "filled active" : ""}" data-action="rate-event" data-id="${e.id}" data-value="${a}">\n      <svg viewBox="0 0 24 24" fill="${a <= t ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>\n    </div>`).join("")}</div><p class="rating-text ${t >= 4 ? "excellent" : 3 === t ? "good" : 2 === t ? "ok" : "bad"}">${t ? RATING_LABELS[t] : "Califica este evento"}</p></div>`;
}
function renderEventDetail(e) {
  const t = DB.getEvent(e);
  if (!t)
    return '<div class="empty-state"><p class="empty-title">Evento no encontrado</p></div>';
  ((workingTree = JSON.parse(JSON.stringify(t.rolesTree))),
    (workingTreeEventId = e),
    (treeDirty = !1));
  const a = countRoles(t.rolesTree),
    n = calcPhase(t);
  return (
    t.phase !== n && ((t.phase = n), DB.updateEvent(e, { phase: n })),
    `\n    <div class="mb-4"><button class="text-sm text-neon-blue hover:underline flex items-center gap-1" data-action="back-events">${svg("arrowL", 14)} Volver a eventos</button></div>\n    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-6">\n      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">\n        <div class="flex-1">\n          <div class="flex gap-2 mb-2">${typeBadge(t.type)}${badge(calcStatus(t))}</div>\n          <h1 class="text-2xl font-bold dark:text-white mb-2">${esc(t.title)}</h1>\n          ${t.description ? `<p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${esc(t.description)}</p>` : ""}\n          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">\n            <div><p class="text-xs text-slate-400 uppercase font-semibold">Coordinador</p><p class="text-sm font-bold dark:text-white">${esc(t.leaderTeacher)}</p></div>\n            <div><p class="text-xs text-slate-400 uppercase font-semibold">Fecha Evento</p><p class="text-sm font-bold dark:text-white">${esc(t.eventDate)}</p></div>\n          </div>\n          ${renderStarRating(t)}\n        </div>\n        <div class="flex flex-col gap-2 flex-shrink-0 sm:items-end">\n          <div class="flex gap-2">\n            <button class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" data-action="edit-event" data-id="${t.id}">${svg("pencil", 14)} Editar</button>\n            <button class="px-3 py-2 bg-neon-blue text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-all" data-action="print-event" data-id="${t.id}">${svg("printer", 14)} Imprimir</button>\n            <button class="px-3 py-2 bg-amber-50 text-amber-600 text-xs font-semibold rounded-xl hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 transition-all" data-action="archive-event" data-id="${t.id}">${svg("archive", 14)} Archivar</button>\n          </div>\n        </div>\n      </div>\n    </div>\n    ${renderPhaseBar(n)}\n    ${t.objectives?.length ? `<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-6">\n      <h2 class="font-bold dark:text-white mb-3">${svg("checkC", 16)} Objetivos</h2>\n      <ul class="ev-detail-list">${t.objectives.map((e) => `<li class="ev-detail-obj"><span class="ev-obj-check">✓</span> ${esc(e)}</li>`).join("")}</ul>\n    </div>` : ""}\n    ${t.resources?.length ? `<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-6">\n      <h2 class="font-bold dark:text-white mb-3">${svg("save", 16)} Recursos Necesarios</h2>\n      <div class="ev-res-detail-table">\n        <div class="ev-res-detail-header"><span>Recurso</span><span>Cant.</span><span>Area</span><span>Estado</span></div>\n        ${t.resources.map((e) => `<div class="ev-res-detail-row"><span class="dark:text-white">${esc(e.name)}</span><span>${e.qty} ${esc(e.unit)}</span><span class="text-slate-500 dark:text-slate-400">${esc(e.area)}</span><span class="ev-res-status ev-res-${e.status || "pendiente"}">${e.status || "pendiente"}</span></div>`).join("")}\n      </div>\n    </div>` : ""}\n    ${(() => {
      const e = t.backupPlan;
      if (!e) return "";
      const a = [];
      return (
        e.weather?.enabled &&
          a.push(
            `<div class="ev-bp-item"><span class="ev-bp-icon">🌧️</span><div><p class="font-semibold dark:text-white">Lluvia / Clima adverso</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(e.weather.venue || "Sin definir")}</p>${e.weather.notes ? `<p class="text-xs text-slate-400 mt-1">${esc(e.weather.notes)}</p>` : ""}</div></div>`,
          ),
        e.medical?.enabled &&
          a.push(
            `<div class="ev-bp-item"><span class="ev-bp-icon">🏥</span><div><p class="font-semibold dark:text-white">Emergencia médica</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(e.medical.protocol || "Sin definir")}</p></div></div>`,
          ),
        e.sound?.enabled &&
          a.push(
            `<div class="ev-bp-item"><span class="ev-bp-icon">🔊</span><div><p class="font-semibold dark:text-white">Falla de sonido</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(e.sound.fallback || "Sin definir")}</p></div></div>`,
          ),
        e.communication?.enabled &&
          a.push(
            `<div class="ev-bp-item"><span class="ev-bp-icon">📢</span><div><p class="font-semibold dark:text-white">Falla de comunicación</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(e.communication.fallback || "Sin definir")}</p></div></div>`,
          ),
        (e.custom || []).forEach((e) => {
          e.title &&
            a.push(
              `<div class="ev-bp-item"><span class="ev-bp-icon">⚡</span><div><p class="font-semibold dark:text-white">${esc(e.title)}</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(e.description || "")}</p></div></div>`,
            );
        }),
        a.length
          ? `<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-6"><h2 class="font-bold dark:text-white mb-3">🛡️ Plan de Respaldo</h2><div class="ev-bp-list">${a.join("")}</div></div>`
          : ""
      );
    })()}\n    ${t.observations ? `<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-6">\n      <h2 class="font-bold dark:text-white mb-3">📝 Observaciones</h2>\n      <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">${esc(t.observations)}</p>\n    </div>` : ""}\n    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">\n      <div class="flex items-center justify-between mb-4">\n        <div>\n          <h2 class="font-bold dark:text-white">Estructura de Roles</h2>\n          <p id="roles-tree-stats" class="text-xs text-slate-400">${a.areas} area(s) · ${a.students} estudiante(s) asignados</p>\n        </div>\n        <div class="flex items-center gap-2">\n          <button id="save-tree-btn" class="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-1" data-action="save-tree" style="display:none">\n            ${svg("save", 12)} Guardar\n          </button>\n          <button class="px-3 py-1.5 bg-neon-blue text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-1" data-action="add-root-child" data-id="${t.id}">\n            ${svg("plus", 12)} Agregar Área\n          </button>\n        </div>\n      </div>\n      <div id="roles-tree-container" class="roles-tree">\n        ${renderTreeSection(workingTree, 0, !0)}\n      </div>\n    </div>`
  );
}
let nodeModalMode = "add",
  nodeModalTargetId = null;
function openNodeModal(e, t) {
  ((nodeModalMode = e), (nodeModalTargetId = t || null));
  const a = document.getElementById("modal-root");
  if (!a) return;
  const n = "edit" === e;
  let s = "",
    o = "";
  if (n && t) {
    const e = findNodeInTree(t);
    e && ((s = e.title), (o = e.assignee || ""));
  }
  ((a.innerHTML = `\n    <div class="modal-overlay" data-action="close-overlay">\n      <div class="modal-dialog" data-stop>\n        <h3 class="modal-title">${n ? "Editar Área" : "Nueva Área"}</h3>\n        <form id="node-form" autocomplete="off">\n          <div class="form-group"><label class="form-label">Nombre del Área</label><input id="node-input-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(s)}" required placeholder="Ej: Logística, Decoración, Sonido..."></div>\n          <div class="form-group"><label class="form-label">Docente Responsable <span class="text-slate-400 text-xs">(opcional)</span></label><input id="node-input-assignee" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(o)}" placeholder="Nombre del docente"></div>\n          <div class="form-actions"><button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 transition-all" data-action="close-modal">Cancelar</button><button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-white hover:bg-blue-600 transition-all shadow-md">${n ? "Guardar" : "Agregar"}</button></div>\n        </form>\n      </div>\n    </div>`),
    document.getElementById("node-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const t = document.getElementById("node-input-title").value.trim(),
        a = document.getElementById("node-input-assignee").value.trim();
      if (t) {
        if (n) {
          const e = findNodeInTree(nodeModalTargetId);
          e && ((e.title = t), (e.assignee = a || null));
        } else {
          const e = nodeModalTargetId
            ? findNodeInTree(nodeModalTargetId)
            : workingTree;
          e &&
            ((e.children = e.children || []),
            e.children.push({
              id: uid("node"),
              title: t,
              assignee: a || null,
              children: [],
              studentRoles: [],
            }));
        }
        ((treeDirty = !0),
          closeModal(),
          refreshRolesTree(),
          updateSaveBtnVisibility());
      }
    }));
}
let studentModalAreaId = null,
  studentModalSrId = null;
function openStudentModal(e, t) {
  ((studentModalAreaId = e), (studentModalSrId = t || null));
  const a = document.getElementById("modal-root");
  if (!a) return;
  const n = !!t;
  let s = "",
    o = "",
    l = "";
  if (n) {
    const a = findNodeInTree(e);
    if (a) {
      const e = (a.studentRoles || []).find((e) => e.id === t);
      e && ((s = e.studentName), (o = e.grade), (l = e.role));
    }
  }
  ((a.innerHTML = `\n    <div class="modal-overlay" data-action="close-overlay">\n      <div class="modal-dialog" data-stop>\n        <h3 class="modal-title">${n ? "Editar Estudiante" : "Agregar Estudiante"}</h3>\n        <form id="student-form" autocomplete="off">\n          <div class="form-group"><label class="form-label">Nombre Completo</label><input id="student-input-name" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(s)}" required placeholder="Nombre del estudiante"></div>\n          <div class="form-row-2">\n            <div class="form-group"><label class="form-label">Grado</label><input id="student-input-grade" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(o)}" required placeholder="Ej: 10-1"></div>\n            <div class="form-group"><label class="form-label">Rol / Cargo</label><input id="student-input-role" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(l)}" required placeholder="Ej: Monitor de Juegos"></div>\n          </div>\n          <div class="form-actions"><button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 transition-all" data-action="close-modal">Cancelar</button><button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-white hover:bg-blue-600 transition-all shadow-md">${n ? "Guardar" : "Agregar"}</button></div>\n        </form>\n      </div>\n    </div>`),
    document.getElementById("student-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const t = document.getElementById("student-input-name").value.trim(),
        a = document.getElementById("student-input-grade").value.trim(),
        s = document.getElementById("student-input-role").value.trim();
      if (!t || !s) return;
      const o = findNodeInTree(studentModalAreaId);
      if (o) {
        if (n) {
          const e = (o.studentRoles || []).find(
            (e) => e.id === studentModalSrId,
          );
          e && ((e.studentName = t), (e.grade = a), (e.role = s));
        } else
          ((o.studentRoles = o.studentRoles || []),
            o.studentRoles.push({
              id: uid("sr"),
              studentName: t,
              grade: a,
              role: s,
            }));
        ((treeDirty = !0),
          closeModal(),
          refreshRolesTree(),
          updateSaveBtnVisibility());
      }
    }));
}
let subtaskModalAreaId = null,
  subtaskModalSrId = null,
  subtaskModalStId = null;
function openSubtaskModal(e, t, a) {
  ((subtaskModalAreaId = e),
    (subtaskModalSrId = t),
    (subtaskModalStId = a || null));
  const n = document.getElementById("modal-root");
  if (!n) return;
  const s = !!a;
  let o = "",
    l = "";
  if (s) {
    const n = findNodeInTree(e);
    if (n) {
      const e = (n.studentRoles || []).find((e) => e.id === t);
      if (e) {
        const t = (e.subtasks || []).find((e) => e.id === a);
        t && ((o = t.title), (l = t.dueDate || ""));
      }
    }
  }
  ((n.innerHTML = `\n    <div class="modal-overlay" data-action="close-overlay">\n      <div class="modal-dialog" data-stop>\n        <h3 class="modal-title">${s ? "Editar Subtarea" : "Nueva Subtarea"}</h3>\n        <form id="subtask-form" autocomplete="off">\n          <div class="form-group"><label class="form-label">Tarea</label><input id="subtask-input-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${esc(o)}" required placeholder="Ej: Comprar materiales, Preparar presentacion..."></div>\n          <div class="form-group"><label class="form-label">Fecha limite <span class="text-slate-400 text-xs">(opcional)</span></label><input type="date" id="subtask-input-date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm" value="${l}"></div>\n          <div class="form-actions"><button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 transition-all" data-action="close-modal">Cancelar</button><button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-white hover:bg-blue-600 transition-all shadow-md">${s ? "Guardar" : "Agregar"}</button></div>\n        </form>\n      </div>\n    </div>`),
    document.getElementById("subtask-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const t = document.getElementById("subtask-input-title").value.trim(),
        a = document.getElementById("subtask-input-date").value;
      if (!t) return;
      const n = findNodeInTree(subtaskModalAreaId);
      if (!n) return;
      const o = (n.studentRoles || []).find((e) => e.id === subtaskModalSrId);
      if (o) {
        if (((o.subtasks = o.subtasks || []), s)) {
          const e = o.subtasks.find((e) => e.id === subtaskModalStId);
          e && ((e.title = t), (e.dueDate = a || null));
        } else
          o.subtasks.push({
            id: uid("st"),
            title: t,
            done: !1,
            dueDate: a || null,
          });
        ((treeDirty = !0),
          closeModal(),
          refreshRolesTree(),
          updateSaveBtnVisibility());
      }
    }));
}
function toggleSubtask(e, t, a) {
  const n = findNodeInTree(e);
  if (!n) return;
  const s = (n.studentRoles || []).find((e) => e.id === t);
  if (!s) return;
  const o = (s.subtasks || []).find((e) => e.id === a);
  o &&
    ((o.done = !o.done),
    (treeDirty = !0),
    refreshRolesTree(),
    updateSaveBtnVisibility());
}
function deleteSubtask(e, t, a) {
  const n = findNodeInTree(e);
  if (!n) return;
  const s = (n.studentRoles || []).find((e) => e.id === t);
  s &&
    ((s.subtasks = (s.subtasks || []).filter((e) => e.id !== a)),
    (treeDirty = !0),
    refreshRolesTree(),
    updateSaveBtnVisibility());
}
function closeModal() {
  const e = document.getElementById("modal-root");
  e && (e.innerHTML = "");
}
function confirmModal(e, t, a = {}) {
  const {
    confirmText: n = "Eliminar",
    type: s = "danger",
    icon: o = "trash",
  } = a;
  return new Promise((a) => {
    const l = document.getElementById("modal-root"),
      r = svg(
        "trash" === o ? "trash" : "alert" === o ? "alertC" : "checkC",
        24,
      );
    l.innerHTML = `<div class="modal-overlay" style="animation:fadeIn .2s ease"><div class="modal-dialog" data-stop style="max-width:400px;text-align:center">\n      <div class="confirm-icon is-${s}"><span style="color:${"danger" === s ? "#EF4444" : "warning" === s ? "#F59E0B" : "#2563EB"}">${r}</span></div>\n      <h3 class="confirm-title">${esc(e)}</h3>\n      <p class="confirm-msg">${esc(t)}</p>\n      <div class="confirm-actions">\n        <button class="confirm-btn btn-cancel" id="confirm-no">Cancelar</button>\n        <button class="confirm-btn btn-confirm-${"danger" === s ? "danger" : "primary"}" id="confirm-yes">${esc(n)}</button>\n      </div>\n    </div></div>`;
    const i = document.getElementById("confirm-yes"),
      d = document.getElementById("confirm-no");
    function c(e) {
      ((l.innerHTML = ""), a(e));
    }
    ((i.onclick = () => {
      ((i.style.transform = "scale(.95)"), setTimeout(() => c(!0), 100));
    }),
      (d.onclick = () => {
        (d.classList.add("confirm-shake"), setTimeout(() => c(!1), 400));
      }),
      l.querySelector(".modal-overlay").addEventListener("click", (e) => {
        e.target === e.currentTarget && c(!1);
      }));
  });
}
function renderAnnouncements() {
  const e = [...DB.listAnn()].sort(
      (e, t) => new Date(t.date) - new Date(e.date),
    ),
    t = document.getElementById("announcements-list-container");
  0 !== e.length
    ? (t.innerHTML = e
        .map((e) => {
          const t = !e.readBy.includes("usr_01");
          return `<div class="ann-card ${t ? "unread" : ""}">\n      <div class="flex items-start gap-4">\n        <div class="flex-1 min-w-0">\n          <div class="flex items-center gap-2 mb-1">${badge(e.category)}${t ? '<span class="w-2 h-2 rounded-full bg-neon-blue"></span>' : ""}</div>\n          <h3 class="font-bold text-base ${t ? "dark:text-white" : "text-slate-500 dark:text-slate-400"}">${esc(e.title)}</h3>\n          ${e.content ? `<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${esc(e.content)}</p>` : ""}\n          <div class="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">\n            <span>Autor: <b class="dark:text-white">${esc(e.author)}</b></span>\n            <span>${esc(e.date)}</span>\n            <span>${e.readBy.length} leido(s)</span>\n          </div>\n        </div>\n        <div class="flex flex-col gap-1 flex-shrink-0">\n          ${t ? `<button class="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/40 text-green-600 transition-all" data-action="mark-read" data-id="${e.id}" title="Marcar leido">${svg("check", 15)}</button>` : ""}\n          <button class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-all" data-action="delete-ann" data-id="${e.id}" title="Eliminar">${svg("trash", 15)}</button>\n        </div>\n      </div>\n    </div>`;
        })
        .join(""))
    : (t.innerHTML = `<div class="empty-state">${svg("megaphone", 48)}<p class="empty-title">No hay comunicados</p><p>Publica el primer comunicado</p></div>`);
}
function renderPrint(e) {
  const t = DB.getPrintData(e),
    a = document.getElementById("print-content");
  if (!t)
    return void (a.innerHTML =
      '<div class="empty-state"><p class="empty-title">Evento no encontrado</p></div>');
  const n = t.objectives.length
      ? `<div class="print-section"><h3>Objetivos</h3><ul>${t.objectives.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`
      : "",
    s = t.backupPlan.length
      ? `<div class="print-section"><h3>Plan de Respaldo</h3><ul>${t.backupPlan.map((e) => `<li>${e.icon} ${esc(e.text)}</li>`).join("")}</ul></div>`
      : "",
    o = t.observations
      ? `<div class="print-section"><h3>Observaciones</h3><p>${esc(t.observations)}</p></div>`
      : "";
  a.innerHTML = `\n    <div class="flex items-center justify-between no-print mb-4">\n      <button class="text-sm text-neon-blue hover:underline flex items-center gap-1" onclick="history.back()">${svg("arrowL", 14)} Volver</button>\n      <div class="flex gap-2">\n        <button class="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2" onclick="downloadAllCards('${e}')">${svg("save", 16)} Descargar todas</button>\n        <button class="px-4 py-2 bg-neon-blue text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2" onclick="window.print()">${svg("printer", 16)} Imprimir</button>\n      </div>\n    </div>\n    <div class="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center mb-8 no-print">\n      <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Modulo de Impresion</p>\n      <h1 class="text-2xl font-bold" style="color:#1E3A8A">${esc(t.title)}</h1>\n      <p class="text-sm text-slate-500">Fecha: ${esc(t.date)} · ${t.cards.length} tarjeta(s)</p>\n    </div>\n    ${n || s || o ? `<div class="print-info-panel no-print mb-6">${n}${s}${o}</div>` : ""}\n    ${
    0 === t.cards.length
      ? '<div class="empty-state no-print"><p class="empty-title">Sin roles estudiantiles</p><p>Agrega estudiantes al arbol de roles</p></div>'
      : `\n    <h2 class="text-lg font-bold mb-4 no-print">Tarjetas de Rol</h2>\n    <div class="role-cards-grid mb-8">${t.cards
          .map((e, a) => {
            const n = t.resources.filter((t) => t.area === e.area),
              s = n.length
                ? `<div class="role-card-resources"><p class="role-card-resources-title">Insumos de tu area:</p>${n.map((e) => `<p>• ${esc(e.name)} x${e.qty}</p>`).join("")}</div>`
                : "";
            return `<div class="role-card print-card" id="card-${a}"><div class="role-card-header"><p>I.E. Nuestra Senora del Pilar</p></div><div class="role-card-body"><div class="role-card-avatar">${esc(e.name.charAt(0))}</div><div><p class="role-card-name">${esc(e.name)}</p><p class="role-card-grade">Grado ${esc(e.grade)}</p></div><div class="role-card-role-pill"><p>${esc(e.role)}</p></div>${s}<div class="role-card-footer"><p>${esc(t.title)}</p><p>${esc(t.date)}</p><p>Area: ${esc(e.area)}</p></div><button class="no-print mt-3 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 mx-auto" onclick="downloadCard('card-${a}', '${esc(e.name)}')">${svg("save", 12)} Descargar</button></div></div>`;
          })
          .join("")}</div>\n    `
  }`;
}
async function downloadCard(e, t) {
  const a = document.getElementById(e);
  if (!a) return;
  toast("Generando imagen...");
  const n = a.querySelector("button");
  n && (n.style.display = "none");
  try {
    const e = await domtoimage.toPng(a, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      }),
      n = document.createElement("a");
    ((n.download = `rol-${t.toLowerCase().replace(/\s+/g, "-")}.png`),
      (n.href = e),
      n.click(),
      toast("Imagen descargada"));
  } catch (e) {
    (console.error(e), toast("Error al generar imagen"));
  }
  n && (n.style.display = "");
}
async function downloadAllCards(e) {
  const t = document.querySelector(".role-cards-grid");
  if (!t) return;
  toast("Generando imagen de todas las tarjetas...");
  const a = t.querySelectorAll("button");
  a.forEach((e) => (e.style.display = "none"));
  try {
    const a = await domtoimage.toPng(t, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      }),
      n = document.createElement("a");
    ((n.download = `roles-evento-${e}.png`),
      (n.href = a),
      n.click(),
      toast("Imagen descargada"));
  } catch (e) {
    (console.error(e), toast("Error al generar imagen"));
  }
  a.forEach((e) => (e.style.display = ""));
}
function findNodeInTree(e) {
  if (!workingTree) return null;
  return (function t(a) {
    if (a.id === e) return a;
    for (const e of a.children || []) {
      const a = t(e);
      if (a) return a;
    }
    return null;
  })(workingTree);
}
function findParentInTree(e) {
  if (!workingTree) return null;
  return (function t(a) {
    for (const n of a.children || []) {
      if (n.id === e) return a;
      const s = t(n);
      if (s) return s;
    }
    return null;
  })(workingTree);
}
function updateSaveBtnVisibility() {
  const e = document.getElementById("save-tree-btn");
  e && (e.style.display = treeDirty ? "" : "none");
}
function generateBackupSuggestions(e) {
  const t = {
    weather: {
      enabled: !0,
      venue:
        "Sala de conversatorio (presentaciones) + Biblioteca (exposiciones)",
      notes:
        "Actividades de cancha se reubican a espacios interiores. Horario rotativo: 20 min por grado.",
    },
    medical: {
      enabled: !0,
      protocol:
        "Punto de atención en Coordinación. Contactar Emergencias 123 si es grave. Agua y botiquín disponibles.",
    },
    sound: {
      enabled: !0,
      fallback:
        "Megáfono de emergencia + 2 estudiantes ayudantes como voceadores. Señales visuales: palo con bandera.",
    },
    communication: {
      enabled: !0,
      fallback:
        "Lista impresa del cronograma por grado. Carteles visuales en la cancha. Estudiantes con camisetas distintivas como ayudantes.",
    },
    custom: [],
  };
  return (
    "Deportivo" === e &&
      ((t.weather.notes =
        "Actividades deportivas se cancelan en exterior. Se activan juegos indoor en sala de conversatorio."),
      (t.weather.venue = "Sala de conversatorio (juegos alternativos)")),
    ("Cultural" !== e && "Social" !== e) ||
      t.custom.push({
        title: "Participación estudiantil",
        description:
          "Si la asistencia es baja, se activan actividades de integración para motivar la asistencia.",
      }),
    t.custom.push({
      title: "Salida anticipada",
      description:
        "Si el evento se extiende, a las 12:15 se hace cierre obligatorio. Actividades pendientes se posponen.",
    }),
    t
  );
}
function openEventModal(e) {
  const t = !!e,
    a = document.getElementById("modal-root"),
    n = e?.backupPlan || {
      weather: { enabled: !1, venue: "", notes: "" },
      medical: { enabled: !1, protocol: "" },
      sound: { enabled: !1, fallback: "" },
      communication: { enabled: !1, fallback: "" },
      custom: [],
    },
    s = e?.objectives || [],
    o = e?.resources || [];
  ((a.innerHTML = `<div class="modal-overlay" data-action="close-overlay"><div class="modal-dialog event-modal" data-stop>\n    <h2 class="modal-title">${t ? "Editar Evento" : "Nuevo Evento"}</h2>\n    <div class="event-modal-tabs">\n      <button class="em-tab active" data-tab="basic">Basico</button>\n      <button class="em-tab" data-tab="details">Detalles</button>\n      <button class="em-tab" data-tab="backup">Planes</button>\n    </div>\n    <form id="event-form" class="space-y-4" autocomplete="off">\n      \x3c!-- TAB BASICO --\x3e\n      <div class="em-tab-content active" data-tab-content="basic">\n        <div><label class="form-label">Nombre del Evento</label><input type="text" id="ev-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" value="${esc(e?.title || "")}" required></div>\n        <div class="form-row-2">\n          <div><label class="form-label">Tipo</label><select id="ev-type" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue">${["Academico", "Cultural", "Deportivo", "Social", "Administrativo"].map((t) => `<option value="${t}" ${(e?.type || "Academico") === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>\n          <div class="flex items-end pb-1"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="ev-urgent" class="w-4 h-4 rounded accent-red-600" ${e?.urgent ? "checked" : ""}><span class="text-sm font-medium text-red-600 dark:text-red-400">Marcar como urgente</span></label></div>\n        </div>\n        <div><label class="form-label">Fecha del Evento</label><input type="date" id="ev-date" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" value="${e?.eventDate || ""}" required></div>\n        <div><label class="form-label">Coordinador General</label><input type="text" id="ev-leader" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" value="${esc(e?.leaderTeacher || "")}" required></div>\n        <div><label class="form-label">Descripcion</label><textarea id="ev-desc" rows="2" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" placeholder="Descripcion breve...">${esc(e?.description || "")}</textarea></div>\n      </div>\n      \x3c!-- TAB DETALLES --\x3e\n      <div class="em-tab-content" data-tab-content="details">\n        <div>\n          <label class="form-label">Objetivos del Evento</label>\n          <div id="ev-obj-list" class="ev-tag-list">${s.map((e, t) => `<div class="ev-tag"><span>${esc(e)}</span><button type="button" class="ev-tag-remove" data-obj-idx="${t}">&times;</button></div>`).join("")}</div>\n          <div class="flex gap-2 mt-2"><input type="text" id="ev-obj-input" class="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Ej: Recaudar fondos para la biblioteca..."><button type="button" id="ev-obj-add" class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">+</button></div>\n        </div>\n        <div>\n          <label class="form-label">Recursos / Insumos</label>\n          <div id="ev-res-table" class="ev-res-table">\n            <div class="ev-res-header"><span>Nombre</span><span>Cant.</span><span>Unidad</span><span>Area</span><span></span></div>\n            ${o.map((e, t) => `<div class="ev-res-row"><input value="${esc(e.name)}" data-res-field="name" data-res-idx="${t}" class="ev-res-input"><input type="number" value="${e.qty}" min="1" data-res-field="qty" data-res-idx="${t}" class="ev-res-input ev-res-sm"><select data-res-field="unit" data-res-idx="${t}" class="ev-res-input ev-res-sm"><option ${"pza" === e.unit ? "selected" : ""}>pza</option><option ${"kg" === e.unit ? "selected" : ""}>kg</option><option ${"lt" === e.unit ? "selected" : ""}>lt</option><option ${"par" === e.unit ? "selected" : ""}>par</option><option ${" rollo" === e.unit ? "selected" : ""}>rollo</option><option ${"caja" === e.unit ? "selected" : ""}>caja</option></select><input value="${esc(e.area)}" data-res-field="area" data-res-idx="${t}" class="ev-res-input"><button type="button" class="ev-res-del" data-res-del="${t}">&times;</button></div>`).join("")}\n          </div>\n          <button type="button" id="ev-res-add" class="mt-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">+ Agregar recurso</button>\n        </div>\n        <div>\n          <label class="form-label">Observaciones</label>\n          <textarea id="ev-obs" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" placeholder="Notas adicionales, horarios especiales, instrucciones...">${esc(e?.observations || "")}</textarea>\n        </div>\n      </div>\n      \x3c!-- TAB PLANES DE RESPALDO --\x3e\n      <div class="em-tab-content" data-tab-content="backup">\n        <div class="ev-backup-section">\n          <label class="ev-backup-toggle"><input type="checkbox" id="ev-bp-weather" ${n.weather?.enabled ? "checked" : ""}><span class="ev-backup-icon">🌧️</span><span>Lluvia / Clima adverso</span></label>\n          <div class="ev-backup-fields" id="ev-bp-weather-fields" style="display:${n.weather?.enabled ? "block" : "none"}">\n            <input id="ev-bp-weather-venue" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm mb-2" placeholder="Venue alterno (Ej: Sala de conversatorio)" value="${esc(n.weather?.venue || "")}">\n            <textarea id="ev-bp-weather-notes" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Notas del plan de lluvia...">${esc(n.weather?.notes || "")}</textarea>\n          </div>\n        </div>\n        <div class="ev-backup-section">\n          <label class="ev-backup-toggle"><input type="checkbox" id="ev-bp-medical" ${n.medical?.enabled ? "checked" : ""}><span class="ev-backup-icon">🏥</span><span>Emergencia médica</span></label>\n          <div class="ev-backup-fields" id="ev-bp-medical-fields" style="display:${n.medical?.enabled ? "block" : "none"}">\n            <textarea id="ev-bp-medical-protocol" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Protocolo: punto de atención, contactos, rutas...">${esc(n.medical?.protocol || "")}</textarea>\n          </div>\n        </div>\n        <div class="ev-backup-section">\n          <label class="ev-backup-toggle"><input type="checkbox" id="ev-bp-sound" ${n.sound?.enabled ? "checked" : ""}><span class="ev-backup-icon">🔊</span><span>Falla de sonido</span></label>\n          <div class="ev-backup-fields" id="ev-bp-sound-fields" style="display:${n.sound?.enabled ? "block" : "none"}">\n            <textarea id="ev-bp-sound-fallback" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Alternativa: megáfono, ayudantes, señales visuales...">${esc(n.sound?.fallback || "")}</textarea>\n          </div>\n        </div>\n        <div class="ev-backup-section">\n          <label class="ev-backup-toggle"><input type="checkbox" id="ev-bp-comm" ${n.communication?.enabled ? "checked" : ""}><span class="ev-backup-icon">📢</span><span>Falla de comunicación</span></label>\n          <div class="ev-backup-fields" id="ev-bp-comm-fields" style="display:${n.communication?.enabled ? "block" : "none"}">\n            <textarea id="ev-bp-comm-fallback" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" placeholder="Alternativa: listas impresas, carteles, ayudantes...">${esc(n.communication?.fallback || "")}</textarea>\n          </div>\n        </div>\n        <div class="ev-backup-section">\n          <label class="form-label">Escenarios personalizados</label>\n          <div id="ev-bp-custom-list">${(n.custom || []).map((e, t) => `<div class="ev-custom-row"><input value="${esc(e.title)}" data-cust-field="title" data-cust-idx="${t}" class="ev-res-input" placeholder="Titulo"><input value="${esc(e.description)}" data-cust-field="description" data-cust-idx="${t}" class="ev-res-input" placeholder="Descripcion"><button type="button" class="ev-res-del" data-cust-del="${t}">&times;</button></div>`).join("")}</div>\n          <button type="button" id="ev-bp-custom-add" class="mt-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">+ Agregar escenario</button>\n        </div>\n        ${t ? "" : '<div class="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">\n          <p class="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Sugerencia automática</p>\n          <p class="text-xs text-blue-600 dark:text-blue-400 mb-2">Generar planes de respaldo según el tipo de evento y la infraestructura del colegio.</p>\n          <button type="button" id="ev-bp-suggest" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Generar sugerencias</button>\n        </div>'}\n      </div>\n      <div class="form-actions"><button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 transition-all" data-action="close-modal">Cancelar</button><button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-white hover:bg-blue-600 transition-all shadow-md">Guardar</button></div>\n    </form></div></div>`),
    a.querySelectorAll(".em-tab").forEach((e) => {
      e.addEventListener("click", () => {
        (a
          .querySelectorAll(".em-tab")
          .forEach((e) => e.classList.remove("active")),
          a
            .querySelectorAll(".em-tab-content")
            .forEach((e) => e.classList.remove("active")),
          e.classList.add("active"),
          a
            .querySelector(`[data-tab-content="${e.dataset.tab}"]`)
            .classList.add("active"));
      });
    }),
    ["weather", "medical", "sound", "comm"].forEach((e) => {
      const t = a.querySelector(`#ev-bp-${e}`);
      t &&
        t.addEventListener("change", () => {
          const n = a.querySelector(`#ev-bp-${e}-fields`);
          n && (n.style.display = t.checked ? "block" : "none");
        });
    }));
  let l = [...s];
  function r() {
    ((a.querySelector("#ev-obj-list").innerHTML = l
      .map(
        (e, t) =>
          `<div class="ev-tag"><span>${esc(e)}</span><button type="button" class="ev-tag-remove" data-obj-idx="${t}">&times;</button></div>`,
      )
      .join("")),
      a.querySelectorAll("[data-obj-idx]").forEach((e) =>
        e.addEventListener("click", () => {
          (l.splice(+e.dataset.objIdx, 1), r());
        }),
      ));
  }
  (a.querySelector("#ev-obj-add").addEventListener("click", () => {
    const e = a.querySelector("#ev-obj-input"),
      t = e.value.trim();
    t && (l.push(t), (e.value = ""), r());
  }),
    a.querySelector("#ev-obj-input").addEventListener("keydown", (e) => {
      "Enter" === e.key &&
        (e.preventDefault(), a.querySelector("#ev-obj-add").click());
    }),
    r());
  let i = [...o];
  function d() {
    ((a.querySelector("#ev-res-table").innerHTML =
      '<div class="ev-res-header"><span>Nombre</span><span>Cant.</span><span>Unidad</span><span>Area</span><span></span></div>' +
      i
        .map(
          (e, t) =>
            `<div class="ev-res-row"><input value="${esc(e.name)}" data-res-field="name" data-res-idx="${t}" class="ev-res-input"><input type="number" value="${e.qty}" min="1" data-res-field="qty" data-res-idx="${t}" class="ev-res-input ev-res-sm"><select data-res-field="unit" data-res-idx="${t}" class="ev-res-input ev-res-sm"><option ${"pza" === e.unit ? "selected" : ""}>pza</option><option ${"kg" === e.unit ? "selected" : ""}>kg</option><option ${"lt" === e.unit ? "selected" : ""}>lt</option><option ${"par" === e.unit ? "selected" : ""}>par</option><option ${"rollo" === e.unit ? "selected" : ""}>rollo</option><option ${"caja" === e.unit ? "selected" : ""}>caja</option></select><input value="${esc(e.area)}" data-res-field="area" data-res-idx="${t}" class="ev-res-input"><button type="button" class="ev-res-del" data-res-del="${t}">&times;</button></div>`,
        )
        .join("")),
      a.querySelectorAll("[data-res-del]").forEach((e) =>
        e.addEventListener("click", () => {
          (i.splice(+e.dataset.resDel, 1), d());
        }),
      ),
      a.querySelectorAll("[data-res-field]").forEach((e) =>
        e.addEventListener("change", () => {
          const t = +e.dataset.resIdx;
          i[t][e.dataset.resField] = e.value;
        }),
      ));
  }
  (a.querySelector("#ev-res-add").addEventListener("click", () => {
    (i.push({
      id: uid("res"),
      name: "",
      qty: 1,
      unit: "pza",
      area: "",
      status: "pendiente",
    }),
      d());
  }),
    d());
  let c = [...(n.custom || [])];
  function u() {
    ((a.querySelector("#ev-bp-custom-list").innerHTML = c
      .map(
        (e, t) =>
          `<div class="ev-custom-row"><input value="${esc(e.title)}" data-cust-field="title" data-cust-idx="${t}" class="ev-res-input" placeholder="Titulo"><input value="${esc(e.description)}" data-cust-field="description" data-cust-idx="${t}" class="ev-res-input" placeholder="Descripcion"><button type="button" class="ev-res-del" data-cust-del="${t}">&times;</button></div>`,
      )
      .join("")),
      a.querySelectorAll("[data-cust-del]").forEach((e) =>
        e.addEventListener("click", () => {
          (c.splice(+e.dataset.custDel, 1), u());
        }),
      ),
      a.querySelectorAll("[data-cust-field]").forEach((e) =>
        e.addEventListener("change", () => {
          const t = +e.dataset.custIdx;
          c[t][e.dataset.custField] = e.value;
        }),
      ));
  }
  (a.querySelector("#ev-bp-custom-add").addEventListener("click", () => {
    (c.push({ title: "", description: "" }), u());
  }),
    u());
  const v = a.querySelector("#ev-bp-suggest");
  (v &&
    v.addEventListener("click", () => {
      const e = generateBackupSuggestions(a.querySelector("#ev-type").value);
      ((a.querySelector("#ev-bp-weather").checked = !0),
        a.querySelector("#ev-bp-weather").dispatchEvent(new Event("change")),
        (a.querySelector("#ev-bp-weather-venue").value = e.weather.venue),
        (a.querySelector("#ev-bp-weather-notes").value = e.weather.notes),
        (a.querySelector("#ev-bp-medical").checked = !0),
        a.querySelector("#ev-bp-medical").dispatchEvent(new Event("change")),
        (a.querySelector("#ev-bp-medical-protocol").value = e.medical.protocol),
        (a.querySelector("#ev-bp-sound").checked = !0),
        a.querySelector("#ev-bp-sound").dispatchEvent(new Event("change")),
        (a.querySelector("#ev-bp-sound-fallback").value = e.sound.fallback),
        (a.querySelector("#ev-bp-comm").checked = !0),
        a.querySelector("#ev-bp-comm").dispatchEvent(new Event("change")),
        (a.querySelector("#ev-bp-comm-fallback").value =
          e.communication.fallback),
        (c = e.custom),
        u(),
        toast("Sugerencias aplicadas"));
    }),
    (document.getElementById("event-form").onsubmit = (a) => {
      a.preventDefault();
      const n = {
        title: document.getElementById("ev-title").value.trim(),
        type: document.getElementById("ev-type").value,
        urgent: document.getElementById("ev-urgent").checked,
        eventDate: document.getElementById("ev-date").value,
        prepDeadline: "",
        leaderTeacher: document.getElementById("ev-leader").value.trim(),
        description: document.getElementById("ev-desc").value.trim(),
        objectives: l,
        resources: i,
        observations: document.getElementById("ev-obs").value.trim(),
        backupPlan: {
          weather: {
            enabled: document.getElementById("ev-bp-weather").checked,
            venue:
              document.getElementById("ev-bp-weather-venue")?.value?.trim() ||
              "",
            notes:
              document.getElementById("ev-bp-weather-notes")?.value?.trim() ||
              "",
          },
          medical: {
            enabled: document.getElementById("ev-bp-medical").checked,
            protocol:
              document
                .getElementById("ev-bp-medical-protocol")
                ?.value?.trim() || "",
          },
          sound: {
            enabled: document.getElementById("ev-bp-sound").checked,
            fallback:
              document.getElementById("ev-bp-sound-fallback")?.value?.trim() ||
              "",
          },
          communication: {
            enabled: document.getElementById("ev-bp-comm").checked,
            fallback:
              document.getElementById("ev-bp-comm-fallback")?.value?.trim() ||
              "",
          },
          custom: c,
        },
      };
      n.title &&
        n.eventDate &&
        n.leaderTeacher &&
        (t ? DB.updateEvent(e.id, n) : DB.createEvent(n),
        toast(t ? "Evento actualizado" : "Evento creado"),
        closeModal(),
        refreshCurrentView());
    }));
}
function openAnnModal() {
  ((document.getElementById("modal-root").innerHTML =
    '<div class="modal-overlay" data-action="close-overlay"><div class="modal-dialog" data-stop>\n    <h2 class="modal-title">Nuevo Comunicado</h2>\n      <form id="ann-form" class="space-y-4" autocomplete="off">\n      <div><label class="form-label">Titulo</label><input type="text" id="ann-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" required></div>\n      <div><label class="form-label">Categoria</label><select id="ann-cat" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue"><option value="URGENTE">URGENTE</option><option value="INFORMATIVO" selected>INFORMATIVO</option><option value="RECORDATORIO">RECORDATORIO</option></select></div>\n      <div><label class="form-label">Autor</label><input type="text" id="ann-author" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" value="Prof. Erika Villafane"></div>\n      <div><label class="form-label">Contenido</label><textarea id="ann-content" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-neon-blue" placeholder="Redacte el comunicado..."></textarea></div>\n      <div class="form-actions"><button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 transition-all" data-action="close-modal">Cancelar</button><button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-white hover:bg-blue-600 transition-all shadow-md">Publicar</button></div>\n    </form></div></div>'),
    (document.getElementById("ann-form").onsubmit = (e) => {
      e.preventDefault();
      const t = document.getElementById("ann-title").value.trim();
      t &&
        (DB.createAnn({
          title: t,
          category: document.getElementById("ann-cat").value,
          author:
            document.getElementById("ann-author").value.trim() ||
            "Prof. Erika Villafane",
          content: document.getElementById("ann-content").value.trim(),
          date: todayISO(),
        }),
        toast("Comunicado publicado"),
        closeModal(),
        refreshCurrentView());
    }));
}
function showEventsList() {
  (document.getElementById("events-list-wrapper").classList.remove("hidden"),
    document.getElementById("events-detail-container").classList.add("hidden"),
    (workingTree = null),
    (workingTreeEventId = null),
    (treeDirty = !1),
    renderEvents());
}
function showEventDetail(e) {
  const t = document.getElementById("events-detail-container");
  ((t.innerHTML = renderEventDetail(e)),
    document.getElementById("events-list-wrapper").classList.add("hidden"),
    t.classList.remove("hidden"));
}
function refreshCurrentView() {
  if ("dashboard" === currentView) renderDashboard();
  else if ("events" === currentView) {
    const e = document.getElementById("events-detail-container");
    e && !e.classList.contains("hidden")
      ? workingTreeEventId && showEventDetail(workingTreeEventId)
      : renderEvents();
  } else
    "announcements" === currentView
      ? renderAnnouncements()
      : "archive" === currentView
        ? renderArchive()
        : "print" === currentView &&
          workingTreeEventId &&
          renderPrint(workingTreeEventId);
}
let actionsBound = !1;
function bindActions() {
  if (actionsBound) return;
  if (
    ((actionsBound = !0),
    document
      .getElementById("login-form")
      .addEventListener("submit", handleLogin),
    document
      .getElementById("btn-enter-dashboard")
      .addEventListener("click", enterDashboard),
    document
      .getElementById("btn-logout")
      .addEventListener("click", handleLogout),
    document
      .getElementById("theme-light")
      .addEventListener("click", () => setTheme("light")),
    document
      .getElementById("theme-dark")
      .addEventListener("click", () => setTheme("dark")),
    document
      .getElementById("theme-system")
      .addEventListener("click", () => setTheme("system")),
    ["dashboard", "events", "calendar", "announcements", "archive"].forEach(
      (e) => {
        document
          .getElementById("btn-nav-" + e)
          .addEventListener("click", async () => {
            if (treeDirty) {
              ((await confirmModal(
                "Cambios sin guardar",
                "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
                {
                  confirmText: "Guardar y salir",
                  type: "warning",
                  icon: "alert",
                },
              )) &&
                workingTree &&
                workingTreeEventId &&
                (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
                toast("Cambios guardados automaticamente")),
                (treeDirty = !1));
            }
            location.hash = e;
          });
      },
    ),
    document.getElementById("cal-prev")?.addEventListener("click", calPrev),
    document.getElementById("cal-next")?.addEventListener("click", calNext),
    document.getElementById("cal-today")?.addEventListener("click", calToday),
    document
      .getElementById("cal-quick-add")
      ?.addEventListener("click", calQuickAdd),
    document
      .getElementById("cal-q-save")
      ?.addEventListener("click", calQuickSave),
    document.getElementById("cal-q-cancel")?.addEventListener("click", () => {
      document.getElementById("cal-quick-form").classList.add("hidden");
    }),
    document.getElementById("cal-q-name")?.addEventListener("keydown", (e) => {
      "Enter" === e.key && calQuickSave();
    }),
    document
      .getElementById("cal-d-save")
      ?.addEventListener("click", calDaySave),
    document
      .getElementById("cal-d-cancel")
      ?.addEventListener("click", calDayCancel),
    document.getElementById("cal-d-name")?.addEventListener("keydown", (e) => {
      "Enter" === e.key && calDaySave();
    }),
    document.getElementById("cal-year-prev")?.addEventListener("click", () => {
      (calYear--, populateYearSelect(), renderCalendar());
    }),
    document.getElementById("cal-year-next")?.addEventListener("click", () => {
      (calYear++, populateYearSelect(), renderCalendar());
    }),
    document.getElementById("cal-year-select")?.addEventListener("change", onYearSelectChange),
    document
      .getElementById("cal-btn-monthly")
      ?.addEventListener("click", () => {
        ((calMode = "monthly"), updateCalToggle(), renderCalendar());
      }),
    document.getElementById("cal-btn-yearly")?.addEventListener("click", () => {
      ((calMode = "yearly"), updateCalToggle(), renderCalendar());
    }),
    !calSwipeInit)
  ) {
    const e = document.getElementById("view-calendar");
    e && (setupCalSwipe(e), (calSwipeInit = !0));
  }
  (window.addEventListener("resize", () => {
    "calendar" === currentView && renderCalendar();
  }),
    document
      .getElementById("archive-search")
      ?.addEventListener("input", () => renderArchive()),
    document
      .getElementById("archive-type-filter")
      ?.addEventListener("change", () => renderArchive()),
    document
      .getElementById("archive-year-filter")
      ?.addEventListener("change", () => renderArchive()),
    document
      .getElementById("btn-new-event-dashboard")
      .addEventListener("click", () => openEventModal(null)),
    document
      .getElementById("btn-view-all-events")
      ?.addEventListener("click", () => {
        (switchView("events"), showEventsList());
      }),
    document
      .getElementById("btn-view-all-announcements")
      ?.addEventListener("click", () => switchView("announcements")),
    document
      .getElementById("btn-new-event")
      .addEventListener("click", () => openEventModal(null)),
    document.getElementById("events-search").addEventListener("input", (e) => {
      ((evtFilters.search = e.target.value), renderEvents());
    }),
    document
      .getElementById("events-filter-status")
      .addEventListener("change", (e) => {
        ((evtFilters.status = e.target.value), renderEvents());
      }),
    document
      .getElementById("events-filter-type")
      .addEventListener("change", (e) => {
        ((evtFilters.type = e.target.value), renderEvents());
      }),
    document
      .getElementById("btn-new-announcement")
      .addEventListener("click", () => openAnnModal()));
  let e = !1;
  (document.addEventListener("mousedown", (t) => {
    e = !!t.target.closest("[data-stop]");
  }),
    document.addEventListener("click", async (t) => {
      const a = t.target.closest("[data-stop]"),
        n = t.target.closest("[data-action]");
      if (a)
        return n && "close-modal" === n.dataset.action
          ? void closeModal()
          : void 0;
      if (e) return void (e = !1);
      if (!n) return;
      const s = n.dataset.action;
      if ("close-overlay" !== s) {
        if ("edit-event" === s) {
          if (treeDirty && workingTreeEventId !== n.dataset.id) {
            ((await confirmModal(
              "Cambios sin guardar",
              "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
              {
                confirmText: "Guardar y salir",
                type: "warning",
                icon: "alert",
              },
            )) &&
              workingTree &&
              workingTreeEventId &&
              (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
              toast("Cambios guardados automaticamente")),
              (treeDirty = !1));
          }
          return void openEventModal(DB.getEvent(n.dataset.id));
        }
        if ("delete-event" === s) {
          if (
            !(await confirmModal(
              "Eliminar evento",
              'Se eliminara "' +
                n.dataset.title +
                '" y todo su contenido permanentemente.',
              { confirmText: "Eliminar", type: "danger" },
            ))
          )
            return;
          return (
            DB.deleteEvent(n.dataset.id),
            toast("Evento eliminado"),
            void refreshCurrentView()
          );
        }
        if ("open-detail" !== s) {
          if ("back-events" === s) {
            if (treeDirty) {
              ((await confirmModal(
                "Cambios sin guardar",
                "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
                {
                  confirmText: "Guardar y salir",
                  type: "warning",
                  icon: "alert",
                },
              )) &&
                workingTree &&
                workingTreeEventId &&
                (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
                toast("Cambios guardados automaticamente")),
                (treeDirty = !1));
            }
            return (showEventsList(), void switchView("events"));
          }
          if ("print-event" === s) {
            if (treeDirty) {
              ((await confirmModal(
                "Cambios sin guardar",
                "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
                {
                  confirmText: "Guardar y salir",
                  type: "warning",
                  icon: "alert",
                },
              )) &&
                workingTree &&
                workingTreeEventId &&
                (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
                toast("Cambios guardados automaticamente")),
                (treeDirty = !1));
            }
            return (
              switchView("print"),
              void (location.hash = "print:" + n.dataset.id)
            );
          }
          if ("archive-event" === s)
            return (
              treeDirty &&
                workingTreeEventId === n.dataset.id &&
                (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
                (treeDirty = !1)),
              DB.archiveEvent(n.dataset.id),
              toast("Evento archivado"),
              showEventsList(),
              void switchView("events")
            );
          if ("restore-event" === s) {
            if (
              !(await confirmModal(
                "Restaurar evento",
                `Deseas restaurar "${n.dataset.title}" a la seccion de eventos activos?`,
                { confirmText: "Restaurar", type: "info", icon: "check" },
              ))
            )
              return;
            return (
              DB.unarchiveEvent(n.dataset.id),
              toast("Evento restaurado"),
              void renderArchive()
            );
          }
          if ("mark-read" === s)
            return (DB.markRead(n.dataset.id), void refreshCurrentView());
          if ("delete-ann" === s) {
            if (
              !(await confirmModal(
                "Eliminar comunicado",
                "Esta accion no se puede deshacer.",
                { confirmText: "Eliminar", type: "danger" },
              ))
            )
              return;
            return (
              DB.deleteAnn(n.dataset.id),
              toast("Eliminado"),
              void refreshCurrentView()
            );
          }
          if ("save-tree" === s) {
            if (!workingTree || !workingTreeEventId) return;
            return (
              DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
              (treeDirty = !1),
              toast("Guardado"),
              void updateSaveBtnVisibility()
            );
          }
          if ("rate-event" === s)
            return (
              DB.updateEvent(n.dataset.id, { rating: +n.dataset.value }),
              toast("Evento calificado"),
              void refreshCurrentView()
            );
          if ("toggle-section" !== s)
            if ("add-root-child" !== s)
              if ("edit-node" !== s)
                if ("delete-node" !== s)
                  if ("add-student-to-node" !== s)
                    if ("edit-student" !== s)
                      if ("delete-student" !== s)
                        if ("add-subtask-to-student" !== s)
                          if ("edit-subtask" !== s)
                            if ("toggle-subtask" !== s)
                              if ("delete-subtask" !== s);
                              else {
                                if (
                                  !(await confirmModal(
                                    "Eliminar subtarea",
                                    "Esta accion no se puede deshacer.",
                                    { confirmText: "Eliminar", type: "danger" },
                                  ))
                                )
                                  return;
                                deleteSubtask(
                                  n.dataset.areaId,
                                  n.dataset.srId,
                                  n.dataset.stId,
                                );
                              }
                            else
                              toggleSubtask(
                                n.dataset.areaId,
                                n.dataset.srId,
                                n.dataset.stId,
                              );
                          else
                            openSubtaskModal(
                              n.dataset.areaId,
                              n.dataset.srId,
                              n.dataset.stId,
                            );
                        else openSubtaskModal(n.dataset.areaId, n.dataset.srId);
                      else {
                        if (
                          !(await confirmModal(
                            "Eliminar estudiante",
                            "Se removera este estudiante del rol asignado.",
                            { confirmText: "Eliminar", type: "danger" },
                          ))
                        )
                          return;
                        deleteStudentFromTree(n.dataset.srId);
                      }
                    else openStudentModal(n.dataset.areaId, n.dataset.srId);
                  else openStudentModal(n.dataset.nodeId);
                else {
                  if (
                    !(await confirmModal(
                      "Eliminar area",
                      "Se eliminara esta area y todos los roles asignados.",
                      { confirmText: "Eliminar area", type: "danger" },
                    ))
                  )
                    return;
                  deleteNodeFromTree(n.dataset.nodeId);
                }
              else openNodeModal("edit", n.dataset.nodeId);
            else openNodeModal("add", "node_root");
          else toggleSection(n.dataset.nodeId);
        } else location.hash = "event:" + n.dataset.id;
      } else closeModal();
    }),
    document
      .getElementById("sidebar-toggle-mobile")
      ?.addEventListener("click", () => {
        (document
          .querySelector("#app-container > aside")
          .classList.toggle("open"),
          document.getElementById("sidebar-overlay").classList.toggle("open"));
      }),
    document
      .getElementById("sidebar-overlay")
      ?.addEventListener("click", () => {
        (document
          .querySelector("#app-container > aside")
          .classList.remove("open"),
          document.getElementById("sidebar-overlay").classList.remove("open"));
      }),
    window.addEventListener("hashchange", handleHash),
    window.addEventListener("beforeunload", (e) => {
      treeDirty && (e.preventDefault(), (e.returnValue = ""));
    }));
}
let _pendingHash = null;
async function handleHash() {
  const e = location.hash.slice(1);
  if (treeDirty) {
    _pendingHash = e;
    return (
      (await confirmModal(
        "Cambios sin guardar",
        "Tienes cambios en el arbol de roles que no se han guardado. Deseas guardarlos antes de salir?",
        { confirmText: "Guardar y salir", type: "warning", icon: "alert" },
      ))
        ? (workingTree &&
            workingTreeEventId &&
            (DB.updateEvent(workingTreeEventId, { rolesTree: workingTree }),
            toast("Cambios guardados automaticamente")),
          (treeDirty = !1),
          _applyHash(_pendingHash))
        : ((treeDirty = !1), _applyHash(_pendingHash)),
      void (_pendingHash = null)
    );
  }
  _applyHash(e);
}
function _applyHash(e) {
  if (!e || "dashboard" === e)
    return (switchView("dashboard"), void renderDashboard());
  if ("events" === e) return (switchView("events"), void showEventsList());
  if ("calendar" === e) return (switchView("calendar"), void renderCalendar());
  if ("announcements" === e)
    return (switchView("announcements"), void renderAnnouncements());
  if ("archive" === e) return (switchView("archive"), void renderArchive());
  if (e.startsWith("event:")) {
    const t = e.slice(6),
      a = DB.getEvent(t);
    return (
      switchView("events"),
      void (a
        ? showEventDetail(t)
        : (toast("Evento no encontrado", "error"), showEventsList()))
    );
  }
  if (e.startsWith("print:")) {
    const t = e.slice(6);
    return (switchView("print"), void renderPrint(t));
  }
}
function initMainApp() {
  (renderDashboard(),
    renderEvents(),
    renderAnnouncements(),
    (document.getElementById("user-name").textContent = "Prof. Erika"),
    (document.getElementById("user-role").textContent = "Coordinadora"),
    (document.getElementById("user-initial").textContent = "E"));
}
document.addEventListener("DOMContentLoaded", () => {
  (seedData(),
    DB.autoArchive(),
    setTheme(localStorage.getItem("sioci_theme") || "system"),
    initWebGL(),
    checkSession(),
    bindActions(),
    history.replaceState(null, "", "#"),
    handleHash());
  const e = document.getElementById("cursor-follower");
  if (e && window.matchMedia("(pointer: fine)").matches) {
    let a = -200,
      n = -200,
      s = -200,
      o = -200,
      l = 40,
      r = 40,
      i = 40,
      d = 40;
    function t(t) {
      const s = t.getBoundingClientRect();
      s.width > 400 ||
        s.height > 300 ||
        ((a = s.left + s.width / 2),
        (n = s.top + s.height / 2),
        (i = s.width + 20),
        (d = s.height + 16),
        clearTimeout(e._snap),
        (e._snap = setTimeout(() => {
          ((l = i), (r = d));
        }, 250)));
    }
    (document.addEventListener("mousemove", (e) => {
      ((a = e.clientX), (n = e.clientY));
    }),
      document.addEventListener("mouseleave", () => {
        e.style.opacity = "0";
      }),
      document.addEventListener("mouseenter", () => {
        e.style.opacity = "1";
      }),
      (function t() {
        ((s += 0.15 * (a - s)),
          (o += 0.15 * (n - o)),
          (l += 0.15 * (i - l)),
          (r += 0.15 * (d - r)),
          (e.style.transform = `translate(${s - l / 2}px, ${o - r / 2}px)`),
          (e.style.width = l + "px"),
          (e.style.height = r + "px"),
          requestAnimationFrame(t));
      })(),
      document.addEventListener("mouseover", (a) => {
        const n = a.target.closest("input, select, textarea"),
          s = a.target.closest('button, [type="submit"]'),
          o = a.target.closest(".event-card, .event-row, .stat-card"),
          l = a.target.closest("a, [data-action]");
        ((e.className = ""),
          n
            ? (t(n), e.classList.add("is-expand"))
            : s
              ? (t(s), e.classList.add("is-expand"))
              : o
                ? (t(o), e.classList.add("is-expand"))
                : l && e.classList.add("is-dot"));
      }),
      document.addEventListener("mouseout", (t) => {
        t.target.closest(
          'a, [data-action], button, [type="submit"], input, select, textarea, .event-card, .event-row, .stat-card',
        ) &&
          ((e.className = ""),
          (i = 40),
          (d = 40),
          clearTimeout(e._snap),
          (e._snap = setTimeout(() => {
            ((l = 40), (r = 40));
          }, 250)));
      }));
  }
});
