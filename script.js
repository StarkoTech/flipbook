// Total PDF pages
const totalPages = 22;

// Get HTML elements
const flipbookElement = document.getElementById("flipbook");
const pageNumber = document.getElementById("pageNumber");
const pageSlider = document.getElementById("pageSlider");

const firstBtn = document.getElementById("firstBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const lastBtn = document.getElementById("lastBtn");

// Create PageFlip object
const pageFlip = new St.PageFlip(flipbookElement, {
    width: 420,
    height: 594,

    // Stretch means it will adjust according to available screen size
    size: "stretch",

    minWidth: 280,
    maxWidth: 420,

    minHeight: 396,
    maxHeight: 594,

    // First page works like book cover
    showCover: true,

    // Realistic shadow while page turning
    drawShadow: true,
    maxShadowOpacity: 0.45,

    // Smooth flip speed
    flippingTime: 900,

    // Allow mouse hover, click and drag
    useMouseEvents: true,

    // Mobile support
    mobileScrollSupport: false,

    // Page corner click area size
    clickEventForward: true,

});


// Load all pages from HTML
pageFlip.loadFromHTML(document.querySelectorAll(".page, .page1"));

function updateCoverShift() {
    const currentPage = pageFlip.getCurrentPageIndex() + 1;

    if (currentPage === 1) {
        flipbookElement.classList.add('cover-page-left');
        flipbookElement.classList.remove('cover-page-right');
    } else if (currentPage === totalPages) {
        flipbookElement.classList.add('cover-page-right');
        flipbookElement.classList.remove('cover-page-left');
    } else {
        flipbookElement.classList.remove('cover-page-left', 'cover-page-right');
    }
}

// Update page number, slider and buttons
function updateControls() {
    // StPageFlip page index starts from 0
    const currentIndex = pageFlip.getCurrentPageIndex();

    // User page number starts from 1
    const currentPage = currentIndex + 1;

    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
    pageSlider.value = currentPage;

    // Disable buttons at first and last page
    firstBtn.hidden = currentPage === 1;
    prevBtn.hidden = currentPage === 1;

    nextBtn.hidden = currentPage === totalPages;
    lastBtn.hidden = currentPage === totalPages;

    updateCoverShift();
}

// Play page turn sound effect
function playPageTurnSound() {
    FlipSound.currentTime = 0;
    FlipSound.play();
}

// Play front and backpage turn sound effect
function FirstAndLastPageSound() {
    FirstAndLastPageFlipSound.currentTime = 0;
    FirstAndLastPageFlipSound.play();
}

// Next page button
nextBtn.addEventListener("click", function () {
    pageFlip.flipNext();
});

// Previous page button
prevBtn.addEventListener("click", function () {
    pageFlip.flipPrev();
});

// First page button
firstBtn.addEventListener("click", function () {
    pageFlip.turnToPage(0);
});

// Last page button
lastBtn.addEventListener("click", function () {
    pageFlip.turnToPage(totalPages - 1);
});

// Slider page change
pageSlider.addEventListener("change", function () {

    const selectedPage = Number(pageSlider.value);

    // Convert normal page number to index
    pageFlip.turnToPage(selectedPage - 1);
});

// This event runs after every page flip
pageFlip.on("flip", function (pageIndexObj) {
    const currentPage = pageIndexObj.data
    if (currentPage === 0) {
        FirstAndLastPageSound();
    } else if (currentPage === totalPages - 1) {
        FirstAndLastPageSound();
    } else {
        playPageTurnSound();
    }
    updateControls();
});

function autoFlip() {
    return
}

// let autoFlipInterval = null;
autoBtn.addEventListener("click", function () {
    if (autoBtn.textContent === "▶") {
        autoBtn.textContent = "⏸";
        pageFlip.flipNext();
        autoFlipInterval = setInterval(() => {
            if (pageFlip.getCurrentPageIndex() < totalPages - 1) {
                pageFlip.flipNext();
            } else if (pageFlip.getCurrentPageIndex() == totalPages - 1) {
                autoBtn.textContent = "↻";
                clearInterval(autoFlipInterval);
            }
            else {
                clearInterval(autoFlipInterval);
                autoBtn.textContent = "▶";
            }
        }, 2000);
    }
    else if (autoBtn.textContent == "↻") {
        autoBtn.textContent = "⏸";
        clearInterval(autoFlipInterval);
        firstBtn.click();
        autoFlipInterval = setInterval(() => {
            if (pageFlip.getCurrentPageIndex() < totalPages - 1) {
                pageFlip.flipNext();
            } else if (pageFlip.getCurrentPageIndex() == totalPages - 1) {
                autoBtn.textContent = "↻";
                clearInterval(autoFlipInterval);
            }
            else {
                clearInterval(autoFlipInterval);
                autoBtn.textContent = "▶";
            }
        }, 2000);
    }
    else {
        autoBtn.textContent = "▶";
        clearInterval(autoFlipInterval);
    }
});


// This event runs when book layout changes
pageFlip.on("changeState", function () {
    updateControls();
});

// First time update
updateControls();