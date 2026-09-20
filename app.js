let lessons = [];
let resourceLibraries = [];
let currentLessonId = "";
let activeFileUrl = "";
let selectedClassFile = null;
let fullscreenHistoryActive = false;
let fullscreenClosedByBack = false;

const MATERIAL_DB_NAME = "learnbridge-materials";
const MATERIAL_STORE_NAME = "materials";
const MAX_MATERIAL_SIZE = 25 * 1024 * 1024;

const resourceCategories = [
  {
    id: "burmese-reading",
    title: "Burmese reading",
    description: "Levelled picture books for beginning and developing readers. Download selected books while connected, then add the saved PDF to Teaching Desk.",
    subjects: ["Burmese", "Literacy", "Ages 5+"],
    links: [
      { label: "Browse Burmese books", url: "https://content.digitallibrary.io/bur/topic/library-books/" },
    ],
    offline: "Download individual books as PDFs",
    license: "Creative Commons; check each book",
  },
  {
    id: "english-reading",
    title: "English reading",
    description: "Illustrated stories organised by reading ability rather than age. Start with Level 1 and move up when reading feels comfortable.",
    subjects: ["English", "Literacy", "Levels 1-4"],
    links: [
      { label: "Browse StoryWeaver", url: "https://storyweaver.org.in/en/" },
      { label: "Understand reading levels", url: "https://storyweaver.org.in/en/reading-levels" },
    ],
    offline: "Download selected stories before class",
    license: "Stories: CC BY 4.0; media may differ",
  },
  {
    id: "practical-maths",
    title: "Practical mathematics",
    description: "Downloadable curriculum and worksheets for counting, arithmetic, measurement, money, and problem-solving.",
    subjects: ["Math", "Preschool-Grade 8"],
    links: [
      { label: "Core Knowledge maths", url: "https://www.coreknowledge.org/mathematics/" },
      { label: "Download free curriculum", url: "https://www.coreknowledge.org/download-free-curriculum/" },
    ],
    offline: "Download units or worksheets as PDFs",
    license: "Mostly CC BY-NC-SA; check each unit",
  },
  {
    id: "practical-japanese",
    title: "Practical Japanese",
    description: "A structured path for communication in daily life and work. Download individual lessons instead of the full course when device storage is limited.",
    subjects: ["Japanese", "Daily life", "A1-B1"],
    links: [
      { label: "Download Irodori lessons", url: "https://www.irodori.jpf.go.jp/en/starter/pdf.html" },
      { label: "Browse Minato courses", url: "https://minato-jf.jp/" },
    ],
    offline: "Irodori lesson PDFs and MP3 audio",
    license: "Free materials; follow Japan Foundation terms",
  },
  {
    id: "science-explorer",
    title: "Science explorer",
    description: "Interactive experiments for maths and science. Download individual HTML5 simulations on a connected device before using them offline.",
    subjects: ["Science", "Math", "Elementary+"],
    links: [
      { label: "Browse PhET simulations", url: "https://phet.colorado.edu/en/simulations/filter?type=html" },
      { label: "PhET offline access", url: "https://phet.colorado.edu/en/offline-access" },
    ],
    offline: "Download individual HTML5 simulations",
    license: "CC BY-NC 4.0 for regular simulations",
  },
  {
    id: "offline-platforms",
    title: "Larger offline libraries",
    description: "For schools or learning centres that need a much larger collection, install a dedicated offline platform alongside LearnBridge.",
    subjects: ["Learning centres", "Many subjects"],
    links: [
      { label: "Learn about Kolibri", url: "https://learningequality.org/kolibri/" },
      { label: "Learn about Kiwix", url: "https://www.kiwix.org/en/" },
    ],
    offline: "Separate installation and content download",
    license: "Content licences vary by collection",
  },
];

const homeLearningPaths = [
  {
    id: "reading-together",
    title: "Reading together",
    ages: ["5-7", "8-11"],
    description: "Build a reading habit with short stories, picture talk, new words, and simple retelling.",
    routine: "Read together, ask one question, draw or write one idea, and revisit new words.",
  },
  {
    id: "maths-at-home",
    title: "Maths with everyday objects",
    ages: ["5-7", "8-11", "12+"],
    description: "Practice counting, arithmetic, money, measurement, and problem-solving with objects at home.",
    routine: "Choose one practical problem, solve it together, and let the learner explain the answer.",
  },
  {
    id: "language-building",
    title: "Everyday language",
    ages: ["5-7", "8-11", "12+"],
    description: "Practice useful English or Thai words through conversation, labels, drawing, and repetition.",
    routine: "Learn five useful words, use them in short sentences, and review them the next day.",
  },
  {
    id: "curious-learning",
    title: "Science and curiosity",
    ages: ["8-11", "12+"],
    description: "Explore weather, plants, water, health, and the local environment through observation.",
    routine: "Observe something nearby, write or draw what changed, and discuss why it may have happened.",
  },
];

