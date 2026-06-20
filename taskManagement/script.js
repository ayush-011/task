const input = document.querySelector(".inputField");
const taskField = document.querySelector("ul");
const add = document.querySelector(".addBtn");
const selected = document.querySelector("select");
const filterInput = document.querySelector(".filter");

add.addEventListener("click", () => {
  const inputValue = input.value;
  if (inputValue.trim() === "") return;

  const list = document.createElement("li");

  const taskText = document.createElement("span");
  taskText.textContent = inputValue;
  taskText.classList.add("taskTextSpan");
  taskText.style.fontSize = "20px";
  list.appendChild(taskText);
  
  const categoryValue = selected.value;
  const categorySpan = document.createElement("span");
  categorySpan.textContent = ` (${categoryValue})`;
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
    list.remove();
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
        taskText.textContent = finalValue;
        list.replaceChild(taskText, newInputSelect);
        editBtn.textContent = "Edit";
        runFilteringLogic();
      }
    }
  });

  taskField.appendChild(list);
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
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  });
}

filterInput.addEventListener("input", runFilteringLogic);
