import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Interests = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    tvPodcasts: "",
    games: "",
    music: "",
    movies: "",
    sports: "",
    mangaAnime: "",
    activities: "",
    brands: "",
    books: ""
  });

  const [selections, setSelections] = useState({
    tvPodcasts: [],
    games: [],
    music: [],
    movies: [],
    sports: [],
    mangaAnime: [],
    activities: [],
    brands: [],
    books: []
  });

  const categories = [
    { id: "tvPodcasts", label: "TV & Podcasts", placeholder: "e.g., Stranger Things, The Joe Rogan Experience" },
    { id: "games", label: "Games", placeholder: "e.g., Fortnite, Minecraft" },
    { id: "music", label: "Music Artists", placeholder: "e.g., The Weeknd, Taylor Swift" },
    { id: "movies", label: "Movies", placeholder: "e.g., Inception, The Dark Knight" },
    { id: "sports", label: "Sports", placeholder: "e.g., Football, Basketball" },
    { id: "mangaAnime", label: "Manga & Anime", placeholder: "e.g., Attack on Titan, Naruto" },
    { id: "activities", label: "Activities", placeholder: "e.g., Gym, Netflix and Chill" },
    { id: "brands", label: "Brands", placeholder: "e.g., Nike, Apple" },
    { id: "books", label: "Books", placeholder: "e.g., Atomic Habits, Harry Potter" }
  ];

  const handleInputChange = (e, category) => {
    setInputs({
      ...inputs,
      [category]: e.target.value
    });
  };

  const handleAddInterest = (category) => {
    if (inputs[category].trim() === "") return;
    if (selections[category].length >= 5) return;

    setSelections({
      ...selections,
      [category]: [...selections[category], inputs[category].trim()]
    });

    setInputs({
      ...inputs,
      [category]: ""
    });
  };

  const handleRemoveInterest = (category, index) => {
    const updated = selections[category].filter((_, i) => i !== index);
    setSelections({
      ...selections,
      [category]: updated
    });
  };

  const saveInterestsToFile = () => {
    // Combine all interests from all categories into one array
    const allInterests = Object.values(selections).flat();
    
    // Create JSON structure with just the allInterests array
    const data = {
      allInterests: allInterests
    };

    // Create download link
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_interests.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveInterestsToFile();
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
        backgroundColor: "rgba(0,0,0,0.7)",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "30px",
        borderRadius: "10px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Enter Your Interests</h1>
        <p style={{ textAlign: "center", marginBottom: "40px" }}>
          Type up to 5 for each category (optional)
        </p>

        {categories.map(({ id, label, placeholder }) => (
          <div key={id} style={{ marginBottom: "30px" }}>
            <h3 style={{ 
              marginBottom: "10px",
              borderBottom: "1px solid #444",
              paddingBottom: "5px"
            }}>
              {label}
            </h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={inputs[id]}
                onChange={(e) => handleInputChange(e, id)}
                placeholder={placeholder}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white"
                }}
              />
              <button
                onClick={() => handleAddInterest(id)}
                disabled={selections[id].length >= 5}
                style={{
                  padding: "10px 15px",
                  backgroundColor: selections[id].length >= 5 ? "#555" : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: selections[id].length >= 5 ? "not-allowed" : "pointer"
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {selections[id].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {item}
                  <button
                    onClick={() => handleRemoveInterest(id, index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff5555",
                      cursor: "pointer",
                      fontSize: "1.1rem"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {selections[id].length >= 5 && (
              <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "5px" }}>
                Maximum 5 items reached
              </p>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.1rem",
            marginTop: "40px",
            cursor: "pointer"
          }}
        >
          Save Interests
        </button>
      </div>
    </div>
  );
};

export default Interests;