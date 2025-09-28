// Basic Todo app with localStorage persistence
const TODO_KEY = 'tfp_todo_app';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearBtn = document.getElementById('clearBtn');

// util: generate simple ID
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// get todos from localStorage
function getTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODO_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTodos(arr) {
  localStorage.setItem(TODO_KEY, JSON.stringify(arr));
}

function renderTodos() {
  const todos = getTodos();
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'There are no tasks by the moment';
    li.style.color = 'var(--muted)';
    li.style.padding = '10px 0';
    todoList.appendChild(li);
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    // checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox' + (todo.completed ? ' checked' : '');
    checkbox.title = 'Toggle complete';
    checkbox.addEventListener('click', () => {
      toggleTodo(todo.id);
    });

    // Text
    const text = document.createElement('div');
    text.className = 'todo-text' + (todo.completed ? ' completed' : '');
    text.textContent = todo.text;

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      editTodo(text, todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Add Todo
function addTodo(text) {
  if (!text || !text.trim()) return;
  const todos = getTodos();
  todos.push({
    id: uid(),
    text: text.trim(),
    completed: false,
  });
  saveTodos(todos);
  renderTodos();
}

// Add via enter key
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo(todoInput.value);
    todoInput.value = '';
  }
});

// Add via button
addBtn.addEventListener('click', () => {
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

// Toggle task
function toggleTodo(id) {
  const todos = getTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  todos[idx].completed = !todos[idx].completed;
  saveTodos(todos);
  renderTodos();
}

// Delete Task
function deleteTodo(id) {
  let todos = getTodos();
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

function editTodo(task, id) {
  const todos = getTodos();
  const currentText = task.textContent;
  const input = document.createElement('input');
  input.placeholder = 'Edit task...';
  input.className = 'input';
  input.type = 'text';
  input.value = currentText;

  // Injecting the input on the DOM
  task.replaceWith(input);
  input.focus();

  input.addEventListener('blur', () => {
    task.textContent = input.value.trim() || currentText;
    input.replaceWith(task);

    // Update the tasks on localStorage
    const taskIndex = todos.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      todos[taskIndex].text = input.value.trim() || currentText;
      saveTodos(todos);
      renderTodos();
    }
  });
}

// Clear all tasks
clearBtn.addEventListener('click', () => {
  if (!confirm('Do you want to clear all tasks ?')) return;
  localStorage.removeItem(TODO_KEY);
  renderTodos();
});

// Render Initial Todos
renderTodos();
