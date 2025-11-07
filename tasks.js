const STORAGE_KEY = 'taskData';

export let tasks = loadTasks();

function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t) => ({ ...t, date: new Date(t.date) }));
    }
    return [];
}
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function renderTasks(listElement, filteredTasks) {
    listElement.innerHTML = '';

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.completed ? 'completed' : '';
        li.dataset.id = task.id;

        li.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            updateView();
        });
        listElement.appendChild(li);
    });
}

export function filteredTasks(status) {
    if (status === 'completed') {
        return tasks.filter((task) => task.completed);
    } else if (status === 'active') {
        return tasks.filter((task) => !task.completed);
    }
    return tasks;
}

export function sortTasks(tasksArray, sortBy) {
    if (sortBy === 'date') {
        return [...tasksArray].sort((a, b) => b.date - a.date);
    } else if (sortBy === 'name') {
        return [...tasksArray].sort((a, b) => a.text.localeCompare(b.text));
    }
    return tasksArray;
}

export function updateView() {
    const listElement = document.querySelector('#taskList');
    const filterSelect = document.querySelector('#filterSelect');
    const sortSelect = document.querySelector('#sortSelect');

    const filterValue = filterSelect ? filterSelect.value : 'all';
    const sortedValue = sortSelect ? sortSelect.value : 'date';

    const filtered = filteredTasks(filterSelect.value);
    const sorted = sortTasks(filtered, sortSelect.value);
    renderTasks(listElement, sorted);
}
