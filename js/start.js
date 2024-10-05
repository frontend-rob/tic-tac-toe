function start() {
    const components = getStartComponents();
    loadStartTemplates(components);
    initializeTheme();
}


function getStartComponents() {
    return {
        header: document.getElementById('header-content'),
        start: document.getElementById('start-screen')
    };
}


function loadStartTemplates(components) {
    components.header.innerHTML = getHeaderTemplate();
    components.start.innerHTML = getStartScreenTemplate();
}