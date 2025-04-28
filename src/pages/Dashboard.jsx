import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const topics = [
    {
      title: "💸 Mastering the Money Flow",
      subtopics: [
        "Money Talks: Understanding What It Really Is",
        "Build Your First Budget Map",
        "The Expense Detective: Track Every Rupee",
        "Save Smart, Not Hard",
        "Fun Funds: Budgeting for Hobbies & Hangouts"
      ]
    },
    {
      title: "📈 Investment Adventure Begins",
      subtopics: [
        "Level Up: What Is Investing Anyway?",
        "Time Traveler's Secret: Compound Interest",
        "Enter the Arena: Stock Market Simplified",
        "Simulate & Dominate: Create a Virtual Portfolio",
        "Risk Radar: Know What You're Getting Into"
      ]
    },
    {
      title: "💰 Save Like a Pro",
      subtopics: [
        "Mission: Money Goals",
        "Saving Up for Dream Buys",
        "Be Your Own Safety Net: Emergency Fund 101",
        "Bank Smart: Account Types Explained",
        "Set It & Forget It: Automate Your Savings"
      ]
    },
    {
      title: "💳 Credit Chronicles",
      subtopics: [
        "Credit Unlocked: What It Means & Why It Matters",
        "Borrowing Without Breaking the Bank",
        "The Power Score: Demystifying Credit Scores",
        "Escape the Debt Dungeon",
        "Build a Reputation with Good Credit Moves"
      ]
    },
    {
      title: "🧾 Tax Time Unlocked",
      subtopics: [
        "Taxed & Explained: Why It Exists",
        "Paycheck Decoder: Where Your Money Goes",
        "Your First Tax Quest: How to File",
        "Tax-Savvy Saving Strategies",
        "Planning Ahead: Tax Tricks for Smart Students"
      ]
    }
  ];

  const handleStartQuiz = async (title, subtopic) => {
    try {
      const response = await fetch('/all_interests.json');
      const data = await response.json();

      navigate('/quiz', {
        state: {
          topic: title,
          subtopic: subtopic,
          interests: data.allInterests ? data.allInterests : []
        }
      });
    } catch (error) {
      console.error("Failed to load interests:", error);
      navigate('/quiz', {
        state: {
          topic: title,
          subtopic: subtopic,
          interests: []
        }
      });
    }
  };

  return (
    <div style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      minHeight: "100vh",
      padding: "40px",
      color: "white"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: "10px",
        padding: "30px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Smart Cents Dashboard</h1>
        
        <div style={{ marginBottom: "40px" }}>
          <button 
            onClick={() => navigate('/interests')}
            style={{
              padding: "12px 24px",
              backgroundColor: "#5865F2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            ✨ Update Your Preferences
          </button>
        </div>

        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} style={{ 
            marginBottom: "30px",
            borderBottom: "1px solid #444",
            paddingBottom: "20px"
          }}>
            <h2 style={{ 
              fontSize: "1.5rem",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {topic.title}
            </h2>
            
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "15px"
            }}>
              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <div 
                  key={subtopicIndex}
                  onClick={() => handleStartQuiz(topic.title, subtopic)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    padding: "15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  <h3 style={{ 
                    fontSize: "1.1rem",
                    marginBottom: "8px"
                  }}>
                    {subtopic}
                  </h3>
                  <p style={{ 
                    fontSize: "0.9rem",
                    color: "#aaa"
                  }}>
                    Click to start learning
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