const INDEPENDENT_SUBJECTS = ["Math", "Thai language", "Japanese", "Literacy", "English"];

const translations = {
  en: {
    welcome: "Welcome",
    complete: "activities complete",
    saved: "Saved on this device",
    correct: "Correct. Privacy keeps children safer.",
    incorrect: "Try again. The safest answer avoids private identity details.",
  },
  my: {
    welcome: "Mingalaba",
    complete: "activities complete",
    saved: "Saved on this device",
    correct: "Correct. Privacy keeps children safer.",
    incorrect: "Try again. The safest answer avoids private identity details.",
  },
  rhg: {
    welcome: "Welcome",
    complete: "activities complete",
    saved: "Saved on this device",
    correct: "Correct. Privacy keeps children safer.",
    incorrect: "Try again. The safest answer avoids private identity details.",
  },
  th: {
    welcome: "Sawasdee",
    complete: "activities complete",
    saved: "Saved on this device",
    correct: "Correct. Privacy keeps children safer.",
    incorrect: "Try again. The safest answer avoids private identity details.",
  },
};

function readStoredJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function createId(prefix) {
  const value = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  return `${prefix}-${value}`;
}

const legacyCompleteLessons = readStoredJson("completeLessons", []);
const legacyClassNotes = readStoredJson("classNotes", []);
const independentCompleteLessons = readStoredJson("independentCompleteLessons", legacyCompleteLessons);
const storedBatches = readStoredJson("teachingBatches", []);
const teachingBatches = Array.isArray(storedBatches) && storedBatches.length > 0
  ? storedBatches.map((batch, index) => ({
      id: batch.id || createId(`batch-${index + 1}`),
      name: batch.name || `Class ${index + 1}`,
      learnerCount: batch.learnerCount || "",
      createdAt: batch.createdAt || Date.now(),
      completeLessons: Array.isArray(batch.completeLessons) ? batch.completeLessons : [],
      classNotes: Array.isArray(batch.classNotes) ? batch.classNotes : [],
    }))
  : [
      {
        id: "main-class",
        name: "Main class",
        learnerCount: "",
        createdAt: Date.now(),
        completeLessons: Array.isArray(legacyCompleteLessons) ? legacyCompleteLessons : [],
        classNotes: Array.isArray(legacyClassNotes) ? legacyClassNotes : [],
      },
    ];

const storedActiveBatchId = localStorage.getItem("activeBatchId");
const initialActiveBatchId = teachingBatches.some((batch) => batch.id === storedActiveBatchId)
  ? storedActiveBatchId
  : teachingBatches[0].id;

const state = {
  learnerName: localStorage.getItem("learnerName") || "",
  language: localStorage.getItem("language") || "en",
  completeLessons: Array.isArray(independentCompleteLessons) ? independentCompleteLessons : [],
  selectedSubject: "All",
  teachingBatches,
  activeBatchId: initialActiveBatchId,
  get classNotes() {
    return getActiveBatch().classNotes;
  },
  set classNotes(value) {
    getActiveBatch().classNotes = value;
  },
  homeLearnerName: localStorage.getItem("homeLearnerName") || "",
  homeAgeGroup: localStorage.getItem("homeAgeGroup") || "5-7",
  homeCurrentPathId: localStorage.getItem("homeCurrentPathId") || "",
};

