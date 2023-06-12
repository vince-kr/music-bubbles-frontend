// Canvas contents
const bubblesCanvas = document.getElementById("bubbles");
// Set canvas size (can be got from API at a later stage)
bubblesCanvas.width = 1782
bubblesCanvas.height = 1260

// Get input elements and register listeners
const title_input = document.getElementById("title");
title_input.addEventListener("input", proctor);

const tune_lines = document.getElementsByClassName("tune-line");
for (line of tune_lines) {
    line.addEventListener("input", proctor);
}

function proctor() {
    console.log('here')
    title = title_input.value
    tune_one = tune_lines[0].value
    tune_two = tune_lines[1].value

    // If title is invalid, return null
    if (!validateTitle(title)) {
        return null;
    }
    // If any notes line is invalid, return null
    for (line of tune_lines) {
        if (!validateTune(line)) {
            console.log('Validation failed');
            return null;
        };
    };

    for (line of tune_lines) {
        line = line.trim().replace(/ /g, "-");
    }

    // Get array of notes from API and use it to draw bubbles
    getNotesArray(tune_lines)
        .then(notesArray => {
            drawBubbles(notesArray);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

function validateTitle(title) {
    // Make sure the title only contains alphanumeric characters or whitespace
    // This should also be safely checked in the backend
    const lettersNumbersSpacesRegex = /^[0-9a-zA-Z\s]*$/;
    return lettersNumbersSpacesRegex.test(title);
}

function validateTune(tune) {
    // Make sure tune only contains valid note names (a - g) or whitespace
    // This should also be safely checked in the backend
    const noteNamesRegex = /^[abcdefgr\s]*$/;
    return noteNamesRegex.test(tune);
};

function getNotesArray(tune) {
    // If tune is null, return an empty array
    if (!tune) {
        return [];
    }
    // Call the API and return the resulting JSON
    var address = 'http://127.0.0.1:50505/canvas_coordinates?notes=' + tune;
    return fetch(address, {
        method: "GET",
        headers: {
            "Origin": "http://127.0.0.1"
        }
    })
        .then(response => response.json())
        .then(notesArray => {
            return notesArray;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function drawBubbles(notesArray) {
    // Access the canvas and draw circles according to coordinates
    bubblesContext = bubblesCanvas.getContext("2d");
    bubblesContext.clearRect(0, 0, 1782, 1260)

    for (note of notesArray) {
        bubblesContext.fillStyle = note.color;
        bubblesContext.beginPath();
        bubblesContext.arc(note.x, note.y, note.radius, 0, 2 * Math.PI);
        bubblesContext.fill();
    }
};