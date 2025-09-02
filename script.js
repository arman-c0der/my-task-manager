const API_URL = "http://localhost:3000/tasks"

// DOM Elements
const form = document.querySelector("form")
const titleInput = form.querySelector("input[placeholder='Enter your task name']")
const descInput = form.querySelector("textarea")
const assignedInput = form.querySelector("input[placeholder='Enter name whom you have to assign to']")
const startInput = form.querySelector("input[type='date']")
const endInput = form.querySelectorAll("input[type='date']")[1]
const priorityInputs = form.querySelectorAll("input[name='priority']")
const statusInputs = form.querySelectorAll("input[name='status']")
const completedRange = form.querySelector("input[type='range']")
const completedText = form.querySelector("span")
const addBtn = form.querySelector("button")

const tableBody = document.querySelector("tbody")

// Load tasks
async function loadTasks() {
  const res = await fetch(API_URL)
  const tasks = await res.json()
  renderTasks(tasks)
}

// Render tasks
function renderTasks(tasks) {
  tableBody.innerHTML = ""
  tasks.forEach(task => {
    const tr = document.createElement("tr")
    tr.className = "bg-white border-b"
    tr.innerHTML = `
      <td class="py-2 px-3">${task.id}</td>
      <td class="py-2 px-3">${task.title}</td>
      <td class="py-2 px-3">
        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">${task.priority}</span>
      </td>
      <td class="py-2 px-3">${task.status}</td>
      <td class="py-2 px-3">${task.submitDate}</td>
      <td class="py-2 px-3">${task.assignedTo}</td>
      <td class="py-2 px-3">
        <div class="w-32 bg-gray-200 rounded-full h-5 flex items-center relative">
          <div class="bg-blue-500 h-5 rounded-full" style="width:${task.completed}%"></div>
          <span class="absolute ml-2 text-white font-bold text-xs">${task.completed}%</span>
        </div>
      </td>
      <td class="py-2 px-3">
        <div class="flex justify-center items-center gap-2">
          <button onclick="deleteTask(${task.id})" class="text-red-600 hover:text-red-800">
            ❌
          </button>
        </div>
      </td>
    `
    tableBody.appendChild(tr)
  })
}

// Add Task
addBtn.addEventListener("click", async () => {
  const task = {
    title: titleInput.value,
    description: descInput.value,
    assignedTo: assignedInput.value,
    start: startInput.value,
    end: endInput.value,
    priority: [...priorityInputs].find(r => r.checked)?.nextSibling.textContent.trim() || "Low",
    status: [...statusInputs].find(r => r.checked)?.nextSibling.textContent.trim() || "New",
    completed: parseInt(completedRange.value),
    submitDate: new Date().toISOString().split("T")[0]
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })

  loadTasks()
  form.reset()
})

// Delete Task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" })
  loadTasks()
}

// Completed percentage live update
completedRange.addEventListener("input", () => {
  completedText.textContent = `${completedRange.value}%`
})

// Initial load
loadTasks()
