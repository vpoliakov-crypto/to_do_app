import { toggleAccordion } from './accordion.js';
import { updateCount } from './count.js';

document.addEventListener('DOMContentLoaded', () => {
    toggleAccordion();

    document.querySelectorAll('.accordion-item').forEach((item) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const ul = content.querySelector('ul');
        const input = content.querySelector('.new-task-input');
        const addButton = content.querySelector('.add-task-btn');
        const countSpan = header.querySelector('.count');
        const storageKey = `tasks-${item.dataset.id}`;
        const sortDateBtn = item.querySelector('.sort-date-btn');
        const sortAlphaBtn = item.querySelector('.sort-alpha-btn');

        function saveTasks() {
            const tasks = [];

            ul.querySelectorAll('li').forEach((li) => {
                const checkbox = li.querySelector('input[type="checkbox"]');
                const text = li.querySelector('span').textContent;
                const createdAt = li.dataset.createdAt || Date.now();

                tasks.push({
                    text,
                    done: checkbox.checked,
                    createdAt: Number(createdAt),
                });
            });

            localStorage.setItem(storageKey, JSON.stringify(tasks));
        }

        const loadTasks = () => {
            const savedTasks =
                JSON.parse(localStorage.getItem(storageKey)) || [];
            savedTasks.forEach((task) => {
                createTask(task.text, task.done, task.createdAt);
            });
        };

        const createTask = (text, done = false, createdAt = Date.now()) => {
            const li = document.createElement('li');
            li.classList.add('task');
            li.dataset.createdAt = createdAt;

            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = done;

            const span = document.createElement('span');
            span.textContent = text;

            taskContent.appendChild(checkbox);
            taskContent.appendChild(span);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✕';
            deleteBtn.classList.add('delete-btn');

            li.appendChild(taskContent);
            li.appendChild(deleteBtn);

            ul.appendChild(li);
            li.classList.add('appearing');

            updateCount(ul, countSpan);
            saveTasks();
        };

        loadTasks();

        const addTaskByEnter = () => {
            const taskText = input.value.trim();
            if (!taskText) return;
            createTask(taskText);
            input.value = '';

            content.style.maxHeight = content.scrollHeight + 'px';
        };

        const sortByDate = () => {
            const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
            tasks.sort((a, b) => a.createdAt - b.createdAt);
            localStorage.setItem(storageKey, JSON.stringify(tasks));
            ul.innerHTML = '';
            tasks.forEach((t) => {
                createTask(t.text, t.done, t.createdAt);
            });
        };

        const sortByAlpha = () => {
            const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
            tasks.sort((a, b) => a.text.localeCompare(b.text));
            localStorage.setItem(storageKey, JSON.stringify(tasks));
            ul.innerHTML = '';
            tasks.forEach((t) => {
                createTask(t.text, t.done, t.createdAt);
            });
        };

        sortDateBtn.addEventListener('click', sortByDate);
        sortAlphaBtn.addEventListener('click', sortByAlpha);

        ul.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                updateCount(ul, countSpan);
                saveTasks();
            }
            if (e.target.classList.contains('delete-btn')) {
                li.classList.remove('appearing');
                li.classList.add('removing');
                li.addEventListener(
                    'animationend',
                    () => {
                        li.remove();
                        updateCount(ul, countSpan);
                        saveTasks();
                    },
                    { once: true }
                );
            }
        });

        addButton.addEventListener('click', addTaskByEnter);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTaskByEnter();
            }
        });

        updateCount(ul, countSpan);
    });
});
