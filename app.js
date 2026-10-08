const STORAGE_KEY = "tk_cartoon_studio";

let appData = {
  project: {
    name: "My Cartoon Series",
    duration: 5
  },

  characters: [],

  scenes: [],

  settings: {
    autosave: true
  }
};


// -------------------------
// STORAGE
// -------------------------

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );

  document.getElementById("storageStatus").textContent =
    "Saved ✓";
}


function loadData() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    renderAll();
    return;
  }

  try {

    appData = JSON.parse(saved);

  } catch {

    console.log("Could not load project.");

  }

  renderAll();
}


function autosave() {

  if (appData.settings.autosave) {
    saveData();
  }
}


// -------------------------
// NAVIGATION
// -------------------------

document.querySelectorAll(".nav").forEach(button => {

  button.addEventListener("click", () => {

    const page = button.dataset.page;

    document.querySelectorAll(".nav")
      .forEach(x => x.classList.remove("active"));

    document.querySelectorAll(".page")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");

    document.getElementById(page)
      .classList.add("active");

  });

});


// -------------------------
// MODALS
// -------------------------

function openModal(id) {

  document.getElementById(id)
    .classList.add("show");

}


function closeModal(id) {

  document.getElementById(id)
    .classList.remove("show");

}


document.querySelectorAll("[data-close]").forEach(button => {

  button.addEventListener("click", () => {

    closeModal(button.dataset.close);

  });

});


// -------------------------
// NEW PROJECT
// -------------------------

document.getElementById("newProjectBtn")
  .addEventListener("click", () => {

    openModal("projectModal");

  });


document.getElementById("createProject")
  .addEventListener("click", () => {

    const name =
      document.getElementById("newProjectName").value.trim();

    if (!name) {
      alert("Enter a project name.");
      return;
    }

    appData.project = {
      name,
      duration: 5
    };

    appData.characters = [];
    appData.scenes = [];

    document.getElementById("newProjectName").value = "";

    closeModal("projectModal");

    saveData();

    renderAll();

  });


// -------------------------
// CHARACTER CREATOR
// -------------------------

document.getElementById("newCharacterBtn")
  .addEventListener("click", () => {

    openModal("characterModal");

  });


document.getElementById("createCharacter")
  .addEventListener("click", () => {

    const name =
      document.getElementById("characterName").value.trim();

    const description =
      document.getElementById("characterDescription").value.trim();

    const emoji =
      document.getElementById("characterEmoji").value || "🧑🏽";

    if (!name) {
      alert("Give your character a name.");
      return;
    }

    appData.characters.push({

      id: crypto.randomUUID(),

      name,

      description,

      emoji,

      created: Date.now()

    });

    document.getElementById("characterName").value = "";
    document.getElementById("characterDescription").value = "";

    closeModal("characterModal");

    autosave();

    renderCharacters();

  });


// -------------------------
// DELETE CHARACTER
// -------------------------

function deleteCharacter(id) {

  appData.characters =
    appData.characters.filter(character =>
      character.id !== id
    );

  autosave();

  renderCharacters();

}


// -------------------------
// SCENES
// -------------------------

document.getElementById("newSceneBtn")
  .addEventListener("click", () => {

    openModal("sceneModal");

  });


document.getElementById("createScene")
  .addEventListener("click", () => {

    const name =
      document.getElementById("sceneName").value.trim()
      || `Scene ${appData.scenes.length + 1}`;

    const background =
      document.getElementById("sceneBackground").value;

    const duration =
      Number(document.getElementById("sceneTime").value) || 5;

    appData.scenes.push({

      id: crypto.randomUUID(),

      name,

      background,

      duration,

      dialogue: "",

      characters: []

    });

    document.getElementById("sceneName").value = "";

    closeModal("sceneModal");

    autosave();

    renderScenes();

  });


// -------------------------
// DELETE SCENE
// -------------------------

function deleteScene(id) {

  appData.scenes =
    appData.scenes.filter(scene =>
      scene.id !== id
    );

  autosave();

  renderScenes();

}


// -------------------------
// PROJECT RENDER
// -------------------------

function renderProjects() {

  const grid =
    document.getElementById("projectGrid");

  grid.innerHTML = `

    <div class="project-card">

      <h3>${escapeHTML(appData.project.name)}</h3>

      <p>
        ${appData.scenes.length} scenes ·
        ${appData.characters.length} characters
      </p>

      <div class="card-actions">

        <button onclick="openProject()">
          Open
        </button>

        <button onclick="renameProject()">
          Rename
        </button>

      </div>

    </div>

  `;

  document.getElementById("projectName")
    .textContent = appData.project.name;

}


