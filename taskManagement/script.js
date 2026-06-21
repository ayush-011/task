const input = document.querySelector(".inputField");
const taskField = document.querySelector("ul");
const add = document.querySelector(".addBtn");
const selected = document.querySelector("select");
const filterInput = document.querySelector(".filter");

let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function renderTasks() {
  taskField.innerHTML = "";

  tasksArray.forEach((taskObj) => {
    const list = document.createElement("li");
    list.dataset.id = taskObj.id; 

    const taskText = document.createElement("span");
    taskText.textContent = taskObj.text;
    taskText.classList.add("taskTextSpan");
    list.appendChild(taskText);
    
    const categorySpan = document.createElement("span");
    categorySpan.textContent = taskObj.category;
    categorySpan.classList.add("taskCategory");
    list.appendChild(categorySpan);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");
    list.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
    list.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      tasksArray = tasksArray.filter(t => t.id !== taskObj.id);
      saveToLocalStorage();
      renderTasks();
      runFilteringLogic();
    });

    editBtn.addEventListener("click", () => {
      if (editBtn.textContent === "Edit") {
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = taskText.textContent;
        newInput.classList.add("newEditedText");
        list.replaceChild(newInput, taskText);
        editBtn.textContent = "Save";
      } else {
        const newInputSelect = list.querySelector(".newEditedText");
        const finalValue = newInputSelect.value.trim();
        if (finalValue !== "") {
          const taskToUpdate = tasksArray.find(t => t.id === taskObj.id);
          if (taskToUpdate) {
            taskToUpdate.text = finalValue;
          }
          saveToLocalStorage();
          renderTasks();
          runFilteringLogic();
        }
      }
    });

    taskField.appendChild(list);
  });
}

add.addEventListener("click", () => {
  const inputValue = input.value.trim();
  if (inputValue === "") return;

  const newTask = {
    id: Date.now(), 
    text: inputValue,
    category: selected.value
  };

  tasksArray.push(newTask);
  saveToLocalStorage();
  renderTasks();
  runFilteringLogic();

  input.value = "";
});

function runFilteringLogic() {
  const filterText = filterInput.value.toLowerCase();
  const allTask = taskField.querySelectorAll("li");
  
  allTask.forEach(element => {
    const taskValue = element.querySelector(".taskTextSpan");
    if (taskValue) {
      const taskValueText = taskValue.textContent.toLowerCase();
      if (taskValueText.includes(filterText)) {
        element.style.display = "flex";
      } else {
        element.style.display = "none";
      }
    }
  });
}

filterInput.addEventListener("input", runFilteringLogic);

renderTasks();
1