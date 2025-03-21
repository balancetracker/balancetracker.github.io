const amountInput = document.getElementById('amountInput');
const feeInput = document.getElementById('feeInput');
const pasteButton = document.getElementById('pasteButton');
const resetHistory = document.getElementById('resetHistory');
const historyList = document.getElementById('historyList');
const tooltip = document.getElementById('tooltip');
const tabList = document.getElementById('tabList');
const addTab = document.getElementById('addTab');
const deleteTab = document.getElementById('deleteTab');
const currentBalanceDisplay = document.getElementById('currentBalanceDisplay');
const bankBalanceInput = document.getElementById('bankBalanceInput');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const themeToggle = document.getElementById('themeToggle');
const themePopup = document.getElementById('themePopup');
const themeList = document.getElementById('themeList');
const closeThemePopup = document.getElementById('closeThemePopup');
const dragHandle = document.getElementById('dragHandle');
const resizeHandle = document.getElementById('resizeHandle');
const containerWrapper = document.getElementById('containerWrapper');
const container = document.getElementById('container');
const resetSizePosition = document.getElementById('resetSizePosition');

let profiles = JSON.parse(localStorage.getItem('profiles')) || [
    { name: 'Default', balance: 0, fee: 0, history: [] }
];
let activeProfile = localStorage.getItem('activeProfile') || 'Default';
let scale = 1.0;

// Load saved position and size from localStorage or set defaults
let containerState = JSON.parse(localStorage.getItem('containerState')) || {
    width: 288, // Default width: 288px (w-72 in Tailwind)
    height: 'auto',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    scale: 1.0 // Default scale
};

// Apply saved position and size
container.style.width = `${containerState.width}px`;
container.style.height = containerState.height;
containerWrapper.style.left = containerState.left;
containerWrapper.style.top = containerState.top;
containerWrapper.style.transform = containerState.transform;
scale = containerState.scale;
container.style.transform = `scale(${scale})`;

// Theme Options
const themes = [
    { id: 'default', name: 'Default', icon: '⚪' },
    { id: 'darkmode', name: 'Dark Mode', icon: '🌙' }, // New Dark Mode theme
    { id: 'khmer', name: 'Khmer', icon: '🏡' },
    { id: 'sunset', name: 'Sunset', icon: '🌅' },
    { id: 'rainy', name: 'Rainy City', icon: '☔' },
    { id: 'forest', name: 'Forest Festival', icon: '🌳' },
    { id: 'meteor', name: 'Meteor Shower', icon: '🌠' },
    { id: 'field', name: 'Sunny Field', icon: '🌞' },
    { id: 'wanted', name: 'Wanted Poster', icon: '📜' },
    { id: 'dog', name: 'Dog Chase', icon: '🐶' },
    { id: 'winter', name: 'Winter', icon: '☃️' },
    { id: 'halloween', name: 'Halloween', icon: '🎃' },
    { id: 'spring', name: 'Daisy', icon: '🌼' },
    { id: 'kawaii', name: 'Kawaii', icon: '🍡' },
    { id: 'pastel', name: 'Pastel', icon: '🎨' },
    { id: 'handdrawn', name: 'Hand-Drawn', icon: '✍️' },
    { id: 'rainbow', name: 'Doraemon', icon: '🐼' },
    { id: 'glassmorphism', name: 'Luffy', icon: '👒' },
    { id: 'sticker', name: 'Sticker', icon: '📌' },
    { id: 'cozy', name: 'Cozy', icon: '🛋️' }
];

