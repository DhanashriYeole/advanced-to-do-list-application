let tasks = [];

window.onload = () => {
  const saved = localStorage.getItem("todo-tasks");
  if (saved) tasks = JSON.parse(saved);
  renderTasks("all");

  // Theme
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
};

document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("searchInput").addEventListener("input", () => renderTasks(currentFilter));
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

let currentFilter = "all";

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dueDateInput");
  const categoryInput = document.getElementById("categoryInput");

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    date: dateInput.value,
    category: categoryInput.value
  });

  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  taskInput.value = "";
  dateInput.value = "";
  categoryInput.value = "";

  renderTasks(currentFilter);
}

function renderTasks(filter) {
  currentFilter = filter;
  const list = document.getElementById("taskList");
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  list.innerHTML = "";

  tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;
    if (searchQuery && !task.text.toLowerCase().includes(searchQuery)) return;

    const li = document.createElement("li");

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const span = document.createElement("span");
    span.className = "task-text";
    if (task.completed) span.classList.add("completed");
    span.textContent = task.text;
    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saveAndRender();
    });

    taskContent.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText !== null) {
        task.text = newText.trim();
        saveAndRender();
      }
    });

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Due: ${task.date || 'N/A'} | ${task.category || 'General'}`;

    li.appendChild(taskContent);
    li.appendChild(meta);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function filterTasks(type) {
  renderTasks(type);
}

function saveAndRender() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  renderTasks(currentFilter);
}