const viewTabs = document.querySelectorAll("[data-view]");
const viewPanels = document.querySelectorAll("[data-view-panel]");
const lessonGrid = document.querySelector("#lessonGrid");
const resourceCategoryGrid = document.querySelector("#resourceCategoryGrid");
const subjectFilter = document.querySelector("#subjectFilter");
const learnerName = document.querySelector("#learnerName");
const languageSelect = document.querySelector("#languageSelect");
const welcomeTitle = document.querySelector("#welcomeTitle");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");
const networkStatus = document.querySelector("#networkStatus");
const continueTitle = document.querySelector("#continueTitle");
const continueText = document.querySelector("#continueText");
const openNextLesson = document.querySelector("#openNextLesson");
const lessonListView = document.querySelector("#lessonListView");
const lessonReader = document.querySelector("#lessonReader");
const lessonDetailTitle = document.querySelector("#lessonDetailTitle");
const lessonDetailContent = document.querySelector("#lessonDetailContent");
const lessonDetailMeta = document.querySelector("#lessonDetailMeta");
const backToLessons = document.querySelector("#backToLessons");
const completeCurrentLesson = document.querySelector("#completeCurrentLesson");
const teacherTotalLessons = document.querySelector("#teacherTotalLessons");
const teacherCompletedLessons = document.querySelector("#teacherCompletedLessons");
const teacherRemainingLessons = document.querySelector("#teacherRemainingLessons");
const teacherLearnerCount = document.querySelector("#teacherLearnerCount");
const teacherGuideList = document.querySelector("#teacherGuideList");
const exportReport = document.querySelector("#exportReport");
const resetProgress = document.querySelector("#resetProgress");
const classFile = document.querySelector("#classFile");
const saveClassFile = document.querySelector("#saveClassFile");
const toggleFullscreen = document.querySelector("#toggleFullscreen");
const clearClassFile = document.querySelector("#clearClassFile");
const classFileStatus = document.querySelector("#classFileStatus");
const fileViewer = document.querySelector("#fileViewer");
const offlineMaterialList = document.querySelector("#offlineMaterialList");
const batchSelect = document.querySelector("#batchSelect");
const newBatchName = document.querySelector("#newBatchName");
const newBatchLearnerCount = document.querySelector("#newBatchLearnerCount");
const addBatch = document.querySelector("#addBatch");
const batchMessage = document.querySelector("#batchMessage");
const classResult = document.querySelector("#classResult");
const classNote = document.querySelector("#classNote");
const saveClassNote = document.querySelector("#saveClassNote");
const classNoteList = document.querySelector("#classNoteList");
const homeLearnerName = document.querySelector("#homeLearnerName");
const homeAgeGroup = document.querySelector("#homeAgeGroup");
const saveHomeProfile = document.querySelector("#saveHomeProfile");
const homeCurrentPlan = document.querySelector("#homeCurrentPlan");
const homePlanMessage = document.querySelector("#homePlanMessage");
const homePathGrid = document.querySelector("#homePathGrid");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveState() {
  localStorage.setItem("learnerName", state.learnerName);
  localStorage.setItem("language", state.language);
  localStorage.setItem("independentCompleteLessons", JSON.stringify(state.completeLessons));
  localStorage.setItem("teachingBatches", JSON.stringify(state.teachingBatches));
  localStorage.setItem("activeBatchId", state.activeBatchId);
  localStorage.setItem("homeLearnerName", state.homeLearnerName);
  localStorage.setItem("homeAgeGroup", state.homeAgeGroup);
  localStorage.setItem("homeCurrentPathId", state.homeCurrentPathId);
}

function getActiveBatch() {
  return state.teachingBatches.find((batch) => batch.id === state.activeBatchId) || state.teachingBatches[0];
}

function renderBatchControls() {
  const activeBatch = getActiveBatch();

  batchSelect.innerHTML = state.teachingBatches
    .map((batch) => `<option value="${escapeHtml(batch.id)}">${escapeHtml(batch.name)}</option>`)
    .join("");
  batchSelect.value = activeBatch.id;
}

function addTeachingBatch() {
  const name = newBatchName.value.trim();
  const learnerCount = newBatchLearnerCount.value.trim();

  if (!name) {
    batchMessage.textContent = "Enter a short batch name first.";
    newBatchName.focus();
    return;
  }

  if (state.teachingBatches.some((batch) => batch.name.toLowerCase() === name.toLowerCase())) {
    batchMessage.textContent = "A batch with this name already exists.";
    return;
  }

  const batch = {
    id: createId("batch"),
    name,
    learnerCount,
    createdAt: Date.now(),
    completeLessons: [],
    classNotes: [],
  };

  state.teachingBatches.push(batch);
  state.activeBatchId = batch.id;
  newBatchName.value = "";
  newBatchLearnerCount.value = "";
  batchMessage.textContent = `${name} is ready. Progress and notes will be saved separately.`;
  saveState();
  renderAll();
}

function openMaterialDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MATERIAL_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MATERIAL_STORE_NAME)) {
        database.createObjectStore(MATERIAL_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function useMaterialStore(mode, operation) {
  const database = await openMaterialDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(MATERIAL_STORE_NAME, mode);
    const store = transaction.objectStore(MATERIAL_STORE_NAME);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getOfflineMaterials() {
  const materials = await useMaterialStore("readonly", (store) => store.getAll());
  return materials.sort((a, b) => b.savedAt - a.savedAt);
}

async function renderOfflineMaterials() {
  if (!offlineMaterialList) return;

  try {
    const materials = await getOfflineMaterials();

    if (materials.length === 0) {
      offlineMaterialList.innerHTML = `<p class="empty-note">No materials saved offline yet.</p>`;
      return;
    }

    offlineMaterialList.innerHTML = materials
      .map(
        (material) => `
          <article class="offline-material-item">
            <div>
              <h5>${escapeHtml(material.name)}</h5>
              <p>${escapeHtml(formatFileSize(material.size))} · Saved ${escapeHtml(new Date(material.savedAt).toLocaleDateString())}</p>
            </div>
            <div class="material-actions">
              <button type="button" data-open-material-id="${escapeHtml(material.id)}">Open</button>
              <button class="secondary-button" type="button" data-delete-material-id="${escapeHtml(material.id)}">Delete</button>
            </div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    offlineMaterialList.innerHTML = `<p class="empty-note">Offline storage is not available in this browser.</p>`;
  }
}

async function saveSelectedMaterial() {
  if (!selectedClassFile) return;

  if (selectedClassFile.size > MAX_MATERIAL_SIZE) {
    classFileStatus.textContent = "This file is larger than 25 MB. Choose a smaller PDF or image.";
    return;
  }

  const material = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${selectedClassFile.name}`,
    name: selectedClassFile.name,
    type: selectedClassFile.type,
    size: selectedClassFile.size,
    savedAt: Date.now(),
    file: selectedClassFile,
  };

  try {
    await useMaterialStore("readwrite", (store) => store.put(material));
    saveClassFile.disabled = true;
    classFileStatus.textContent = `${selectedClassFile.name} is saved for offline use on this device.`;
    await renderOfflineMaterials();
  } catch (error) {
    classFileStatus.textContent = "The file could not be saved. This browser may be out of storage space.";
  }
}

async function openSavedMaterial(materialId) {
  const material = await useMaterialStore("readonly", (store) => store.get(materialId));
  if (!material) return;

  const storedFile =
    material.file instanceof File
      ? material.file
      : new File([material.file], material.name, { type: material.type });
  showClassFile(storedFile, true);
  fileViewer.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteSavedMaterial(materialId) {
  await useMaterialStore("readwrite", (store) => store.delete(materialId));
  await renderOfflineMaterials();
}

function showView(viewName) {
  viewTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  viewPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.viewPanel !== viewName);
  });
}

function getIndependentLessons() {
  return lessons.filter((lesson) => INDEPENDENT_SUBJECTS.includes(lesson.subject || "General"));
}

function getIndependentCompletedIds() {
  const independentIds = new Set(getIndependentLessons().map((lesson) => lesson.id));
  return state.completeLessons.filter((id) => independentIds.has(id));
}

function getBatchCompletedIds(batch) {
  const suggestedIds = new Set(getIndependentLessons().map((lesson) => lesson.id));
  return batch.completeLessons.filter((id) => suggestedIds.has(id));
}

function getSubjects() {
  const subjects = getIndependentLessons().map((lesson) => lesson.subject || "General");
  return ["All", ...new Set(subjects)];
}

function renderSubjectFilter() {
  subjectFilter.innerHTML = getSubjects()
    .map((subject) => {
      const label = subject === "All" ? "All subjects" : subject;
      return `<option value="${escapeHtml(subject)}">${escapeHtml(label)}</option>`;
    })
    .join("");
  subjectFilter.value = state.selectedSubject;
}

function renderLessons() {
  const independentLessons = getIndependentLessons();
  const visibleLessons =
    state.selectedSubject === "All"
      ? independentLessons
      : independentLessons.filter((lesson) => (lesson.subject || "General") === state.selectedSubject);

  if (visibleLessons.length === 0) {
    lessonGrid.innerHTML = `
      <article class="lesson-card">
        <div>
          <h3>No activities found</h3>
          <p>Choose another subject to see available activities.</p>
        </div>
      </article>
    `;
    return;
  }

  lessonGrid.innerHTML = visibleLessons
    .map((lesson) => {
      const isComplete = state.completeLessons.includes(lesson.id);
      const buttonText = isComplete ? "Completed" : "Mark complete";
      const reviewStatus = lesson.reviewStatus || "Draft";

      return `
        <article class="lesson-card ${isComplete ? "complete" : ""}">
          <div>
            <span class="review-badge">${escapeHtml(reviewStatus)}</span>
            <h3>${escapeHtml(lesson.title)}</h3>
            <p class="lesson-card-meta">${escapeHtml(lesson.subject || "General")} · ${escapeHtml(lesson.level || "Starter")}</p>
            <p>${escapeHtml(lesson.description)}</p>
            <p class="lesson-card-focus"><strong>Goal:</strong> ${escapeHtml(lesson.goal || "Open the activity to start learning.")}</p>
          </div>
          <div class="lesson-actions">
            <button type="button" data-open-lesson-id="${escapeHtml(lesson.id)}">Open activity</button>
            <button type="button" data-lesson-id="${escapeHtml(lesson.id)}">${buttonText}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderResourceCategories() {
  resourceCategoryGrid.innerHTML = resourceCategories
    .map((category) => {
      return `
        <article class="resource-category-card">
          <div>
            <h3>${escapeHtml(category.title)}</h3>
            <p>${escapeHtml(category.description)}</p>
            <p class="path-subjects">Related practice: ${escapeHtml(category.subjects.join(" · "))}</p>
            <dl class="resource-facts">
              <div><dt>Offline</dt><dd>${escapeHtml(category.offline)}</dd></div>
              <div><dt>Licence</dt><dd>${escapeHtml(category.license)}</dd></div>
            </dl>
            <div class="resource-link-list">
              ${category.links
                .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderHomeLearning() {
  homeLearnerName.value = state.homeLearnerName;
  homeAgeGroup.value = state.homeAgeGroup;

  const currentPath = homeLearningPaths.find((path) => path.id === state.homeCurrentPathId);
  homeCurrentPlan.textContent = currentPath ? currentPath.title : "Choose a suggested path";
  homePlanMessage.textContent = currentPath
    ? currentPath.routine
    : "You can change paths at any time.";

  const visiblePaths = homeLearningPaths.filter((path) => path.ages.includes(state.homeAgeGroup));
  homePathGrid.innerHTML = visiblePaths
    .map((path) => {
      const isCurrent = path.id === state.homeCurrentPathId;
      return `
        <article class="home-path-card ${isCurrent ? "current" : ""}">
          <div>
            <p class="eyebrow">Ages ${escapeHtml(path.ages.join(" · "))}</p>
            <h3>${escapeHtml(path.title)}</h3>
            <p>${escapeHtml(path.description)}</p>
          </div>
          <div class="home-routine">
            <strong>Simple routine</strong>
            <p>${escapeHtml(path.routine)}</p>
          </div>
          <button type="button" data-home-path-id="${escapeHtml(path.id)}">${isCurrent ? "Current path" : "Use this path"}</button>
        </article>
      `;
    })
    .join("");
}

function getResourcesForSubject(subject) {
  const library = resourceLibraries.find((item) => item.subject === subject);
  return library ? library.items : [];
}

function renderTeacherResources(subject) {
  const resources = getResourcesForSubject(subject);
  if (resources.length === 0) return "";

  return `
    <div class="teacher-resources">
      <p class="eyebrow">Resource notes</p>
      <div class="teacher-resource-list">
        ${resources
          .map((resource) => {
            return `
              <a href="${resource.url}" target="_blank" rel="noreferrer">
                <strong>${escapeHtml(resource.title)}</strong>
                <span>${escapeHtml(resource.source)} · ${escapeHtml(resource.access)}</span>
              </a>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderProgress() {
  const t = translations[state.language];
  const independentLessons = getIndependentLessons();
  const completed = getIndependentCompletedIds().length;
  const percent = independentLessons.length === 0 ? 0 : Math.round((completed / independentLessons.length) * 100);
  const name = state.learnerName || "learner";

  welcomeTitle.textContent = `${t.welcome}, ${name}`;
  progressText.textContent = `${completed} of ${independentLessons.length} ${t.complete}`;
  progressFill.style.width = `${percent}%`;
}

function getNextLesson() {
  return getIndependentLessons().find((lesson) => !state.completeLessons.includes(lesson.id));
}

function renderContinueLearning() {
  const nextLesson = getNextLesson();

  if (!nextLesson) {
    continueTitle.textContent = "All activities complete";
    continueText.textContent = "Reset progress in Teaching Desk when a new group uses the device.";
    openNextLesson.disabled = true;
    openNextLesson.textContent = "Nothing to open";
    return;
  }

  continueTitle.textContent = nextLesson.title;
  continueText.textContent = `${nextLesson.subject || "General"} · ${nextLesson.level || "Starter"}`;
  openNextLesson.disabled = false;
  openNextLesson.textContent = "Open next activity";
}

function updateNetworkStatus() {
  networkStatus.textContent = navigator.onLine ? "Online" : "Offline ready";
}

function renderTeacherView() {
  const activeBatch = getActiveBatch();
  const suggestedLessons = getIndependentLessons();
  const completed = getBatchCompletedIds(activeBatch).length;
  const remaining = Math.max(suggestedLessons.length - completed, 0);

  teacherTotalLessons.textContent = suggestedLessons.length;
  teacherCompletedLessons.textContent = completed;
  teacherRemainingLessons.textContent = remaining;
  teacherLearnerCount.textContent = activeBatch.learnerCount || "-";
  teacherGuideList.innerHTML = suggestedLessons
    .map((lesson) => {
      const isComplete = activeBatch.completeLessons.includes(lesson.id);
      const status = isComplete ? "Mark incomplete" : "Mark complete";
      const reviewStatus = lesson.reviewStatus || "Draft";
      const resourcesHtml = renderTeacherResources(lesson.subject || "General");

      return `
        <article class="teacher-guide-card">
          <div>
            <p class="lesson-card-meta">${escapeHtml(lesson.subject || "General")} · ${escapeHtml(lesson.level || "Starter")}</p>
            <h3>${escapeHtml(lesson.title)}</h3>
            <span class="review-badge">${escapeHtml(reviewStatus)}</span>
            <p>${escapeHtml(lesson.teacherNote || "Teaching guidance is coming soon.")}</p>
            ${resourcesHtml}
          </div>
          <button class="${isComplete ? "secondary-button" : ""}" type="button" data-batch-lesson-id="${escapeHtml(lesson.id)}">${status}</button>
        </article>
      `;
    })
    .join("");
}

function showLessonList() {
  currentLessonId = "";
  lessonListView.classList.remove("is-hidden");
  lessonReader.classList.add("is-hidden");
}

function showLessonReader(lessonId) {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return;

  currentLessonId = lesson.id;
  lessonDetailTitle.textContent = lesson.title;
  lessonDetailMeta.textContent = `${lesson.subject || "General"} · ${lesson.level || "Starter"}`;
  lessonDetailContent.innerHTML = renderLessonContent(lesson);
  completeCurrentLesson.textContent = state.completeLessons.includes(lesson.id)
    ? "Activity completed"
    : "Mark activity complete";
  lessonListView.classList.add("is-hidden");
  lessonReader.classList.remove("is-hidden");
  lessonReader.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderLessonContent(lesson) {
  if (!lesson.goal && !lesson.steps && !lesson.practice && !lesson.checkQuestion) {
    return `<p>${escapeHtml(lesson.content || "Activity content is coming soon.")}</p>`;
  }

  const goalHtml = lesson.goal
    ? `<section class="lesson-block"><p class="eyebrow">Goal</p><p>${escapeHtml(lesson.goal)}</p></section>`
    : "";
  const stepsHtml = Array.isArray(lesson.steps)
    ? `
      <section class="lesson-block">
        <p class="eyebrow">Steps</p>
        <ol>${lesson.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </section>
    `
    : "";
  const practiceHtml = lesson.practice
    ? `<section class="lesson-block"><p class="eyebrow">Practice</p><p>${escapeHtml(lesson.practice)}</p></section>`
    : "";
  const checkHtml = lesson.checkQuestion
    ? `<section class="lesson-block"><p class="eyebrow">Check</p><p>${escapeHtml(lesson.checkQuestion)}</p></section>`
    : "";
  const referencesHtml = Array.isArray(lesson.references)
    ? `
      <section class="lesson-block lesson-sources">
        <p class="eyebrow">Sources</p>
        <ul>
          ${lesson.references
            .map((reference) => `<li><a href="${reference.url}" target="_blank" rel="noreferrer">${escapeHtml(reference.title)}</a></li>`)
            .join("")}
        </ul>
      </section>
    `
    : "";

  return `${goalHtml}${stepsHtml}${practiceHtml}${checkHtml}${referencesHtml}`;
}

function renderClassNotes() {
  if (state.classNotes.length === 0) {
    classNoteList.innerHTML = `<p class="empty-note">No class notes saved yet.</p>`;
    return;
  }

  classNoteList.innerHTML = state.classNotes
    .map((note) => {
      return `
        <article class="saved-note">
          <div>
            <p class="eyebrow">${escapeHtml(note.date)}</p>
            <h4>${escapeHtml(note.group)}</h4>
            <strong>${escapeHtml(note.result)}</strong>
            <p>${escapeHtml(note.note)}</p>
          </div>
          <button class="secondary-button" type="button" data-delete-note-id="${escapeHtml(note.id)}">Delete</button>
        </article>
      `;
    })
    .join("");
}

function saveClassNotebookEntry() {
  const noteText = classNote.value.trim();
  const group = getActiveBatch().name;

  if (!noteText) {
    classNote.placeholder = "Write one short review note before saving.";
    return;
  }

  state.classNotes.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toLocaleDateString(),
    group,
    result: classResult.value,
    note: noteText,
  });

  state.classNotes = state.classNotes.slice(0, 20);
  classNote.value = "";
  saveState();
  renderClassNotes();
}

function clearCurrentClassFile() {
  if (document.fullscreenElement === fileViewer) {
    document.exitFullscreen().catch(() => {});
  }

  if (activeFileUrl) {
    URL.revokeObjectURL(activeFileUrl);
    activeFileUrl = "";
  }

  classFile.value = "";
  selectedClassFile = null;
  saveClassFile.disabled = true;
  toggleFullscreen.disabled = true;
  classFileStatus.textContent = "No file selected yet.";
  fileViewer.className = "file-viewer empty";
  fileViewer.innerHTML = "<p>Select a saved PDF or image before class starts.</p>";
}

function showClassFile(file, isSaved = false) {
  if (!file) return;

  if (activeFileUrl) URL.revokeObjectURL(activeFileUrl);
  activeFileUrl = URL.createObjectURL(file);
  selectedClassFile = file;
  saveClassFile.disabled = isSaved;
  toggleFullscreen.disabled = false;
  classFileStatus.textContent = isSaved
    ? `Showing ${file.name} from this device's offline library.`
    : `Showing ${file.name}. Select Save offline to keep it in this browser.`;
  fileViewer.className = "file-viewer";

  if (file.type === "application/pdf") {
    fileViewer.innerHTML = `<object data="${activeFileUrl}" type="application/pdf"><p>This browser cannot preview the PDF. Open the file directly from your Downloads folder.</p></object>`;
    return;
  }

  if (file.type.startsWith("image/")) {
    fileViewer.innerHTML = `<img src="${activeFileUrl}" alt="Selected class material" />`;
    return;
  }

  classFileStatus.textContent = "Please choose a PDF or image file.";
  clearCurrentClassFile();
}

async function toggleClassFileFullscreen() {
  if (!activeFileUrl) return;

  try {
    if (document.fullscreenElement === fileViewer) {
      await document.exitFullscreen();
    } else {
      await fileViewer.requestFullscreen();
      window.history.pushState({ learnbridgeFullscreen: true }, "");
      fullscreenHistoryActive = true;
    }
  } catch (error) {
    classFileStatus.textContent = "Full-screen viewing is not supported by this browser.";
  }
}

function updateFullscreenButton() {
  const isFullscreen = document.fullscreenElement === fileViewer;
  toggleFullscreen.textContent = isFullscreen ? "Exit full screen" : "Full screen";
  toggleFullscreen.setAttribute("aria-pressed", String(isFullscreen));

  if (!isFullscreen && fullscreenHistoryActive && !fullscreenClosedByBack) {
    fullscreenHistoryActive = false;
    window.history.back();
  }

  if (!isFullscreen && fullscreenClosedByBack) {
    fullscreenClosedByBack = false;
  }
}

function closeFullscreenWithBackButton() {
  if (!fullscreenHistoryActive) return;

  fullscreenHistoryActive = false;
  fullscreenClosedByBack = true;

  if (document.fullscreenElement === fileViewer) {
    document.exitFullscreen().catch(() => {
      fullscreenClosedByBack = false;
    });
  } else {
    fullscreenClosedByBack = false;
  }
}

function downloadPilotReport() {
  const activeBatch = getActiveBatch();
  const suggestedLessons = getIndependentLessons();
  const completed = getBatchCompletedIds(activeBatch).length;
  const remaining = Math.max(suggestedLessons.length - completed, 0);
  const date = new Date().toLocaleDateString();
  const lessonLines = suggestedLessons
    .map((lesson) => {
      const status = activeBatch.completeLessons.includes(lesson.id) ? "Complete" : "Not complete";
      return `- ${lesson.title} (${lesson.subject || "General"}): ${status}`;
    })
    .join("\n");
  const noteLines = state.classNotes
    .map((note) => `- ${note.date} | ${note.group} | ${note.result}: ${note.note}`)
    .join("\n");
  const report = [
    "LearnBridge Myanmar pilot report",
    `Date: ${date}`,
    `Class batch: ${activeBatch.name}`,
    `Approximate learners: ${activeBatch.learnerCount || "Not recorded"}`,
    "",
    "Privacy note: This report should not include real child names, documents, addresses, or private family details.",
    "",
    `Total suggested activities: ${suggestedLessons.length}`,
    `Completed activities: ${completed}`,
    `Remaining activities: ${remaining}`,
    "",
    "Activity status",
    lessonLines,
    "",
    "Class notes",
    noteLines || "No class notes saved.",
  ].join("\n");
  const blob = new Blob([report], { type: "text/plain" });
  const reportUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = reportUrl;
  link.download = "learnbridge-pilot-report.txt";
  link.click();
  URL.revokeObjectURL(reportUrl);
}

function renderAll() {
  learnerName.value = state.learnerName;
  languageSelect.value = state.language;
  renderBatchControls();
  renderSubjectFilter();
  renderLessons();
  renderResourceCategories();
  renderProgress();
  renderContinueLearning();
  renderTeacherView();
  renderClassNotes();
  renderHomeLearning();
  updateNetworkStatus();
}

document.querySelector("#saveLearner").addEventListener("click", () => {
  state.learnerName = learnerName.value.trim();
  state.language = languageSelect.value;
  saveState();
  renderProgress();
});

languageSelect.addEventListener("change", () => {
  state.language = languageSelect.value;
  saveState();
  renderProgress();
});

subjectFilter.addEventListener("change", () => {
  state.selectedSubject = subjectFilter.value;
  renderLessons();
});

lessonGrid.addEventListener("click", (event) => {
  const openButton = event.target.closest("button[data-open-lesson-id]");
  const completeButton = event.target.closest("button[data-lesson-id]");

  if (openButton) {
    showLessonReader(openButton.dataset.openLessonId);
    return;
  }

  if (completeButton) {
    const lessonId = completeButton.dataset.lessonId;

    if (!state.completeLessons.includes(lessonId)) {
      state.completeLessons.push(lessonId);
    }

    saveState();
    renderAll();
  }
});

backToLessons.addEventListener("click", showLessonList);

completeCurrentLesson.addEventListener("click", () => {
  if (!currentLessonId) return;

  if (!state.completeLessons.includes(currentLessonId)) {
    state.completeLessons.push(currentLessonId);
  }

  saveState();
  renderAll();
  showLessonReader(currentLessonId);
});

viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

document.querySelectorAll("[data-open-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.openView));
});

resetProgress.addEventListener("click", () => {
  const activeBatch = getActiveBatch();
  const shouldReset = window.confirm(`Reset progress for ${activeBatch.name}? This cannot be undone.`);
  if (!shouldReset) return;

  activeBatch.completeLessons = [];
  saveState();
  renderAll();
});

exportReport.addEventListener("click", downloadPilotReport);

batchSelect.addEventListener("change", () => {
  state.activeBatchId = batchSelect.value;
  batchMessage.textContent = `Now tracking ${getActiveBatch().name}.`;
  saveState();
  showLessonList();
  renderAll();
});

addBatch.addEventListener("click", addTeachingBatch);

newBatchName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTeachingBatch();
});

teacherGuideList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-batch-lesson-id]");
  if (!button) return;

  const activeBatch = getActiveBatch();
  const lessonId = button.dataset.batchLessonId;
  const isComplete = activeBatch.completeLessons.includes(lessonId);

  activeBatch.completeLessons = isComplete
    ? activeBatch.completeLessons.filter((id) => id !== lessonId)
    : [...activeBatch.completeLessons, lessonId];
  saveState();
  renderTeacherView();
});

