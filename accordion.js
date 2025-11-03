export function toggleAccordion() {
    document.querySelectorAll('.accordion-item').forEach((item) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        const toggleHeaderSign = () => {
            const isOpen = item.dataset.open === 'true';
            const plusSpan = item.querySelector('.plusSpan');
            const minusSpan = item.querySelector('.minusSpan');

            if (!plusSpan || !minusSpan) return;
            plusSpan.style.display = isOpen ? 'none' : 'inline';
            minusSpan.style.display = isOpen ? 'inline' : 'none';
        };

        toggleHeaderSign();

        header.addEventListener('click', () => {
            const isOpen = item.dataset.open === 'true';

            document.querySelectorAll('.accordion-item').forEach((i) => {
                i.dataset.open = 'false';
                i.querySelector('.accordion-content').style.maxHeight = null;
                i.querySelector('.plusSpan').style.display = 'inline';
                i.querySelector('.minusSpan').style.display = 'none';
            });

            if (!isOpen) item.dataset.open = 'true';

            if (item.dataset.open === 'true') {
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }, 0);
            }
            toggleHeaderSign();
        });
    });
}
