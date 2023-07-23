
const githubAccessToken = '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'; // Substitua pelo seu token de acesso do GitHub

function getAllTasks() {
  const tasks = [];
  const todoList = document.getElementById("todo-list");
  const todoListItems = todoList.querySelectorAll('li');

  todoListItems.forEach((task) => {
    tasks.push(task.textContent);
  });

  return tasks;
}

const saveTasksToGitHub = async (tasks) => {
  try {
    const githubUsername = 'andreilud';
    const repoName = 'coisinhas';
    const filePath = 'tasks.json';
    const url = `https://api.github.com/repos/andreilud/coisinhas/contents/tasks.json`;

    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
    };

    const content = JSON.stringify(tasks);
    const encodedContent = btoa(content);

    const data = {
      message: 'Atualizar lista de afazeres',
      content: encodedContent,
    };

    await axios.put(url, data, { headers });
  } catch (error) {
    console.error('Erro ao salvar as tarefas no GitHub:', error);
  }
};

function generateHTMLFromTasks(tasks) {
  const todoList = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");

  todoList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;

    if (task.includes('[concluído]')) {
      li.classList.add("completed-task");
      completedList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");
  const editBtn = document.getElementById("edit-btn");
  const addBtn = document.getElementById("add-btn");
  const newTaskInput = document.getElementById("new-task");
  let isEditMode = false;

  newTaskInput.style.display = "none";
  addBtn.style.display = "none";

  function toggleEditMode() {
    isEditMode = !isEditMode;
    if (isEditMode) {
      editBtn.innerHTML = '<i class="fas fa-check"></i>';
      newTaskInput.style.display = "inline-block";
      addBtn.style.display = "inline-block";
      todoList.querySelectorAll(".delete-task").forEach(deleteTask => {
        deleteTask.style.display = "inline";
      });
    } else {
      editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
      newTaskInput.style.display = "none";
      addBtn.style.display = "none";
      todoList.querySelectorAll(".delete-task").forEach(deleteTask => {
        deleteTask.style.display = "none";
      });
    }
  }

  function addActivity() {
    const activity = newTaskInput.value.trim();
    if (activity && isEditMode) {
      const li = document.createElement("li");
      li.textContent = activity;

      const deleteTask = document.createElement("span");
      deleteTask.classList.add("delete-task");
      li.appendChild(deleteTask);

      todoList.appendChild(li);
      newTaskInput.value = "";

      saveTasksToGitHub(getAllTasks());
    }
  }

  function toggleTaskCompletion(event) {
    if (!isEditMode && event.target.tagName === "LI") {
      const task = event.target;
      task.classList.toggle("completed-task");

      if (task.classList.contains("completed-task")) {
        completedList.prepend(task);
      } else {
        todoList.appendChild(task);
      }

      saveTasksToGitHub(getAllTasks());
    }
  }

  function deleteActivity(event) {
    if (isEditMode && event.target.classList.contains("delete-task")) {
      const li = event.target.parentElement;
      if (confirm(`Deseja excluir a atividade: "${li.textContent}"?`)) {
        li.remove();

        saveTasksToGitHub(getAllTasks());
      }
    }
  }

  editBtn.addEventListener("click", toggleEditMode);
  addBtn.addEventListener("click", addActivity);
  todoList.addEventListener("click", deleteActivity);
  todoList.addEventListener("click", toggleTaskCompletion);
  completedList.addEventListener("click", toggleTaskCompletion);

  saveTasksToGitHub(getAllTasks());
});