// Load selected theme from localStorage or set to 'default' for new users
const savedTheme = localStorage.getItem('selectedTheme') || 'default';
document.body.className = `font-mono theme-${savedTheme}`;
document.documentElement.setAttribute('data-theme', savedTheme === 'default' || savedTheme === 'sunset' || savedTheme === 'spring' || savedTheme === 'kawaii' || savedTheme === 'pastel' || savedTheme === 'handdrawn' || savedTheme === 'rainbow' || savedTheme === 'glassmorphism' || savedTheme === 'sticker' || savedTheme === 'cozy' ? 'light' : 'dark');
// Update current balance display
function updateCurrentBalanceDisplay(balance) {
    if (isNaN(balance)) balance = 0;
    currentBalanceDisplay.value = formatNumber(balance);
    currentBalanceDisplay.classList.add('fade-in');
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Restrict input to numbers only
function restrictInput(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9-]/g, '');
    if (input === amountInput) calculateAndUpdate();
    if (input === currentBalanceDisplay) {
        const profile = profiles.find(p => p.name === activeProfile);
        const newBalance = parseFloat(input.value.replace(/,/g, '')) || 0;
        profile.balance = newBalance;
        saveProfiles();
    }
    if (input === bankBalanceInput) calculateAndUpdateBank();
}

