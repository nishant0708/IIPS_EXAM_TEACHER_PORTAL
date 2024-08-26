import React, { useState } from 'react';
import './question.css'; // Import the CSS file
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
    <div className="add_question_container">
      <h2 className="add_question_heading">Add Question</h2>

      <div>
        <label className="add_question_label">Question Heading:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          required
          className="add_question_input"
        />
      </div>

      <div>
        <label className="add_question_label">Question Description:</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question description"
          required
          rows="3"
          className="add_question_textarea"
        />
      </div>

      <div className="add_question_row">
        <div className="add_question_column">
          <label className="add_question_label">Compiler Requirement:</label>
          <select
            value={compilerReq}
            onChange={(e) => setCompilerReq(e.target.value)}
            required
            className="add_question_select"
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
        <div className="add_question_column">
          <label className="add_question_label">Maximum Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks"
            required
            className="add_question_input"
          />
        </div>
      </div>

      <div>
        <label className="add_question_label">Upload Image (optional):</label>
        <div {...getRootProps({ className: 'add_question_dropbox' })}>
          <input {...getInputProps()} />
          {image ? (
            <div className="add_question_image_preview">
              <img src={image} alt="Question" className="add_question_preview_image" />
              <FaTimes className="add_question_remove_image_icon" onClick={handleRemoveImage} />
            </div>
          ) : (
            <p>
              <div className='add_question_cloudicon'>
                <IoCloudUploadOutline />
              </div>
              Drag and drop an image here, or click to select one
            </p>
          )}
        </div>
      </div>
      <button onClick={handleAddQuestion} className="add_question_button">Add Question</button>
    </div>
  );
};

export default Question;
