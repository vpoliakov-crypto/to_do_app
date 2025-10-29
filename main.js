document.querySelectorAll('.accordion-item').forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const ul = content.querySelector('ul');
    const input = content.querySelector('.new-task-input');
    const addButton = content.querySelector('.add-task-btn');
    const countSpan = header.querySelector('.count');
    const storageKey = `tasks -${item.dataset.id}`;

    const updateCount = () => {
        const unfinished = ul.querySelectorAll('li input:not(:checked)').length;
        countSpan.textContent = `(${unfinished})`;
    };

    function saveTasks() {
        const tasks = [];

        ul.querySelectorAll('li').forEach((li) => {
            const checkbox = li.querySelector('input[type="checkbox"]');
            const text = li.querySelector('span').textContent;

            tasks.push({
                text,
                done: checkbox.checked,
            });
        });

        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedTasks.forEach((task) => {
            createTask(task.text, task.done);
        });
    };

    const createTask = (text, done = false) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = done;

        const span = document.createElement('span');
        span.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.classList.add('delete-btn');

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        ul.appendChild(li);

        updateCount();
        saveTasks();
    };

    loadTasks();

    ul.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            updateCount();
            saveTasks();
        }
        if (e.target.classList.contains('delete-btn')) {
            li.remove();
            updateCount();
            saveTasks();
        }
    });

    addButton.addEventListener('click', () => {
        const taskText = input.value.trim();
        if (!taskText) return;

        createTask(taskText);
        input.value = '';
    });

    header.addEventListener('click', () => {
        const isOpen = item.dataset.open === 'true';
        document.querySelectorAll('.accordion-item').forEach((i) => {
            i.dataset.open = 'false';
            i.querySelector('.accordion-content').style.maxHeight = null;
        });

        if (!isOpen) item.dataset.open = 'true';

        if (item.dataset.open === 'true') {
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            }, 0);
        }
    });

    updateCount();
});
