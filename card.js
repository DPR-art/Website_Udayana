class VanillaCardsSwiper {
    constructor(container) {
        this.container = container;
        this.cards = Array.from(container.querySelectorAll('.card'));
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.threshold = 100;
        
        this.init();
    }
    
    init() {
        this.updateCards();
        this.bindEvents();
    }
    
    bindEvents() {
        this.container.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));
        
        this.container.addEventListener('touchstart', this.handleStart.bind(this));
        document.addEventListener('touchmove', this.handleMove.bind(this));
        document.addEventListener('touchend', this.handleEnd.bind(this));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        this.container.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    handleStart(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        this.isDragging = true;
        const point = e.type.includes('touch') ? e.touches[0] : e;
        this.startX = point.clientX;
        this.startY = point.clientY;
        
        const activeCard = this.cards[this.currentIndex];
        if (activeCard) {
            activeCard.classList.add('dragging');
        }
        
        e.preventDefault();
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        const point = e.type.includes('touch') ? e.touches[0] : e;
        this.currentX = point.clientX - this.startX;
        this.currentY = point.clientY - this.startY;
        
        const activeCard = this.cards[this.currentIndex];
        if (activeCard) {
            const rotation = this.currentX * 0.1;
            const scale = Math.max(0.95, 1 - Math.abs(this.currentX) * 0.001);
            
            activeCard.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${rotation}deg) scale(${scale})`;
            activeCard.style.opacity = Math.max(0.5, 1 - Math.abs(this.currentX) * 0.003);
        }
        
        e.preventDefault();
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const activeCard = this.cards[this.currentIndex];
        
        if (activeCard) {
            activeCard.classList.remove('dragging');
            activeCard.style.transform = '';
            activeCard.style.opacity = '';
        }
        
        const deltaX = Math.abs(this.currentX);
        const deltaY = Math.abs(this.currentY);
        
        if (deltaX > this.threshold && deltaX > deltaY) {
            if (this.currentX > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.updateCards();
        }
        
        this.currentX = 0;
        this.currentY = 0;
    }
    
    next() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.updateCards();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCards();
        }
    }
    
    updateCards() {
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');
            
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else if (index === this.currentIndex - 1) {
                card.classList.add('prev');
            } else if (index === this.currentIndex + 1) {
                card.classList.add('next');
            } else {
                card.classList.add('hidden');
            }
        });
    }
    
    goTo(index) {
        if (index >= 0 && index < this.cards.length) {
            this.currentIndex = index;
            this.updateCards();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.card-container');
    new VanillaCardsSwiper(container);
});