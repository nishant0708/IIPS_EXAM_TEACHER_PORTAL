import React, { useState } from 'react';
import './question.css';  // Import the CSS file

const Question = () => {
  const [questionText, setQuestionText] = useState('');
  const [compilerReq, setCompilerReq] = useState('');
  const [marks, setMarks] = useState('');
  const [image, setImage] = useState(null);

  const handleAddQuestion = () => {
    setQuestionText('');
    setCompilerReq('');
    setMarks('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="container">
      <h2>Add Question</h2>
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <div>
        <label>Upload Image:</label>
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Question" className="preview-image" />}
      </div>
      <div className="row">
        <div className="column">
          <label>Compiler Requirement:</label>
          <select
            value={compilerReq}
            onChange={(e) => setCompilerReq(e.target.value)}
          >
            <option value="" disabled>Select Compiler</option>
            <option value="cpp">cpp</option>
            <option value="java">java</option>
            <option value="python">python</option>
            <option value="html">html</option>
            <option value="css">css</option>
            <option value="javascript">javascript</option>
          </select>
        </div>
        <div className="column">
          <label>Maximum Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
};

export default Question;
