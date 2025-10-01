const quizQuestions = [
            {
                question: "Which programming language is known as the 'language of the web'?",
                options: ["Python", "JavaScript", "Java", "C++"],
                correctAnswer: 1,
                explanation: "JavaScript is the primary language for web development, running in browsers to create interactive experiences."
            },
            {
                question: "What does CSS stand for?",
                options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Syntax"],
                correctAnswer: 2,
                explanation: "CSS stands for Cascading Style Sheets, used to style and layout web pages."
            },
            {
                question: "Which HTML tag is used for creating a hyperlink?",
                options: ["<link>", "<a>", "<href>", "<hyperlink>"],
                correctAnswer: 1,
                explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML."
            },
            {
                question: "Which property is used to change the background color in CSS?",
                options: ["color", "bgcolor", "background-color", "background"],
                correctAnswer: 2,
                explanation: "The 'background-color' property is used to set the background color of an element."
            },
            {
                question: "Which symbol is used for single-line comments in JavaScript?",
                options: ["//", "<!-- -->", "/* */", "#"],
                correctAnswer: 0,
                explanation: "Double slashes (//) are used for single-line comments in JavaScript."
            }
        ];

        
        let currentQuestion = 0;
        let score = 0;
        let timeLeft = 30;
        let timerInterval;
        let userAnswers = [];

        
        const startScreen = document.getElementById('start-screen');
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        const startBtn = document.getElementById('start-btn');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const feedback = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const timer = document.getElementById('time');
        const timerContainer = document.getElementById('timer');
        const progressBar = document.getElementById('progress-bar');
        const currentEl = document.getElementById('current');
        const totalEl = document.getElementById('total');
        const scoreDisplay = document.getElementById('score-display');
        const scoreMessage = document.getElementById('score-message');
        const restartBtn = document.getElementById('restart-btn');

        
        function initQuiz() {
            totalEl.textContent = quizQuestions.length;
            progressBar.style.width = '0%';
        }

        
        function startQuiz() {
            startScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            loadQuestion();
            startTimer();
        }

        
        function loadQuestion() {
            clearOptions();
            resetOptionStyles();
            
            const question = quizQuestions[currentQuestion];
            currentEl.textContent = currentQuestion + 1;
            questionText.textContent = question.question;
            
            
            progressBar.style.width = `${((currentQuestion) / quizQuestions.length) * 100}%`;
            
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                
                const optionLabel = document.createElement('div');
                optionLabel.classList.add('option-label');
                optionLabel.textContent = String.fromCharCode(65 + index); // A, B, C, D
                
                const optionText = document.createElement('div');
                optionText.textContent = option;
                
                optionElement.appendChild(optionLabel);
                optionElement.appendChild(optionText);
                
                
                if (userAnswers[currentQuestion] !== undefined) {
                    if (userAnswers[currentQuestion] === index) {
                        optionElement.classList.add('selected');
                        if (index === question.correctAnswer) {
                            optionElement.classList.add('correct');
                        } else {
                            optionElement.classList.add('incorrect');
                        }
                    } else if (index === question.correctAnswer) {
                        optionElement.classList.add('correct');
                    }
                }
                
                optionElement.addEventListener('click', () => selectOption(index));
                optionsContainer.appendChild(optionElement);
            });
            
            
            prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
            
           
            nextBtn.innerHTML = currentQuestion === quizQuestions.length - 1 ? 
                'Finish <i class="fas fa-check"></i>' : 
                'Next <i class="fas fa-arrow-right"></i>';
            
            
            if (userAnswers[currentQuestion] !== undefined) {
                showFeedback(userAnswers[currentQuestion]);
            } else {
                feedback.style.display = 'none';
            }
        }

        
        function clearOptions() {
            while (optionsContainer.firstChild) {
                optionsContainer.removeChild(optionsContainer.firstChild);
            }
        }

       
        function resetOptionStyles() {
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
        }

       
        function selectOption(optionIndex) {
           
            if (userAnswers[currentQuestion] !== undefined) return;
            
            const options = document.querySelectorAll('.option');
            options.forEach(option => option.classList.remove('selected'));
            options[optionIndex].classList.add('selected');
            
            userAnswers[currentQuestion] = optionIndex;
            showFeedback(optionIndex);
            
            
            clearInterval(timerInterval);
        }

        function showFeedback(selectedOption) {
            const question = quizQuestions[currentQuestion];
            const isCorrect = selectedOption === question.correctAnswer;
            
            feedback.textContent = isCorrect 
                ? "✓ Correct! " + question.explanation 
                : "✗ Incorrect. " + question.explanation;
                
            feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
            feedback.style.display = 'block';
            
            if (isCorrect) {
                score++;
            }
        }

       
        function startTimer() {
            clearInterval(timerInterval);
            timeLeft = 30;
            timer.textContent = timeLeft;
            timerContainer.classList.remove('timer-warning');
            
            timerInterval = setInterval(() => {
                timeLeft--;
                timer.textContent = timeLeft;
                
               
                if (timeLeft <= 10) {
                    timerContainer.classList.add('timer-warning');
                }
                
               
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    if (userAnswers[currentQuestion] === undefined) {
                        userAnswers[currentQuestion] = -1; // Mark as unanswered
                        showFeedback(-1);
                    }
                }
            }, 1000);
        }

       
        function nextQuestion() {
            
            if (userAnswers[currentQuestion] === undefined) {
                feedback.textContent = "Please select an answer to continue";
                feedback.className = 'feedback incorrect';
                feedback.style.display = 'block';
                return;
            }
            
            // Move to next question or finish quiz
            if (currentQuestion < quizQuestions.length - 1) {
                currentQuestion++;
                loadQuestion();
                startTimer();
            } else {
                finishQuiz();
            }
        }

     
        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
                
            }
        }

        
        function finishQuiz() {
            clearInterval(timerInterval);
            quizScreen.style.display = 'none';
            resultsScreen.style.display = 'block';
            
            
            scoreDisplay.textContent = `${score}/${quizQuestions.length}`;
            
            
            const percentage = (score / quizQuestions.length) * 100;
            if (percentage >= 80) {
                scoreMessage.textContent = "Outstanding! You're a tech genius!";
            } else if (percentage >= 60) {
                scoreMessage.textContent = "Well done! You have solid tech knowledge!";
            } else if (percentage >= 40) {
                scoreMessage.textContent = "Good effort! Keep learning and try again!";
            } else {
                scoreMessage.textContent = "Keep studying tech concepts! You'll do better next time!";
            }
        }

        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            userAnswers = [];
            resultsScreen.style.display = 'none';
            startScreen.style.display = 'block';
        }

        
        startBtn.addEventListener('click', startQuiz);
        nextBtn.addEventListener('click', nextQuestion);
        prevBtn.addEventListener('click', previousQuestion);
        restartBtn.addEventListener('click', restartQuiz);

        
        initQuiz();

