const form = document.querySelector("form");
const ul = document.querySelector("ul");
const count = document.getElementById("count");

function getStoredTodos() {
  return JSON.parse(localStorage.getItem("todos")) ?? [];
}

function storeTodosLocally(value) {
  localStorage.setItem("todos", JSON.stringify(value));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const done = form.elements.done.checked;
  const description = form.elements.description.value;

  if (!description) return;

  const payload = { id: window.crypto.randomUUID(), done, description };
  const todos = getStoredTodos();

  storeTodosLocally(!todos ? [payload] : [...todos, payload]);
  addTodo(payload);

  e.target.done.checked = false;
  e.target.description.value = "";
});

function addTodo(todoAdded) {
  const li = document.createElement("li");
  const div = document.createElement("div");
  const checkbox = document.createElement("input");
  const p = document.createElement("p");
  const img = document.createElement("img");

  li.className = "todo";

  if (todoAdded.done) {
    li.classList.add("todo--done");
  }

  li.id = todoAdded.id;
  checkbox.type = "checkbox";
  checkbox.checked = todoAdded.done;
  checkbox.className = "checkbox";
  p.textContent = todoAdded.description;
  img.src = "images/icon-cross.svg";

  checkbox.addEventListener("click", () => completeTodo(todoAdded.id));

  img.addEventListener("click", () => removeTodo(todoAdded.id));

  div.appendChild(checkbox);
  div.appendChild(p);
  li.appendChild(div);
  li.appendChild(img);
  ul.append(li);
}

function completeTodo(id) {
  const todos = getStoredTodos();
  const todo = todos.findIndex((todo) => todo.id === id);
  todos[todo].done = !todos[todo].done;
  localStorage.setItem("todos", JSON.stringify([...todos]));
  const li = document.getElementById(id);
  li.classList.toggle("todo--done");
}

function removeTodo(id) {
  const todos = getStoredTodos();
  const todo = todos.findIndex((todo) => todo.id === id);
  todos.splice(todo, 1);
  localStorage.setItem("todos", JSON.stringify([...todos]));
  const li = document.getElementById(id);
  todos.splice(todo, 1);
  ul.removeChild(li);
}

function handleOnFilter(elementId, callback) {
  document.getElementById(elementId).addEventListener("click", () => callback);
}

handleOnFilter("active", filterTodos(false));
handleOnFilter("completed", filterTodos(true));
handleOnFilter("all", getStoredTodos());

function removeElement(id) {
  const node = document.getElementById(id);
  if (node) node.remove();
}

function filterTodos(isDone) {
  const todos = getStoredTodos();
  const filteredTodos = todos.filter((todo) => todo.done === isDone);

  todos.forEach((todo) => removeElement(todo.id));
  filteredTodos.forEach((todo) => addTodo(todo));
}

document.getElementById("clear-all").addEventListener("click", () => {
  let todos = getStoredTodos();
  todos.forEach((t) => {
    if (t.done) {
      todos = todos.filter((todo) => todo.id !== t.id);
      document.getElementById(t.id).remove();
    }
  });
  localStorage.setItem("todos", JSON.stringify([...todos]));
});

window.onload = () => {
  const todos = getStoredTodos();
  todos.forEach((todo) => addTodo(todo));
};
