// Game State
let currentStop = 0;
let currentStage = 'welcome'; // welcome, puzzle, hint, success, final

// Scavenger Hunt Data
const stops = [
    {
        title: "Stop 1",
        puzzle: {
            content: "Your first puzzle goes here. This could be a riddle, a question, or any challenge you want!",
            answer: "answer1" // Change this to your actual answer
        },
        hint: "This is where you'll put your hint for the first location.",
        location: {
            answer: "location1", // Change this to the actual location name
            alternatives: [] // Add alternative accepted answers if needed
        }
    },
    {
        title: "Stop 2",
        puzzle: {
            content: "Second puzzle content goes here.",
            answer: "answer2"
        },
        hint: "Hint for the second location.",
        location: {
            answer: "location2",
            alternatives: []
        }
    },
    {
        title: "Stop 3",
        puzzle: {
            content: "Third puzzle content goes here.",
            answer: "answer3"
        },
        hint: "Hint for the third location.",
        location: {
            answer: "location3",
            alternatives: []
        }
    },
    {
        title: "Stop 4",
        puzzle: {
            content: "Fourth puzzle content goes here.",
            answer: "answer4"
        },
        hint: "Hint for the fourth location.",
        location: {
            answer: "location4",
            alternatives: []
        }
    },
    {
        title: "Stop 5",
        puzzle: {
            content: "Fifth puzzle content goes here.",
            answer: "answer5"
        },
        hint: "Hint for the fifth location.",
        location: {
            answer: "location5",
            alternatives: []
        }
    },
    {
        title: "Stop 6",
        puzzle: {
            content: "Final puzzle content goes here.",
            answer: "answer6"
        },
        hint: "Hint for the final location.",
        location: {
            answer: "location6",
            alternatives: []
        }
    }
];

const finalMessage = "Add your special final message here for when Mayra completes all 6 stops! 💕";

// Initialize
function init() {
    updateProgress();
}

// Start Hunt
function startHunt() {
    currentStop = 0;
    currentStage = 'puzzle';
    showScreen('puzzleScreen');
    loadPuzzle();
    updateProgress();
}

// Show Screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Clear inputs and feedback
    clearInputs();
}

// Clear Inputs
function clearInputs() {
    const puzzleAnswer = document.getElementById('puzzleAnswer');
    const locationGuess = document.getElementById('locationGuess');
    const puzzleFeedback = document.getElementById('puzzleFeedback');
    const locationFeedback = document.getElementById('locationFeedback');
    
    if (puzzleAnswer) puzzleAnswer.value = '';
    if (locationGuess) locationGuess.value = '';
    if (puzzleFeedback) puzzleFeedback.className = 'feedback';
    if (puzzleFeedback) puzzleFeedback.textContent = '';
    if (locationFeedback) locationFeedback.className = 'feedback';
    if (locationFeedback) locationFeedback.textContent = '';
}

// Update Progress
function updateProgress() {
    const progress = ((currentStop) / stops.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Stop ${currentStop + 1} of ${stops.length}`;
}

// Load Puzzle
function loadPuzzle() {
    const stop = stops[currentStop];
    document.getElementById('stopTitle').textContent = stop.title;
    document.getElementById('puzzleContent').innerHTML = stop.puzzle.content;
}

// Check Puzzle Answer
function checkPuzzleAnswer() {
    const answer = document.getElementById('puzzleAnswer').value.trim().toLowerCase();
    const correctAnswer = stops[currentStop].puzzle.answer.toLowerCase();
    const feedback = document.getElementById('puzzleFeedback');
    
    if (!answer) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter an answer!';
        return;
    }
    
    if (answer === correctAnswer) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct! Loading hint...';
        
        setTimeout(() => {
            showHint();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Not quite. Try again!';
    }
}

// Show Hint
function showHint() {
    currentStage = 'hint';
    document.getElementById('hintText').textContent = stops[currentStop].hint;
    showScreen('hintScreen');
}

// Check Location
function checkLocation() {
    const guess = document.getElementById('locationGuess').value.trim().toLowerCase();
    const stop = stops[currentStop];
    const correctAnswer = stop.location.answer.toLowerCase();
    const alternatives = stop.location.alternatives.map(alt => alt.toLowerCase());
    const feedback = document.getElementById('locationFeedback');
    
    if (!guess) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter your guess!';
        return;
    }
    
    // Check if answer matches correct answer or any alternatives
    if (guess === correctAnswer || alternatives.includes(guess)) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ You found it!';
        
        setTimeout(() => {
            showSuccess();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Not the right place. Keep guessing!';
    }
}

// Show Success
function showSuccess() {
    currentStage = 'success';
    showScreen('successScreen');
}

// Next Stop
function nextStop() {
    currentStop++;
    
    if (currentStop >= stops.length) {
        showFinal();
    } else {
        currentStage = 'puzzle';
        showScreen('puzzleScreen');
        loadPuzzle();
        updateProgress();
    }
}

// Show Final
function showFinal() {
    currentStage = 'final';
    document.getElementById('finalMessage').textContent = finalMessage;
    showScreen('finalScreen');
    
    // Update progress to 100%
    document.getElementById('progressBar').style.width = '100%';
}

// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    document.getElementById('puzzleAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPuzzleAnswer();
        }
    });
    
    document.getElementById('locationGuess').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkLocation();
        }
    });
});