// Calculate and update balance (deduct amount and fee)
function calculateAndUpdate() {
    const profile = profiles.find(p => p.name === activeProfile);
    let balance = parseFloat(currentBalanceDisplay.value.replace(/,/g, '')) || 0;
    const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
    const fee = parseFloat(feeInput.value.replace(/,/g, '')) || 0;

    if (isNaN(amount)) return;

    const newBalance = balance - amount - fee;
    const formattedResult = formatNumber(newBalance);
    updateCurrentBalanceDisplay(newBalance);
    profile.balance = newBalance;
    currentBalanceDisplay.classList.remove('pulse');
    setTimeout(() => currentBalanceDisplay.classList.add('pulse'), 100);

    const historyCard = document.createElement('div');
    historyCard.className = 'history-card fade-in';
    const dateTime = new Date().toLocaleString();
    const feeText = fee > 0 ? ` | F: ${formatNumber(fee)}` : '';
    historyCard.innerHTML = `
        A: ${formatNumber(amount)}${feeText} | B: ${formattedResult}
        <span class="timestamp hidden">${dateTime}</span>
    `;
    historyCard.addEventListener('click', () => {
        const match = historyCard.textContent.match(/A: ([\d,]+)( \| F: ([\d,]+))? \| B: ([\d,]+)/);
        const amount = parseFloat(match[1].replace(/,/g, ''));
        const fee = match[3] ? parseFloat(match[3].replace(/,/g, '')) : 0;
        const balance = parseFloat(match[4].replace(/,/g, ''));
        amountInput.value = formatNumber(amount);
        feeInput.value = fee > 0 ? formatNumber(fee) : '';
        bankBalanceInput.value = '';
        updateCurrentBalanceDisplay(balance);
        const profile = profiles.find(p => p.name === activeProfile);
        profile.balance = balance;
        saveProfiles();
    });
    historyCard.addEventListener('mouseover', (e) => {
        if (tooltip) {
            tooltip.textContent = historyCard.querySelector('.timestamp').textContent;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    });
    historyCard.addEventListener('mouseout', () => {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    });

    // Highlight if the amount matches the previous entry
    const previousEntry = historyList.firstChild?.textContent;
    const previousAmountMatch = previousEntry?.match(/A: ([\d,]+)/);
    const previousAmount = previousAmountMatch ? parseFloat(previousAmountMatch[1].replace(/,/g, '')) : null;
    if (previousAmount !== null && previousAmount === amount) {
        historyCard.classList.add('highlight');
    }

    profile.history.unshift(historyCard.outerHTML);
    saveProfiles();
    renderHistory(profile.history);
    amountInput.value = '';
    feeInput.value = '';
    navigator.clipboard.writeText(formattedResult).catch(console.error);

    // Highlight the last history entry
    highlightLastHistoryEntry();
}

// Calculate and update balance with bank input (add to balance)
function calculateAndUpdateBank() {
    const profile = profiles.find(p => p.name === activeProfile);
    const currentBalance = parseFloat(currentBalanceDisplay.value.replace(/,/g, '')) || 0;
    const bankBalance = parseFloat(bankBalanceInput.value.replace(/,/g, '')) || 0;

    if (isNaN(bankBalance) || bankBalance === 0) return;

    const newBalance = currentBalance + bankBalance;
    const formattedResult = formatNumber(newBalance);
    updateCurrentBalanceDisplay(newBalance);
    profile.balance = newBalance;
    saveProfiles();

    const historyCard = document.createElement('div');
    historyCard.className = 'history-card fade-in plus-highlight';
    const dateTime = new Date().toLocaleString();
    historyCard.innerHTML = `
        +B: ${formatNumber(bankBalance)} | B: ${formattedResult}
        <span class="timestamp hidden">${dateTime}</span>
    `;
    historyCard.addEventListener('click', () => {
        const match = historyCard.textContent.match(/\+B: ([\d,]+) \| B: ([\d,]+)/);
        const bankBal = parseFloat(match[1].replace(/,/g, ''));
        const balance = parseFloat(match[2].replace(/,/g, ''));
        bankBalanceInput.value = formatNumber(bankBal);
        amountInput.value = '';
        feeInput.value = '';
        updateCurrentBalanceDisplay(balance);
        const profile = profiles.find(p => p.name === activeProfile);
        profile.balance = balance;
        saveProfiles();
    });
    historyCard.addEventListener('mouseover', (e) => {
        if (tooltip) {
            tooltip.textContent = historyCard.querySelector('.timestamp').textContent;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    });
    historyCard.addEventListener('mouseout', () => {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    });

    profile.history.unshift(historyCard.outerHTML);
    saveProfiles();
    renderHistory(profile.history);
    bankBalanceInput.value = '';

    // Highlight the last history entry
    highlightLastHistoryEntry();
}

// Highlight the last history entry
// Highlight the last history entry
function highlightLastHistoryEntry() {
    const historyCards = historyList.querySelectorAll('.history-card');
    console.log('History cards:', historyCards); // Debug: Check if cards are found

    // Remove last-highlight from all cards
    historyCards.forEach(card => card.classList.remove('last-highlight'));

    // If there are no history cards, return
    if (historyCards.length === 0) return;

    // Get the most recent and second-most-recent entries
    const mostRecentCard = historyCards[0];
    const secondMostRecentCard = historyCards[1];

    // Extract the amount from the most recent entry
    const mostRecentText = mostRecentCard.textContent;
    const mostRecentAmountMatch = mostRecentText.match(/A: ([\d,]+)/);
    const mostRecentAmount = mostRecentAmountMatch ? parseFloat(mostRecentAmountMatch[1].replace(/,/g, '')) : null;

    // If there's a second entry, extract its amount
    let amountsMatch = false;
    if (secondMostRecentCard) {
        const secondMostRecentText = secondMostRecentCard.textContent;
        const secondMostRecentAmountMatch = secondMostRecentText.match(/A: ([\d,]+)/);
        const secondMostRecentAmount = secondMostRecentAmountMatch ? parseFloat(secondMostRecentAmountMatch[1].replace(/,/g, '')) : null;

        // Check if the amounts match
        if (mostRecentAmount !== null && secondMostRecentAmount !== null && mostRecentAmount === secondMostRecentAmount) {
            amountsMatch = true;
            // Apply .highlight to the second-most-recent card as well
            secondMostRecentCard.classList.add('highlight');
            console.log('Applied highlight to second-most-recent card:', secondMostRecentCard); // Debug
        }
    }

    // Apply last-highlight to the most recent card only if amounts don't match
    if (!amountsMatch) {
        mostRecentCard.classList.add('last-highlight');
        console.log('Applied last-highlight to:', mostRecentCard); // Debug: Confirm class is added
    } else {
        console.log('Skipped last-highlight because amounts match:', mostRecentCard); // Debug
    }
}

// Render tabs
function renderTabs() {
    tabList.innerHTML = '';
    profiles.forEach(profile => {
        const tab = document.createElement('button');
        tab.textContent = profile.name;
        tab.className = `tab-btn ${profile.name === activeProfile ? 'active' : ''}`;
        tab.addEventListener('click', () => switchProfile(profile.name));
        tab.addEventListener('dblclick', () => renameProfile(profile.name));
        tabList.appendChild(tab);
    });
}

// Switch profile
function switchProfile(profileName) {
    activeProfile = profileName;
    localStorage.setItem('activeProfile', activeProfile);
    loadProfile(profileName);
    renderTabs();
}

// Rename profile
function renameProfile(profileName) {
    const newName = prompt('Enter profile name:', profileName);
    if (newName && newName !== profileName && !profiles.some(p => p.name === newName)) {
        const profile = profiles.find(p => p.name === profileName);
        profile.name = newName;
        if (activeProfile === profileName) activeProfile = newName;
        saveProfiles();
        renderTabs();
        loadProfile(activeProfile);
    }
}

// Load profile
function loadProfile(profileName) {
    const profile = profiles.find(p => p.name === profileName) || profiles[0];
    amountInput.value = '';
    feeInput.value = '';
    bankBalanceInput.value = '';
    updateCurrentBalanceDisplay(profile.balance || 0);
    renderHistory(profile.history || []);
}

// Render history
function renderHistory(history) {
    historyList.innerHTML = history.join('');
    historyList.querySelectorAll('.history-card').forEach(card => {
        card.addEventListener('click', () => {
            const isDeduction = card.textContent.includes('A:');
            if (isDeduction) {
                const match = card.textContent.match(/A: ([\d,]+)( \| F: ([\d,]+))? \| B: ([\d,]+)/);
                if (match) {
                    const amount = parseFloat(match[1].replace(/,/g, ''));
                    const fee = match[3] ? parseFloat(match[3].replace(/,/g, '')) : 0;
                    const balance = parseFloat(match[4].replace(/,/g, ''));
                    amountInput.value = formatNumber(amount);
                    feeInput.value = fee > 0 ? formatNumber(fee) : '';
                    bankBalanceInput.value = '';
                    updateCurrentBalanceDisplay(balance);
                    const profile = profiles.find(p => p.name === activeProfile);
                    profile.balance = balance;
                    saveProfiles();
                }
            } else {
                const match = card.textContent.match(/\+B: ([\d,]+) \| B: ([\d,]+)/);
                if (match) {
                    const bankBal = parseFloat(match[1].replace(/,/g, ''));
                    const balance = parseFloat(match[2].replace(/,/g, ''));
                    bankBalanceInput.value = formatNumber(bankBal);
                    amountInput.value = '';
                    feeInput.value = '';
                    updateCurrentBalanceDisplay(balance);
                    const profile = profiles.find(p => p.name === activeProfile);
                    profile.balance = balance;
                    saveProfiles();
                }
            }
        });
        card.addEventListener('mouseover', (e) => {
            if (tooltip) {
                tooltip.textContent = card.querySelector('.timestamp').textContent;
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        });
        card.addEventListener('mouseout', () => {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    });

    highlightLastHistoryEntry();
}

// Clipboard paste via button
pasteButton.addEventListener('click', () => {
    navigator.clipboard.readText()
        .then(text => {
            amountInput.value = text.replace(/[^0-9-]/g, '');
            calculateAndUpdate();
        })
        .catch(console.error);
});

// Clipboard paste via right-click
amountInput.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    navigator.clipboard.readText()
        .then(text => {
            amountInput.value = text.replace(/[^0-9-]/g, '');
            calculateAndUpdate();
        })
        .catch(console.error);
});

// Add new tab/profile
addTab.addEventListener('click', () => {
    const newName = prompt('Enter profile name:', `Profile ${profiles.length + 1}`);
    if (newName && !profiles.some(p => p.name === newName)) {
        profiles.push({ name: newName, balance: 0, fee: 0, history: [] });
        saveProfiles();
        switchProfile(newName);
    }
});

// Delete tab/profile
deleteTab.addEventListener('click', () => {
    if (profiles.length <= 1) return alert('Cannot delete the last profile!');
    profiles = profiles.filter(p => p.name !== activeProfile);
    activeProfile = profiles[0].name;
    saveProfiles();
    renderTabs();
    loadProfile(activeProfile);
});

// Reset all in profile
resetHistory.addEventListener('click', () => {
    const profile = profiles.find(p => p.name === activeProfile);
    profile.balance = 0;
    profile.fee = 0;
    profile.history = [];
    saveProfiles();
    loadProfile(activeProfile);
    updateCurrentBalanceDisplay(0);
});

// Save profiles to localStorage
function saveProfiles() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// Input event listeners
[amountInput, feeInput, currentBalanceDisplay, bankBalanceInput].forEach(input => {
    input.addEventListener('input', restrictInput);
});

// Zoom functionality
zoomIn.addEventListener('click', () => {
    scale = Math.min(scale + 0.1, 1.5);
    container.style.transform = `scale(${scale})`;
    containerState.scale = scale;
    localStorage.setItem('containerState', JSON.stringify(containerState));
});

zoomOut.addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.5);
    container.style.transform = `scale(${scale})`;
    containerState.scale = scale;
    localStorage.setItem('containerState', JSON.stringify(containerState));
});

