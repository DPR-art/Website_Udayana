const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuBackdrop = document.getElementById('menuBackdrop');
const menuItems = document.querySelectorAll('.menu-item');

let isMenuOpen = false;

function toggleMenu() {
isMenuOpen = !isMenuOpen;

hamburgerBtn.classList.toggle('hamburger-active');

if (isMenuOpen) {
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';

    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
    });
} else {
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    document.body.style.overflow = '';
    
    menuItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
    });
}
}

hamburgerBtn.addEventListener('click', toggleMenu);
menuBackdrop.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && isMenuOpen) {
    toggleMenu();
}
});

menuItems.forEach(item => {
item.addEventListener('click', () => {
    setTimeout(toggleMenu, 200);
});
});

window.addEventListener('resize', () => {
if (window.innerWidth >= 768 && isMenuOpen) {
    toggleMenu();
}
});