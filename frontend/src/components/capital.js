import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import backIcon from "../images/back.svg";
import questionIcon from "../images/question.svg";
import cupGif from "../images/cup.gif";
import "./guesstheflag.css";

export default function Capitals() {
    const navigate = useNavigate();
    const { continent } = useParams();

    const [showExitModal, setShowExitModal] = React.useState(false);
    const [showScoreModal, setShowScoreModal] = React.useState(false);
    const [quizList, setQuizList] = React.useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [isCorrect, setIsCorrect] = React.useState(null);
    const [score, setScore] = React.useState(0);
    const [wrongCount, setWrongCount] = React.useState(0);

    // Audio refs
    const correctSound = React.useRef(new Audio("/sound/correct.mp3"));
    const wrongSound = React.useRef(new Audio("/sound/wrong.mp3"));
    const bgMusic = React.useRef(new Audio("/sound/bgmusic.mp3"));

    React.useEffect(() => {
        // Helper to shuffle array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Fetch all capitals quiz data for the continent
        fetch(`https://geosensei.onrender.com/api/flags/all/${continent}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched capital quiz data:", data);
                const shuffled = shuffleArray(data);
                setQuizList(shuffled);
                setCurrentQuestionIndex(0);
                if (shuffled.length > 0) {
                    // Defensive: check if options exist and are array
                    if (Array.isArray(shuffled[0].options) && shuffled[0].options.length > 0) {
                        setOptions(shuffled[0].options);
                    } else {
                        // Generate options: include correct answer and 3 random capitals from data
                    const correctCapital = shuffled[0].correctAnswer.capital;
                    const otherCapitals = shuffled
                        .map(item => item.correctAnswer.capital)
                        .filter(cap => cap !== correctCapital);
                        // Shuffle otherCapitals and pick 3
                        for (let i = otherCapitals.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [otherCapitals[i], otherCapitals[j]] = [otherCapitals[j], otherCapitals[i]];
                        }
                        const generatedOptions = [correctCapital, ...otherCapitals.slice(0, 3)];
                        // Shuffle generatedOptions
                        for (let i = generatedOptions.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [generatedOptions[i], generatedOptions[j]] = [generatedOptions[j], generatedOptions[i]];
                        }
                        setOptions(generatedOptions);
                    }
                    setSelectedOption(null);
                    setIsCorrect(null);
                }
                setScore(0);
                setWrongCount(0);
            })
            .catch(err => {
                console.error("Error fetching capital quiz data:", err);
            });

        // Play background music
        bgMusic.current.loop = true;
        bgMusic.current.volume = 0.5;
        bgMusic.current.play().catch(() => {});

        return () => {
            bgMusic.current.pause();
            bgMusic.current.currentTime = 0;
        };
    }, [continent]);

    const handleBackClick = () => setShowExitModal(true);

    const handleConfirmExit = () => {
        setShowExitModal(false);
        navigate(`/newpage/${continent}`);
    };

    const handleOptionClick = (option) => {
        if (selectedOption !== null) return;
        setSelectedOption(option);

        const correctAnswer = quizList[currentQuestionIndex]?.correctAnswer.capital;
        const correct = option === correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            correctSound.current.play();
            setScore(prev => prev + 1);
        } else {
            wrongSound.current.play();
            setWrongCount(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < quizList.length) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setOptions(quizList[nextIndex].options);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
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
            <h1>Guess the Capital</h1>
            <div className="subtitle">{continent}</div>

            {/* Flag container */}
            <div className="flag-box">
                {quizList.length > 0 ? (
                    <img
                        src={`https://geosensei.onrender.com/${quizList[currentQuestionIndex].correctAnswer.flag_image}`}
                        alt="Flag"
                        className="flag-image"
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {/* Capital options */}
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
                    <img src={cupGif} alt="Trophy" className="trophy-gif" />
                    <p>Total Questions: {quizList.length}</p>
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