// Dragging functionality
let isDragging = false;
let currentX;
let currentY;

dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    container.classList.add('dragging'); // Add visual indicator

    // Calculate the initial position correctly
    const rect = containerWrapper.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;
    containerWrapper.style.transform = 'none'; // Remove centering transform while dragging
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let newX = e.clientX - currentX;
        let newY = e.clientY - currentY;

        // Ensure the calculator stays within the viewport
        const maxX = window.innerWidth - container.offsetWidth * scale;
        const maxY = window.innerHeight - container.offsetHeight * scale;

        // Add snapping to edges (within 20px of the edge)
        const snapThreshold = 20;
        if (newX < snapThreshold) newX = 0;
        if (newY < snapThreshold) newY = 0;
        if (newX > maxX - snapThreshold) newX = maxX;
        if (newY > maxY - snapThreshold) newY = maxY;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        containerWrapper.style.left = `${newX}px`;
        containerWrapper.style.top = `${newY}px`;

        // Update container state
        containerState.left = containerWrapper.style.left;
        containerState.top = containerWrapper.style.top;
        containerState.transform = 'none';
        localStorage.setItem('containerState', JSON.stringify(containerState));
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging'); // Remove visual indicator
    }
});

// Remove resetSizePosition button
if (resetSizePosition) {
    resetSizePosition.remove();
}

