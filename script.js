let fields = Array(9).fill(null);
let currentPlayer = 'cross';


const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];


function init() {
    const components = getComponents();
    loadTemplates(components);
    initializeTheme();
    renderContent();
    updateCurrentPlayer(currentPlayer);
}


function hideStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    startScreen.classList.remove('show');
    document.body.style.overflow = 'auto';
}


function handleClick(index) {
    if (fields[index] !== null) return;

    fields[index] = currentPlayer;
    updateField(index);
    checkWinner();
    switchPlayer();
    updateCurrentPlayer(currentPlayer);
}


function restartGame() {
    fields.fill(null);
    currentPlayer = 'cross';
    renderContent();
    updateCurrentPlayer(currentPlayer);
    closeModal();
}


function showWinnerModal(result) {
    const winnerModal = document.getElementById('winner-modal');
    const winnerIcon = document.getElementById('winner-icon');
    const winnerState = document.getElementById('winner-state');
    const winnerMessage = document.getElementById('winner-message');

    if (result === 'draw') {
        winnerIcon.innerHTML = '<svg id="draw" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M191.83,51.48l13.83-13.82a8,8,0,0,0-11.32-11.32L179.79,40.9a87.81,87.81,0,0,0-103.58,0L61.66,26.34A8,8,0,0,0,50.34,37.66L64.17,51.48A87.72,87.72,0,0,0,40,112v40a88,88,0,0,0,176,0V112A87.72,87.72,0,0,0,191.83,51.48ZM128,40a72.08,72.08,0,0,1,72,72v8H56v-8A72.08,72.08,0,0,1,128,40Zm0,184a72.08,72.08,0,0,1-72-72V136H200v16A72.08,72.08,0,0,1,128,224ZM144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM88,92a12,12,0,1,1,12,12A12,12,0,0,1,88,92Z"></path></svg>';
        winnerState.textContent = 'Great game!';
        winnerMessage.textContent = `It's a tie this time.`;
    } else {
        const symbol = getPlayerSymbol(result);
        winnerIcon.innerHTML = `${symbol}`;
        winnerState.textContent = 'Is the winner!';
        winnerMessage.textContent = `Get ready for the next round.`;
    }

    winnerModal.classList.remove('hidden');
    winnerModal.classList.add('show');
    document.body.classList.add('no-scroll');
}


function closeModal() {
    const winnerModal = document.getElementById('winner-modal');
    winnerModal.classList.add('hidden');
    winnerModal.classList.remove('show');
    document.body.classList.remove('no-scroll');
}


function updateField(index) {
    const fieldElement = document.getElementById(`field-${index}`);
    fieldElement.innerHTML = getPlayerSymbol(currentPlayer);
    fieldElement.onclick = null;
}


function checkWinner() {
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(combination);
            disableAllFields();
            setTimeout(() => showWinnerModal(fields[a]), 750);
            return fields[a];
        }
    }

    if (fields.every(field => field !== null)) {
        setTimeout(() => showWinnerModal('draw'), 750);
        return 'draw';
    }

    return null;
}


function disableAllFields() {
    const fieldElements = document.querySelectorAll('.field');
    fieldElements.forEach(field => {
        field.removeAttribute('onclick');
        field.style.cursor = 'default';
        field.style.pointerEvents = 'none';
    });
}


function drawWinningLine(combination) {
    const fieldContent = document.getElementById('field-content');
    const [a, b, c] = combination;
    const fieldA = document.getElementById(`field-${a}`);
    const fieldC = document.getElementById(`field-${c}`);


    const rectA = fieldA.getBoundingClientRect();
    const rectC = fieldC.getBoundingClientRect();
    const containerRect = fieldContent.getBoundingClientRect();

    const centerX1 = rectA.left - containerRect.left + rectA.width / 2;
    const centerY1 = rectA.top - containerRect.top + rectA.height / 2;
    const centerX2 = rectC.left - containerRect.left + rectC.width / 2;
    const centerY2 = rectC.top - containerRect.top + rectC.height / 2;

    const angle = Math.atan2(centerY2 - centerY1, centerX2 - centerX1) * (180 / Math.PI);
    const length = Math.hypot(centerX2 - centerX1, centerY2 - centerY1);

    const lineHeight = 4;
    const line = document.createElement('div');
    line.classList.add('winning-line');
    line.style.width = `${length}px`;
    line.style.height = `${lineHeight}px`;
    line.style.position = 'absolute';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = 'left center';
    line.style.top = `${centerY1 - (lineHeight / 2)}px`;
    line.style.left = `${centerX1}px`;
    fieldContent.appendChild(line);

    addWinningPoints(centerX1, centerY1, centerX2, centerY2);
}


function addWinningPoints(centerX1, centerY1, centerX2, centerY2) {
    const fieldContent = document.getElementById('field-content');
    const createPoint = (x, y) => {
        const point = document.createElement('div');
        point.classList.add('winning-point');
        point.style.left = `${x}px`;
        point.style.top = `${y}px`;
        return point;
    };

    const pointStart = createPoint(centerX1, centerY1);
    const midX = (centerX1 + centerX2) / 2;
    const midY = (centerY1 + centerY2) / 2;
    const pointMid = createPoint(midX, midY);
    const pointEnd = createPoint(centerX2, centerY2);

    fieldContent.appendChild(pointStart);
    fieldContent.appendChild(pointMid);
    fieldContent.appendChild(pointEnd);
}


function getPlayerSymbol(player) {
    if (player === 'circle') {
        return `
            <svg id="circle" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 256 256">
                <path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Z"></path>
            </svg>
        `;
    } else {
        return `
            <svg id="cross" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 256 256">
                <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
            </svg>
        `;
    }
}


function switchPlayer() {
    currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';
}


function showCrossIcon() {
    const playerCrossIcon = document.getElementById('player-cross-icon');
    const playerCircleIcon = document.getElementById('player-circle-icon');
    playerCrossIcon.classList.add('show');
    playerCrossIcon.classList.remove('hidden');
    playerCircleIcon.classList.add('hidden');
    playerCircleIcon.classList.remove('show');
}


function showCircleIcon() {
    const playerCrossIcon = document.getElementById('player-cross-icon');
    const playerCircleIcon = document.getElementById('player-circle-icon');
    playerCircleIcon.classList.add('show');
    playerCircleIcon.classList.remove('hidden');
    playerCrossIcon.classList.add('hidden');
    playerCrossIcon.classList.remove('show');
}


function updateCurrentPlayer(player) {
    if (player === 'cross') {
        showCrossIcon();
    } else if (player === 'circle') {
        showCircleIcon();
    }
}


function renderContent() {
    const fieldContent = document.getElementById('field-content');
    let htmlContent = '';

    fields.forEach((field, index) => {
        let fieldSymbol = '';

        if (field === 'circle') {
            fieldSymbol = getPlayerSymbol('circle');
        } else if (field === 'cross') {
            fieldSymbol = getPlayerSymbol('cross');
        }

        htmlContent += `<div class="field" id="field-${index}" onclick="handleClick(${index})">${fieldSymbol}</div>`;
    });

    fieldContent.innerHTML = htmlContent;
}


function getComponents() {
    return {
        header: document.getElementById('header-content'),
        footer: document.getElementById('footer-content'),
        player: document.getElementById('current-player-indicator'),
        winner: document.getElementById('winner-modal'),
    };
}


function loadTemplates(components) {
    components.header.innerHTML = getHeaderTemplate();
    components.footer.innerHTML = getFooterTemplate();
    components.player.innerHTML = getCurrentPlayerTemplate();
    components.winner.innerHTML = getWinningModalTemplate();
}