import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizFlow = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quizContent, setQuizContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const generateQuizWithGemini = async () => {
      try {
        if (!state?.interests || !state?.topic || !state?.subtopic) {
          throw new Error('Missing required quiz parameters');
        }

        const prompt = `You are an educational game designer building fun, personalized quizzes for a gamified finance app called Smart Cents. The user has shown interest in: ${state.interests.join(', ')}.

Your task is to:

1. Create a big story of about 500 words on the parameters - ${state.interests.join(' and ')}, which are basically interests of a young student of age 10-12 who is learning about personal finance through an event related to that interest.

2. Based on the chosen topic "${state.topic}" and subtopic "${state.subtopic}", generate 5 unique quiz questions with 4 options (A, B, C, D), the correct answer, and a brief 1-2 line explanation for each.

⚠️ Important Guidelines:
- Questions must be based on the story context and the subtopic
- Use casual, student-friendly language (make it fun! and easy for the student as per his age)
- Don't repeat questions or answers
- Be creative and engaging!
- Format options clearly with A) B) C) D) prefixes
- Ensure explanations are clear and educational

👉 Required Output Format:
Story:
<your story here>

Questions:
1. <question text>
   A) Option A  
   B) Option B  
   C) Option C  
   D) Option D  
   Correct Answer: <A/B/C/D>  
   Explanation: <1-2 lines why it's correct>

2. <question text>
   A) Option A  
   B) Option B  
   C) Option C  
   D) Option D  
   Correct Answer: <A/B/C/D>  
   Explanation: <1-2 lines why it's correct>

...continue for all 5 questions`;

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCT8GbNfxmVrMmEAQ5FXzanPDJ0Tvo1xiM',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }]
            })
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        const parsedContent = parseGeminiResponse(generatedText);
        
        if (!parsedContent.story || parsedContent.questions.length === 0) {
          throw new Error('Invalid quiz content generated');
        }

        setQuizContent(parsedContent);
      } catch (err) {
        console.error("Quiz generation error:", err);
        setError(err.message);
        setQuizContent(getFallbackContent(state));
      } finally {
        setLoading(false);
      }
    };

    generateQuizWithGemini();
  }, [state]);

  const parseGeminiResponse = (text) => {
    try {
      // Extract story
      const storySection = text.split('Story:')[1]?.split('Questions:')[0]?.trim();
      const questionsSection = text.split('Questions:')[1]?.trim();
      
      // Parse questions
      const questionRegex = /(\d+)\.\s(.+?)\s+A\)\s(.+?)\s+B\)\s(.+?)\s+C\)\s(.+?)\s+D\)\s(.+?)\s+Correct Answer:\s([A-D])\s+Explanation:\s(.+?)(?=\n\d+\.|\n*$)/gs;
      const questions = [];
      let match;
      
      while ((match = questionRegex.exec(questionsSection)) !== null) {
        questions.push({
          question: match[2].trim(),
          options: [
            `A) ${match[3].trim()}`,
            `B) ${match[4].trim()}`,
            `C) ${match[5].trim()}`,
            `D) ${match[6].trim()}`
          ],
          correct: match[7].trim(),
          explanation: match[8].trim()
        });
      }

      return {
        story: storySection || "Financial adventure story goes here...",
        questions: questions.length >= 5 ? questions.slice(0, 5) : getFallbackQuestions(state)
      };
    } catch (err) {
      console.error("Error parsing Gemini response:", err);
      return getFallbackContent(state);
    }
  };

  const getFallbackContent = (state) => ({
    story: `Meet ${state.interests.length > 0 ? state.interests[0] : 'Alex'}, who's learning about ${state.subtopic}. They discovered that managing money is like ${state.interests.length > 1 ? state.interests[1] : 'a game'} - you need strategy to win!`,
    questions: getFallbackQuestions(state)
  });

  const getFallbackQuestions = (state) => [
    {
      question: `What's the first step in ${state.subtopic.split(':')[0]}?`,
      options: [
        "A) Spend all your money",
        "B) Create a budget",
        "C) Ignore your finances",
        "D) Only think about short-term"
      ],
      correct: "B",
      explanation: "Budgeting helps you understand where your money goes."
    },
    {
      question: `Why is ${state.subtopic.split(':')[0]} important?`,
      options: [
        "A) It's not really important",
        "B) Helps you achieve financial goals",
        "C) Only matters when you're older",
        "D) Banks require it"
      ],
      correct: "B",
      explanation: "Financial knowledge helps you make better money decisions."
    },
    {
      question: "What's a good savings strategy?",
      options: [
        "A) Save whatever is left at month end",
        "B) Set aside 20% of income first",
        "C) Only save for big purchases",
        "D) Don't save, just invest"
      ],
      correct: "B",
      explanation: "Pay yourself first by saving before spending."
    },
    {
      question: "What does 'pay yourself first' mean?",
      options: [
        "A) Buy things you want",
        "B) Save before spending on other things",
        "C) Only pay your bills",
        "D) Take loans to buy stuff"
      ],
      correct: "B",
      explanation: "Prioritize saving before other expenses."
    },
    {
      question: "How often should you review your finances?",
      options: [
        "A) Never",
        "B) Once a year",
        "C) Monthly",
        "D) Only when you run out of money"
      ],
      correct: "C",
      explanation: "Regular check-ins help you stay on track."
    }
  ];

  const handleAnswer = (optionIndex) => {
    if (showFeedback) return;
    setSelected(optionIndex);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizContent.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>Generating your personalized quiz...</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              borderTopColor: '#4CAF50',
              animation: 'spin 1s ease-in-out infinite'
            }}></div>
          </div>
          <p style={{ marginTop: '20px' }}>Creating a fun financial story about {state.interests.join(' and ')}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: '#f44336' }}>⚠️ Quiz Generation Error</h2>
          <p>{error}</p>
          <p>We've loaded sample questions so you can continue learning.</p>
          <button
            onClick={() => setLoading(false)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Continue with Sample Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      minHeight: '100vh',
      padding: '40px',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px',
        borderRadius: '10px'
      }}>
        {/* Story Page */}
        {currentQuestion === 0 && !showFeedback && (
          <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Financial Adventure</h1>
            <h2 style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: '#4CAF50'
            }}>
              {state.topic}: {state.subtopic}
            </h2>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              lineHeight: '1.6',
              whiteSpace: 'pre-line'
            }}>
              {quizContent.story}
            </div>
            <button
              onClick={() => {
                setShowFeedback(false);      // Ensure feedback is hidden
                setSelected(null);            // Reset any preselected option
                setCurrentQuestion(1);        // Start from the first question
              }}
              style={{
                display: 'block',
                margin: '0 auto',
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Start Quiz →
            </button>
          </div>
        )}
  
        {/* Questions */}
        {currentQuestion >= 1 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <span>Question {currentQuestion} of {quizContent.questions.length}</span>
              <span>Topic: {state.subtopic}</span>
            </div>
            
            <p style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              {quizContent.questions[currentQuestion - 1].question}
            </p>
  
            <div style={{ marginBottom: '30px' }}>
              {quizContent.questions[currentQuestion - 1].options.map((option, i) => {
                const optionLetter = option[0];
                const isCorrect = optionLetter === quizContent.questions[currentQuestion - 1].correct;
                const isSelected = selected === i;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      marginBottom: '10px',
                      textAlign: 'left',
                      backgroundColor: 
                        showFeedback
                          ? isCorrect
                            ? '#4CAF50'
                            : isSelected
                              ? '#f44336'
                              : 'rgba(255,255,255,0.1)'
                          : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: showFeedback ? 'default' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
  
            {showFeedback && (
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{
                  color: selected === quizContent.questions[currentQuestion - 1].correct.charCodeAt(0) - 65 
                    ? '#4CAF50' 
                    : '#f44336',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {selected === quizContent.questions[currentQuestion - 1].correct.charCodeAt(0) - 65 
                    ? '✅ Correct!' 
                    : '❌ Incorrect!'}
                </p>
                <p style={{ marginTop: '10px' }}>
                  <strong>Explanation:</strong> {quizContent.questions[currentQuestion - 1].explanation}
                </p>
                <button
                  onClick={handleNext}
                  style={{
                    display: 'block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  {currentQuestion < quizContent.questions.length ? 'Next Question →' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default QuizFlow;