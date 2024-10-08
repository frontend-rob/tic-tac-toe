function initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme ? storedTheme : (prefersDarkScheme ? 'dark' : 'light');
    applyTheme(theme);
    updateMetaThemeColor(theme);
}


function changeTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}


function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
    updateMetaThemeColor(theme);
}


function updateMetaThemeColor(theme) {
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    const lightThemeColor = 'var(--bg-base-100)';
    const darkThemeColor = 'var(--bg-base-100)';
    const lightThemeColor = '#fafafa';
    const darkThemeColor = '#212121';

    themeColorMetaTag.setAttribute('content', theme === 'dark' ? darkThemeColor : lightThemeColor);
}


function updateThemeToggle(theme) {
    const darkIcon = document.getElementById('dark-icon');
    const lightIcon = document.getElementById('light-icon');
    const themeName = document.getElementById('theme-name');

    if (theme === 'dark') {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
        themeName.textContent = 'Dark';
    } else {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
        themeName.textContent = 'Light';
    }
}
