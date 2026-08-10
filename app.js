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
  
