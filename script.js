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

const themes = [
    {
        category: 'Default',
        items: [
            { id: 'default', name: 'Default', icon: '', preview: 'images/default.png' },
            { id: 'darkmode', name: 'Dark Mode', icon: '🌙', preview: 'images/darkmode.jpg' },
        ]
    },
    {
        category: 'Shin-chan',
        items: [
            { id: 'family', name: 'family', icon: '', preview: 'images/Shin-chan/family.jpg' },
            { id: 'fishing', name: 'fishing', icon: '', preview: 'images/Shin-chan/fishing.jpg' },
            { id: 'friend', name: 'friend', icon: '', preview: 'images/Shin-chan/friend.jpg' },
            { id: 'luky', name: 'luky', icon: '', preview: 'images/Shin-chan/luky.jpg' },
            { id: 'peace', name: 'peace', icon: '', preview: 'images/Shin-chan/peace.jpg' },
            { id: 'missing', name: 'Missing', icon: '', preview: 'images/Shin-chan/Missing.jpg' },
            { id: 'work', name: 'work', icon: '', preview: 'images/Shin-chan/work.jpg' },
            { id: 'beach', name: 'Beach', icon: '', preview: 'images/Shin-chan/beach.jpg' },
            { id: 'party', name: 'Party', icon: '', preview: 'images/Shin-chan/party.jpg' },
            { id: 'sea', name: 'sea', icon: '', preview: 'images/Shin-chan/sea.jpg' },
            { id: 'care', name: 'care', icon: '', preview: 'images/Shin-chan/care.jpg' },
            { id: 'rainy', name: 'Rainy', icon: '', preview: 'images/Shin-chan/rainy.jpg' },
            { id: 'sunny', name: 'Sunny', icon: '', preview: 'images/Shin-chan/Sunny.jpg' },
            { id: 'meteor', name: 'Meteor', icon: '', preview: 'images/Shin-chan/meteor.jpg' }
        ]
    },
    {
        category: 'D.Luffy',
        items: [
            { id: 'strawhat', name: 'Straw Hat', icon: '', preview: 'images/D.Luffy/strawhat.jpg' },
            { id: 'pirateship', name: 'Pirate Ship', icon: '', preview: 'images/D.Luffy/pirateship.jpg' },
            { id: 'logo', name: 'Sticker', icon: '', preview: 'images/D.Luffy/Sticker.jpg' },
            { id: 'adventure', name: 'Adventure', icon: '', preview: 'images/D.Luffy/adventure.jpg' },
            { id: 'kid', name: 'Kid', icon: '', preview: 'images/D.Luffy/kid.jpg' },
            { id: 'joyboy', name: 'Joyboy', icon: '', preview: 'images/D.Luffy/joyboy.jpg' },
            { id: 'forest', name: 'Forest', icon: '', preview: 'images/D.Luffy/Forest.jpg' },
            { id: 'grandline', name: 'Grand Line', icon: '', preview: 'images/D.Luffy/grandline.jpg' },
            { id: 'onepiece', name: 'One Piece', icon: '', preview: 'images/D.Luffy/onepiece.jpg' }
        ]
    },
    {
        category: 'Kampuchea',
        items: [
            { id: 'home', name: 'Home', preview: 'images/kampuchea/Home.jpg' },
            { id: 'angkor', name: 'Angkor', preview: 'images/kampuchea/Angkor.jpg' },
            { id: 'night', name: 'Night', preview: 'images/kampuchea/Night.jpg' },
            { id: 'dream', name: 'Dream', preview: 'images/kampuchea/Dream.jpg' }
        ]
    },
    {
        category: 'Panda',
        items: [
            { id: 'sleeping', name: 'Sleeping', preview: 'images/Panda/sleeping.jpg' },
            { id: 'relax', name: 'Relax', preview: 'images/Panda/relax.jpg' },
            { id: 'sticky', name: 'Sticky', preview: 'images/Panda/sticky.jpg' },
            { id: 'shower', name: 'Shower', preview: 'images/Panda/shower.jpg' },
            { id: 'cute', name: 'Cute', preview: 'images/Panda/Cute.jpg' },
            { id: 'gang', name: 'Gang', preview: 'images/Panda/Gang.jpg' }
        ]
    },
    {
        category: 'Nezha',
        items: [
            { id: 'jgmix', name: 'Jg Mix', preview: 'images/nezha/Jgmix.jpg' },
            { id: 'goffy', name: 'Goffy', preview: 'images/nezha/goffy.jpg' },
            { id: 'chers', name: 'Chers', preview: 'images/nezha/chers.jpg' },
            { id: 'kdmv', name: 'KDMV', preview: 'images/nezha/kdmv.jpg' },
            { id: 'ganggang', name: 'ganggang', preview: 'images/nezha/ganggang.jpg' },
            { id: 'jaffy', name: ' jaffy', preview: 'images/nezha/jaffy.jpg' },
            { id: 'pukmak', name: 'pukmak', preview: 'images/nezha/pukmak.jpg' },
            { id: 'BL', name: 'BL', preview: 'images/nezha/BL.jpg' }

        ]
    },
    {
        category: 'Bubu Dudu',
        items: [
            { id: 'trip', name: 'Trip', preview: 'images/Bubu Dudu/trip.jpg' },
            { id: 'street', name: 'Street', preview: 'images/Bubu Dudu/street.jpg' },
            { id: 'heart', name: 'Heart', preview: 'images/Bubu Dudu/sea.jpg' },
            { id: 'sweet', name: 'Sweet', preview: 'images/Bubu Dudu/night.jpg' }
        ]
    },
    {
        category: 'Naruto',
        items: [
            { id: 'hikhik', name: 'Hikhik', preview: 'images/Naruto/hikhik.jpg' },
            { id: 'woo', name: 'Woo?', preview: 'images/Naruto/woo.jpg' },
            { id: 'thnking', name: 'Thnking', preview: 'images/Naruto/hikhik.jpg' },
            { id: 'team', name: 'Team', preview: 'images/Naruto/team.jpg' },
        ]
    },
    {
        category: 'Ponyo',
        items: [
            { id: 'first', name: 'First', preview: 'images/ponyo/first.jpg' },
            { id: 'hug', name: 'Hug', preview: 'images/ponyo/hug.jpg' },
            { id: 'nature', name: 'Nature', preview: 'images/ponyo/nature.jpg' },
            { id: 'warm', name: 'Warm', preview: 'images/ponyo/warm.jpg' },
            { id: 'ocean', name: 'Ocean', preview: 'images/ponyo/ocean.jpg' },
        ]
    },
    {
        category: 'Doraemon&Stitch',
        items: [
            { id: 'wating', name: 'Wating', preview: 'images/Doraemon&Stitch/wating.jpg' },
            { id: 'hello', name: 'Hello', preview: 'images/Doraemon&Stitch/hello.jpg' },
            { id: 'lolo', name: 'lolo', preview: 'images/Doraemon&Stitch/lolo.jpg' },
            { id: 'cool', name: 'cool', preview: 'images/Doraemon&Stitch/cool.jpg' },
            { id: 'help', name: 'help', preview: 'images/Doraemon&Stitch/help.jpg' },
        ]
    },
    {
        category: 'Totoro',
        items: [
            { id: 'rgcham', name: 'Rgcham', preview: 'images/Totoro/rgcham.jpg' },
            { id: 'collapsing', name: 'collapsing', preview: 'images/Totoro/collapsing.jpg' },
            { id: 'whoops', name: 'whoops', preview: 'images/Totoro/whoops.jpg' },
        ]
    },
    {
        category: 'Weather&Flower',
        items: [
            { id: 'daisy', name: 'Daisy', preview: 'images/Weather&Flower/Daisy.jpg' },
            { id: 'campfire', name: 'campfire', preview: 'images/Weather&Flower/campfire.jpg' },
            { id: 'cozy', name: 'cozy', preview: 'images/Weather&Flower/cozy.jpg' },
            { id: 'meet', name: 'Meet', preview: 'images/Weather&Flower/meet.jpg' },
            { id: 'safe', name: 'Safe', preview: 'images/Weather&Flower/safe.jpg' },
            { id: 'sakura', name: 'Sakura', preview: 'images/Weather&Flower/sakura.jpg' },
            { id: 'village', name: 'village', preview: 'images/Weather&Flower/village.jpg' },
        ]
    }
];

