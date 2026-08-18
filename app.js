let lessons = [];
let resourceLibraries = [];
let currentLessonId = "";
let currentMode = "class";

const resourceCategories = [
  {
    id: "textbooks",
    title: "School textbooks",
    description: "Start with kindergarten and grade-level textbooks. Download PDFs while online, then open saved files offline from Facilitator View.",
    subjects: ["Math", "Literacy", "English"],
    links: [
      {
        label: "Edu4MM Grade 1",
        url: "https://edu4mm.com/grade-1/",
      },
      {
        label: "LearnBig Grade 1",
        url: "https://www.learnbig.net/en/book_category/textbooks_myanmar_basic_education_grade1/",
      },
      {
        label: "LearnBig all grades",
        url: "https://www.learnbig.net/en/book_category/textbooks_myanmar_basic_education/",
      },
    ],
  },
  {
    id: "languages",
    title: "Language learning",
    description: "Use English, Thai, Burmese/Myanmar, Rakhine, and Chinese resources for school access, daily life, and communication.",
    subjects: ["Thai language", "English", "Literacy"],
    links: [
      {
        label: "Let's Read app",
        url: "https://play.google.com/store/apps/details?id=org.asiafoundation.letsread",
      },
      {
        label: "Global Digital Library",
        url: "https://digitallibrary.io/",
      },
      {
        label: "Kiwix catalog",
        url: "https://get.kiwix.org/en/solutions/catalog/",
      },
    ],
  },
  {
    id: "digital",
    title: "Digital skills",
    description: "Prepare older learners for typing, basic computer use, internet safety, and beginner coding.",
    subjects: ["Digital safety", "Review"],
    links: [
      {
        label: "Scratch offline app",
        url: "https://scratch.mit.edu/download",
      },
      {
        label: "GCF basic computer skills",
        url: "https://learnfree.org/series/basic-computer-skills",
      },
      {
        label: "TypingClub",
        url: "https://www.typingclub.com/",
      },
    ],
  },
  {
    id: "life",
    title: "Life skills and safety",
    description: "Use original offline guidance for privacy, wellbeing, asking for help, hygiene, and emergency awareness.",
    subjects: ["Wellbeing", "Practical safety", "Emergency safety"],
    links: [
      {
        label: "INEE standards",
        url: "https://inee.org/minimum-standards",
      },
      {
        label: "UNICEF Learning Passport",
        url: "https://www.unicef.org/digitaleducation/learning-passport",
      },
      {
        label: "Ready.gov earthquakes",
        url: "https://www.ready.gov/earthquakes",
      },
    ],
  },
  {
    id: "catchup",
    title: "Exam and catch-up",
    description: "Use free practice tools for math, science, reading, and missed school foundations.",
    subjects: ["Math", "Literacy", "Review"],
    links: [
      {
        label: "Kolibri",
        url: "https://learningequality.org/kolibri/about-kolibri/",
      },
      {
        label: "Khan Academy downloads",
        url: "https://www.khanacademy.org/downloads",
      },
      {
        label: "Global Digital Library math",
        url: "https://digitallibrary.io/",
      },
    ],
  },
  {
    id: "offline",
    title: "Offline libraries",
    description: "Build a small offline library with Kiwix ZIM files, Kolibri channels, and downloaded PDFs.",
    subjects: ["Review", "Science", "English"],
    links: [
      {
        label: "Kiwix Reader",
        url: "https://get.kiwix.org/en/solutions/applications/kiwix-reader/",
      },
      {
        label: "Kiwix catalog",
        url: "https://get.kiwix.org/en/solutions/catalog/",
      },
      {
        label: "Kolibri resources",
        url: "https://kolibri.readthedocs.io/en/latest/manage/resources.html",
      },
    ],
  },
];

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

const state = {
  learnerName: localStorage.getItem("learnerName") || "",
  language: localStorage.getItem("language") || "en",
  completeLessons: JSON.parse(localStorage.getItem("completeLessons") || "[]"),
  selectedSubject: "All",
};

