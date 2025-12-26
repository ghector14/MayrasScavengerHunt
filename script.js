// Game State
let currentStop = 0;
let currentStage = 'welcome'; // welcome, puzzle, hint, success, camera, final
let cameraStream = null;

// Scavenger Hunt Data
const stops = [
    {
        title: "Stop 1",
        puzzle: {
            content: "<strong>Solve this math problem:</strong><br><br>3² × (8 - 5) - 18 ÷ 2 = ?",
            answer: "18"
        },
        hint: "Seek the park that shares its name with the trees that shelter it.",
        location: {
            answer: "oak park",
            alternatives: ["oakpark", "oak park playground"] // Accept variations
        },
        verificationCode: "100"
    },
    {
        title: "Stop 2",
        puzzle: {
            content: "<strong>Solve this math problem:</strong><br><br>Energy cannot be created or destroyed, only transformed. What is this law called?",
            answer: "Conservation of energy",
            alternatives: ["conservation of energy", "first law of thermodynamics"]
        },
        hint: "This park shares its name with a middle school in Pasco.",
        location: {
            answer: "stevens park",
            alternatives: ["stevens", "stevenspark"]
        },
        verificationCode: "200"
    },
    {
        title: "Stop 3",
        puzzle: {
            content: "<strong>Physics Question:</strong><br><br>What element with atomic number 94 was produced at Hanford for the Manhattan Project?",
            answer: "plutonium",
            alternatives: ["pu"] // Accept element symbol
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
            content: "<strong>Fill in the blank:</strong><br><br>An ______ zone is any area of the body that becomes sexually aroused or sensitive when touched, leading to pleasure.",
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
            content: "<strong>Hunter x Hunter Question:</strong><br><br>What was Kurapika's badge number during the Hunter Exam?",
            answer: "404"
        },
        hint: "Cherchez le lieu où les lapins vont se cacher.",
        location: {
            answer: "adventures underground",
            alternatives: ["adventures", "underground"]
        },
        verificationCode: "500"
    },
    {
        title: "Stop 6",
        puzzle: {
            content: "<strong>Word Problem:</strong><br><br>Mayra works at the lab for 50 weeks a year, earning 10 samples per week. At year-end, she receives a bonus of 3² additional samples. What's her total sample count?",
            answer: "509"
        },
        hint: "Your answer unlocks more than this puzzle's gate - it names the vault where pocket monsters await.",
        location: {
            answer: "vault 509",
            alternatives: ["vault", "vault509"]
        },
        verificationCode: "600"
    }
];

const finalMessage = "Seek the creature who sleeps through each battle and blocks every path, whose soft belly rises and falls, avoiding all wrath. This lazy giant snores loud, shaking earth with its sound. When you find this sleeping monster among cards all around, a snapshot is required to complete what you've found.";

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
    
    // Check if this is the final stop
    if (currentStop === stops.length - 1) {
        // Customize message for final stop
        document.querySelector('#successScreen h2').textContent = 'Congratulations';
        document.querySelector('#successScreen p').textContent = 'But wait... there\'s one more thing.';
    } else {
        // Reset to default for other stops
        document.querySelector('#successScreen h2').textContent = 'Location Found';
        document.querySelector('#successScreen p').textContent = 'You found it! Now prove you\'re there with a photo.';
    }
    
    showScreen('successScreen');
}

// Show Camera
async function showCamera() {
    currentStage = 'camera';
    showScreen('cameraScreen');
    
    // Reset camera UI
    document.getElementById('cameraVideo').style.display = 'block';
    document.getElementById('capturedPhoto').style.display = 'none';
    document.getElementById('captureBtn').style.display = 'block';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('verificationSection').style.display = 'none';
    document.getElementById('verificationCode').value = '';
    document.getElementById('codeFeedback').className = 'feedback';
    document.getElementById('codeFeedback').textContent = '';
    
    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Use back camera on mobile
        });
        document.getElementById('cameraVideo').srcObject = cameraStream;
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please allow camera permissions and try again.');
    }
}

// Capture Photo
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const photo = document.getElementById('capturedPhoto');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image
    const imageDataUrl = canvas.toDataURL('image/png');
    photo.src = imageDataUrl;
    
    // Update UI
    video.style.display = 'none';
    photo.style.display = 'block';
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'block';
    document.getElementById('verificationSection').style.display = 'block';
    
    // Stop camera stream
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
}

// Retake Photo
async function retakePhoto() {
    document.getElementById('cameraVideo').style.display = 'block';
    document.getElementById('capturedPhoto').style.display = 'none';
    document.getElementById('captureBtn').style.display = 'block';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('verificationSection').style.display = 'none';
    document.getElementById('verificationCode').value = '';
    document.getElementById('codeFeedback').className = 'feedback';
    document.getElementById('codeFeedback').textContent = '';
    
    // Restart camera
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        document.getElementById('cameraVideo').srcObject = cameraStream;
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please allow camera permissions and try again.');
    }
}

// Verify Code
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

// Confirm Photo
function confirmPhoto() {
    // Stop camera stream if still active
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Move to next stop
    nextStop();
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
});

// Final Camera Functions
async function showFinalCamera() {
    showScreen('finalCameraScreen');
    
    // Reset camera UI
    document.getElementById('finalCameraVideo').style.display = 'block';
    document.getElementById('finalCapturedPhoto').style.display = 'none';
    document.getElementById('finalCaptureBtn').style.display = 'block';
    document.getElementById('finalRetakeBtn').style.display = 'none';
    document.getElementById('finalConfirmBtn').style.display = 'none';
    
    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        document.getElementById('finalCameraVideo').srcObject = cameraStream;
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please allow camera permissions and try again.');
    }
}

function captureFinalPhoto() {
    const video = document.getElementById('finalCameraVideo');
    const canvas = document.getElementById('finalCameraCanvas');
    const photo = document.getElementById('finalCapturedPhoto');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image
    const imageDataUrl = canvas.toDataURL('image/png');
    photo.src = imageDataUrl;
    
    // Update UI
    video.style.display = 'none';
    photo.style.display = 'block';
    document.getElementById('finalCaptureBtn').style.display = 'none';
    document.getElementById('finalRetakeBtn').style.display = 'block';
    document.getElementById('finalConfirmBtn').style.display = 'block';
    
    // Stop camera stream
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
}

async function retakeFinalPhoto() {
    document.getElementById('finalCameraVideo').style.display = 'block';
    document.getElementById('finalCapturedPhoto').style.display = 'none';
    document.getElementById('finalCaptureBtn').style.display = 'block';
    document.getElementById('finalRetakeBtn').style.display = 'none';
    document.getElementById('finalConfirmBtn').style.display = 'none';
    
    // Restart camera
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        document.getElementById('finalCameraVideo').srcObject = cameraStream;
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please allow camera permissions and try again.');
    }
}

function confirmFinalPhoto() {
    // Stop camera stream if still active
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Show completion screen
    showScreen('completionScreen');
    
    // Update progress to 100%
    document.getElementById('progressBar').style.width = '100%';
}