let todos = [];

const filterModes = {
  All: 0,
  Active: 1,
  Completed: 2,
};

let filterMode = filterModes.All;
let mainInputForm = document.querySelector("[class='main-input-form']");
let mainInput = document.querySelector("[class='main-input']");
let todoList = document.querySelector("[class='todo-list']");
let leftCounter = document.querySelector("[class='footer-sign']");
let filterSelectors = document.querySelectorAll("[name='tasks-selector-radio']");
let filterSelector = document.querySelector("[class='selector']");
let checkButton = document.querySelector("[class='check-button']");
let clearCompletedButton = document.querySelector("[class='clear-button']");

for (selector of filterSelectors) {
  if (selector.checked) {
    if (selector.value == "all") {
      filterMode = filterModes.All;
    }
    if (selector.value == "active") {
      filterMode = filterModes.Active;
    }
    if (selector.value == "completed") {
      filterMode = filterModes.Completed;
    }
  }
}

function addTodo(e) {
  const todo = newTodo(mainInput.value);
  mainInput.value = "";
  todos.push(todo);
  if (filterMode != filterModes.Completed) {
    todoList.appendChild(createNodeOfTodo(todo));
  }
  updateLeftCounter();
  e.preventDefault();
}

mainInputForm.addEventListener("submit", addTodo);

function changeFilter(e) {
  if (e.target.nodeName != "INPUT") {
    return;
  }
  console.log(e.target.nodeName)
  id = e.target.id;
  if (id == "radio-all") {
    filterMode = filterModes.All;
  }
  if (id == "radio-active") {
    filterMode = filterModes.Active;
  }
  if (id == "radio-completed") {
    filterMode = filterModes.Completed;
  }
  rerenderTodos();
}

filterSelector.addEventListener("click", changeFilter);


function markEverythingAsCompleted() {
  for (todo of todos) {
    todo.isActive = false;
  }
  rerenderTodos();
  updateLeftCounter();
}

checkButton.addEventListener("click", markEverythingAsCompleted);

function clearAllCompleted() {
  todos = todos.filter((value, index, arr) => value.isActive == true);
  rerenderTodos();
}

clearCompletedButton.addEventListener("click", clearAllCompleted);

function rerenderTodos() {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.lastChild);
  }
  for (todo of todos) {
    if (isInFilter(todo)) {
      todoList.appendChild(createNodeOfTodo(todo));
    }
  }
}

function isInFilter(todo) {
  return (
    filterMode == filterModes.All ||
    (filterMode == filterModes.Active && todo.isActive) ||
    (filterMode == filterModes.Completed && !todo.isActive)
  );
}

function updateLeftCounter() {
  cnt = 0;
  for (todo of todos) {
    if (todo.isActive) {
      cnt++;
    }
  }
  leftCounter.textContent = cnt + " items left";
}

function remarkToDo(e) {
  if (e.target.getAttribute("class") == "done-checkbox") {
    id = e.target.getAttribute("id").split("-")[1];
    for (todo of todos) {
      if (todo.rndID == id) {
        todo.isActive = !e.target.checked;
        break;
      }
    }

    if (!isInFilter(todo)) {
      e.target.parentNode.remove();
    }
    updateLeftCounter();
  }
}

todoList.addEventListener('click', remarkToDo)


function deleteToDo(e) {
  if (e.target.getAttribute("class") == "delete-button") {
    todoNode = e.target.parentNode;
    let id = todoNode.getAttribute("id").split("-")[2];
    let indexToDelete = 0;
    todos = todos.filter((value, index, arr) => value.rndID != id);
    todoNode.remove();
    updateLeftCounter();
  }
}

todoList.addEventListener('click', deleteToDo)


function newTodo(name) {
  return {
    rndID: Date.now(),
    label: name,
    isActive: true,
  };
}

function createNodeOfTodo(todo) {
  const ans = document.createElement("li");
  ans.setAttribute("class", "todo-thing");
  ans.setAttribute("id", "todo-thing-" + todo.rndID);
  ans.setAttribute("aria-label", "Todo - " + todo.label);
  ans.appendChild(createCheckboxForTodo(todo));
  ans.appendChild(createCheckboxImageForTodo(todo));
  ans.appendChild(createSignForTodo(todo));
  ans.appendChild(createDeleteButtonForTodo(todo));
  return ans;
}

function createCheckboxForTodo(todo) {
  const ans = document.createElement("input");
  ans.setAttribute("id", "checkbox-" + todo.rndID);
  ans.setAttribute("class", "done-checkbox");
  ans.setAttribute("type", "checkbox");
  ans.setAttribute(
    "aria-label",
    "Mark '" + todo.label + "' as " + (todo.isActive ? "" : "un") + "done"
  );
  ans.checked = !todo.isActive;
  return ans;
}

function createCheckboxImageForTodo(todo) {
  const ans = document.createElement("label");
  ans.setAttribute("class", "checkbox-image");
  ans.setAttribute("for", "checkbox-" + todo.rndID);
  return ans;
}

function createSignForTodo(todo) {
  const ans = document.createElement("span");
  ans.setAttribute("class", "todo-thing-string");
  ans.textContent = todo.label;
  return ans;
}

function createDeleteButtonForTodo(todo) {
  const ans = document.createElement("button");
  ans.setAttribute("class", "delete-button");
  ans.setAttribute("aria-label", "Delete '" + todo.label + "' task");
  return ans;
}
