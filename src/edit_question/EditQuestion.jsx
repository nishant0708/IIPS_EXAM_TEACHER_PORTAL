import React, { useState,useEffect } from 'react';
import '../question/question.css';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; // Import the AlertModal component
import Loader from '../Loader/Loader';

const EditQuestion = () => {
  document.title = "Edit-Question";
  const { paperId } = useParams();
  const location = useLocation();

  const { remainingMarks } = location.state || {}; // Get remaining marks from props
  const [questionheading, setQuestionHeading] = useState(location.state.questionheading);
  const [questionDescription, setQuestionDescription] = useState(location.state.questionDescription);
  const [compilerReq, setCompilerReq] = useState(location.state.compilerReq);
  const [marks, setMarks] = useState(location.state.marks);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSpinner,setLoadingSpinner] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{setTimeout(()=>{setLoadingSpinner(false)},1000);},[]);

  const handleEditQuestion = async () => {
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

      await editQuestion(imageUrl);
    } catch (error) {
      console.error('Failed to add question:', error.message);
      setModalMessage('Failed to add question. Please try again.');
      setIsError(true);
      setModalIsOpen(true);
      setLoading(false);
    }
  };

  const editQuestion = async (imageUrl) => {
    const response = await axios.post('http://localhost:5000/paper/edit-question', {
      _id: location.state._id,
      paperId,
      questionheading,
      questionDescription,
      compilerReq,
      marks,
      image: imageUrl, // Include imageUrl even if it's an empty string
    });

    if (response.status === 200) {
      setModalMessage('Question Edited successfully!');
      setIsError(false);
      setModalIsOpen(true);

      setTimeout(() => {
        navigate(`/questionPaperDashboard/${paperId}`);
      }, 2000);
    } else {
      setModalMessage('Question Edit Failed!');
      setIsError(true);
      setModalIsOpen(true);
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
        {loadingSpinner ? (<Loader />) : (<>
          <div className="add_question_container">
          <h2 className="add_question_heading">Edit Question</h2>

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

          <button onClick={handleEditQuestion} className="add_question_button" disabled={loading}>
            {loading ? 'Editing...' : 'Edit Question'}
          </button>
        </div>
        </>)}
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

export default EditQuestion;
