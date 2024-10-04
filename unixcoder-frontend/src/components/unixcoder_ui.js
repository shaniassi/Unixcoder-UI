import React, { useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaCopy } from "react-icons/fa"; 
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../../src/components/unixcoder_ui.scss"; 

function App() {
  const [code, setCode] = useState("");
  const [predictedCategory, setPredictedCategory] = useState("");
  const [generatedFix, setGeneratedFix] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPrediction, setShowPrediction] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictedCategory("");
    setGeneratedFix("");
    setError("");
    setLoading(true); 
    setShowPrediction(true);

    try {
      const response = await axios.post("http://localhost:5004/api/predict", {
        code,
      });

      setPredictedCategory(response.data.predictedCategory);
      setGeneratedFix(response.data.generatedFix);
      setShowPrediction(true); 
    } catch (err) {
      setError(err.response ? err.response.data.error : "An error occurred");
    } finally {
      setLoading(false); 
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="app-container">
      {!showPrediction ? (
        <div className="welcome-message">
          <h1>Welcome to UnixCoder Fix Predictor</h1>
          <p>
            Enter your JavaScript code below, and we'll predict the fix category
            for you!!
          </p>
        </div>
      ) : (
        <div className="prediction-area">
          <div
            className="prediction-section"
            style={{ height: loading ? "auto" : "auto" }}
          >
            <h2>PEFT-LoRA</h2>
            <h3 className="category-text">Predicted Fix Category</h3>
            <p>
              {loading
                ? "Predicting..."
                : predictedCategory || "Predicted fix category will go here."}
            </p>
            <h3 className="generated-fix-text">Generated Fix</h3>
            <div className="code-box">
              <SyntaxHighlighter language="javascript" style={nightOwl}>
                {loading
                  ? "Generating fix..."
                  : generatedFix || "Generated fix will go here."}
              </SyntaxHighlighter>
              <button
                className="copy-button"
                onClick={() => copyToClipboard(generatedFix)}
              >
                <FaCopy /> Copy Code
              </button>
            </div>
          </div>

          <div
            className="prediction-section"
            style={{ height: loading ? "auto" : "auto" }}
          >
            <h2>FFT</h2>
            <h3>Predicted Fix Category</h3>
            <p>
              {loading
                ? "Predicting..."
                : predictedCategory || "Predicted fix category will go here."}
            </p>
            <h3>Generated Fix</h3>
            <div className="code-box">
              <SyntaxHighlighter language="javascript" style={nightOwl}>
                {loading
                  ? "Generating fix..."
                  : generatedFix || "Generated fix will go here."}
              </SyntaxHighlighter>
              <button
                className="copy-button"
                onClick={() => copyToClipboard(generatedFix)}
              >
                <FaCopy /> Copy Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your JavaScript code here..."
          required
          className="input-textarea"
        />
        <button type="submit" className="submit-icon" disabled={loading}>
          <FaPaperPlane />
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
