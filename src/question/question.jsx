import React, { useState } from 'react';
import './question.css';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; // Import the AlertModal component

const Question = () => {
  const { paperId } = useParams();
  const location = useLocation();
  const { remainingMarks } = location.state || {}; // Get remaining marks from props

  const [questionheading, setQuestionHeading] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [compilerReq, setCompilerReq] = useState('');
  const [marks, setMarks] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleAddQuestion = async () => {
    if (!questionheading || !questionDescription || !compilerReq || !marks) {
      setModalMessage('Please fill in all the required fields.');
      setIsError(true);
      setModalIsOpen(true);
      return;
    }

    if (parseInt(marks) > remainingMarks) {
      setModalMessage(`You can assign a maximum of ${remainingMarks} marks to this question.`);
      setIsError(true);
      setModalIsOpen(true);
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'question');

        const uploadResponse = await axios.post('http://localhost:5000/paper/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.url; // Assuming the backend responds with the image URL
      }

      await submitQuestion(imageUrl);
    } catch (error) {
      console.error('Failed to add question:', error.message);
      setModalMessage('Failed to add question. Please try again.');
      setIsError(true);
      setModalIsOpen(true);
      setLoading(false);
    }
  };

  function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<img src="' + url + '" alt="fail to load image">' + url + '</img>';
    })

  }

  const submitQuestion = async (imageUrl) => {
    const questionDescriptionModified = urlify(questionDescription);

    const response = await axios.post('http://localhost:5000/paper/add-question', {
      paperId,
      questionheading,
      questionDescriptionModified,
      compilerReq,
      marks,
      image: imageUrl, // Include imageUrl even if it's an empty string
    });

    if (response.status === 201) {
      setModalMessage('Question added successfully!');
      setIsError(false);
      setModalIsOpen(true);

      // If remaining marks are 0, navigate to the QuestionPaperDashboard
      if (remainingMarks - parseInt(marks) === 0) {
        setTimeout(() => {
          navigate(`/questionPaperDashboard/${paperId}`);
        }, 2000); // Wait for 2 seconds before navigating
      } else {
        // Clear form if there are remaining marks
        setQuestionHeading('');
        setQuestionDescription('');
        setCompilerReq('');
        setMarks('');
        setImage(null);
      }
    }
    setLoading(false);
  };

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760, // 10MB limit
  });

  return (
    <>
      <Navbar />
      <div className='add_question_container_main'>
        <div className="add_question_container">
          <h2 className="add_question_heading">Add Question</h2>

          <div>
            <label className="add_question_label">Question Heading:</label>
            <input
              type="text"
              value={questionheading}
              onChange={(e) => setQuestionHeading(e.target.value)}
              placeholder="Enter your question heading"
              required
              className="add_question_input"
            />
          </div>

          <div>
            <label className="add_question_label">Question Description:</label>
            <textarea
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
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
                <option value="sql">SQL</option>
              </select>
            </div>
            <div className="add_question_column">
              <label className="add_question_label">Marks:</label>
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
                  <img src={URL.createObjectURL(image)} alt="Question" className="add_question_preview_image" />
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

          <button onClick={handleAddQuestion} className="add_question_button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
        iserror={isError}
      />
    </>
  );
};

export default Question;