saveHomeProfile.addEventListener("click", () => {
  state.homeLearnerName = homeLearnerName.value.trim();
  state.homeAgeGroup = homeAgeGroup.value;
  saveState();
  renderHomeLearning();
  homePlanMessage.textContent = state.homeLearnerName
    ? `Home learning is ready for ${state.homeLearnerName}.`
    : "Home learning profile saved on this device.";
});

homeAgeGroup.addEventListener("change", () => {
  state.homeAgeGroup = homeAgeGroup.value;
  saveState();
  renderHomeLearning();
});

homePathGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-home-path-id]");
  if (!button) return;

  state.homeCurrentPathId = button.dataset.homePathId;
  saveState();
  renderHomeLearning();
});

classFile.addEventListener("change", () => {
  showClassFile(classFile.files[0]);
});

saveClassFile.addEventListener("click", saveSelectedMaterial);

toggleFullscreen.addEventListener("click", toggleClassFileFullscreen);

document.addEventListener("fullscreenchange", updateFullscreenButton);

window.addEventListener("popstate", closeFullscreenWithBackButton);

clearClassFile.addEventListener("click", clearCurrentClassFile);

offlineMaterialList.addEventListener("click", async (event) => {
  const openButton = event.target.closest("button[data-open-material-id]");
  const deleteButton = event.target.closest("button[data-delete-material-id]");

  try {
    if (openButton) {
      await openSavedMaterial(openButton.dataset.openMaterialId);
      return;
    }

    if (deleteButton) {
      const shouldDelete = window.confirm("Delete this material from this browser?");
      if (!shouldDelete) return;
      await deleteSavedMaterial(deleteButton.dataset.deleteMaterialId);
    }
  } catch (error) {
    classFileStatus.textContent = "The offline material could not be opened or changed.";
  }
});