// Fixed missing or incorrect logic in theme rendering
function renderThemeOptions() {
    if (!themeList) {
        console.error('themeList element not found!');
        return;
    }
    themeList.innerHTML = '';
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    console.log('Saved theme on render:', savedTheme);

    themes.forEach((category, catIndex) => {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header text-sm font-semibold text-[var(--text-color)] mt-2 mb-1 p-2 rounded-lg cursor-pointer flex justify-between items-center';
        categoryHeader.innerHTML = `
            ${category.category || 'Unnamed Category'}
            <i class="fas fa-chevron-down transition-transform duration-300"></i>
        `;
        categoryContainer.appendChild(categoryHeader);

        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'category-grid grid grid-cols-3 gap-2 hidden';
        category.items.forEach((theme, themeIndex) => {
            const themeOption = document.createElement('div');
            themeOption.className = `theme-option ${theme.id === savedTheme ? 'selected' : ''}`;
            themeOption.setAttribute('data-theme-id', theme.id);
            themeOption.innerHTML = `
                <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-cover bg-center" style="background-image: url('${theme.preview || 'images/default.png'}');"></div>
                    <p class="text-xs text-[var(--text-color)]">${theme.name || 'Unnamed Theme'}</p>
                </div>
            `;
            themeOption.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling to categoryHeader
                console.log(`Theme clicked: Category=${category.category}, Theme=${theme.name}, ID=${theme.id}`);
                console.log('Event target:', e.target);
                console.log('Current body class before change:', document.body.className);

                // Apply the selected theme to the body
                document.body.className = `font-mono theme-${theme.id}`;
                console.log('Body class set to:', document.body.className);

                // Set data-theme attribute
                document.documentElement.setAttribute('data-theme', 
                    ['default', 'family', 'fishing', 'luky', 'peace', 'missing', 'work', 'beach', 'party', 'sea', 'care', 'rainy', 'sunny', 'meteor', 
                     'strawhat', 'pirateship', 'logo', 'adventure', 'kid', 'joyboy', 'forest', 'grandline', 'onepiece', 
                     'home', 'angkor', 'dream', 
                     'sleeping', 'relax', 'sticky', 'shower', 'cute', 'gang', 
                     'jgmix', 'goffy', 'chers', 'kdmv', 'kesomtus', 
                     'trip', 'street', 'heart', 'sweet', 
                     'hikhik', 'woo', 'thnking', 'team', 
                     'first', 'hug', 'nature', 'warm', 'ocean', 
                     'wating', 'hello', 'lolo', 'cool', 'help', 
                     'rgcham', 'collapsing', 'whoops', 
                     'daisy', 'campfire', 'cozy', 'meet', 'safe', 'sakura', 'village'].includes(theme.id) ? 'light' : 'dark'
                );
                console.log('data-theme set to:', document.documentElement.getAttribute('data-theme'));

                // Save to localStorage
                localStorage.setItem('selectedTheme', theme.id);
                console.log('Saved theme to localStorage:', localStorage.getItem('selectedTheme'));

                // Update the selected state
                document.querySelectorAll('.theme-option').forEach(option => {
                    option.classList.remove('selected');
                });
                themeOption.classList.add('selected');
                console.log('Selected class updated on themeOption:', themeOption.className);

                // Close the theme popup
                if (themePopup) {
                    themePopup.classList.add('hidden');
                    themePopup.classList.remove('show');
                    console.log('Theme popup closed');
                }

                // Force a re-render
                document.body.classList.remove('force-render');
                void document.body.offsetWidth; // Trigger reflow
                document.body.classList.add('force-render');
                console.log('Forced re-render of body');
            });
            categoryGrid.appendChild(themeOption);
        });
        categoryContainer.appendChild(categoryGrid);

        categoryHeader.addEventListener('click', () => {
            // Collapse all other categories
            document.querySelectorAll('.category-container').forEach(container => {
                const otherGrid = container.querySelector('.category-grid');
                const otherChevron = container.querySelector('.category-header i');
                if (otherGrid !== categoryGrid) {
                    otherGrid.classList.add('hidden');
                    otherChevron.classList.remove('rotate-180');
                }
            });

            // Toggle the clicked category
            categoryGrid.classList.toggle('hidden');
            const chevron = categoryHeader.querySelector('i');
            chevron.classList.toggle('rotate-180');
        });

        themeList.appendChild(categoryContainer);
    });

    openCategoryWithSelectedTheme(savedTheme);
}

