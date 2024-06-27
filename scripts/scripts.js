const addTaskButton = document.getElementById("add-task-btn");
const taskNameInput = document.getElementById("task-name");
const taskDescInput = document.getElementById("task-desc");
const taskDateInput = document.getElementById("task-date");
const userSelect = document.getElementById("user-select");

addTaskButton.addEventListener("click", addTask);

function addTask() {
  const taskName = taskNameInput.value;
  const taskDesc = taskDescInput.value;
  const taskDate = taskDateInput.value;
  const assignedUser = userSelect.value;

  if (taskName && taskDate && taskDesc && assignedUser) {
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
  }
}

function addTaskToDOM(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-card";
  taskElement.innerHTML = `
        <div>
            <h3>${task.name}</h3>
            <p>Description: ${task.desc}</p>
            <p>Due Date: ${task.date}</p>
            <p>Assigned to: ${task.assignedTo}</p>
        </div>
        
    `;
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

function removeTaskFromLocalStorage(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.name !== taskToRemove.name);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTaskToDOM(task));
}

loadTasksFromLocalStorage();
