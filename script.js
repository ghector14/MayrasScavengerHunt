// Game State
let currentStop = 0;
let currentStage = 'welcome'; // welcome, puzzle, hint, success, book, final

// Scavenger Hunt Data
const stops = [
    {
        title: "Stop 1",
        puzzle: {
            content: "<strong>Solve this math problem for clue:</strong><br><br>3² × (8 - 5) - 18 ÷ 2 = ?",
            answer: "18" 
        },
        hint: "Seek the park that shares its name with the trees that shelter it.",
        location: {
            answer: "oak park",
            alternatives: ["oakpark", "oak park playground"]
        },
        verificationCode: "100"
    },
    {
        title: "Stop 2",
        puzzle: {
            content: "<strong>For the clue, what is this called?:</strong><br><br>Energy cannot be created or destroyed, only transformed. What is this law called?",
            answer: "conservation of energy",
            alternatives: ["first law of thermodynamics"]
        },
        hint: "Stripes of orange in Pasco's pride, the park that bears its name resides.",
        location: {
            answer: "stevens park",
            alternatives: ["stevens", "stevenspark"]
        },
        verificationCode: "200"
    },
    {
        title: "Stop 3",
        puzzle: {
            content: "<strong>Physics Question for clue:</strong><br><br>What element with atomic number 94 was produced at Hanford for the Manhattan Project?",
            answer: "plutonium",
            alternatives: ["pu"]
        },
        hint: "Columbia was its name, planes are its game, for Mayra to win, for this stop she must aim.",
        location: {
            answer: "richland high school",
            alternatives: ["richland high", "rhs", "richland"]
        },
        verificationCode: "300"
    },
    {
        title: "Stop 4",
        puzzle: {
            content: "<strong>Fill in the blank for the clue:</strong><br><br>An ______ zone is any area of the body that becomes sexually aroused or sensitive when touched, leading to pleasure.",
            answer: "erogenous"
        },
        hint: "The inside is a maze for your eyes, though the taste is savory fried rice.",
        location: {
            answer: "soi 705",
            alternatives: ["soi705", "soi", "soi 705 thai"]
        },
        verificationCode: "400"
    },
    {
        title: "Stop 5",
        puzzle: {
            content: "<strong>Hunter x Hunter Question for clue:</strong><br><br>What was Kurapika's badge number during the Hunter Exam?",
            answer: "404"
        },
        hint: "Down the rabbit hole you go, where wonders hide and secrets flow.",
        location: {
            answer: "adventures underground",
            alternatives: ["adventures", "underground"]
        },
        verificationCode: "500",
        requiresBook: true // Special flag for book requirement
    },
    {
        title: "Stop 6",
        puzzle: {
            content: "<strong>Solve this word Problem for the clue:</strong><br><br>Mayra works at the lab for 50 weeks a year, earning 10 samples per week. At year-end, she receives a bonus of 3² additional samples. What's her total sample count?",
            answer: "509"
        },
        hint: "Your answer unlocks more than this puzzle's gate, it names the vault where pocket monsters await.",
        location: {
            answer: "vault 509",
            alternatives: ["vault", "vault509"]
        },
        verificationCode: "600"
    }
];

const finalMessage = "This lazy giant snores loud, shaking earth with its sound. When you find this sleeping monster among cards all around, show it to Hector to complete what you've found.";
const finalVerificationCode = "999"; // Code for finding Snorlax

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
    const stop = stops[currentStop];
    const correctAnswer = stop.puzzle.answer.toLowerCase();
    const puzzleAlternatives = stop.puzzle.alternatives ? stop.puzzle.alternatives.map(alt => alt.toLowerCase()) : [];
    const feedback = document.getElementById('puzzleFeedback');
    
    if (!answer) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter an answer!';
        return;
    }
    
    // Check if answer matches correct answer or any alternatives
    if (answer === correctAnswer || puzzleAlternatives.includes(answer)) {
        feedback.className = 'feedback correct';
        feedback.textContent = 'Correct! Loading clue...';
        
        setTimeout(() => {
            showHint();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Not quite. Try again';
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
        feedback.textContent = 'You found it';
        
        setTimeout(() => {
            showSuccess();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Not the right place. Keep guessing';
    }
}

// Show Success
function showSuccess() {
    currentStage = 'success';
    
    // Check if this is Stop 5 (requires book finding)
    if (stops[currentStop].requiresBook) {
        // Go to book finding screen instead
        showBookScreen();
        return;
    }
    
    // Clear verification inputs
    document.getElementById('verificationCode').value = '';
    document.getElementById('codeFeedback').className = 'feedback';
    document.getElementById('codeFeedback').textContent = '';
    
    showScreen('successScreen');
}

// Show Book Screen (Stop 5 only)
function showBookScreen() {
    currentStage = 'book';
    document.getElementById('bookVerificationCode').value = '';
    document.getElementById('bookCodeFeedback').className = 'feedback';
    document.getElementById('bookCodeFeedback').textContent = '';
    showScreen('bookScreen');
}

// Verify Code (regular stops)
function verifyCode() {
    const enteredCode = document.getElementById('verificationCode').value.trim();
    const correctCode = stops[currentStop].verificationCode;
    const feedback = document.getElementById('codeFeedback');
    
    if (!enteredCode) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter the code from Hector!';
        return;
    }
    
    if (enteredCode === correctCode) {
        feedback.className = 'feedback correct';
        feedback.textContent = 'Code verified! Moving to next puzzle...';
        
        setTimeout(() => {
            nextStop();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect code. Ask Hector for the right code';
    }
}

// Verify Book Code (Stop 5)
function verifyBookCode() {
    const enteredCode = document.getElementById('bookVerificationCode').value.trim();
    const correctCode = stops[currentStop].verificationCode;
    const feedback = document.getElementById('bookCodeFeedback');
    
    if (!enteredCode) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter the code from Hector!';
        return;
    }
    
    if (enteredCode === correctCode) {
        feedback.className = 'feedback correct';
        feedback.textContent = 'Book found! Moving to next puzzle...';
        
        setTimeout(() => {
            nextStop();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect code. Show Hector the purple book';
    }
}

// Verify Final Code (Snorlax)
function verifyFinalCode() {
    const enteredCode = document.getElementById('finalVerificationCode').value.trim();
    const feedback = document.getElementById('finalCodeFeedback');
    
    if (!enteredCode) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please enter the code from Hector!';
        return;
    }
    
    if (enteredCode === finalVerificationCode) {
        feedback.className = 'feedback correct';
        feedback.textContent = 'Sleeping monster found! Quest complete!';
        
        setTimeout(() => {
            showCompletion();
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect code. Show Hector the Snorlax card';
    }
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
    document.getElementById('finalVerificationCode').value = '';
    document.getElementById('finalCodeFeedback').className = 'feedback';
    document.getElementById('finalCodeFeedback').textContent = '';
    showScreen('finalScreen');
}

// Show Completion
function showCompletion() {
    showScreen('completionScreen');
    
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
    
    document.getElementById('verificationCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyCode();
        }
    });
    
    document.getElementById('bookVerificationCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyBookCode();
        }
    });
    
    document.getElementById('finalVerificationCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyFinalCode();
        }
    });
});