const lessonGrid = document.querySelector("#lessonGrid");
const resourceCategoryGrid = document.querySelector("#resourceCategoryGrid");
const subjectFilter = document.querySelector("#subjectFilter");
const learnerName = document.querySelector("#learnerName");
const languageSelect = document.querySelector("#languageSelect");
const welcomeTitle = document.querySelector("#welcomeTitle");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");
const networkStatus = document.querySelector("#networkStatus");
const quizResult = document.querySelector("#quizResult");
const continueTitle = document.querySelector("#continueTitle");
const continueText = document.querySelector("#continueText");
const openNextLesson = document.querySelector("#openNextLesson");
const lessonListView = document.querySelector("#lessonListView");
const lessonReader = document.querySelector("#lessonReader");
const lessonDetailTitle = document.querySelector("#lessonDetailTitle");
const lessonDetailContent = document.querySelector("#lessonDetailContent");
const lessonDetailMeta = document.querySelector("#lessonDetailMeta");
const lessonTeacherNote = document.querySelector("#lessonTeacherNote");
const backToLessons = document.querySelector("#backToLessons");
const completeCurrentLesson = document.querySelector("#completeCurrentLesson");
const learnerView = document.querySelector("#learnerView");
const teacherView = document.querySelector("#teacherView");
const modeToggle = document.querySelector("#modeToggle");
const teacherTotalLessons = document.querySelector("#teacherTotalLessons");
const teacherCompletedLessons = document.querySelector("#teacherCompletedLessons");
const teacherRemainingLessons = document.querySelector("#teacherRemainingLessons");
const teacherGuideList = document.querySelector("#teacherGuideList");
const exportReport = document.querySelector("#exportReport");
const textbookFile = document.querySelector("#textbookFile");
const textbookStatus = document.querySelector("#textbookStatus");
const resetProgress = document.querySelector("#resetProgress");

function saveState() {
  localStorage.setItem("learnerName", state.learnerName);
  localStorage.setItem("language", state.language);
  localStorage.setItem("completeLessons", JSON.stringify(state.completeLessons));
}

function getSubjects() {
  const subjects = lessons.map((lesson) => lesson.subject || "General");

  return ["All", ...new Set(subjects)];
}

function renderSubjectFilter() {
  subjectFilter.innerHTML = getSubjects()
    .map((subject) => {
      const label = subject === "All" ? "All subjects" : subject;

      return `<option value="${subject}">${label}</option>`;
    })
    .join("");
  subjectFilter.value = state.selectedSubject;
}