// Ensure the category containing the selected theme is open
function openCategoryWithSelectedTheme(savedTheme) {
    const categoryContainers = document.querySelectorAll('.category-container');
    categoryContainers.forEach(container => {
        const categoryGrid = container.querySelector('.category-grid');
        const themeOptions = categoryGrid.querySelectorAll('.theme-option');
        let hasSelectedTheme = false;

        themeOptions.forEach(option => {
            if (option.classList.contains('selected')) {
                hasSelectedTheme = true;
            }
        });

        if (hasSelectedTheme) {
            categoryGrid.classList.remove('hidden');
            const chevron = container.querySelector('.category-header i');
            chevron.classList.add('rotate-180');
        }
    });
}

function updateCurrentBalanceDisplay(balance) {
    if (isNaN(balance) || balance === 0) {
        currentBalanceDisplay.value = ''; // Set to empty if balance is 0 or NaN
    } else {
        currentBalanceDisplay.value = formatNumber(balance); // Format and display the balance
    }
    currentBalanceDisplay.classList.add('fade-in');
}

function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) {
        return '0';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Restrict input to numbers only
function restrictInput(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9-]/g, '');

    // Only trigger calculations for specific inputs
    if (input === amountInput) {
        calculateAndUpdate();
    } else if (input === bankBalanceInput) {
        calculateAndUpdateBank();
    }
}