saveClassNote.addEventListener("click", saveClassNotebookEntry);

classNoteList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("button[data-delete-note-id]");
  if (!deleteButton) return;

  state.classNotes = state.classNotes.filter((note) => note.id !== deleteButton.dataset.deleteNoteId);
  saveState();
  renderClassNotes();
});

openNextLesson.addEventListener("click", () => {
  const nextLesson = getNextLesson();
  if (!nextLesson) return;

  showLessonReader(nextLesson.id);
});

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

async function loadLessons() {
  try {
    const [lessonResponse, resourceResponse] = await Promise.all([
      fetch("./lessons.json?v=54"),
      fetch("./resources.json?v=54"),
    ]);

    if (!lessonResponse.ok || !resourceResponse.ok) {
      throw new Error("Learning files could not be loaded.");
    }

    lessons = await lessonResponse.json();
    resourceLibraries = await resourceResponse.json();
    renderAll();
  } catch (error) {
    lessonGrid.innerHTML = `
      <article class="lesson-card">
        <div>
          <h3>Activities could not load</h3>
          <p>Please check lessons.json, resources.json, or run the app from the local server.</p>
        </div>
      </article>
    `;
    progressText.textContent = "Activities are not available right now.";
    progressFill.style.width = "0%";
    updateNetworkStatus();
  }
}

saveState();
loadLessons();
renderOfflineMaterials();
