// DOM Elements
const book = document.getElementById('book');
const openBookBtn = document.querySelector('.open-book-btn');
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const tocLinks = document.querySelectorAll('.toc-link');

// Variables
let currentPage = 0;
let totalPages = pages.length;
let isBookOpen = false;

// Initialize
function init() {
    // Set first page (TOC) as active
    pages[0].classList.add('active');
    
    // Add event listeners
    openBookBtn.addEventListener('click', toggleBook);
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
    
    // Add event listeners to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            goToPage(findPageIndex(targetId));
        });
    });
    
    // Hide navigation initially (until book is opened)
    updateNavigation();
}

// Find page index by ID
function findPageIndex(id) {
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
            return i;
        }
    }
    return 0;
}

// Toggle book open/close
function toggleBook() {
    isBookOpen = !isBookOpen;
    book.classList.toggle('open', isBookOpen);
    
    // Show/hide navigation based on book state
    updateNavigation();
}

// Go to specific page
function goToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= totalPages || pageIndex === currentPage) {
        return;
    }
    
    // Add animation classes
    pages[currentPage].classList.add('page-turn');
    
    // After animation completes
    setTimeout(() => {
        // Remove active and animation classes from current page
        pages[currentPage].classList.remove('active', 'page-turn');
        
        // Update current page
        currentPage = pageIndex;
        
        // Add active and animation classes to new page
        pages[currentPage].classList.add('active', 'page-turn-in');
        
        // Remove animation class after it completes
        setTimeout(() => {
            pages[currentPage].classList.remove('page-turn-in');
        }, 600);
        
        // Update navigation
        updateNavigation();
    }, 300);
}

// Go to previous page
function goToPrevPage() {
    goToPage(currentPage - 1);
}

// Go to next page
function goToNextPage() {
    goToPage(currentPage + 1);
}

// Update navigation buttons
function updateNavigation() {
    if (!isBookOpen) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }
    
    prevBtn.style.display = currentPage > 0 ? 'flex' : 'none';
    nextBtn.style.display = currentPage < totalPages - 1 ? 'flex' : 'none';
}

// Handle video background fallback
function setupVideoBackground() {
    const video = document.getElementById('background-video');
    
    // If video fails to load, use a gradient background
    video.addEventListener('error', function() {
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    });
    
    // If no source is available, use a gradient background
    if (!video.querySelector('source').src) {
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    setupVideoBackground();
});

// Add some visual effects for modern feel
document.addEventListener('mousemove', function(e) {
    if (!isBookOpen) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        book.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

// Reset transform when mouse leaves
document.addEventListener('mouseleave', function() {
    if (!isBookOpen) {
        book.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    const openBookBtn = document.querySelector('.open-book-btn');
    const bookCover = document.querySelector('.book-cover');
    const bookContent = document.querySelector('.book-content');
    const tocPage = document.getElementById('toc');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const backToTocBtns = document.querySelectorAll('.back-to-toc-btn');
    let currentPageIndex = 0;

    if (!openBookBtn) {
        console.warn("Open Book button not found.");
        return;
    }
    if (!bookCover) {
        console.warn("Book cover not found.");
        return;
    }
    if (!bookContent) {
        console.warn("Book content not found.");
        return;
    }
    if (!tocPage) {
        console.warn("TOC page not found.");
        return;
    }

    const pages = Array.from(document.querySelectorAll('.book-content .page'));

    openBookBtn.addEventListener('click', () => {
        console.log("Open Book button clicked");

        // Hide the book cover
        bookCover.style.display = 'none';

        // Show the book content container
        bookContent.style.display = 'block';

        // Hide all pages first
        pages.forEach(page => {
            page.style.display = 'none';
        });

        // Then display the TOC page
        tocPage.style.display = 'block';
        currentPageIndex = pages.indexOf(tocPage);
        console.log("TOC page should now be visible");
    })

    // Handle TOC link clicks to navigate between sections
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('toc-link')) {
            e.preventDefault();
            console.log("TOC link clicked");
            const targetId = e.target.getAttribute('href').substring(1);
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                // Hide all pages then show the target page
                pages.forEach(page => {
                    page.style.display = 'none';
                });
                targetPage.style.display = 'block';
                currentPageIndex = pages.indexOf(targetPage);
                console.log(`Displaying section: ${targetId}`);
            } else {
                console.warn(`Section with id "${targetId}" not found.`);
            }
        }
    });

    // Handle previous and next buttons
    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            pages[currentPageIndex].style.display = 'none';
            currentPageIndex--;
            pages[currentPageIndex].style.display = 'block';
            console.log(`Displaying previous section: ${pages[currentPageIndex].id}`);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPageIndex < pages.length - 1) {
            pages[currentPageIndex].style.display = 'none';
            currentPageIndex++;
            pages[currentPageIndex].style.display = 'block';
            console.log(`Displaying next section: ${pages[currentPageIndex].id}`);
        }
    });

    // Handle "Back to Index" button clicks
    backToTocBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pages.forEach(page => {
                page.style.display = 'none';
            });
            tocPage.style.display = 'block';
            currentPageIndex = pages.indexOf(tocPage);
            console.log("Back to TOC");
        });
    });
});
