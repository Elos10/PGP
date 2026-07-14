const STORAGE_KEY = "pgp-semed-professores-v1";
const FIREBASE_SDK_VERSION = "10.12.5";

let remotePersistence = {
  enabled: false,
  ready: false,
  loading: false,
  saving: false,
  error: "",
  db: null,
  docRef: null,
  getDoc: null,
  setDoc: null,
  serverTimestamp: null,
  saveTimer: null
};

const defaultState = {
  session: null,
  activeView: "home",
  units: [
    { id: "u1", code: "001", name: "Escola Municipal João XXIII", region: "Norte", modality: "Ensino Fundamental", shifts: "Manhã/Tarde", rooms: 18 },
    { id: "u2", code: "002", name: "Escola Primavera", region: "Sul", modality: "Ensino Fundamental", shifts: "Manhã/Tarde", rooms: 14 },
    { id: "u3", code: "003", name: "Escola Caminho do Saber", region: "Norte", modality: "Ensino Fundamental", shifts: "Manhã/Tarde", rooms: 22 },
    { id: "u4", code: "004", name: "Escola Paulo Freire", region: "Leste", modality: "Ensino Fundamental", shifts: "Manhã/Noite", rooms: 16 }
  ],
  classes: [
    { id: "t14", unitId: "u1", year: "Maternal I", name: "A", shift: "Manhã", students: 18 },
    { id: "t15", unitId: "u1", year: "Pré I", name: "A", shift: "Tarde", students: 22 },
    { id: "t16", unitId: "u2", year: "1º Ano", name: "A", shift: "Manhã", students: 25 },
    { id: "t17", unitId: "u3", year: "3º Ano", name: "A", shift: "Tarde", students: 27 },
    { id: "t18", unitId: "u4", year: "5º Ano", name: "A", shift: "Manhã", students: 29 },
    { id: "t1", unitId: "u1", year: "6º Ano", name: "A", shift: "Manhã", students: 28 },
    { id: "t2", unitId: "u1", year: "6º Ano", name: "B", shift: "Tarde", students: 30 },
    { id: "t3", unitId: "u1", year: "7º Ano", name: "A", shift: "Manhã", students: 31 },
    { id: "t4", unitId: "u2", year: "6º Ano", name: "A", shift: "Manhã", students: 27 },
    { id: "t5", unitId: "u2", year: "6º Ano", name: "B", shift: "Tarde", students: 29 },
    { id: "t6", unitId: "u2", year: "7º Ano", name: "A", shift: "Tarde", students: 32 },
    { id: "t7", unitId: "u2", year: "8º Ano", name: "A", shift: "Manhã", students: 25 },
    { id: "t8", unitId: "u3", year: "6º Ano", name: "A", shift: "Manhã", students: 30 },
    { id: "t9", unitId: "u3", year: "7º Ano", name: "A", shift: "Tarde", students: 29 },
    { id: "t10", unitId: "u3", year: "8º Ano", name: "A", shift: "Manhã", students: 33 },
    { id: "t11", unitId: "u3", year: "9º Ano", name: "A", shift: "Tarde", students: 34 },
    { id: "t12", unitId: "u4", year: "6º Ano", name: "A", shift: "Manhã", students: 26 },
    { id: "t13", unitId: "u4", year: "7º Ano", name: "A", shift: "Noite", students: 24 }
  ],
  matrix: {
    "Maternal I": { "Regência": 24, "Português": 0, "Matemática": 0, "História": 0, "Geografia": 0, "Ciências": 0, "Inglês": 0, "Arte": 0, "Educação Física": 0 },
    "Maternal II": { "Regência": 24, "Português": 0, "Matemática": 0, "História": 0, "Geografia": 0, "Ciências": 0, "Inglês": 0, "Arte": 0, "Educação Física": 0 },
    "Pré I": { "Regência": 24, "Português": 0, "Matemática": 0, "História": 0, "Geografia": 0, "Ciências": 0, "Inglês": 0, "Arte": 0, "Educação Física": 0 },
    "Pré II": { "Regência": 24, "Português": 0, "Matemática": 0, "História": 0, "Geografia": 0, "Ciências": 0, "Inglês": 0, "Arte": 0, "Educação Física": 0 },
    "1º Ano": { "Regência": 24, "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 2, "Inglês": 0, "Arte": 2, "Educação Física": 2 },
    "2º Ano": { "Regência": 24, "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 2, "Inglês": 0, "Arte": 2, "Educação Física": 2 },
    "3º Ano": { "Regência": 24, "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 2, "Inglês": 0, "Arte": 2, "Educação Física": 2 },
    "4º Ano": { "Regência": 24, "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 2, "Inglês": 0, "Arte": 2, "Educação Física": 2 },
    "5º Ano": { "Regência": 24, "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 2, "Inglês": 0, "Arte": 2, "Educação Física": 2 },
    "6º Ano": { "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 3, "Inglês": 2, "Arte": 2, "Educação Física": 2 },
    "7º Ano": { "Português": 5, "Matemática": 5, "História": 2, "Geografia": 2, "Ciências": 3, "Inglês": 2, "Arte": 2, "Educação Física": 2 },
    "8º Ano": { "Português": 5, "Matemática": 5, "História": 3, "Geografia": 3, "Ciências": 3, "Inglês": 2, "Arte": 2, "Educação Física": 2 },
    "9º Ano": { "Português": 5, "Matemática": 5, "História": 3, "Geografia": 3, "Ciências": 3, "Inglês": 2, "Arte": 2, "Educação Física": 2 }
  },
  teachers: [
    { id: "p1", name: "Maria Oliveira", subject: "Português", modality: "RT", registration: "11021", lotationUnitId: "u3", exerciseUnitId: "u3", contractHours: 40, usedHours: 30, situation: "Ativo", bond: "Efetivo" },
    { id: "p2", name: "José Almeida", subject: "Português", modality: "RT", registration: "11022", lotationUnitId: "u3", exerciseUnitId: "u3", contractHours: 30, usedHours: 18, situation: "Ativo", bond: "Contratado" },
    { id: "p3", name: "Ana Costa", subject: "Português", modality: "RA", registration: "11023", lotationUnitId: "u2", exerciseUnitId: "u2", contractHours: 24, usedHours: 20, situation: "Ativo", bond: "Efetivo" },
    { id: "p4", name: "Carlos Nunes", subject: "Matemática", modality: "RT", registration: "12011", lotationUnitId: "u1", exerciseUnitId: "u1", contractHours: 40, usedHours: 25, situation: "Ativo", bond: "Efetivo" },
    { id: "p5", name: "Bianca Reis", subject: "Matemática", modality: "RA", registration: "12012", lotationUnitId: "u4", exerciseUnitId: "u4", contractHours: 24, usedHours: 20, situation: "Ativo", bond: "Contratado" },
    { id: "p6", name: "Rafael Lima", subject: "História", modality: "RA", registration: "13031", lotationUnitId: "u2", exerciseUnitId: "u2", contractHours: 24, usedHours: 12, situation: "Ativo", bond: "Contratado" },
    { id: "p7", name: "Cláudia Souza", subject: "Ciências", modality: "RT", registration: "14042", lotationUnitId: "u1", exerciseUnitId: "u1", contractHours: 30, usedHours: 21, situation: "Ativo", bond: "Efetivo" },
    { id: "p8", name: "Helena Duarte", subject: "Educação Física", modality: "RA", registration: "15052", lotationUnitId: "u3", exerciseUnitId: "u3", contractHours: 24, usedHours: 14, situation: "Ativo", bond: "Efetivo" },
    { id: "p9", name: "Marcos Vieira", subject: "Inglês", modality: "RA", registration: "16061", lotationUnitId: "u4", exerciseUnitId: "u4", contractHours: 24, usedHours: 16, situation: "Ativo", bond: "Contratado" },
    { id: "p10", name: "Patrícia Gomes", subject: "Arte", modality: "RA", registration: "17071", lotationUnitId: "u1", exerciseUnitId: "u1", contractHours: 24, usedHours: 14, situation: "Ativo", bond: "Efetivo" },
    { id: "p11", name: "Luciana Martins", subject: "Regência", modality: "RT", registration: "18081", lotationUnitId: "u1", exerciseUnitId: "u1", contractHours: 30, usedHours: 24, situation: "Ativo", bond: "Efetivo" },
    { id: "p12", name: "Renata Alves", subject: "Regência", modality: "RA", registration: "18082", lotationUnitId: "u2", exerciseUnitId: "u2", contractHours: 24, usedHours: 24, situation: "Ativo", bond: "Contratado" }
  ],
  distributions: [
    { id: "d1", teacherId: "p1", classId: "t8", subject: "Português", hours: 5 },
    { id: "d2", teacherId: "p1", classId: "t9", subject: "Português", hours: 5 },
    { id: "d3", teacherId: "p2", classId: "t10", subject: "Português", hours: 5 },
    { id: "d4", teacherId: "p3", classId: "t4", subject: "Português", hours: 5 },
    { id: "d5", teacherId: "p4", classId: "t1", subject: "Matemática", hours: 5 },
    { id: "d6", teacherId: "p4", classId: "t2", subject: "Matemática", hours: 5 },
    { id: "d7", teacherId: "p5", classId: "t12", subject: "Matemática", hours: 5 },
    { id: "d8", teacherId: "p6", classId: "t6", subject: "História", hours: 2 },
    { id: "d9", teacherId: "p7", classId: "t1", subject: "Ciências", hours: 3 },
    { id: "d10", teacherId: "p8", classId: "t11", subject: "Educação Física", hours: 2 }
  ],
  movements: [
    { id: "m1", date: "2026-02-15", teacher: "João Silva", origin: "Escola Municipal João XXIII", destination: "Escola Caminho do Saber", reason: "Ajuste de carga" }
  ],
  accessProfiles: [
    { id: "perfil1", name: "Administrador", description: "Acesso total ao sistema", status: "Ativo", permissions: ["dashboard", "units", "classes", "matrix", "teachers", "distributions", "needs", "equity", "suggestions", "movements", "accessProfiles"] },
    { id: "perfil2", name: "Gestor Escolar", description: "Consulta indicadores e atualiza cadastros da unidade", status: "Ativo", permissions: ["dashboard", "units", "classes", "teachers", "needs", "equity", "movements"] },
    { id: "perfil3", name: "Consulta", description: "Acesso somente aos painéis gerenciais", status: "Ativo", permissions: ["dashboard", "needs", "equity", "suggestions"] }
  ],
  users: [
    { id: "user1", name: "Administrador PGP", email: "admin@semed.local", profileId: "perfil1", status: "Ativo" }
  ],
  filters: { unit: "all", subject: "all" },
  editing: {}
};

let state = loadState();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return normalizeState(clone(defaultState));
  try {
    return normalizeState({ ...clone(defaultState), ...JSON.parse(stored) });
  } catch {
    return normalizeState(clone(defaultState));
  }
}

function normalizeState(value) {
  value.matrix = { ...clone(defaultState.matrix), ...(value.matrix || {}) };
  subjectsFromMatrix(value.matrix).forEach((subject) => {
    Object.keys(value.matrix).forEach((year) => {
      if (value.matrix[year][subject] == null) value.matrix[year][subject] = 0;
    });
  });
  value.teachers = (value.teachers || []).map((teacher) => ({
    ...teacher,
    modality: teacher.modality || (Number(teacher.contractHours) >= 30 ? "RT" : "RA")
  }));
  value.accessProfiles = value.accessProfiles || clone(defaultState.accessProfiles);
  value.users = value.users || clone(defaultState.users);
  value.filters = value.filters || { unit: "all", subject: "all" };
  value.editing = value.editing || {};
  return value;
}

function subjectsFromMatrix(matrix) {
  return [...new Set(Object.values(matrix).flatMap((row) => Object.keys(row)))];
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemoteSave();
}

function dataStateForRemote() {
  const data = clone(state);
  delete data.session;
  delete data.editing;
  return data;
}

function isFirebaseConfigured() {
  const config = window.PGP_FIREBASE_CONFIG;
  const options = window.PGP_FIREBASE_OPTIONS;
  return Boolean(
    options?.enabled &&
    config?.apiKey &&
    config?.projectId &&
    !String(config.apiKey).includes("PREENCHA") &&
    !String(config.projectId).includes("PREENCHA")
  );
}

async function initRemotePersistence() {
  if (!isFirebaseConfigured() || remotePersistence.loading || remotePersistence.ready) return;
  remotePersistence.loading = true;
  try {
    const [{ initializeApp }, authModule, firestore] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`)
    ]);
    const app = initializeApp(window.PGP_FIREBASE_CONFIG);
    const auth = authModule.getAuth(app);
    await authModule.signInAnonymously(auth);
    const db = firestore.getFirestore(app);
    const options = window.PGP_FIREBASE_OPTIONS || {};
    const docRef = firestore.doc(db, options.collection || "pgp", options.documentId || "estado-principal");
    remotePersistence = {
      ...remotePersistence,
      enabled: true,
      ready: true,
      loading: false,
      error: "",
      db,
      docRef,
      getDoc: firestore.getDoc,
      setDoc: firestore.setDoc,
      serverTimestamp: firestore.serverTimestamp
    };
    await loadRemoteState();
  } catch (error) {
    remotePersistence.loading = false;
    remotePersistence.error = "Firebase indisponível. Usando armazenamento local.";
    console.warn(remotePersistence.error, error);
  }
}

async function loadRemoteState() {
  if (!remotePersistence.ready) return;
  try {
    const snapshot = await remotePersistence.getDoc(remotePersistence.docRef);
    if (!snapshot.exists()) {
      await saveRemoteStateNow();
      return;
    }
    const remoteData = snapshot.data()?.state;
    if (!remoteData) return;
    const session = state.session;
    const editing = {};
    state = normalizeState({ ...clone(defaultState), ...remoteData, session, editing });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  } catch (error) {
    remotePersistence.error = "Não foi possível carregar os dados do Firebase.";
    console.warn(remotePersistence.error, error);
  }
}

function scheduleRemoteSave() {
  if (!remotePersistence.ready) return;
  clearTimeout(remotePersistence.saveTimer);
  remotePersistence.saveTimer = setTimeout(() => {
    saveRemoteStateNow();
  }, 650);
}

async function saveRemoteStateNow() {
  if (!remotePersistence.ready || remotePersistence.saving) return;
  remotePersistence.saving = true;
  try {
    await remotePersistence.setDoc(remotePersistence.docRef, {
      state: dataStateForRemote(),
      updatedAt: remotePersistence.serverTimestamp()
    }, { merge: true });
    remotePersistence.error = "";
  } catch (error) {
    remotePersistence.error = "Não foi possível salvar no Firebase.";
    console.warn(remotePersistence.error, error);
  } finally {
    remotePersistence.saving = false;
  }
}

function id(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function subjects() {
  return subjectsFromMatrix(state.matrix);
}

function unitName(unitId) {
  return state.units.find((unit) => unit.id === unitId)?.name || "Não informado";
}

function classLabel(classId) {
  const item = state.classes.find((klass) => klass.id === classId);
  return item ? `${unitName(item.unitId)} - ${item.year} ${item.name}` : "Turma removida";
}

function teacherName(teacherId) {
  return state.teachers.find((teacher) => teacher.id === teacherId)?.name || "Professor removido";
}

function formatHours(value) {
  return Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function moduleLabels() {
  return {
    dashboard: "Painel",
    home: "Início",
    units: "Unidades",
    classes: "Turmas",
    matrix: "Matriz",
    teachers: "Professores",
    distributions: "Distribuição",
    needs: "Necessidade",
    equity: "Equidade",
    suggestions: "Sugestões",
    movements: "Movimentações",
    accessProfiles: "Perfis de Acesso"
  };
}

function startEdit(scope, itemId) {
  state.editing = { scope, itemId };
  saveState();
  render();
}

function cancelEdit() {
  state.editing = {};
  saveState();
  render();
}

function isEditing(scope, itemId) {
  return state.editing?.scope === scope && state.editing?.itemId === itemId;
}

function updateItem(event, type, itemId, numericFields = []) {
  event.preventDefault();
  const form = new FormData(event.target);
  const item = state[type].find((record) => record.id === itemId);
  if (!item) return;
  form.forEach((value, key) => {
    item[key] = numericFields.includes(key) ? Number(value) : value;
  });
  if (type === "teachers" || type === "distributions") autoSyncTeacherHours();
  cancelEdit();
}

function autoSyncTeacherHours() {
  state.teachers = state.teachers.map((teacher) => {
    const usedHours = state.distributions
      .filter((dist) => dist.teacherId === teacher.id)
      .reduce((sum, dist) => sum + Number(dist.hours), 0);
    return { ...teacher, usedHours };
  });
}

function profileName(profileId) {
  return state.accessProfiles.find((profile) => profile.id === profileId)?.name || "Sem perfil";
}

function teacherModalities() {
  return [
    ["RA", "RA - Regente de Aula (24h semanais)"],
    ["RT", "RT - Regente de Turma (30h semanais)"]
  ];
}

function modalityLabel(value) {
  return teacherModalities().find(([key]) => key === value)?.[1] || "Não informado";
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function currentProfile() {
  return state.accessProfiles.find((profile) => profile.id === state.session?.profileId) || state.accessProfiles[0];
}

function canAccess(view) {
  if (view === "home") return true;
  const profile = currentProfile();
  return !profile || profile.permissions.includes(view);
}

function persistenceStatus() {
  if (remotePersistence.ready) return "Firebase conectado";
  if (remotePersistence.loading) return "Conectando Firebase";
  if (remotePersistence.error) return "Firebase local";
  return "Armazenamento local";
}

function subjectNeeds() {
  const rows = [];
  state.units.forEach((unit) => {
    subjects().forEach((subject) => {
      const needed = state.classes
        .filter((klass) => klass.unitId === unit.id)
        .reduce((sum, klass) => sum + (state.matrix[klass.year]?.[subject] || 0), 0);
      const assigned = state.distributions
        .filter((dist) => dist.subject === subject)
        .filter((dist) => state.classes.find((klass) => klass.id === dist.classId)?.unitId === unit.id)
        .reduce((sum, dist) => sum + Number(dist.hours), 0);
      const available = state.teachers
        .filter((teacher) => teacher.exerciseUnitId === unit.id && teacher.subject === subject)
        .reduce((sum, teacher) => sum + Number(teacher.contractHours), 0);
      rows.push({
        unitId: unit.id,
        unit: unit.name,
        region: unit.region,
        subject,
        needed,
        assigned,
        available,
        balance: available - needed,
        assignedBalance: assigned - needed,
        coverage: needed ? available / needed : 1
      });
    });
  });
  return rows;
}

function unitCoverage() {
  const network = { needed: 0, available: 0 };
  const rows = state.units.map((unit) => {
    const rows = subjectNeeds().filter((item) => item.unitId === unit.id);
    const needed = rows.reduce((sum, item) => sum + item.needed, 0);
    const available = rows.reduce((sum, item) => sum + item.available, 0);
    network.needed += needed;
    network.available += available;
    return { unitId: unit.id, unit: unit.name, region: unit.region, needed, available, coverage: needed ? available / needed : 1 };
  });
  const average = network.needed ? network.available / network.needed : 1;
  return rows.map((row) => ({ ...row, equity: row.coverage - average, average }));
}

function statusForCoverage(coverage) {
  if (coverage >= 0.95 && coverage <= 1.05) return ["Completo", "good"];
  if (coverage < 0.8) return ["Prioridade", "bad"];
  if (coverage < 0.95) return ["Déficit", "warn"];
  return ["Excesso", "bad"];
}

function statusForBalance(balance) {
  if (balance === 0) return ["Completo", "good"];
  if (balance < 0) return ["Déficit", "warn"];
  return ["Excesso", "bad"];
}

function suggestions() {
  const rows = subjectNeeds();
  const output = [];
  rows.filter((row) => row.balance < 0).forEach((deficit) => {
    let remaining = Math.abs(deficit.balance);
    const target = state.units.find((unit) => unit.id === deficit.unitId);
    const candidates = rows
      .filter((row) => row.subject === deficit.subject && row.balance > 0 && row.unitId !== deficit.unitId)
      .map((row) => ({ ...row, sameRegion: row.region === target.region }))
      .sort((a, b) => Number(b.sameRegion) - Number(a.sameRegion) || b.balance - a.balance);
    candidates.forEach((candidate) => {
      if (remaining <= 0) return;
      const amount = Math.min(remaining, candidate.balance);
      const candidateTeachers = state.teachers
        .filter((teacher) => teacher.subject === deficit.subject && teacher.exerciseUnitId === candidate.unitId)
        .sort((a, b) => (a.bond === "Contratado" ? -1 : 1) - (b.bond === "Contratado" ? -1 : 1) || (b.contractHours - b.usedHours) - (a.contractHours - a.usedHours));
      output.push({
        id: `${candidate.unitId}-${deficit.unitId}-${deficit.subject}`,
        subject: deficit.subject,
        origin: candidate.unit,
        destination: deficit.unit,
        amount,
        reason: `${candidate.sameRegion ? "Mesma região, " : ""}excesso de ${formatHours(candidate.balance)} aulas na origem e déficit de ${formatHours(Math.abs(deficit.balance))} aulas no destino.`,
        teachers: candidateTeachers.slice(0, 2).map((teacher) => teacher.name).join(", ") || "Professor a definir"
      });
      remaining -= amount;
    });
  });
  return output;
}

function setView(view) {
  state.activeView = view;
  saveState();
  render();
}

function login(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const user = form.get("user")?.trim();
  const password = form.get("password")?.trim();
  const appUser = state.users.find((item) => (item.email === user || item.name === user) && item.status === "Ativo");
  if ((appUser || user === "admin") && password === "Admin@123") {
    const profileId = appUser?.profileId || "perfil1";
    state.session = { user: appUser?.name || "Administrador PGP", userId: appUser?.id || "user1", profileId, at: new Date().toISOString() };
    state.activeView = "home";
    saveState();
    render();
    return;
  }
  document.querySelector(".login-error").textContent = "Usuário ou senha inválidos.";
}

function logout() {
  state.session = null;
  saveState();
  render();
}

function resetDemo() {
  if (!confirm("Restaurar a base de demonstração? Os cadastros atuais serão substituídos.")) return;
  state = clone(defaultState);
  state.session = { user: "Administrador PGP", userId: "user1", profileId: "perfil1", at: new Date().toISOString() };
  saveState();
  render();
}

function removeItem(type, itemId) {
  if (!confirm("Confirmar exclusão deste registro?")) return;
  state[type] = state[type].filter((item) => item.id !== itemId);
  if (type === "units") {
    state.classes = state.classes.filter((item) => item.unitId !== itemId);
    state.teachers = state.teachers.filter((item) => item.exerciseUnitId !== itemId && item.lotationUnitId !== itemId);
  }
  if (type === "classes") state.distributions = state.distributions.filter((item) => item.classId !== itemId);
  if (type === "teachers") state.distributions = state.distributions.filter((item) => item.teacherId !== itemId);
  if (type === "distributions" || type === "teachers" || type === "classes") autoSyncTeacherHours();
  saveState();
  render();
}

function addUnit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.units.push({
    id: id("u"),
    code: form.get("code"),
    name: form.get("name"),
    region: form.get("region"),
    modality: form.get("modality"),
    shifts: form.get("shifts"),
    rooms: Number(form.get("rooms"))
  });
  event.target.reset();
  saveState();
  render();
}

function addClass(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.classes.push({
    id: id("t"),
    unitId: form.get("unitId"),
    year: form.get("year"),
    name: form.get("name"),
    shift: form.get("shift"),
    students: Number(form.get("students"))
  });
  event.target.reset();
  saveState();
  render();
}

function addTeacher(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.teachers.push({
    id: id("p"),
    name: form.get("name"),
    subject: form.get("subject"),
    modality: form.get("modality"),
    registration: form.get("registration"),
    lotationUnitId: form.get("lotationUnitId"),
    exerciseUnitId: form.get("exerciseUnitId"),
    contractHours: Number(form.get("contractHours")),
    usedHours: 0,
    situation: form.get("situation"),
    bond: form.get("bond")
  });
  event.target.reset();
  saveState();
  render();
}

function updateMatrix(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  Object.keys(state.matrix).forEach((year) => {
    subjects().forEach((subject) => {
      state.matrix[year][subject] = Number(form.get(`${year}-${subject}`));
    });
  });
  state.editing = {};
  saveState();
  render();
}

function addMovement(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const teacher = state.teachers.find((item) => item.id === form.get("teacherId"));
  const origin = unitName(teacher.exerciseUnitId);
  const destination = unitName(form.get("destinationUnitId"));
  teacher.exerciseUnitId = form.get("destinationUnitId");
  state.movements.unshift({
    id: id("m"),
    date: form.get("date"),
    teacher: teacher.name,
    origin,
    destination,
    reason: form.get("reason")
  });
  saveState();
  render();
}

function addAccessProfile(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.accessProfiles.push({
    id: id("perfil"),
    name: form.get("name"),
    description: form.get("description"),
    status: form.get("status"),
    permissions: form.getAll("permissions")
  });
  event.target.reset();
  saveState();
  render();
}

function updateAccessProfile(event, profileId) {
  event.preventDefault();
  const form = new FormData(event.target);
  const profile = state.accessProfiles.find((item) => item.id === profileId);
  if (!profile) return;
  profile.name = form.get("name");
  profile.description = form.get("description");
  profile.status = form.get("status");
  profile.permissions = form.getAll("permissions");
  cancelEdit();
}

function addUser(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.users.push({
    id: id("user"),
    name: form.get("name"),
    email: form.get("email"),
    profileId: form.get("profileId"),
    status: form.get("status")
  });
  event.target.reset();
  saveState();
  render();
}

function applyModalityHours(selectElement) {
  const form = selectElement.form || selectElement.closest("form");
  const input = form?.querySelector('[name="contractHours"]');
  if (!input) return;
  input.value = selectElement.value === "RT" ? 30 : 24;
}

function autoDistribute() {
  const newDistributions = [];
  const teacherHours = Object.fromEntries(state.teachers.map((teacher) => [teacher.id, 0]));
  state.classes.forEach((klass) => {
    subjects().forEach((subject) => {
      let needed = state.matrix[klass.year]?.[subject] || 0;
      const teachers = state.teachers
        .filter((teacher) => teacher.subject === subject && teacher.exerciseUnitId === klass.unitId)
        .sort((a, b) => (teacherHours[a.id] || 0) - (teacherHours[b.id] || 0));
      teachers.forEach((teacher) => {
        if (needed <= 0) return;
        const free = Number(teacher.contractHours) - (teacherHours[teacher.id] || 0);
        if (free <= 0) return;
        const amount = Math.min(free, needed);
        newDistributions.push({ id: id("d"), teacherId: teacher.id, classId: klass.id, subject, hours: amount });
        teacherHours[teacher.id] += amount;
        needed -= amount;
      });
    });
  });
  state.distributions = newDistributions;
  state.teachers = state.teachers.map((teacher) => ({ ...teacher, usedHours: teacherHours[teacher.id] || 0 }));
  saveState();
  render();
}

function applySuggestion(index) {
  const item = suggestions()[index];
  const teacher = state.teachers.find((candidate) => candidate.subject === item.subject && unitName(candidate.exerciseUnitId) === item.origin);
  const destination = state.units.find((unit) => unit.name === item.destination);
  if (!teacher || !destination) return;
  const origin = unitName(teacher.exerciseUnitId);
  teacher.exerciseUnitId = destination.id;
  state.movements.unshift({
    id: id("m"),
    date: new Date().toISOString().slice(0, 10),
    teacher: teacher.name,
    origin,
    destination: destination.name,
    reason: `Sugestão inteligente: ${formatHours(item.amount)} aulas de ${item.subject}`
  });
  saveState();
  render();
}

function layout(title, subtitle, content, options = {}) {
  const navItems = [
    ["home", "Início"],
    ["dashboard", "Painel"],
    ["units", "Unidades"],
    ["classes", "Turmas"],
    ["matrix", "Matriz"],
    ["teachers", "Professores"],
    ["distributions", "Distribuição"],
    ["needs", "Necessidade"],
    ["equity", "Equidade"],
    ["suggestions", "Sugestões"],
    ["movements", "Movimentações"],
    ["accessProfiles", "Perfis de Acesso"]
  ].filter(([view]) => canAccess(view));
  if (!canAccess(state.activeView)) state.activeView = "home";
  return `
    <section class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">PGP</div>
          <div><strong>PGP SEMED</strong><span>Controle docente</span></div>
        </div>
        <nav class="nav">
          ${navItems.map(([view, label]) => `<button class="${state.activeView === view ? "active" : ""}" onclick="setView('${view}')">${label}</button>`).join("")}
        </nav>
        <div class="sidebar-footer">
          <span>${state.session?.user || ""}<br />${profileName(state.session?.profileId)}<br />${persistenceStatus()}</span>
          <button class="ghost-btn" onclick="resetDemo()">Restaurar demo</button>
          <button class="danger-btn" onclick="logout()">Sair</button>
        </div>
      </aside>
      <section class="content">
        ${options.hideTopbar ? "" : `<header class="topbar">
          <div>
            <h1>${title}</h1>
            <p>${subtitle}</p>
          </div>
          <div class="toolbar">
            <select onchange="state.filters.unit=this.value;saveState();render()">
              <option value="all">Todas as unidades</option>
              ${state.units.map((unit) => `<option value="${unit.id}" ${state.filters.unit === unit.id ? "selected" : ""}>${unit.name}</option>`).join("")}
            </select>
            <select onchange="state.filters.subject=this.value;saveState();render()">
              <option value="all">Todas as disciplinas</option>
              ${subjects().map((subject) => `<option value="${subject}" ${state.filters.subject === subject ? "selected" : ""}>${subject}</option>`).join("")}
            </select>
          </div>
        </header>`}
        ${content}
      </section>
    </section>
  `;
}

function renderLogin() {
  return `
    <section class="login-shell">
      <form class="login-card" onsubmit="login(event)">
        <div class="login-logo-panel">
          <img src="assets/logo_semed.jpeg" alt="Secretaria de Educação - Governo Municipal de Uberaba" />
        </div>
        <h1>SISTEMA DE GERENCIAMENTO DE PROFESSORES</h1>
        <p class="login-subtitle">Sistema web da Secretaria Municipal de Educação para controle de necessidade docente, matriz curricular, distribuição de aulas e movimentações.</p>
        <div class="field">
          <label for="user">E-mail</label>
          <input id="user" name="user" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required />
        </div>
        <p class="login-error"></p>
        <button class="primary-btn" type="submit">Entrar</button>
        <div class="demo-access">
          <strong>Acesso de demonstração</strong><br />
          Usuário: admin@semed.local<br />
          Senha: Admin@123
        </div>
      </form>
    </section>
  `;
}

function homeView() {
  return layout("", "", `
    <section class="welcome-screen">
      <div class="welcome-shapes" aria-hidden="true">
        <span class="shape circle left"></span>
        <span class="shape triangle green"></span>
        <span class="shape triangle blue"></span>
        <span class="shape circle right"></span>
      </div>
      <article class="welcome-card">
        <h1>SEMED PGP</h1>
        <p>Selecione uma opção no menu principal para iniciar.</p>
      </article>
      <div class="welcome-watermark" aria-hidden="true">
        <strong>SEMED</strong>
        <span>Sistema de</span>
        <em>GESTÃO DE PROFESSORES</em>
      </div>
    </section>
  `, { hideTopbar: true });
}

function dashboard() {
  const needs = subjectNeeds();
  const coverage = unitCoverage();
  const totalNeeded = needs.reduce((sum, row) => sum + row.needed, 0);
  const totalAvailable = needs.reduce((sum, row) => sum + row.available, 0);
  const deficits = needs.filter((row) => row.balance < 0).reduce((sum, row) => sum + Math.abs(row.balance), 0);
  const excess = needs.filter((row) => row.balance > 0).reduce((sum, row) => sum + row.balance, 0);
  const worst = [...coverage].sort((a, b) => a.coverage - b.coverage).slice(0, 5);
  const byRegion = Object.values(coverage.reduce((acc, row) => {
    acc[row.region] ||= { region: row.region, needed: 0, available: 0 };
    acc[row.region].needed += row.needed;
    acc[row.region].available += row.available;
    return acc;
  }, {}));
  return layout("Painel gerencial", "Indicadores consolidados de necessidade, cobertura, déficit, excedente e equidade da rede.", `
    <section class="kpi-grid">
      <article class="kpi"><span>Horas necessárias</span><strong>${formatHours(totalNeeded)}</strong></article>
      <article class="kpi"><span>Horas contratadas</span><strong>${formatHours(totalAvailable)}</strong></article>
      <article class="kpi"><span>Déficit total</span><strong>${formatHours(deficits)}</strong></article>
      <article class="kpi"><span>Excedente total</span><strong>${formatHours(excess)}</strong></article>
    </section>
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header"><h2>Escolas abaixo da média</h2><span class="status neutral">Cobertura da rede: ${formatHours((totalAvailable / totalNeeded) * 100)}%</span></div>
        ${table(["Unidade", "Região", "Necessidade", "Disponível", "Cobertura", "Situação"], worst.map((row) => {
          const [label, tone] = statusForCoverage(row.coverage);
          return [row.unit, row.region, formatHours(row.needed), formatHours(row.available), coverageBar(row.coverage), `<span class="status ${tone}">${label}</span>`];
        }))}
      </article>
      <article class="panel">
        <div class="panel-header"><h2>Cobertura por região</h2></div>
        ${table(["Região", "Cobertura", "Saldo"], byRegion.map((row) => {
          const rate = row.needed ? row.available / row.needed : 1;
          return [row.region, coverageBar(rate), formatHours(row.available - row.needed)];
        }))}
      </article>
    </section>
  `);
}

function unitsView() {
  return layout("Unidades escolares", "Cadastro das escolas com região, modalidade, turnos e número de salas.", `
    <section class="panel">
      <form class="form-grid" onsubmit="addUnit(event)">
        ${input("Código", "code", "001")}
        ${input("Nome", "name", "Escola Municipal", "span-2")}
        ${input("Região", "region", "Norte")}
        ${input("Modalidade", "modality", "Ensino Fundamental")}
        ${input("Turnos", "shifts", "Manhã/Tarde")}
        ${input("Número de salas", "rooms", "18", "", "number")}
        <button class="primary-btn" type="submit">Adicionar unidade</button>
      </form>
      <div class="cards">
        ${state.units.map((unit) => `
          <article class="record-card">
            ${isEditing("units", unit.id) ? `
              <form class="form-grid" onsubmit="updateItem(event,'units','${unit.id}', ['rooms'])">
                ${editInput("Código", "code", unit.code)}
                ${editInput("Nome", "name", unit.name, "span-2")}
                ${editInput("Região", "region", unit.region)}
                ${editInput("Modalidade", "modality", unit.modality)}
                ${editInput("Turnos", "shifts", unit.shifts)}
                ${editInput("Número de salas", "rooms", unit.rooms, "", "number")}
                <div class="actions"><button class="primary-btn" type="submit">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>
              </form>
            ` : `
              <h3>${unit.code} - ${unit.name}</h3>
              <div class="meta">Região: ${unit.region}<br />Modalidade: ${unit.modality}<br />Turnos: ${unit.shifts}<br />Salas: ${unit.rooms}</div>
              <div class="actions"><button class="ghost-btn" onclick="startEdit('units','${unit.id}')">Editar</button><button class="danger-btn" onclick="removeItem('units','${unit.id}')">Excluir</button></div>
            `}
          </article>
        `).join("")}
      </div>
    </section>
  `);
}

function classesView() {
  return layout("Turmas", "Cadastro das turmas vinculadas às unidades escolares.", `
    <section class="panel">
      <form class="form-grid" onsubmit="addClass(event)">
        ${select("Unidade", "unitId", state.units.map((unit) => [unit.id, unit.name]), "", "span-2")}
        ${select("Ano", "year", Object.keys(state.matrix).map((year) => [year, year]))}
        ${input("Turma", "name", "A")}
        ${select("Turno", "shift", [["Manhã", "Manhã"], ["Tarde", "Tarde"], ["Noite", "Noite"]])}
        ${input("Nº de alunos", "students", "28", "", "number")}
        <button class="primary-btn" type="submit">Adicionar turma</button>
      </form>
      ${table(["Unidade", "Ano", "Turma", "Turno", "Alunos", "Ações"], state.classes.map((klass) => isEditing("classes", klass.id) ? [
        `<form id="edit-${klass.id}" onsubmit="updateItem(event,'classes','${klass.id}', ['students'])"></form>${editSelect("Unidade", "unitId", state.units.map((unit) => [unit.id, unit.name]), klass.unitId, "", `form="edit-${klass.id}"`)}`,
        editSelect("Ano", "year", Object.keys(state.matrix).map((year) => [year, year]), klass.year, "", `form="edit-${klass.id}"`),
        editInput("Turma", "name", klass.name, "", "text", `form="edit-${klass.id}"`),
        editSelect("Turno", "shift", [["Manhã", "Manhã"], ["Tarde", "Tarde"], ["Noite", "Noite"]], klass.shift, "", `form="edit-${klass.id}"`),
        editInput("Alunos", "students", klass.students, "", "number", `form="edit-${klass.id}"`),
        `<div class="actions"><button class="primary-btn" type="submit" form="edit-${klass.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
      ] : [unitName(klass.unitId), klass.year, klass.name, klass.shift, klass.students, `<div class="actions"><button class="ghost-btn" onclick="startEdit('classes','${klass.id}')">Editar</button><button class="danger-btn" onclick="removeItem('classes','${klass.id}')">Excluir</button></div>`]))}
    </section>
  `);
}

function matrixView() {
  const editing = isEditing("matrix", "all");
  const rows = Object.entries(state.matrix).map(([year, values]) => [year, ...subjects().map((subject) => editing ? `<input type="number" name="${year}-${subject}" value="${values[subject] || 0}" min="0" />` : values[subject] || 0)]);
  return layout("Matriz curricular", "Tabela fixa que define a quantidade de aulas de cada disciplina por ano.", `
    <section class="panel">
      <form onsubmit="updateMatrix(event)">
        ${table(["Ano", ...subjects()], rows)}
        <br />
        ${editing ? `<div class="actions"><button class="primary-btn" type="submit">Salvar matriz</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>` : `<button class="ghost-btn" type="button" onclick="startEdit('matrix','all')">Editar matriz</button>`}
      </form>
    </section>
  `);
}

function teachersView() {
  return layout("Professores", "Cadastro de docentes, vínculo, lotação, exercício, carga contratada e horas utilizadas.", `
    <section class="panel">
      <div class="panel-header">
        <h2>Modalidades operacionais</h2>
      </div>
      <div class="cards">
        <article class="record-card"><h3>RA - Regente de Aula</h3><div class="meta">Regime de Regência de Aula, geralmente atrelado a jornada de 24 horas semanais, com foco na atuação direta em sala.</div></article>
        <article class="record-card"><h3>RT - Regente de Turma</h3><div class="meta">Regime de Regência de Turma, com jornada semanal de 30 horas, contemplando sala de aula, planejamento e reuniões pedagógicas.</div></article>
      </div>
      <br />
      <form class="form-grid" onsubmit="addTeacher(event)">
        ${input("Nome", "name", "Nome do professor")}
        ${select("Disciplina", "subject", subjects().map((subject) => [subject, subject]))}
        ${select("Modalidade", "modality", teacherModalities(), "RA", "", `onchange="applyModalityHours(this)"`)}
        ${input("Matrícula", "registration", "00000")}
        ${select("Unidade de lotação", "lotationUnitId", state.units.map((unit) => [unit.id, unit.name]))}
        ${select("Unidade de exercício", "exerciseUnitId", state.units.map((unit) => [unit.id, unit.name]))}
        ${input("Carga horária", "contractHours", "24", "", "number")}
        ${select("Situação", "situation", [["Ativo", "Ativo"], ["Afastado", "Afastado"], ["Licença", "Licença"]])}
        ${select("Vínculo", "bond", [["Efetivo", "Efetivo"], ["Contratado", "Contratado"]])}
        <button class="primary-btn" type="submit">Adicionar professor</button>
      </form>
      ${table(["Nome", "Disciplina", "Modalidade", "Matrícula", "Lotação", "Exercício", "Carga", "Disponível", "Situação", "Vínculo", "Ações"], state.teachers.map((teacher) => isEditing("teachers", teacher.id) ? [
        `<form id="edit-${teacher.id}" onsubmit="updateItem(event,'teachers','${teacher.id}', ['contractHours'])"></form>${editInput("Nome", "name", teacher.name, "", "text", `form="edit-${teacher.id}"`)}`,
        editSelect("Disciplina", "subject", subjects().map((subject) => [subject, subject]), teacher.subject, "", `form="edit-${teacher.id}"`),
        editSelect("Modalidade", "modality", teacherModalities(), teacher.modality, "", `form="edit-${teacher.id}" onchange="applyModalityHours(this)"`),
        editInput("Matrícula", "registration", teacher.registration, "", "text", `form="edit-${teacher.id}"`),
        editSelect("Lotação", "lotationUnitId", state.units.map((unit) => [unit.id, unit.name]), teacher.lotationUnitId, "", `form="edit-${teacher.id}"`),
        editSelect("Exercício", "exerciseUnitId", state.units.map((unit) => [unit.id, unit.name]), teacher.exerciseUnitId, "", `form="edit-${teacher.id}"`),
        editInput("Carga", "contractHours", teacher.contractHours, "", "number", `form="edit-${teacher.id}"`),
        formatHours(teacher.contractHours - teacher.usedHours),
        editSelect("Situação", "situation", [["Ativo", "Ativo"], ["Afastado", "Afastado"], ["Licença", "Licença"]], teacher.situation, "", `form="edit-${teacher.id}"`),
        editSelect("Vínculo", "bond", [["Efetivo", "Efetivo"], ["Contratado", "Contratado"]], teacher.bond, "", `form="edit-${teacher.id}"`),
        `<div class="actions"><button class="primary-btn" type="submit" form="edit-${teacher.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
      ] : [
        teacher.name,
        teacher.subject,
        modalityLabel(teacher.modality),
        teacher.registration,
        unitName(teacher.lotationUnitId),
        unitName(teacher.exerciseUnitId),
        formatHours(teacher.contractHours),
        formatHours(teacher.contractHours - teacher.usedHours),
        teacher.situation,
        teacher.bond,
        `<div class="actions"><button class="ghost-btn" onclick="startEdit('teachers','${teacher.id}')">Editar</button><button class="danger-btn" onclick="removeItem('teachers','${teacher.id}')">Excluir</button></div>`
      ]))}
    </section>
  `);
}

function needsView() {
  const rows = subjectNeeds()
    .filter((row) => state.filters.unit === "all" || row.unitId === state.filters.unit)
    .filter((row) => state.filters.subject === "all" || row.subject === state.filters.subject);
  return layout("Painel de necessidade", "Necessidade por disciplina calculada automaticamente: quantidade de turmas multiplicada pela matriz curricular.", `
    <section class="panel">
      <div class="panel-header">
        <h2>Necessidade, lotados e saldo</h2>
        <button class="primary-btn" onclick="autoDistribute()">Gerar distribuição automática</button>
      </div>
      ${table(["Unidade", "Disciplina", "Necessidade", "Aulas atribuídas", "Horas lotadas", "Saldo", "Status"], rows.map((row) => {
        const [label, tone] = statusForBalance(row.balance);
        return [row.unit, row.subject, formatHours(row.needed), formatHours(row.assigned), formatHours(row.available), formatHours(row.balance), `<span class="status ${tone}">${label}</span>`];
      }))}
    </section>
  `);
}

function equityView() {
  const rows = unitCoverage().sort((a, b) => a.coverage - b.coverage);
  return layout("Controle de equidade", "Índice de cobertura e diferença em relação à média da rede para priorizar decisões transparentes.", `
    <section class="panel">
      ${table(["Unidade", "Região", "Horas necessárias", "Horas atendidas", "Cobertura", "Equidade", "Prioridade"], rows.map((row) => {
        const [label, tone] = statusForCoverage(row.coverage);
        return [row.unit, row.region, formatHours(row.needed), formatHours(row.available), coverageBar(row.coverage), `${row.equity >= 0 ? "+" : ""}${formatHours(row.equity * 100)} p.p.`, `<span class="status ${tone}">${label}</span>`];
      }))}
    </section>
  `);
}

function suggestionsView() {
  const items = suggestions();
  return layout("Sugestão inteligente", "Indicações automáticas com prioridade por mesma região, carga disponível, excedente e vínculo.", `
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header"><h2>Sugestões de movimentação</h2></div>
        ${items.length ? items.map((item, index) => `
          <div class="suggestion">
            <strong>${item.subject}: ${item.origin} → ${item.destination}</strong>
            Transferir até ${formatHours(item.amount)} aulas. Candidatos: ${item.teachers}.<br />
            <span class="meta">${item.reason}</span><br /><br />
            <button class="primary-btn" onclick="applySuggestion(${index})">Aplicar sugestão</button>
          </div>
        `).join("") : `<div class="empty">Nenhuma sugestão necessária com os dados atuais.</div>`}
      </article>
      <article class="panel">
        <h2>Critérios aplicados</h2>
        <p class="meta">O sistema prioriza professores da mesma região, carga incompleta, maior excesso disponível, contratados antes dos efetivos e menor impacto nas unidades que já estão equilibradas.</p>
      </article>
    </section>
  `);
}

function movementsView() {
  return layout("Movimentações", "Histórico permanente de alterações de exercício, com origem, destino, data e motivo.", `
    <section class="panel">
      <form class="form-grid" onsubmit="addMovement(event)">
        ${input("Data", "date", new Date().toISOString().slice(0, 10), "", "date")}
        ${select("Professor", "teacherId", state.teachers.map((teacher) => [teacher.id, `${teacher.name} - ${teacher.subject}`]), "", "span-2")}
        ${select("Destino", "destinationUnitId", state.units.map((unit) => [unit.id, unit.name]), "", "span-2")}
        ${input("Motivo", "reason", "Ajuste de carga")}
        <button class="primary-btn" type="submit">Registrar movimentação</button>
      </form>
      ${table(["Data", "Professor", "Origem", "Destino", "Motivo", "Ações"], state.movements.map((movement) => isEditing("movements", movement.id) ? [
        `<form id="edit-${movement.id}" onsubmit="updateItem(event,'movements','${movement.id}')"></form>${editInput("Data", "date", movement.date, "", "date", `form="edit-${movement.id}"`)}`,
        editInput("Professor", "teacher", movement.teacher, "", "text", `form="edit-${movement.id}"`),
        editInput("Origem", "origin", movement.origin, "", "text", `form="edit-${movement.id}"`),
        editInput("Destino", "destination", movement.destination, "", "text", `form="edit-${movement.id}"`),
        editInput("Motivo", "reason", movement.reason, "", "text", `form="edit-${movement.id}"`),
        `<div class="actions"><button class="primary-btn" type="submit" form="edit-${movement.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
      ] : [movement.date.split("-").reverse().join("/"), movement.teacher, movement.origin, movement.destination, movement.reason, `<div class="actions"><button class="ghost-btn" onclick="startEdit('movements','${movement.id}')">Editar</button><button class="danger-btn" onclick="removeItem('movements','${movement.id}')">Excluir</button></div>`]))}
    </section>
  `);
}

function distributionsView() {
  return layout("Distribuição das aulas", "Aulas atribuídas aos professores até completar a carga contratada.", `
    <section class="panel">
      <div class="panel-header"><h2>Distribuição atual</h2><button class="primary-btn" onclick="autoDistribute()">Recalcular</button></div>
      ${table(["Professor", "Turma", "Disciplina", "Aulas", "Ações"], state.distributions.map((dist) => isEditing("distributions", dist.id) ? [
        `<form id="edit-${dist.id}" onsubmit="updateItem(event,'distributions','${dist.id}', ['hours'])"></form>${editSelect("Professor", "teacherId", state.teachers.map((teacher) => [teacher.id, `${teacher.name} - ${teacher.subject}`]), dist.teacherId, "", `form="edit-${dist.id}"`)}`,
        editSelect("Turma", "classId", state.classes.map((klass) => [klass.id, `${unitName(klass.unitId)} - ${klass.year} ${klass.name}`]), dist.classId, "", `form="edit-${dist.id}"`),
        editSelect("Disciplina", "subject", subjects().map((subject) => [subject, subject]), dist.subject, "", `form="edit-${dist.id}"`),
        editInput("Aulas", "hours", dist.hours, "", "number", `form="edit-${dist.id}"`),
        `<div class="actions"><button class="primary-btn" type="submit" form="edit-${dist.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
      ] : [teacherName(dist.teacherId), classLabel(dist.classId), dist.subject, formatHours(dist.hours), `<div class="actions"><button class="ghost-btn" onclick="startEdit('distributions','${dist.id}')">Editar</button><button class="danger-btn" onclick="removeItem('distributions','${dist.id}')">Excluir</button></div>`]))}
    </section>
  `);
}

function accessProfilesView() {
  const labels = moduleLabels();
  return layout("Perfis de Acesso", "Cadastro de perfis, permissões por módulo e usuários vinculados ao sistema.", `
    <section class="access-layout">
      <article class="panel">
        <div class="panel-header profile-heading">
          <div>
            <h2>Perfis</h2>
            <p>Defina o nome, status e os módulos liberados para cada tipo de acesso.</p>
          </div>
        </div>
        <form class="profile-builder" onsubmit="addAccessProfile(event)">
          <div class="profile-form-card">
            ${input("Nome do perfil", "name", "Gestor")}
            ${input("Descrição", "description", "Permissões do perfil")}
            ${select("Status", "status", [["Ativo", "Ativo"], ["Inativo", "Inativo"]])}
            <button class="primary-btn" type="submit">Adicionar perfil</button>
          </div>
          <div class="permission-card">
            <div class="permission-title">
              <strong>Permissões</strong>
              <span>Marque os módulos que este perfil poderá acessar.</span>
            </div>
            ${permissionChecklist([])}
          </div>
        </form>
        ${table(["Perfil", "Descrição", "Status", "Permissões", "Ações"], state.accessProfiles.map((profile) => isEditing("accessProfiles", profile.id) ? [
          `<form id="edit-${profile.id}" onsubmit="updateAccessProfile(event,'${profile.id}')"></form>${editInput("Perfil", "name", profile.name, "", "text", `form="edit-${profile.id}"`)}`,
          editInput("Descrição", "description", profile.description, "", "text", `form="edit-${profile.id}"`),
          editSelect("Status", "status", [["Ativo", "Ativo"], ["Inativo", "Inativo"]], profile.status, "", `form="edit-${profile.id}"`),
          permissionChecklist(profile.permissions, `form="edit-${profile.id}"`),
          `<div class="actions"><button class="primary-btn" type="submit" form="edit-${profile.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
        ] : [
          profile.name,
          profile.description,
          `<span class="status ${profile.status === "Ativo" ? "good" : "neutral"}">${profile.status}</span>`,
          profile.permissions.map((key) => labels[key] || key).join(", "),
          `<div class="actions"><button class="ghost-btn" onclick="startEdit('accessProfiles','${profile.id}')">Editar</button><button class="danger-btn" onclick="removeItem('accessProfiles','${profile.id}')">Excluir</button></div>`
        ]))}
      </article>
      <article class="panel">
        <div class="panel-header"><h2>Usuários</h2></div>
        <form class="form-grid" onsubmit="addUser(event)">
          ${input("Nome", "name", "Nome do usuário")}
          ${input("E-mail / login", "email", "usuario@semed.local")}
          ${select("Perfil", "profileId", state.accessProfiles.map((profile) => [profile.id, profile.name]))}
          ${select("Status", "status", [["Ativo", "Ativo"], ["Inativo", "Inativo"]])}
          <button class="primary-btn" type="submit">Adicionar usuário</button>
        </form>
        ${table(["Nome", "Login", "Perfil", "Status", "Ações"], state.users.map((user) => isEditing("users", user.id) ? [
          `<form id="edit-${user.id}" onsubmit="updateItem(event,'users','${user.id}')"></form>${editInput("Nome", "name", user.name, "", "text", `form="edit-${user.id}"`)}`,
          editInput("Login", "email", user.email, "", "email", `form="edit-${user.id}"`),
          editSelect("Perfil", "profileId", state.accessProfiles.map((profile) => [profile.id, profile.name]), user.profileId, "", `form="edit-${user.id}"`),
          editSelect("Status", "status", [["Ativo", "Ativo"], ["Inativo", "Inativo"]], user.status, "", `form="edit-${user.id}"`),
          `<div class="actions"><button class="primary-btn" type="submit" form="edit-${user.id}">Salvar</button><button class="ghost-btn" type="button" onclick="cancelEdit()">Cancelar</button></div>`
        ] : [
          user.name,
          user.email,
          profileName(user.profileId),
          `<span class="status ${user.status === "Ativo" ? "good" : "neutral"}">${user.status}</span>`,
          `<div class="actions"><button class="ghost-btn" onclick="startEdit('users','${user.id}')">Editar</button><button class="danger-btn" onclick="removeItem('users','${user.id}')">Excluir</button></div>`
        ]))}
      </article>
    </section>
  `);
}

function table(headers, rows) {
  if (!rows.length) return `<div class="empty">Nenhum registro encontrado.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function input(label, name, placeholder, className = "", type = "text") {
  return `<div class="field ${className}"><label>${label}</label><input name="${name}" type="${type}" placeholder="${placeholder}" value="${type === "date" ? placeholder : ""}" ${type === "number" ? "min='0'" : ""} required /></div>`;
}

function select(label, name, options, selected = "", className = "", extraAttrs = "") {
  return `<div class="field ${className}"><label>${label}</label><select name="${name}" ${extraAttrs} required>${options.map(([value, text]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${text}</option>`).join("")}</select></div>`;
}

function editInput(label, name, value, className = "", type = "text", extraAttrs = "") {
  return `<div class="field compact ${className}"><label>${label}</label><input name="${name}" type="${type}" value="${esc(value)}" ${type === "number" ? "min='0'" : ""} ${extraAttrs} required /></div>`;
}

function editSelect(label, name, options, selected = "", className = "", extraAttrs = "") {
  return `<div class="field compact ${className}"><label>${label}</label><select name="${name}" ${extraAttrs} required>${options.map(([value, text]) => `<option value="${esc(value)}" ${selected === value ? "selected" : ""}>${text}</option>`).join("")}</select></div>`;
}

function permissionChecklist(selected = [], extraAttrs = "") {
  const labels = moduleLabels();
  return `<div class="permission-grid">${Object.entries(labels).map(([key, label]) => `
    <label class="check-line">
      <input type="checkbox" name="permissions" value="${key}" ${selected.includes(key) ? "checked" : ""} ${extraAttrs} />
      <span>${label}</span>
    </label>
  `).join("")}</div>`;
}

function coverageBar(value) {
  const tone = value < 0.8 ? "bad" : value < 0.95 ? "warn" : "";
  return `<div>${formatHours(value * 100)}%</div><div class="bar ${tone}"><span style="width:${Math.min(value * 100, 125)}%"></span></div>`;
}

function render() {
  const app = document.getElementById("app");
  if (!state.session) {
    app.innerHTML = renderLogin();
    return;
  }
  const views = {
    home: homeView,
    dashboard,
    units: unitsView,
    classes: classesView,
    matrix: matrixView,
    teachers: teachersView,
    needs: needsView,
    equity: equityView,
    suggestions: suggestionsView,
    movements: movementsView,
    distributions: distributionsView,
    accessProfiles: accessProfilesView
  };
  app.innerHTML = (views[state.activeView] || dashboard)();
}

render();
initRemotePersistence();
