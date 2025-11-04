// --- VARIABLES GLOBALES ----------------------------------------------------
const FORMSPREE_ENDPOINT = ""; // <- Si usas Formspree pon aquí tu endpoint 'https://formspree.io/f/xxxxx'

// --- UTILIDADES ------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const nowISO = () => new Date().toISOString();

// --- DATOS DE MUESTRA ------------------------------------------------------
let solicitudes = [
  {
    id: "S-001",
    title: "Cambio válvula de admisión",
    user: "Carlos P",
    status: "Abierta",
    date: nowISO(),
    desc: "Revisión y reemplazo",
  },
  {
    id: "S-002",
    title: "Inspección cubierta",
    user: "María R",
    status: "Pendiente",
    date: nowISO(),
    desc: "Inspección mensual",
  },
  {
    id: "S-003",
    title: "Orden de compra materiales",
    user: "J. Torres",
    status: "Aprobada",
    date: nowISO(),
    desc: "Compra de resina",
  },
];

const filesRepo = []; // almacenamiento temporal de archivos (solo 1 vez)

let users = [
  { user: "operador1", role: "Editor", enabled: true },
  { user: "inspectorA", role: "Revisor", enabled: true },
  { user: "admin", role: "Administrador", enabled: true },
];

// --- FUNCIONES DE NAVEGACIÓN -----------------------------------------------
function qs(view) {
  return document.querySelector(.view[data-view="${view}"]);
}

function showView(view) {
  $$(".view").forEach((v) => v.classList.add("hidden"));
  const target = qs(view);
  if (target) target.classList.remove("hidden");
  $$(".menu-item").forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(.menu-item[data-view="${view}"])
    .forEach((b) => b.classList.add("active"));

  // actualizar estadísticas
  $("#statActive").textContent = solicitudes.filter(
    (s) => s.status === "Abierta"
  ).length;
  $("#statPending").textContent = solicitudes.filter(
    (s) => s.status === "Pendiente"
  ).length;
  $("#statFiles").textContent = filesRepo.length;
}

// --- EVENTOS DE NAVEGACIÓN -------------------------------------------------
$$(".menu-item").forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// inicialización al cargar
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderSolicitudes();
  renderAutorizaciones();
  renderHistorico();
  renderRepo();
  renderUsers();
  showView("dashboard");
});

// --- SOLICITUDES -----------------------------------------------------------
function renderSolicitudes() {
  const tbody = $("#tableSolicitudes tbody");
  tbody.innerHTML = "";
  solicitudes.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.id}</td><td>${s.title}</td><td>${s.user}</td><td>${s.status}</td>
      <td><button class="secondary view-detail" data-id="${s.id}">Ver</button></td>`;
    tbody.appendChild(tr);
  });

  $$(".view-detail").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const s = solicitudes.find((x) => x.id === id);
      if (!s) return alert("Solicitud no encontrada");
      openViewModal(s);
    })
  );
}

function renderAutorizaciones() {
  const tbody = $("#tableAutorizaciones tbody");
  tbody.innerHTML = "";
  solicitudes
    .filter((s) => s.status === "Pendiente" || s.status === "Abierta")
    .forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${s.id}</td><td>${s.title}</td><td>${s.user}</td>
      <td>
        <button class="primary approve" data-id="${s.id}">Aprobar</button>
        <button class="secondary reject" data-id="${s.id}">Rechazar</button>
      </td>`;
      tbody.appendChild(tr);
    });

  $$(".approve").forEach((b) =>
    b.addEventListener("click", (e) =>
      changeStatus(e.currentTarget.dataset.id, "Aprobada")
    )
  );

  $$(".reject").forEach((b) =>
    b.addEventListener("click", (e) =>
      changeStatus(e.currentTarget.dataset.id, "Rechazada")
    )
  );
}

function changeStatus(id, newStatus) {
  const item = solicitudes.find((s) => s.id === id);
  if (!item) return;
  item.status = newStatus;
  renderSolicitudes();
  renderAutorizaciones();
  renderHistorico();
  alert(Solicitud ${id} marcada como ${newStatus});
}

function renderHistorico() {
  const tbody = $("#tableHistorico tbody");
  tbody.innerHTML = "";
  solicitudes.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.id}</td><td>${s.title}</td><td>${
      s.status
    }</td><td>${new Date(s.date).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

// --- NUEVA SOLICITUD -------------------------------------------------------
["openNewRequest", "openNewRequest2"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => showModal());
});

function showModal() {
  $("#modal").classList.remove("hidden");
  $("#reqTitle").focus();
}

$("#closeModal").addEventListener("click", () =>
  $("#modal").classList.add("hidden")
);

$("#newRequestForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("#reqTitle").value.trim();
  const user = $("#reqUser").value.trim();
  const desc = $("#reqDesc").value.trim();
  if (!title || !user) return alert("Completa título y solicitante");

  const id = S-${String(Math.floor(Math.random() * 900) + 100)};
  solicitudes.unshift({
    id,
    title,
    user,
    status: "Abierta",
    date: nowISO(),
    desc,
  });

  renderSolicitudes();
  renderAutorizaciones();
  renderHistorico();

  $("#modal").classList.add("hidden");
  $("#newRequestForm").reset();
});

