const fs = require("fs");
const path = require("path");

// List to hold spell objects
const spellList = [];
// List to hold spell slot objects
const spellSlots = [];

// When the software is started this function runs
window.onload = function () {
    // Button event listener to create spell slots
    document.getElementById('createSlot').addEventListener('click', newSpellSlot)
    // Button event listener to clear spell slots
    document.getElementById('clearSlots').addEventListener('click', clearSpellSlots)

    // Element to append spell slots to
    var spellSlotContainer = document.createElement('div');
    spellSlotContainer.id = 'spellSlotContainer';
    document.body.appendChild(spellSlotContainer);

    // Create spells and add them to spellList[] for future refrence
    fetch('spell_list.json').then(response => response.json()).then(data => {
        var count = data.length;
        for (let i = 0; i < count; i++) {
            var spellName = data[i].name; //get name
            var spellLevel = data[i].level; //get level
            var spellDesc = data[i].desc; //get description

            var spell = new Spell(spellName, spellLevel, spellDesc); // Create spell object
            spellList.push(spell); // Add object to spellList[]
        }
    })
};

// Function to create new spell slot objects when event listener triggers
function newSpellSlot() {
    var spellSlot = new SpellSlot();
    spellSlots.push(spellSlot);
}

// Function to clear spell slots from screen and objects from spellSlots[] list
function clearSpellSlots() {
    // Remove spell slot container div
    document.getElementById('spellSlotContainer').remove();
    // Recreate the spell slot container div
    var spellSlotContainer = document.createElement('div');
    spellSlotContainer.id = "spellSlotContainer";
    document.body.appendChild(spellSlotContainer);

    var count = spellSlots.length;
    for (let i = 0; i < count; i++) {
        // Delete the spell slot objects
        delete spellSlots[i];
    }
}

// Class to create spells that have names, levels, and descriptions
class Spell {
    constructor(name, level, desc) {
        this._name = name;
        this._level = level;
        this._desc = desc;
    }
    get name() {
        return this._name;
    }
    get level() {
        return this._level;
    }
    get desc() {
        return this._desc;
    }
    set name(name) {
        this._name = name;
    }
    set level(level) {
        this._level = level;
    }
    set desc(desc) {
        this._desc = desc;
    }

}

// Class to create spell slots that hold informatoin from spell objects
class SpellSlot {
    constructor() {
        this.selectedLevel = null; // Level dropdown value
        this.activeBoolean = true; // Spell slot state
        this.spellsMatchingLevelList = []; // List for spell objects matching the slected value in name dropdown
        this.createHTML(); // Initial HTML creation
    }

    // Function used to expand on the constructor() for all HTML element creation
    createHTML() {
        // Creation of the Element to house spell slot information, dropdowns, and buttons
        this.newSpellSlot = document.createElement('div');
        // Add CSS class for formatting
        this.newSpellSlot.classList.add('spell-slot', 'active');
        // Dropdown to select spell level
        this.levelDropdown = document.createElement('select');
        var blank = document.createElement('option'); // Blank initial dropdown option
        blank.value = '';
        this.levelDropdown.appendChild(blank);
        // Create options 0-100 add to the level dropdown
        for (let i = 0; i <= 100; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = 'Level ' + i;
            this.levelDropdown.appendChild(option);
        }
        // Event listener to trigger a function to sort spells by level
        this.levelDropdown.addEventListener('change', () => this.getSpellListByLevel());
        // Dropdown to select spell object name from the sorted list
        this.spellDropdown = document.createElement('select');
        // Event listner that triggers when an option is selected in the spell object name dropdown 
        // that will populate the spell slot with info
        this.spellDropdown.addEventListener('change', () => this.displaySpellToSpellSlot());

        // Element for space to add spell objects name, level, and description
        this.spellInfo = document.createElement('div');
        this.spellInfo.textContent = 'Select a spell';

        // Button to allow the user to toggle the state of the spell slot
        this.toggleButton = document.createElement('button');
        this.toggleButton.textContent = "Spend Slot";
        // Event listner that is triggered when the button is clicked and will call a function to change the color of the background of the spell slot
        this.toggleButton.addEventListener('click', () => this.setSpellSlotState());

        // Add the dropdowns, name, level, description, and button to the spell slot
        this.newSpellSlot.append(this.levelDropdown, this.spellDropdown, this.spellInfo, this.toggleButton);
        // Add this new spell slot to screen
        document.getElementById('spellSlotContainer').appendChild(this.newSpellSlot);
    }

    // Function that will filter the spells in the spellList[] by the selected level from the level dropdown.
    getSpellListByLevel() {
        // Get value of the level dropdown
        var selectedLevel = parseInt(this.levelDropdown.value);
        // Set spellsMatchingLevelList to equal all spell objects matching the selected value
        this.spellsMatchingLevelList = spellList.filter(spell => spell.level == selectedLevel);
        // Function to display those filtered spells to the spell name dropdown
        this.displayFilteredSpellList();

    }

    // Function that populates the spell name dropdown with spell names matching spellsMatchingLevelList[]
    displayFilteredSpellList() {
        // Populate the spell name dropdown with spellsMatchingLevelList[] spell.names
        // Clear the dropdown's current options
        this.spellDropdown.innerHTML = '';
        var blank = document.createElement('option'); // Blank initial dropdown option
        blank.value = '';
        this.spellDropdown.appendChild(blank);

        // Create options for each spell object in the spellsMatchingLevelList[]
        this.spellsMatchingLevelList.forEach(i => { 
            var option = document.createElement('option');
            option.value = i.name;
            option.textContent = i.name;
            this.spellDropdown.appendChild(option);
         });
    }

    // Function to display spell information inside the spell slot
    displaySpellToSpellSlot() {
        var selectedSpellName = this.spellDropdown.value;
        var selectedSpell = this.spellsMatchingLevelList.find(spell => spell.name === selectedSpellName);
        if (selectedSpell) {
            this.spellInfo.innerText = 'Name: ' + selectedSpell.name + '\nLevel: ' + selectedSpell.level + '\nDescription: ' + selectedSpell.desc;
        }
    }

    // Function that toggles the activeBoolean and changes the class of the spell slot on screen so its color can change
    setSpellSlotState() {
        this.activeBoolean = !this.activeBoolean;
        this.newSpellSlot.className = this.activeBoolean ? 'spell-slot active' : 'spell-slot inactive';
    }
}