function openProject() {

  document.querySelector('[data-page="scenes"]')
    .click();

}


function renameProject() {

  const name =
    prompt(
      "Project name:",
      appData.project.name
    );

  if (!name) return;

  appData.project.name = name;

  autosave();

  renderAll();

}


// -------------------------
// CHARACTER RENDER
// -------------------------

function renderCharacters() {

  const grid =
    document.getElementById("characterGrid");

  if (!appData.characters.length) {

    grid.innerHTML = `

      <div class="project-card">

        <h3>No characters yet</h3>

        <p>
          Create your first character to start
          building your cartoon.
        </p>

      </div>

    `;

    return;
  }

  grid.innerHTML =
    appData.characters.map(character => `

      <div class="character-card">

        <div class="character-avatar">
          ${character.emoji}
        </div>

        <h3>
          ${escapeHTML(character.name)}
        </h3>

        <p>
          ${escapeHTML(character.description || "No description")}
        </p>

        <button
          style="margin-top:14px"
          onclick="deleteCharacter('${character.id}')">
          Delete
        </button>

      </div>

    `).join("");

}


// -------------------------
// SCENE RENDER
// -------------------------

function renderScenes() {

  const list =
    document.getElementById("sceneList");

  if (!appData.scenes.length) {

    list.innerHTML = `

      <div class="project-card">

        <h3>No scenes yet</h3>

        <p>
          Create your first scene.
        </p>

      </div>

    `;

    return;
  }

  list.innerHTML =
    appData.scenes.map((scene, index) => `

      <div class="scene-card">

        <div class="scene-info">

          <div class="scene-number">
            ${index + 1}
          </div>

          <div>

            <strong>
              ${escapeHTML(scene.name)}
            </strong>

            <br>

            <small>
              ${scene.background} ·
              ${scene.duration}s
            </small>

          </div>

        </div>

        <div>

          <button onclick="previewScene('${scene.id}')">
            Preview
          </button>

          <button onclick="deleteScene('${scene.id}')">
            Delete
          </button>

        </div>

      </div>

    `).join("");

}


// -------------------------
// PREVIEW
// -------------------------

function previewScene(id) {

  const scene =
    appData.scenes.find(x => x.id === id);

  if (!scene) return;

  const preview =
    document.getElementById("preview");

  preview.classList.add("show");

  document.getElementById("stageDialogue")
    .textContent =
      scene.dialogue || scene.name;

}


document.getElementById("previewBtn")
  .addEventListener("click", () => {

    if (!appData.scenes.length) {

      alert("Create a scene first.");

      return;

    }

    previewScene(appData.scenes[0].id);

  });


document.getElementById("closePreview")
  .addEventListener("click", () => {

    document.getElementById("preview")
      .classList.remove("show");

  });


document.getElementById("playPreview")
  .addEventListener("click", () => {

    const character =
      document.getElementById("stageCharacter");

    character.style.transform =
      "translateX(120px)";

    setTimeout(() => {

      character.style.transform =
        "translateX(-120px)";

    }, 700);

  });


document.getElementById("stopPreview")
  .addEventListener("click", () => {

    document.getElementById("stageCharacter")
      .style.transform = "translateX(0)";

  });


// -------------------------
// SETTINGS
// -------------------------

document.getElementById("applySettings")
  .addEventListener("click", () => {

    const name =
      document.getElementById("projectTitle").value.trim();

    const duration =
      Number(
        document.getElementById("sceneDuration").value
      ) || 5;

    if (name) {
      appData.project.name = name;
    }

    appData.project.duration = duration;

    autosave();

    renderAll();

    alert("Settings saved.");

  });


function renderSettings() {

  document.getElementById("projectTitle")
    .value = appData.project.name;

  document.getElementById("sceneDuration")
    .value = appData.project.duration;

}


// -------------------------
// EXPORT PROJECT DATA
// -------------------------

document.getElementById("exportBtn")
  .addEventListener("click", () => {

    const file = new Blob(
      [
        JSON.stringify(
          appData,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(file);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${appData.project.name.replace(/\s+/g, "-")}.json`;

    link.click();

    URL.revokeObjectURL(url);

  });


// -------------------------
// SAVE BUTTON
// -------------------------

document.getElementById("saveBtn")
  .addEventListener("click", () => {

    saveData();

  });


// -------------------------
// ESCAPE HTML
// -------------------------

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


// -------------------------
// RENDER EVERYTHING
// -------------------------

function renderAll() {

  renderProjects();

  renderCharacters();

  renderScenes();

  renderSettings();

}


// -------------------------
// START
// -------------------------

loadData();