// --- REPOSITORIO -----------------------------------------------------------
$("#fileInput").addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((f) => {
    const id = F-${Date.now()}-${Math.floor(Math.random() * 1000)};
    filesRepo.push({
      id,
      name: f.name,
      size: f.size,
      date: nowISO(),
      status: "Pendiente",
    });
  });
  renderRepo();
});

function renderRepo() {
  const el = $("#fileList");
  el.innerHTML = "";

  if (filesRepo.length === 0) {
    el.innerHTML = '<div class="muted">No hay archivos.</div>';
    return;
  }

  filesRepo.forEach((f) => {
    const row = document.createElement("div");
    row.className = "repo-row";

    let estadoColor = "#9aa4b2";
    if (f.status === "Aprobado") estadoColor = "#3cd48c";
    else if (f.status === "Rechazado") estadoColor = "#ff6b6b";

    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
        <div style="flex:1;min-width:200px">
          <strong>${f.name}</strong>
          <div class="muted" style="font-size:0.85rem">
            ${(f.size / 1024).toFixed(1)} KB — ${new Date(
      f.date
    ).toLocaleString()}
          </div>
        </div>
        <div style="color:${estadoColor};font-weight:700">${f.status}</div>
        <div style="display:flex;gap:6px">
          <button class="approve-file" data-id="${f.id}">Aprobar</button>
          <button class="reject-file" data-id="${f.id}">Rechazar</button>
        </div>
      </div>
    `;

    el.appendChild(row);
  });

  $$(".approve-file").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const item = filesRepo.find((x) => x.id === id);
      if (item) {
        item.status = "Aprobado";
        renderRepo();
        alert(Archivo "${item.name}" aprobado ✅);
      }
    })
  );

  $$(".reject-file").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const item = filesRepo.find((x) => x.id === id);
      if (item) {
        item.status = "Rechazado";
        renderRepo();
        alert(Archivo "${item.name}" rechazado ❌);
      }
    })
  );
}

// --- REPORTES CSV ----------------------------------------------------------
$("#downloadCSV").addEventListener("click", () => {
  const rows = solicitudes.map((s) => [
    s.id,
    s.title,
    s.user,
    s.status,
    s.date,
  ]);
  const csv = [["ID", "Título", "Solicitante", "Estado", "Fecha"], ...rows]
    .map((r) => r.map((c) => "${String(c).replace(/"/g, '""')}").join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "solicitudes_historico.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// --- USUARIOS --------------------------------------------------------------
function renderUsers() {
  const tbody = $("#tableUsers tbody");
  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.user}</td><td>${u.role}</td>
      <td><input type="checkbox" class="toggle-user" data-user="${u.user}" ${
      u.enabled ? "checked" : ""
    }></td>`;
    tbody.appendChild(tr);
  });

  $$(".toggle-user").forEach((cb) =>
    cb.addEventListener("change", (e) => {
      const name = e.currentTarget.dataset.user;
      const u = users.find((x) => x.user === name);
      if (u) u.enabled = e.currentTarget.checked;
    })
  );
}

// --- COMENTARIOS -----------------------------------------------------------
function handleCommentForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.timestamp = nowISO();

    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          alert("Comentario enviado. Gracias.");
          form.reset();
        } else {
          alert("Error al enviar. Guardado localmente.");
          saveLocalComment(payload);
          form.reset();
        }
      } catch (err) {
        console.error(err);
        alert("Error de red. Guardado localmente.");
        saveLocalComment(payload);
        form.reset();
      }
    } else {
      saveLocalComment(payload);
      alert("Comentario guardado localmente (LocalStorage).");
      form.reset();
    }
  });
}

function saveLocalComment(obj) {
  const key = "ganaconaval_comments_v1";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(obj);
  localStorage.setItem(key, JSON.stringify(existing));
}

$$(".comment-form").forEach((f) => handleCommentForm(f));

// --- MODAL VER SOLICITUD ---------------------------------------------------
function openViewModal(s) {
  const modal = $("#modalView");
  const div = $("#viewDetails");
  div.innerHTML = `
    <p><strong>ID:</strong> ${s.id}</p>
    <p><strong>Título:</strong> ${s.title}</p>
    <p><strong>Solicitante:</strong> ${s.user}</p>
    <p><strong>Estado:</strong> ${s.status}</p>
    <p><strong>Descripción:</strong></p>
    <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;margin-bottom:8px">
      ${s.desc || "Sin descripción"}
    </div>
    <p class="muted">Fecha de registro: ${new Date(s.date).toLocaleString()}</p>
  `;
  modal.classList.remove("hidden");
}

$("#closeViewModal").addEventListener("click", () =>
  $("#modalView").classList.add("hidden")
);
$("#modalView").addEventListener("click", (e) => {
  if (e.target.id === "modalView") $("#modalView").classList.add("hidden");
});

// --- ACCESIBILIDAD ---------------------------------------------------------
$$(".menu-item").forEach((b) => {
  b.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") b.click();
  });
});
