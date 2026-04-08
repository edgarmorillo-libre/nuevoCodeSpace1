const STORAGE_KEY = 'todo-app-items';
const THEME_KEY = 'todo-app-theme';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const message = document.getElementById('message');
const themeToggle = document.getElementById('theme-toggle');

let todos = [];

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  todos = stored ? JSON.parse(stored) : [];
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
  }
}

function saveTheme(isDark) {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  saveTheme(isDark);
}

function showMessage(text, isError = true) {
  message.textContent = text;
  message.style.color = isError ? 'var(--danger)' : 'var(--success)';
  if (text) {
    setTimeout(() => {
      message.textContent = '';
    }, 2500);
  }
}

function createTodoElement(todo) {
  const item = document.createElement('li');
  item.className = 'todo-item' + (todo.completed ? ' completed' : '');

  const text = document.createElement('p');
  text.className = 'todo-text';
  text.textContent = todo.title;

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'toggle';
  toggleButton.textContent = todo.completed ? 'Deshacer' : 'Completar';
  toggleButton.addEventListener('click', () => {
    toggleTodoStatus(todo.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete';
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => {
    deleteTodo(todo.id);
  });

  actions.appendChild(toggleButton);
  actions.appendChild(deleteButton);
  item.appendChild(text);
  item.appendChild(actions);
  return item;
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No hay tareas. Agrega una nueva.';
    todoList.appendChild(empty);
    return;
  }

  todos.forEach(todo => {
    todoList.appendChild(createTodoElement(todo));
  });
}

function addTodo(title) {
  const trimmed = title.trim();
  if (!trimmed) {
    showMessage('Ingrese una tarea válida.');
    return;
  }

  const newTodo = {
    id: Date.now().toString(),
    title: trimmed,
    completed: false,
  };

  todos.unshift(newTodo);
  saveTodos();
  renderTodos();
  input.value = '';
  showMessage('Tarea agregada.', false);
}

function toggleTodoStatus(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  showMessage('Tarea eliminada.', false);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  addTodo(input.value);
});

themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  loadTheme();
  renderTodos();
});
