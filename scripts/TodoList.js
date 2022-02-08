import Todo from "./Todo.js";

class TodoList {
  constructor(list, date, lastID) {
    this.list = list;
    this.date = date;
    this.lastID = lastID;
    this.formIsValid = [false, false];
  }

  init() {
    const date = document.querySelector("#date");
    date.innerHTML = `${this.getFormatedDate(
      this.date,
      "."
    )}<br />${this.getToday()}`;

    const newTodoBtns = document.querySelectorAll(".newBtn");
    newTodoBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
        });
        const body = document.querySelector("body");
        body.classList.add("modalActive");
        const newTodoModal = document.querySelector(".modal-new");
        newTodoModal.style.top = `0px`;
        if (newTodoModal.classList.value.includes("inactive")) {
          newTodoModal.classList.remove("inactive");
        }
      })
    );

    this.setNumberOfTaskLeft(this.list);

    this.renderList(this.list);

    this.initFilters();
    this.initColorThemeChange();
    this.initNewTodoModal();

    // const importBtn = document.querySelector("#importBtn");
    const fileInput = document.querySelector("#fileInput");

    fileInput.addEventListener("change", (e) => this.onChooseFile(e));

    const exportBtn = document.querySelector("#exportBtn");
    exportBtn.addEventListener("click", () =>
      this.exportToFile(this.list, this.lastID)
    );

    const detailsHeadChilds = [
      ...document.querySelector(".details-head").children,
    ];
    detailsHeadChilds.forEach((elem) =>
      elem.addEventListener("click", () => {
        // console.log(elem.innerText.toLowerCase().replace(" ", ""));
        this.sortBy(elem.innerText.toLowerCase().replace(" ", ""));
      })
    );
  }

  getFormatedDate(date, separator) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const setTwoDigit = (value) => {
      return value < 10 ? "0" + value : value;
    };
    return `${year}${separator}${setTwoDigit(month)}${separator}${setTwoDigit(
      day
    )}`;
  }

  getToday() {
    return this.date.toLocaleDateString("en-En", { weekday: "long" });
  }

  setNumberOfTaskLeft(todoList) {
    const getNumberOfTaskLeft = () => {
      if (!todoList.length) {
        return 0;
      }

      return todoList.filter((item) => item.taskDone === false).length;
    };

    const todoItemsLeft = document.querySelector("#todo-items-left");
    todoItemsLeft.innerText = `You have ${getNumberOfTaskLeft(
      todoList
    )} pending items.`;
  }

  renderList(listObj) {
    const activeTodosCtn = document.querySelector(".container-active");
    const completedTodosCtn = document.querySelector(".container-completed");
    activeTodosCtn.innerText = "";
    completedTodosCtn.innerText = "";
    listObj.forEach((task) => this.createTask(task));
  }

  createTask(task) {
    const activeTodosCtn = document.querySelector(".container-active");
    const completedTodosCtn = document.querySelector(".container-completed");
    task.taskDone
      ? new Todo(task, this).init(completedTodosCtn, task.taskDone)
      : new Todo(task, this).init(activeTodosCtn, task.taskDone);
  }

  initColorThemeChange() {
    const lightDarkIcon = document.querySelector("#lightDarkIcon");

    const changeColor = (lightDarkIcon) => {
      const html = document.querySelector("html");
      if (lightDarkIcon.classList.value.includes("fa-moon")) {
        lightDarkIcon.classList.remove("fa-moon");
        lightDarkIcon.classList.add("fa-sun");
        html.dataset.theme = "dark";
      } else {
        lightDarkIcon.classList.remove("fa-sun");
        lightDarkIcon.classList.add("fa-moon");
        html.dataset.theme = "";
      }
    };

    lightDarkIcon.addEventListener("click", () => changeColor(lightDarkIcon));
  }

  initFilters() {
    const filterBtns = document.querySelectorAll(".filterBtn");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const datasetValue = btn.dataset.taskdone;
        const activeFilterBtn = [...filterBtns].find((btn) =>
          btn.classList.value.includes("activeFilter")
        );
        activeFilterBtn.classList.remove("activeFilter");
        btn.classList.add("activeFilter");

        const activeTodosCtn = document.querySelector(".container-active");
        const completedTodosCtn = document.querySelector(
          ".container-completed"
        );

        const removeInactiveClass = (ctn) => {
          if (ctn.classList.value.includes("inactive")) {
            ctn.classList.remove("inactive");
          }
        };

        const addInactiveClass = (ctn) => {
          if (!ctn.classList.value.includes("inactive")) {
            ctn.classList.add("inactive");
          }
        };

        if (datasetValue === "") {
          removeInactiveClass(activeTodosCtn);
          removeInactiveClass(completedTodosCtn);
        }

        if (datasetValue === "false") {
          removeInactiveClass(activeTodosCtn);
          addInactiveClass(completedTodosCtn);
        }

        if (datasetValue === "true") {
          removeInactiveClass(completedTodosCtn);
          addInactiveClass(activeTodosCtn);
        }
      });
    });
  }

  initNewTodoModal() {
    const newTodoModal = document.querySelector(".modal-new");
    const newTodoName = document.querySelector("#newTodoName");
    const newTodoDescription = document.querySelector("#newTodoDescription");
    const newTodoDeadline = document.querySelector("#newTodoDeadline");
    newTodoDeadline.value = this.getFormatedDate(this.date, "-");
    newTodoDeadline.min = this.getFormatedDate(this.date, "-");
    const prioSelector = document.querySelector("#prioSelector");
    const createNewTodoModalBtn = document.querySelector(
      "#createNewTodoModalBtn"
    );
    const modalCancel = document.querySelector(".modalCancel");

    const resetNewTodoModal = () => {
      newTodoName.value = "";
      newTodoDescription.value = "";
      newTodoDeadline.value = newTodoDeadline.min;
      prioSelector.value = "";
    };

    modalCancel.addEventListener("click", () => {
      const body = document.querySelector("body");
      body.classList.remove("modalActive");
      resetNewTodoModal();
      newTodoModal.classList.add("inactive");
      newTodoModal.dataset.type = "new";
      createNewTodoModalBtn.innerText = "Create";
      const newTodoModalTitle = document.querySelector(".newTodoModalTitle");
      newTodoModalTitle.innerText = "Create New Todo";
      const invalidMsgs = document.querySelectorAll(".invalidMsg");
      invalidMsgs.forEach((invalidMsg) => {
        if (!invalidMsg.classList.value.includes("inactive")) {
          invalidMsg.classList.add("inactive");
        }
        this.formIsValid = [false, false];
        createNewTodoModalBtn.disabled = true;
      });

      const invalidFields = document.querySelectorAll(".invalid");
      invalidFields.forEach((item) => item.classList.remove("invalid"));
    });

    const validateFields = [newTodoName, prioSelector];
    const invalidMsgs = document.querySelectorAll(".invalidMsg");

    const inputValidation = (e, item, index) => {
      if (e.target.value.length) {
        this.formIsValid[index] = true;
        if (!invalidMsgs[index].classList.value.includes("inactive")) {
          invalidMsgs[index].classList.add("inactive");
        }
        if (item.classList.value.includes("invalid")) {
          item.classList.remove("invalid");
        }
      } else {
        if (invalidMsgs[index].classList.value.includes("inactive")) {
          invalidMsgs[index].classList.remove("inactive");
          this.formIsValid[index] = false;
          if (!item.classList.value.includes("invalid")) {
            item.classList.add("invalid");
          }
        }
      }

      if (this.formIsValid[0] && this.formIsValid[1]) {
        createNewTodoModalBtn.disabled = false;
      } else {
        createNewTodoModalBtn.disabled = true;
      }
    };

    validateFields.forEach((item, index) => {
      item.addEventListener("input", (e) => inputValidation(e, item, index));
      item.addEventListener("blur", (e) => inputValidation(e, item, index));
    });

    createNewTodoModalBtn.addEventListener("click", () => {
      if (newTodoModal.dataset.type === "new") {
        this.lastID++;

        const newTask = {
          id: this.lastID,
          name: newTodoName.value,
          description: newTodoDescription.value,
          createat: Date.parse(this.date),
          deadline: Date.parse(newTodoDeadline.value),
          priority: prioSelector.value,
          taskDone: false,
        };

        this.list.push(newTask);
        this.createTask(newTask);
        this.setNumberOfTaskLeft(this.list);
        this.formIsValid = [false, false];
      }

      if (newTodoModal.dataset.type === "edit") {
        const taskId = newTodoModal.dataset.taskid;
        const editedTask = this.list.find(
          (item) => item.id === parseInt(taskId)
        );

        const setValueChange = (key, oldValue, newValue) => {
          if (oldValue !== newValue) {
            editedTask[key] = newValue;
          }
        };

        setValueChange("name", editedTask.name, newTodoName.value);
        setValueChange(
          "description",
          editedTask.description,
          newTodoDescription.value
        );

        setValueChange(
          "deadline",
          editedTask.deadline,
          Date.parse(newTodoDeadline.value)
        );
        setValueChange("priority", editedTask.priority, prioSelector.value);
        Todo.editTodo(
          Todo.getTaskElement(parseInt(taskId)),
          editedTask,
          this.getFormatedDate
        );
        newTodoModal.dataset.type = "new";
        createNewTodoModalBtn.innerText = "Create";
        const newTodoModalTitle = document.querySelector(".newTodoModalTitle");
        newTodoModalTitle.innerText = "Create New Todo";
      }

      const body = document.querySelector("body");
      body.classList.remove("modalActive");
      resetNewTodoModal();
      newTodoModal.classList.add("inactive");
      this.formIsValid = [false, false];
      createNewTodoModalBtn.disabled = true;
    });
  }

  onChooseFile(event) {
    try {
      if (typeof window.FileReader !== "function")
        throw "The file API isn't supported on this browser.";
    } catch (error) {
      console.log(error);
    }

    let file = event.target.files[0];
    if (file) {
      let fr = new FileReader();

      fr.addEventListener("loadend", (e) => {
        const result = JSON.parse(e.target.result);
        this.list = result.todoList;
        this.lastID = result.lastID;
        this.renderList(this.list);
        this.setNumberOfTaskLeft(this.list);
      });
      fr.readAsText(file);
    }
  }

  exportToFile(listArr, lastID) {
    window.scrollTo({
      top: 0,
    });
    const body = document.querySelector("body");
    body.classList.add("modalActive");
    const exportModal = document.createElement("div");
    exportModal.classList.add("exportModal");
    body.appendChild(exportModal);

    const exportCtn = document.createElement("div");
    exportCtn.classList.add("exportCtn");
    exportModal.appendChild(exportCtn);
    exportCtn.innerHTML = listArr.length
      ? `
    <p>Download your todo list and next time you could import it</p>
    `
      : `<p>Your todo list is empty.</p>`;

    const closeBtn = document.createElement("i");
    closeBtn.classList = "fas fa-times modalCloseBtn";
    closeBtn.addEventListener("click", () => {
      body.removeChild(exportModal);
      body.classList.remove("modalActive");
    });

    exportCtn.prepend(closeBtn);

    if (listArr.length) {
      let filename = "MyToDoList.json";

      let text = JSON.stringify({ todoList: listArr, lastID: lastID });
      let downloadLink = document.createElement("a");
      exportCtn.appendChild(downloadLink);
      downloadLink.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      downloadLink.setAttribute("download", filename);
      downloadLink.innerText = "Dowload";
      downloadLink.addEventListener("click", () => {
        body.removeChild(exportModal);
        body.classList.remove("modalActive");
      });
    }
  }

  sortBy(value) {
    this.renderList(this.list.sort((a, b) => (a[value] > b[value] ? -1 : 1)));
  }
}

const data = { todoList: [], lastID: null };

const myTodo = new TodoList(data.todoList, new Date(), data.lastID);

myTodo.init();
// myTodo.orderBy("priority");

export default TodoList;

// window.addEventListener("scroll", () => {
//   console.log(window.scrollY);
// });
