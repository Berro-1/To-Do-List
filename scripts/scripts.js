const addTaskButton = document.getElementById("add-task-btn");
const taskNameInput = document.getElementById("task-name");
const taskDescInput = document.getElementById("task-desc");
const taskDateInput = document.getElementById("task-date");
const userSelect = document.getElementById("user-select");

document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    const taskNameInput = document.getElementById('task-name');
    const taskDescInput = document.getElementById('task-desc');
    const taskDateInput = document.getElementById('task-date');
    const userSelect = document.getElementById('user-select');
    const taskName = taskNameInput.value.trim(); // Ensure whitespace is trimmed
    const taskDesc = taskDescInput.value.trim();
    const taskDate = taskDateInput.value;
    const assignedUser = userSelect.value;

    // Create date objects for validation
    const selectedDate = new Date(taskDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours for accurate day comparison
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if the selected date is before tomorrow
    if (selectedDate < tomorrow) {
        alert("Please select a due date that is not earlier than tomorrow.");
        return; // Stop the function if the date is invalid
    }

    // Continue with task addition if the date is valid
    if (taskName && taskDesc && taskDate && assignedUser) {
        const task = {
            name: taskName,
            desc: taskDesc,
            date: taskDate,
            assignedTo: assignedUser,
            status: "pending",
        };
        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        clearInputFields();
    } else {
        alert("Please fill in all fields."); // Alert if any field is empty
    }
}
function addTaskToDOM(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-card";

  if (task.status === "completed") {
    taskElement.classList.add("completed");
  } else if (task.status === "past due") {
    taskElement.classList.add("past-due");
  }

  taskElement.innerHTML = `
        <div>
            <h3>${task.name}</h3>
            <p>Description: ${task.desc}</p>
            <p>Due Date: ${task.date}</p>
            <p>Assigned to: ${task.assignedTo}</p>
            <p>Status: ${task.status}</p>
            ${
              task.status !== "completed" && task.status !== "past due"
                ? `<button onclick="markAsCompleted('${task.name}')" class="complete-btn"><i class="fas fa-check"></i> Mark as Completed</button>`
                : ""
            }
            ${
              task.status !== "completed"
                ? `<button onclick="deleteTask('${task.name}')" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>`
                : ""
            }
               ${
              task.status == "completed"
                ? `<button onclick="deleteTask('${task.name}')" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>`
                : ""
            }
        
        </div>`;
  document.querySelector(".tasks").appendChild(taskElement);
}

function clearInputFields() {
  taskNameInput.value = "";
  taskDescInput.value = "";
  taskDateInput.value = "";
  userSelect.value = "";
}

function saveTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  updateTaskStatuses();
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTaskToDOM(task));
}
function deleteTask(taskName) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.name !== taskName);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.querySelectorAll(".task-card").forEach((card) => {
    if (card.querySelector("h3").textContent === taskName) {
      card.remove();
    }
  });
}

function updateTaskStatuses() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const currentDate = new Date();
    const dueDate = new Date(task.date);
    if (task.status !== "completed" && currentDate > dueDate) {
      task.status = "past due";
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function markAsCompleted(taskName) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    if (task.name === taskName) {
      task.status = "completed";
      document.querySelectorAll(".task-card").forEach((card) => {
        if (card.querySelector("h3").textContent === taskName) {
          card.classList.add("completed");
          card.querySelector("p:last-child").textContent = "Status: Completed";
        }
      });
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

loadTasksFromLocalStorage();
