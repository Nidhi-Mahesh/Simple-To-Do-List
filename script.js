// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const clock = document.getElementById('clock');
const dateElement = document.getElementById('date');
const themeColorPicker = document.getElementById('theme-color');
const cuteHeader = document.querySelector('.cute-header h1');
const header = document.querySelector('.header');

// Load tasks, progress, and theme color from local storage
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadProgress();
  loadThemeColor();
});

// Add a new task on button click
addTaskBtn.addEventListener('click', addTask);

// Add a new task on Enter key press
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Update clock every second
setInterval(updateClock, 1000);
updateClock();

// Update date
updateDate();

// Change theme color and save it
themeColorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  document.body.style.backgroundColor = color;
  progressBar.style.backgroundColor = color;
  addTaskBtn.style.backgroundColor = color;
  cuteHeader.style.color = color;
  header.style.color = color; // Update header text color
  taskInput.style.color = color; // Update input text color
  taskInput.style.borderColor = color; // Update input border color
  localStorage.setItem('themeColor', color);
});

// Function to add a task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  // Create a new task item
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';

  // Add the task text
  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskItem.appendChild(taskTextSpan);

  // Add a delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', deleteTask);
  taskItem.appendChild(deleteBtn);

  // Add a click event to mark the task as completed
  taskItem.addEventListener('click', toggleCompleted);

  // Add the task to the list
  taskList.appendChild(taskItem);

  // Save the task to local storage
  saveTaskToLocalStorage(taskText, false); // Default: task is not completed

  // Clear the input field
  taskInput.value = '';

  // Update progress bar
  updateProgressBar();
}

// Function to delete a task
function deleteTask(event) {
  const taskItem = event.target.parentElement;
  const taskText = taskItem.querySelector('span').textContent;

  // Remove the task from the DOM
  taskItem.remove();

  // Remove the task from local storage
  removeTaskFromLocalStorage(taskText);

  // Update progress bar
  updateProgressBar();
}

// Function to toggle task completion
function toggleCompleted(event) {
  const taskItem = event.currentTarget;
  taskItem.classList.toggle('completed');

  // Update the task's completed state in local storage
  const taskText = taskItem.querySelector('span').textContent;
  const isCompleted = taskItem.classList.contains('completed');
  updateTaskCompletionInLocalStorage(taskText, isCompleted);

  // Update progress bar
  updateProgressBar();
}

// Function to update the progress bar
function updateProgressBar() {
  const totalTasks = taskList.children.length;
  const completedTasks = document.querySelectorAll('.task-item.completed').length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  progressBar.style.width = `${progress}%`;

  // Save progress to local storage
  localStorage.setItem('progress', progress);
}

// Function to load progress from local storage
function loadProgress() {
  const progress = localStorage.getItem('progress') || 0;
  progressBar.style.width = `${progress}%`;
}

// Function to load theme color from local storage
function loadThemeColor() {
  const themeColor = localStorage.getItem('themeColor') || '#76c7c0';
  document.body.style.backgroundColor = themeColor;
  progressBar.style.backgroundColor = themeColor;
  addTaskBtn.style.backgroundColor = themeColor;
  cuteHeader.style.color = themeColor;
  header.style.color = themeColor; // Update header text color
  taskInput.style.color = themeColor; // Update input text color
  taskInput.style.borderColor = themeColor; // Update input border color
  themeColorPicker.value = themeColor;
}

// Function to save a task to local storage
function saveTaskToLocalStorage(task, isCompleted) {
  if (!task || task.trim() === '') return; // Skip empty tasks
  let tasks = getTasksFromLocalStorage();
  tasks.push({ text: task, completed: isCompleted });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getTasksFromLocalStorage() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  return tasks;
}

// Function to load tasks from local storage
function loadTasks() {
  let tasks = getTasksFromLocalStorage();
  tasks.forEach(task => {
    // Skip invalid or empty tasks
    if (!task.text || task.text.trim() === '') return;

    // Create a new task item
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    // Add the task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    taskItem.appendChild(taskTextSpan);

    // Add a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteTask);
    taskItem.appendChild(deleteBtn);

    // Add a click event to mark the task as completed
    taskItem.addEventListener('click', toggleCompleted);

    // Mark the task as completed if it was completed before
    if (task.completed) {
      taskItem.classList.add('completed');
    }

    // Add the task to the list
    taskList.appendChild(taskItem);
  });

  // Update progress bar
  updateProgressBar();
}

// Function to remove a task from local storage
function removeTaskFromLocalStorage(task) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter(t => t.text !== task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update a task's completion status in local storage
function updateTaskCompletionInLocalStorage(task, isCompleted) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.map(t => {
    if (t.text === task) {
      return { ...t, completed: isCompleted };
    }
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update the clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  clock.textContent = time;
}

// Function to update the date
function updateDate() {
  const now = new Date();
  const date = now.toLocaleDateString();
  dateElement.textContent = date;
}