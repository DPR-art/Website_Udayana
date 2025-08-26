document.addEventListener('DOMContentLoaded', function () {
    const textElements = document.querySelectorAll('.toggle-text');
    const buttons = document.querySelectorAll('.toggle-btn');
    const toggleDivs = document.querySelectorAll('.toggle-div');

    toggleDivs.forEach(function (div, i) {
        div.addEventListener('click', function () {
            const el = textElements[i];
            const isVisible = el.classList.contains('opacity-100');

            textElements.forEach((t, idx) => {
                t.classList.remove('opacity-100', 'max-h-[500px]', 'mt-2');
                t.classList.add('opacity-0', 'max-h-0', 'mt-0');
                buttons[idx].classList.remove('rotate-90');
            });

            if (!isVisible) {
                el.classList.remove('opacity-0', 'max-h-0', 'mt-0');
                el.classList.add('opacity-100', 'max-h-[500px]', 'mt-2');
                buttons[i].classList.add('rotate-90');
            }
        });
    });
});
