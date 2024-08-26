import React, { useState } from 'react';
import './question.css';  // Import the CSS file
import { FaTimes } from 'react-icons/fa'; // Import the cross icon
import { useDropzone } from 'react-dropzone'; // Import Dropzone
import { IoCloudUploadOutline } from "react-icons/io5";

const Question = () => {
  const [questionText, setQuestionText] = useState('');
  const [compilerReq, setCompilerReq] = useState('');
  const [marks, setMarks] = useState('');
  const [image, setImage] = useState(null);

  const handleAddQuestion = () => {
    if (!questionText || !compilerReq || !marks) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Logic to handle adding the question can be added here.
    setQuestionText('');
    setCompilerReq('');
    setMarks('');
    setImage(null); // Clear the image after adding the question
  };

  const onDrop = (acceptedFiles) => {
    setImage(URL.createObjectURL(acceptedFiles[0]));
  };

  const handleRemoveImage = () => {
    setImage(null); // Remove the image
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container">
       
      <h2>Add Question</h2>

      <div>
        <label>Question Heading:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          required
        />
      </div>

      <div>
        <label>Question Description:</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question description "
          required
          rows="3" // Initial rows for the textarea
        />
      </div>
     
      <div className="row">
        <div className="column">
          <label>Compiler Requirement:</label>
          <select
            value={compilerReq}
            onChange={(e) => setCompilerReq(e.target.value)}
            required
          >
            <option value="" disabled>Select Compiler</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="column">
          <label>Maximum Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks"
            required
          />
        </div>
      </div>
      <div>
        <label>Upload Image (optional):</label>
        <div {...getRootProps({ className: 'dropbox' })}>
          <input {...getInputProps()} />
          {image ? (
            <div className="image-preview">
              <img src={image} alt="Question" className="preview-image" />
              <FaTimes className="remove-image-icon" onClick={handleRemoveImage} />
            </div>
          ) : (
            <p> <div className='question_cloudicon'><IoCloudUploadOutline /> </div></p> 
          )}

        </div>
      </div>
      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
};

export default Question;