// Remove unnecessary blur event listener for currentBalanceDisplay
[amountInput, feeInput, bankBalanceInput].forEach(input => {
    input.addEventListener('input', restrictInput);
    input.addEventListener('blur', () => {
        if (input === amountInput) calculateAndUpdate();
        if (input === bankBalanceInput) calculateAndUpdateBank();
    });
});

function calculateAndUpdate() {
    const profile = profiles.find(p => p.name === activeProfile);
    let balance = parseFloat(currentBalanceDisplay.value.replace(/,/g, '')) || 0;
    const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
    const fee = parseFloat(feeInput.value.replace(/,/g, '')) || 0;

    // Only proceed if there's an amount; ignore fee-only changes here
    if (amount === 0) return; // Skip if no amount is entered

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
    // ... history card event listeners remain unchanged ...

    profile.history.unshift(historyCard.outerHTML);
    saveProfiles();
    renderHistory(profile.history);
    
    amountInput.value = ''; // Clear only amountInput, leave feeInput as is

    navigator.clipboard.writeText(formattedResult).catch(console.error);
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
function highlightLastHistoryEntry() {
    const historyCards = historyList.querySelectorAll('.history-card');
    historyCards.forEach(card => card.classList.remove('last-highlight'));

    if (historyCards.length === 0) return;

    const mostRecentCard = historyCards[0];
    const secondMostRecentCard = historyCards[1];

    const mostRecentText = mostRecentCard.textContent;
    const mostRecentAmountMatch = mostRecentText.match(/A: ([\d,]+)/);
    const mostRecentAmount = mostRecentAmountMatch ? parseFloat(mostRecentAmountMatch[1].replace(/,/g, '')) : null;

    let amountsMatch = false;
    if (secondMostRecentCard) {
        const secondMostRecentText = secondMostRecentCard.textContent;
        const secondMostRecentAmountMatch = secondMostRecentText.match(/A: ([\d,]+)/);
        const secondMostRecentAmount = secondMostRecentAmountMatch ? parseFloat(secondMostRecentAmountMatch[1].replace(/,/g, '')) : null;

        if (mostRecentAmount !== null && mostRecentAmount === secondMostRecentAmount) {
            amountsMatch = true;
            secondMostRecentCard.classList.add('highlight');
        }
    }

    if (!amountsMatch) {
        mostRecentCard.classList.add('last-highlight');
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

// Zoom functionality
zoomIn.addEventListener('click', () => {
    const oldScale = scale;
    const maxScale = Math.min(
        1.5,
        Math.min(
            window.innerWidth / container.offsetWidth,
            window.innerHeight / container.offsetHeight
        )
    );
    scale = Math.min(scale + 0.1, maxScale);
    container.style.transform = `scale(${scale})`;

    containerState.scale = scale;
    localStorage.setItem('containerState', JSON.stringify(containerState));
});

zoomOut.addEventListener('click', () => {
    const oldScale = scale;
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
    container.classList.add('dragging');

    const rect = containerWrapper.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;
    containerWrapper.style.transform = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let newX = e.clientX - currentX;
        let newY = e.clientY - currentY;

        const maxX = window.innerWidth - container.offsetWidth * scale;
        const maxY = window.innerHeight - container.offsetHeight * scale;

        const snapThreshold = 20;
        if (newX < snapThreshold) newX = 0;
        if (newY < snapThreshold) newY = 0;
        if (newX > maxX - snapThreshold) newX = maxX;
        if (newY > maxY - snapThreshold) newY = maxY;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        containerWrapper.style.left = `${newX}px`;
        containerWrapper.style.top = `${newY}px`;

        containerState.left = containerWrapper.style.left;
        containerState.top = containerWrapper.style.top;
        containerState.transform = 'none';
        localStorage.setItem('containerState', JSON.stringify(containerState));
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging');
    }
});

// Remove resetSizePosition button
if (resetSizePosition) {
    resetSizePosition.remove();
}

// Center the calculator on page reload
window.addEventListener('load', () => {
    containerWrapper.style.left = '50%';
    containerWrapper.style.top = '50%';
    containerWrapper.style.transform = 'translate(-50%, -50%)';
    containerState.left = '50%';
    containerState.top = '50%';
    containerState.transform = 'translate(-50%, -50%)';
    localStorage.setItem('containerState', JSON.stringify(containerState));
});

// Theme toggle functionality with blur effect
themeToggle.addEventListener('click', () => {
    if (themePopup) {
        themePopup.classList.remove('hidden'); // Show the popup
        themePopup.classList.add('show'); // Add the "show" class for visibility
        renderThemeOptions(); // Ensure themes are rendered when the popup is opened
        document.body.classList.add('blur-background'); // Add blur effect to the body
    }
});

closeThemePopup.addEventListener('click', () => {
    if (themePopup) {
        themePopup.classList.add('hidden'); // Hide the popup
        themePopup.classList.remove('show'); // Remove the "show" class
        document.body.classList.remove('blur-background'); // Remove background blur
    }
});

// Debugging: Log the themePopup and themeList elements to ensure they exist
console.log('themePopup:', themePopup);
console.log('themeList:', themeList);

// In script.js, add this after renderThemeOptions
const themeSearch = document.getElementById('themeSearch');
if (themeSearch) {
    themeSearch.addEventListener('input', () => {
        const searchTerm = themeSearch.value.toLowerCase();
        const categoryContainers = document.querySelectorAll('.category-container');
        categoryContainers.forEach(container => {
            const categoryGrid = container.querySelector('.category-grid');
            const themeOptions = categoryGrid.querySelectorAll('.theme-option');
            let hasVisibleThemes = false;

            themeOptions.forEach(option => {
                const themeName = option.querySelector('p').textContent.toLowerCase();
                if (themeName.includes(searchTerm)) {
                    option.style.display = 'block';
                    hasVisibleThemes = true;
                } else {
                    option.style.display = 'none';
                }
            });

            container.style.display = hasVisibleThemes || searchTerm === '' ? 'block' : 'none';
        });
    });
}

const exportHistory = document.getElementById('exportHistory');
exportHistory.addEventListener('click', () => {
    if (!profiles || profiles.length === 0) {
        alert('No profiles to export!');
        return;
    }

    let profilesToExport = [];
    if (profiles.length > 1) {
        const exportAll = confirm('Do you want to export all profiles? Click "OK" for all profiles, or "Cancel" for the current profile only.');
        if (exportAll) {
            profilesToExport = profiles;
        } else {
            const currentProfile = profiles.find(p => p.name === activeProfile);
            profilesToExport = currentProfile ? [currentProfile] : [];
        }
    } else {
        profilesToExport = profiles;
    }

    if (profilesToExport.length === 0) {
        alert('No profiles to export!');
        return;
    }

    let allExportData = [];
    let csvContent = "Profile,Transaction #,Last Balance,A:(Value),Fee,B:(Value),Date/Time,Notes\n";

    profilesToExport.forEach((profile) => {
        if (!profile.history || profile.history.length === 0) {
            return;
        }

        let exportData = [];
        let previousAmount = null;
        let transactionCount = 0;

        profile.history.forEach((entry) => {
            const div = document.createElement('div');
            div.innerHTML = entry;
            const text = div.textContent;
            const dateTimeElement = div.querySelector('.timestamp');
            const dateTime = dateTimeElement ? dateTimeElement.textContent : 'Unknown Date';
            const restoredElement = div.querySelector('.restored');
            const isRestored = restoredElement && restoredElement.textContent === 'true';

            let row = { dateTime, notes: isRestored ? '(Restore)' : '' };

            if (text.includes('A:')) {
                const match = text.match(/A:\s*([\d,]+)(?:\s*\|\s*F:\s*([\d,]+))?\s*(?:\||\s)\s*B:\s*([\d,]+)/);
                if (match) {
                    const amount = parseFloat(match[1].replace(/,/g, '')) || 0;
                    const fee = match[2] ? parseFloat(match[2].replace(/,/g, '')) : 0;
                    const balance = parseFloat(match[3].replace(/,/g, '')) || 0;
                    row.A = amount;
                    row.fee = fee;
                    row.B = balance;
                    row.transactionNumber = ++transactionCount;
                    row.highlight = previousAmount !== null && previousAmount === amount;
                    previousAmount = amount;
                    exportData.push(row);
                }
            } else if (text.includes('+B:')) {
                const match = text.match(/\+B:\s*([\d,]+)\s*(?:\||\s)\s*B:\s*([\d,]+)/);
                if (match) {
                    const bankBal = parseFloat(match[1].replace(/,/g, '')) || 0;
                    const balance = parseFloat(match[2].replace(/,/g, '')) || 0;
                    row.topUp = bankBal;
                    row.B = balance;
                    row.transactionNumber = ++transactionCount;
                    previousAmount = null;
                    exportData.push(row);
                }
            }
        });

        if (exportData.length > 0) {
            let firstBalance = 0;
            const firstTransaction = exportData[exportData.length - 1];
            if ('A' in firstTransaction) {
                firstBalance = firstTransaction.B + (firstTransaction.A || 0) + (firstTransaction.fee || 0);
            } else if ('topUp' in firstTransaction) {
                firstBalance = firstTransaction.B - (firstTransaction.topUp || 0);
            }
            allExportData.push({ profile: profile.name, data: exportData, firstBalance });
        }
    });

    if (allExportData.length === 0) {
        alert('No valid history entries to export for the selected profiles!');
        return;
    }

    csvContent = "Profile,Transaction #,Last Balance,A:(Value),Fee,B:(Value),Date/Time,Notes\n";
    allExportData.forEach(({ profile, data, firstBalance }) => {
        data.forEach((row, index) => {
            const isTopUp = 'topUp' in row;
            const aValue = isTopUp ? `+${row.topUp || 0}` : (row.A || '');
            const feeValue = isTopUp ? '' : (row.fee || '');
            const notes = row.notes || '';
            csvContent += `"${profile}","${row.transactionNumber}","${index === 0 ? firstBalance : ''}","${aValue}","${feeValue}","${row.B}","${row.dateTime}","${notes}"\n`;
        });
        const lastBalance = data[0].B;
        csvContent += `"${profile}",,"First Balance: ${lastBalance}",,,,,\n`;
        csvContent += "\n";
    });

    let htmlContent = `
        <html>
        <head>
            <title>Balance History Export</title>
            <style>
                body { font-family: monospace; padding: 20px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                th { background-color: #f2f2f2; }
                .download-btn { display: block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Balance History Export</h1>
            <a href="data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}" download="balance_history_export.csv" id="downloadCsv" class="download-btn">Download as CSV</a>
    `;

    allExportData.forEach(({ profile, data, firstBalance }) => {
        const lastBalance = data[0].B || 0;
        htmlContent += `
            <h2>Profile: ${profile}</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th colspan="7">Balance History (${profile})</th>
                    </tr>
                    <tr>
                        <th>Transaction #</th>
                        <th>First Balance</th>
                        <th>A:(Value)</th>
                        <th>Fee</th>
                        <th>last Balance:(Value)</th>
                        <th>Date/Time</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.forEach((row, index) => {
            const isTopUp = 'topUp' in row;
            const highlightClass = row.highlight ? 'style="background-color: rgba(255, 215, 0, 0.2);"' : '';
            htmlContent += `
                <tr ${highlightClass} contenteditable="true">
                    <td>${row.transactionNumber}</td>
                    <td>${index === 0 ? formatNumber(firstBalance) : ''}</td>
                    <td>${isTopUp ? `+${formatNumber(row.topUp || 0)}` : formatNumber(row.A || 0)}</td>
                    <td>${isTopUp ? '' : formatNumber(row.fee || 0)}</td>
                    <td>${formatNumber(row.B)}</td>
                    <td>${row.dateTime}</td>
                    <td>${row.notes}</td>
                </tr>
            `;
        });
        htmlContent += `
                <tr>
                    <td colspan="7">Last Balance: ${formatNumber(lastBalance)}</td>
                </tr>
            </tbody>
            </table>
        `;
    });

    htmlContent += `
        </body>
        </html>
    `;

    const newTab = window.open('', '_blank');
    if (!newTab) {
        alert('Please allow popups to export the history.');
        return;
    }
    newTab.document.write(htmlContent);
    newTab.document.close();
});
// Idle state functionality
let idleTimeout;
const idleTime = 900000; // 2 minutes in milliseconds

function setIdleState() {
    container.style.opacity = '0.2';
    container.style.transition = 'opacity 0.5s ease';
}

function resetIdleState() {
    container.style.opacity = '1';
    container.style.transition = 'opacity 0.5s ease';
    resetIdleTimer();
}

function resetIdleTimer() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(setIdleState, idleTime);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetIdleState);
});

resetIdleTimer();

container.style.opacity = '1';

// Function to check local storage usage
function checkLocalStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (localStorage[key].length + key.length) * 2; // Approximate size in bytes
        }
    }
    const usedKB = (total / 1024).toFixed(2); // Convert to KB
    const limitKB = 5120; // Approximate 5MB limit
    console.log(`Local Storage Usage: ${usedKB} KB / ${limitKB} KB`);
    return { usedKB, limitKB };
}

// Function to clear local storage
function clearLocalStorage() {
    if (confirm('Are you sure you want to clear all local storage data? This action cannot be undone.')) {
        localStorage.clear();
        alert('Local storage has been cleared.');
        location.reload(); // Reload the page to reflect changes
    }
}

// Periodically check local storage usage
function monitorLocalStorageUsage() {
    setInterval(() => {
        const { usedKB, limitKB } = checkLocalStorageUsage();
        if (usedKB >= limitKB * 0.9) { // Alert if usage exceeds 90% of the limit
            alert(`Warning: Local storage usage is nearing its limit (${usedKB} KB / ${limitKB} KB). Consider clearing unused data.`);
        }
    }, 60000); // Check every 60 seconds
}

// Start monitoring local storage usage
monitorLocalStorageUsage();
