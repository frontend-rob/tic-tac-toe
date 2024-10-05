function checkOrientation() {
    const modal = document.getElementById('landscape-modal');
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const body = document.body;

    if (isMobile && isLandscape) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
        body.classList.add('no-scroll');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        body.classList.remove('no-scroll');
    }
}


window.addEventListener('resize', checkOrientation);
if (window.screen.orientation) {
    screen.orientation.addEventListener('change', checkOrientation);
}


checkOrientation();