// Theme toggle functionality with blur effect
themeToggle.addEventListener('click', () => {
    if (themePopup) {
        themePopup.classList.remove('hidden');
        themePopup.classList.add('show');    }
});

closeThemePopup.addEventListener('click', () => {
    if (themePopup) {
        themePopup.classList.add('hidden');
        themePopup.classList.remove('show');
        containerWrapper.classList.remove('blur'); // Remove blur effect
        document.body.classList.remove('blur-background'); // Remove background blur
    }
});

// Render theme options
function renderThemeOptions() {
    if (!themeList) return;
    themeList.innerHTML = '';
    const savedTheme = localStorage.getItem('selectedTheme') || 'default'; // Get the currently selected theme
    themes.forEach(theme => {
        const themeOption = document.createElement('div');
        themeOption.className = `theme-option ${theme.id === savedTheme ? 'selected' : ''}`; // Add 'selected' class if this theme is active
        themeOption.innerHTML = `
            <span class="text-lg">${theme.icon}</span>
            <p class="text-xs text-[var(--text-color)]">${theme.name}</p>
        `;
        themeOption.addEventListener('click', () => {
            document.body.className = `font-mono theme-${theme.id}`;
            document.documentElement.setAttribute('data-theme', theme.id === 'default' || theme.id === 'sunset' || theme.id === 'spring' || theme.id === 'kawaii' || theme.id === 'pastel' || theme.id === 'handdrawn' || theme.id === 'rainbow' || theme.id === 'glassmorphism' || theme.id === 'sticker' || theme.id === 'cozy' ? 'light' : 'dark');
            localStorage.setItem('selectedTheme', theme.id); // Save the selected theme
            // Re-render the theme options to update the highlight
            renderThemeOptions();
            if (themePopup) {
                themePopup.classList.add('hidden');
                themePopup.classList.remove('show');
                containerWrapper.classList.remove('blur'); // Remove blur effect
                document.body.classList.remove('blur-background'); // Remove background blur
            }
        });
        themeList.appendChild(themeOption);
    });
}