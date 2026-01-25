import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import backIcon from "../images/back.svg";
import questionIcon from "../images/question.svg"; 
import trophyGif from "../images/trophy.gif";
import "./guesstheflag.css";

export default function GuessTheFlag() {
    const navigate = useNavigate();
    const { continent } = useParams();

    const [showExitModal, setShowExitModal] = React.useState(false);
    const [showScoreModal, setShowScoreModal] = React.useState(false);
    const [flagsList, setFlagsList] = React.useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [isCorrect, setIsCorrect] = React.useState(null);
    const [score, setScore] = React.useState(0);
    const [wrongCount, setWrongCount] = React.useState(0);

    // Create audio objects for correct and wrong sounds
    const correctSound = React.useRef(new Audio("/sound/correct.mp3"));
    const wrongSound = React.useRef(new Audio("/sound/wrong.mp3"));

    // Create audio object for background music
    const bgMusic = React.useRef(new Audio("/sound/bgmusic.mp3"));

    React.useEffect(() => {
        // Helper function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Fetch all flags and options for the continent from backend API
        fetch(`http://localhost:3002/api/flags/all/${continent}`)
            .then(res => res.json())
            .then(data => {
                const shuffledData = shuffleArray(data);
                setFlagsList(shuffledData);
                setCurrentQuestionIndex(0);
                if (shuffledData.length > 0) {
                    // Instead of using shuffledData[0].options (which are capitals), generate options as country names
                    const correctCountry = shuffledData[0].correctAnswer.country_name;
                    // Collect other country names excluding the correct one
                    const otherCountries = shuffledData
                        .map(item => item.correctAnswer.country_name)
                        .filter(name => name !== correctCountry);
                    // Shuffle otherCountries and pick 3
                    for (let i = otherCountries.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [otherCountries[i], otherCountries[j]] = [otherCountries[j], otherCountries[i]];
                    }
                    const generatedOptions = [correctCountry, ...otherCountries.slice(0, 3)];
                    // Shuffle generatedOptions
                    for (let i = generatedOptions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [generatedOptions[i], generatedOptions[j]] = [generatedOptions[j], generatedOptions[i]];
                    }
                    setOptions(generatedOptions);
                    setSelectedOption(null);
                    setIsCorrect(null);
                }
                setScore(0);
                setWrongCount(0);
            })
            .catch(err => {
                console.error("Error fetching flag data:", err);
            });

        // Play background music on component mount
        bgMusic.current.loop = true;
        bgMusic.current.volume = 0.5;
        bgMusic.current.play().catch(e => {
            // Handle play promise rejection silently
            console.log("bgmusic play prevented:", e);
        });

        // Cleanup on unmount
        return () => {
            bgMusic.current.pause();
            bgMusic.current.currentTime = 0;
        };
    }, [continent]);

    const handleBackClick = () => {
        setShowExitModal(true);
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        navigate(`/newpage/${continent}`);
    };

    const handleOptionClick = (option) => {
        if (selectedOption !== null) return; // Prevent multiple selections

        setSelectedOption(option);
        const correctAnswer = flagsList[currentQuestionIndex]?.correctAnswer.country_name;
        const correct = option === correctAnswer;
        setIsCorrect(correct);

        // Play sound based on correctness
        if (correct) {
            correctSound.current.play();
            setScore(prev => prev + 1);
        } else {
            wrongSound.current.play();
            setWrongCount(prev => prev + 1);
        }

        // Automatically move to next question after 1.5 seconds or show score modal if last question
        setTimeout(() => {
            if (currentQuestionIndex + 1 < flagsList.length) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                // Instead of using flagsList[nextIndex].options (which may contain capitals), generate options as country names
                const correctCountry = flagsList[nextIndex].correctAnswer.country_name;
                const otherCountries = flagsList
                    .map(item => item.correctAnswer.country_name)
                    .filter(name => name !== correctCountry);
                for (let i = otherCountries.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [otherCountries[i], otherCountries[j]] = [otherCountries[j], otherCountries[i]];
                }
                const generatedOptions = [correctCountry, ...otherCountries.slice(0, 3)];
                for (let i = generatedOptions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [generatedOptions[i], generatedOptions[j]] = [generatedOptions[j], generatedOptions[i]];
                }
                setOptions(generatedOptions);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                // Show final score modal
                setShowScoreModal(true);
            }
        }, 1500);
    };

    const handleCloseScoreModal = () => {
        setShowScoreModal(false);
        navigate(`/newpage/${continent}`);
    };

    return (
        <div className="guess-the-flag">
            <button className="back-button" onClick={handleBackClick}>
                <img src={backIcon} alt="Back" />
            </button>
            <h1>Guess the Flag</h1>
            <div className="subtitle">{continent}</div>

            {/* Flag container centered */}
            <div className="flag-box">
                {flagsList.length > 0 ? (
                    <img
                        src={`http://localhost:3002/${flagsList[currentQuestionIndex].correctAnswer.flag_image}`}
                        alt="Flag"
                        className="flag-image"
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {/* Options arranged 2 left and 2 right */}
            <div className="options">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${selectedOption === option ? (isCorrect ? "correct" : "wrong") : ""}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>

            {/* Exit Confirmation Modal */}
            <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Exit Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img src={questionIcon} alt="Question Icon" className="modal-question-icon" />
                    <p>Are you sure you want to exit the quiz?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExitModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmExit}>Yes, Exit</Button>
                </Modal.Footer>
            </Modal>

            {/* Final Score Modal */}
            <Modal show={showScoreModal} onHide={handleCloseScoreModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Quiz Completed</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h4>Your Score</h4>
                    <img src={trophyGif} alt="Trophy" className="trophy-gif" />
                    <p>Total Questions: {flagsList.length}</p>
                    <p className="correct-answer-text">Correct Answers: {score}</p>
                    <p className="wrong-answer-text">Wrong Answers: {wrongCount}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseScoreModal}>OK</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
