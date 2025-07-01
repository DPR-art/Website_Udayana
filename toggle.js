document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.toggle-div').forEach(function (div, i) {
    div.addEventListener('click', function () {
        const textElement = document.querySelectorAll('.toggle-text');
        const btn = document.querySelectorAll('.toggle-btn');
        const el = textElement[i];
        const isVisible = el.classList.contains('opacity-0');

        if (isVisible) {
        el.classList.remove('opacity-0', 'max-h-0');
        el.classList.add('opacity-100', 'max-h-[500px]');
        console.log(isVisible)
        console.log(el)
        } else {
        el.classList.remove('opacity-100', 'max-h-[500px]');
        el.classList.add('opacity-0', 'max-h-0');
        }

        btn[i].classList.toggle('rotate-90');
    })
    })
});
