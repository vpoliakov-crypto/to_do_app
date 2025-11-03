export function updateCount(ul, countSpan) {
    const unfinished = ul.querySelectorAll('li input:not(:checked)').length;
    countSpan.textContent = `(${unfinished})`;
}
