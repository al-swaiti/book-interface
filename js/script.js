// DOM Elements
const book = document.getElementById('book');
const openBookBtn = document.querySelector('.open-book-btn');
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const tocLinks = document.querySelectorAll('.toc-link');
const backToTocBtns = document.querySelectorAll('.back-to-toc-btn');
const bookCover = document.querySelector('.book-cover');
const bookContent = document.querySelector('.book-content');
const tocPage = document.getElementById('toc');

// Variables
let currentPage = 0;
let totalPages = pages.length;
let isBookOpen = false;

// Initialize when DOM is loaded
// Background Music Control Implementation
// Audio Control System - Add to script.js
document.addEventListener('DOMContentLoaded', function() {
    // System component references
    const audioElement = document.getElementById('background-music');
    const controlModule = document.getElementById('audio-control-wrapper');
    const controlTrigger = document.getElementById('mute-btn');
    
    // System state parameters
    let systemAudioEnabled = true;
    let userInteractionRegistered = false;
    
    // Initial volume calibration
    audioElement.volume = 0.3; // 30% baseline volume - optimal for ambient effects
    
    // Primary audio controller function
    function toggleAudioState() {
        systemAudioEnabled = !systemAudioEnabled;
        audioElement.muted = !systemAudioEnabled;
        
        // Update interface state indicator
        if (systemAudioEnabled) {
            controlModule.classList.remove('muted');
        } else {
            controlModule.classList.add('muted');
        }
    }
    
    // Register control event handler
    controlTrigger.addEventListener('click', toggleAudioState);
    
    // Address browser autoplay policy constraints
    function initializeAudioSubsystem() {
        if (!userInteractionRegistered) {
            audioElement.play()
                .then(() => {
                    console.log("Audio subsystem initialized successfully");
                    userInteractionRegistered = true;
                })
                .catch(error => {
                    console.warn("Audio initialization deferred: " + error.message);
                });
        }
    }
    
    // Register global interaction handler for audio initialization
    document.addEventListener('click', function() {
        initializeAudioSubsystem();
    }, { once: true });
    
    // Attempt initial audio subsystem activation
    initializeAudioSubsystem();
    
    // Optional: Fade volume on page visibility change to improve user experience
    document.addEventListener('visibilitychange', function() {
        if (!systemAudioEnabled) return; // Skip if audio disabled by user
        
        if (document.hidden) {
            // Gradual volume reduction when tab inactive
            let currentVolume = audioElement.volume;
            const fadeInterval = setInterval(() => {
                currentVolume = Math.max(0, currentVolume - 0.1);
                audioElement.volume = currentVolume;
                if (currentVolume <= 0) clearInterval(fadeInterval);
            }, 100);
        } else {
            // Restore volume when tab becomes active
            const fadeInterval = setInterval(() => {
                let currentVolume = audioElement.volume;
                currentVolume = Math.min(0.3, currentVolume + 0.1);
                audioElement.volume = currentVolume;
                if (currentVolume >= 0.3) clearInterval(fadeInterval);
            }, 100);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Set first page (TOC) as active
    pages[0].classList.add('active');
    
    // Open book button event
    openBookBtn.addEventListener('click', () => {
        console.log("Open Book button clicked");
        isBookOpen = true;
        book.classList.add('open');
        
        // Show the book content
        bookCover.style.display = 'none';
        bookContent.style.display = 'block';
        
        // Show first page
        currentPage = 0;
        showActivePage();
        
        // Update navigation
        updateNavigation();
    });
    
    // Add event listeners to navigation
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
    
    // Add event listeners to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            goToPageById(targetId);
        });
    });
    
    // Handle "Back to Index" button clicks
    backToTocBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            goToPageById('toc');
            console.log("Back to TOC");
        });
    });
    
    // Setup video background fallback
    setupVideoBackground();
    
    // Hide navigation initially
    updateNavigation();
    
    // Add visual effects
    setupVisualEffects();
});

// Go to page by ID
function goToPageById(id) {
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
            goToPage(i);
            return;
        }
    }
    // If not found, go to TOC
    goToPage(0);
}

// Show only the active page
function showActivePage() {
    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.classList.add('active');
            page.style.display = 'block';
        } else {
            page.classList.remove('active');
            page.style.display = 'none';
        }
    });
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
        pages[currentPage].style.display = 'none';
        
        // Update current page
        currentPage = pageIndex;
        
        // Add active and animation classes to new page
        pages[currentPage].classList.add('active', 'page-turn-in');
        pages[currentPage].style.display = 'block';
        
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

// Setup visual effects
function setupVisualEffects() {
    // 3D book rotation effect
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
}