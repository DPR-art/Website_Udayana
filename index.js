const dots = document.querySelectorAll('.dot');
const unions = document.querySelectorAll('.union');

dots.forEach((dot, i) => {
    dot.addEventListener('mouseenter', () => {
      console.log(i)
    unions[i].classList.remove('opacity-0');
    unions[i].style.transform = "translateY(0)";
  });

  dot.addEventListener('mouseleave', () => {
    unions[i].classList.add('opacity-0');
    unions[i].style.transform = "translateY(100%)";
  });
});