function renderLessons() {
  const visibleLessons =
    state.selectedSubject === "All"
      ? lessons
      : lessons.filter((lesson) => {
          return (lesson.subject || "General") === state.selectedSubject;
        });

  if (visibleLessons.length === 0) {
    lessonGrid.innerHTML = `
      <article class="lesson-card">
        <div class="lesson-icon" aria-hidden="true">0</div>
        <div>
          <h3>No lessons found</h3>
          <p>Choose another subject to see available lessons.</p>
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
          <div class="lesson-icon" aria-hidden="true">${lesson.icon}</div>
          <div>
            <span class="review-badge">${reviewStatus}</span>
            <h3>${lesson.title}</h3>
            <p class="lesson-card-meta">${lesson.subject || "General"} · ${lesson.level || "Starter"}</p>
            <p>${lesson.description}</p>
            <p class="lesson-card-focus"><strong>Goal:</strong> ${lesson.goal || "Open the lesson to start learning."}</p>
          </div>
          <div class= "lesson-actions">
            <button type= "button" data-open-lesson-id="${lesson.id}">Open lesson</button>
            <button type= "button" data-lesson-id="${lesson.id}">${buttonText}</button>
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
            <h3>${category.title}</h3>
            <p>${category.description}</p>
            <p class="path-subjects">Related class activities: ${category.subjects.join(" · ")}</p>
            <div class="resource-link-list">
              ${category.links
                .map((link) => {
                  return `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`;
                })
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getResourcesForSubject(subject) {
  const library = resourceLibraries.find((item) => {
    return item.subject === subject;
  });

  return library ? library.items : [];
}

function renderTeacherResources(subject) {
  const resources = getResourcesForSubject(subject);

  if (resources.length === 0) {
    return "";
  }

  return `
    <div class="teacher-resources">
      <p class="eyebrow">Teacher resources</p>
      <div class="teacher-resource-list">
        ${resources
          .map((resource) => {
            return `
              <a href="${resource.url}" target="_blank" rel="noreferrer">
                <strong>${resource.title}</strong>
                <span>${resource.source} · ${resource.access}</span>
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
  const completed = state.completeLessons.length;
  const percent =
    lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100);
  const name = state.learnerName || "learner";

  welcomeTitle.textContent = `${t.welcome}, ${name}`;
  progressText.textContent = `${completed} of ${lessons.length} ${t.complete}`;
  progressFill.style.width = `${percent}%`;
}

function getNextLesson() {
  return lessons.find((lesson) => {
    return !state.completeLessons.includes(lesson.id);
  });
}

function renderContinueLearning() {
  const nextLesson = getNextLesson();

  if (!nextLesson) {
    continueTitle.textContent = "All lessons complete";
    continueText.textContent =
      "Great work. Reset progress in Teacher mode to start again on this device.";
    openNextLesson.disabled = true;
    openNextLesson.textContent = "Nothing to open";
    return;
  }

  continueTitle.textContent = nextLesson.title;
  continueText.textContent = `${nextLesson.subject || "General"} · ${nextLesson.level || "Starter"}`;
  openNextLesson.disabled = false;
  openNextLesson.textContent = "Open next lesson";
}

function updateNetworkStatus() {
  networkStatus.textContent = navigator.onLine ? "Online" : "Offline ready";
}

function renderTeacherView() {
  const completed = state.completeLessons.length;
  const remaining = Math.max(lessons.length - completed, 0);

  teacherTotalLessons.textContent = lessons.length;
  teacherCompletedLessons.textContent = completed;
  teacherRemainingLessons.textContent = remaining;
  teacherGuideList.innerHTML = lessons
    .map((lesson) => {
      const isComplete = state.completeLessons.includes(lesson.id);
      const status = isComplete ? "Completed" : "Not complete";
      const reviewStatus = lesson.reviewStatus || "Draft";
      const resourcesHtml = renderTeacherResources(lesson.subject || "General");

      return `
        <article class="teacher-guide-card">
          <div>
            <p class="lesson-card-meta">${lesson.subject || "General"} · ${lesson.level || "Starter"}</p>
            <h3>${lesson.title}</h3>
            <span class="review-badge">${reviewStatus}</span>
            <p>${lesson.teacherNote || "Teacher guidance is coming soon."}</p>
            ${resourcesHtml}
          </div>
          <span>${status}</span>
        </article>
      `;
    })
    .join("");
}

function showClassView() {
  currentMode = "class";
  learnerView.classList.remove("is-hidden");
  teacherView.classList.add("is-hidden");
  modeToggle.textContent = "Open facilitator view";
}

function showFacilitatorView() {
  currentMode = "facilitator";
  showLessonList();
  renderResourceCategories();
  renderTeacherView();
  learnerView.classList.add("is-hidden");
  teacherView.classList.remove("is-hidden");
  modeToggle.textContent = "Back to class view";
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
  lessonTeacherNote.textContent =
    lesson.teacherNote || "Teacher guidance is coming soon.";
  completeCurrentLesson.textContent = state.completeLessons.includes(lesson.id)
    ? "Lesson completed"
    : "Mark lesson complete";
  lessonListView.classList.add("is-hidden");
  lessonReader.classList.remove("is-hidden");
  lessonReader.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderLessonContent(lesson) {
  if (!lesson.goal && !lesson.steps && !lesson.practice && !lesson.checkQuestion) {
    return `<p>${lesson.content || "Lesson content is coming soon."}</p>`;
  }

  const goalHtml = lesson.goal
    ? `
      <section class="lesson-block">
        <p class="eyebrow">Goal</p>
        <p>${lesson.goal}</p>
      </section>
    `
    : "";
  const stepsHtml = Array.isArray(lesson.steps)
    ? `
      <section class="lesson-block">
        <p class="eyebrow">Steps</p>
        <ol>
          ${lesson.steps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>
    `
    : "";
  const practiceHtml = lesson.practice
    ? `
      <section class="lesson-block">
        <p class="eyebrow">Practice</p>
        <p>${lesson.practice}</p>
      </section>
    `
    : "";
  const checkHtml = lesson.checkQuestion
    ? `
      <section class="lesson-block">
        <p class="eyebrow">Check</p>
        <p>${lesson.checkQuestion}</p>
      </section>
    `
    : "";
  const referencesHtml = Array.isArray(lesson.references)
    ? `
      <section class="lesson-block lesson-sources">
        <p class="eyebrow">Sources</p>
        <ul>
          ${lesson.references
            .map((reference) => {
              return `<li><a href="${reference.url}" target="_blank" rel="noreferrer">${reference.title}</a></li>`;
            })
            .join("")}
        </ul>
      </section>
    `
    : "";

  return `${goalHtml}${stepsHtml}${practiceHtml}${checkHtml}${referencesHtml}`;
}

function downloadPilotReport() {
  const completed = state.completeLessons.length;
  const remaining = Math.max(lessons.length - completed, 0);
  const date = new Date().toLocaleDateString();
  const lessonLines = lessons
    .map((lesson) => {
      const status = state.completeLessons.includes(lesson.id)
        ? "Complete"
        : "Not complete";

      return `- ${lesson.title} (${lesson.subject || "General"}): ${status}`;
    })
    .join("\n");
  const report = [
    "LearnBridge Myanmar pilot report",
    `Date: ${date}`,
    "",
    "Privacy note: This report does not include real child names, documents, addresses, or private family details.",
    "",
    `Total lessons: ${lessons.length}`,
    `Completed lessons: ${completed}`,
    `Remaining lessons: ${remaining}`,
    "",
    "Lesson status",
    lessonLines,
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
  renderSubjectFilter();
  renderLessons();
  renderProgress();
  renderContinueLearning();
  renderTeacherView();
  updateNetworkStatus();
}

document.querySelector("#saveLearner").addEventListener("click", () => {
  state.learnerName = learnerName.value.trim();
  state.language = languageSelect.value;
  saveState();
  renderProgress();
  quizResult.textContent = translations[state.language].saved;
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
    const lessonId = openButton.dataset.openLessonId;
    showLessonReader(lessonId);
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

backToLessons.addEventListener("click", () => {
  showLessonList();
});

completeCurrentLesson.addEventListener("click", () => {
  if (!currentLessonId) return;

  if (!state.completeLessons.includes(currentLessonId)) {
    state.completeLessons.push(currentLessonId);
  }

  saveState();
  renderAll();
  showLessonReader(currentLessonId);
});

modeToggle.addEventListener("click", () => {
  if (currentMode === "class") {
    showFacilitatorView();
  } else {
    showClassView();
  }
});

resetProgress.addEventListener("click", () => {
  const shouldReset = window.confirm(
    "Reset progress on this device? This cannot be undone."
  );

  if (!shouldReset) return;

  state.completeLessons = [];
  saveState();
  renderAll();
});

exportReport.addEventListener("click", () => {
  downloadPilotReport();
});

textbookFile.addEventListener("change", () => {
  const file = textbookFile.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    textbookStatus.textContent = "Please choose a PDF textbook file.";
    return;
  }

  const textbookUrl = URL.createObjectURL(file);
  window.open(textbookUrl, "_blank");
  textbookStatus.textContent = `Opened ${file.name}. The file stays on this device, not inside LearnBridge.`;
});

openNextLesson.addEventListener("click", () => {
  const nextLesson = getNextLesson();

  if (!nextLesson) return;

  showLessonReader(nextLesson.id);
});

document.querySelectorAll(".quiz-option").forEach((button) => {
  button.addEventListener("click", () => {
    const isCorrect = button.dataset.correct === "true";
    const t = translations[state.language];

    document.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("correct", "incorrect");
    });

    button.classList.add(isCorrect ? "correct" : "incorrect");
    quizResult.textContent = isCorrect ? t.correct : t.incorrect;
  });
});

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

async function loadLessons() {
 try{ 
  const [lessonResponse, resourceResponse] = await Promise.all([
    fetch("./lessons.json?v=43"),
    fetch("./resources.json?v=43"),
  ]);

  if (!lessonResponse.ok || !resourceResponse.ok) {
    throw new Error("Learning files could not be loaded.");
  }

  lessons = await lessonResponse.json();
  resourceLibraries = await resourceResponse.json();
  renderAll();
 } catch (error) {
   lessonGrid.innerHTML = `
     <article class ="lesson-card">
       <div class="lesson-icon" aria-hidden="true">!</div>
        <div>
          <h3>Lessons could not load</h3>
          <p>Please check lessons.json, resources.json, or run the app from the local server.</p>
        </div>
      </article>
    `;
    progressText.textContent = "Lessons are not available right now.";
    progressFill.style.width = "0%";
    updateNetworkStatus();
 }  
}

loadLessons();
