import React, { useState } from 'react';
import './question.css';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; 

const Question = () => {
  const { paperId } = useParams();
  const location = useLocation();
  const initialRemainingMarks = location.state?.remainingMarks || 0; 

  const [questionheading, setQuestionHeading] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [compilerReq, setCompilerReq] = useState('');
  const [marks, setMarks] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [remainingMarks, setRemainingMarks] = useState(initialRemainingMarks); 
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

        const uploadResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.url; 
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

  const submitQuestion = async (imageUrl) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/add-question`, {
      paperId,
      questionheading,
      questionDescription,
      compilerReq,
      marks,
      image: imageUrl, 
    });

    if (response.status === 201) {
      setModalMessage('Question added successfully!');
      setIsError(false);
      setModalIsOpen(true);

      const updatedRemainingMarks = remainingMarks - parseInt(marks); // Calculate remaining marks
      if (updatedRemainingMarks === 0) {
        setTimeout(() => {
          navigate(`/questionPaperDashboard/${paperId}`);
        }, 2000); 
      } else {
        setRemainingMarks(updatedRemainingMarks);
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
    maxSize: 10485760, 
  });

  const handlePaste = async (event) => {
    const clipboardData = event.clipboardData;
    const items = clipboardData.items;

    for (const item of items) {
      if (item.type.includes('image')) {
        const file = item.getAsFile();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'question');

        setQuestionDescription((prev) => prev + '\nUploading image...');

        try {
          const uploadResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const imageUrl = uploadResponse.data.url;
          setQuestionDescription((prev) => prev.replace('Uploading image...', `![image](${imageUrl})`));
        } catch (error) {
          console.error('Image upload failed:', error.message);
          setQuestionDescription((prev) => prev.replace('Uploading image...', 'Image upload failed.'));
        }
      }
    }
  };

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
              onPaste={handlePaste} // Capture paste event
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
                <option value="c">C</option>
              </select>
            </div>
            <div className="add_question_column">
              <label className="add_question_label">Marks:</label>
              <input
                type="tel"
                value={marks}
                onChange={(e) => setMarks(e.target.value.replace(/[^0-9]/g, ""))}
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
