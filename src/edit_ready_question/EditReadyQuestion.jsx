import React, { useState, useEffect } from 'react';
import '../question/question.css';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; // Import the AlertModal component

const EditReadyQuestion = () => {
  document.title = "Ready Question";
  const { paperId } = useParams();
  const location = useLocation();

  const { remainingMarks } = location.state || {}; // Get remaining marks from props
  const [questionheading, setQuestionHeading] = useState(location.state.questionheading);
  const [questionDescription, setQuestionDescription] = useState(location.state.questionDescription);
  const [compilerReq, setCompilerReq] = useState(location.state.compilerReq);
  const [marks, setMarks] = useState(location.state.marks);
  const [image, setImage] = useState(location.state.image);
  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoadingSpinner(false);
    }, 1000);
  }, []);

  // Handle pasting images in question description
  const handlePaste = async (event) => {
    const clipboardData = event.clipboardData;
    const items = clipboardData.items;

    for (const item of items) {
      if (item.type.includes("image")) {
        event.preventDefault(); // Prevent default paste behavior
        const file = item.getAsFile();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "question");

        setQuestionDescription((prev) => prev + "\nUploading image...");

        try {
          const uploadResponse = await axios.post(
            "http://localhost:5000/paper/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          const imageUrl = uploadResponse.data.url;

          // Replace "Uploading image..." with the actual image markdown link
          setQuestionDescription((prev) =>
            prev.replace("Uploading image...", `![image](${imageUrl})`)
          );
        } catch (error) {
          console.error("Image upload failed:", error.message);
          setQuestionDescription((prev) =>
            prev.replace("Uploading image...", "Image upload failed.")
          );
        }
      }
    }
  };

  const handleEditQuestion = async () => {
    if (!questionheading || !questionDescription || !compilerReq || !marks) {
      setModalMessage("Please fill in all the required fields.");
      setIsError(true);
      setModalIsOpen(true);
      return;
    }
  
    if (parseInt(marks) > remainingMarks) {
      setModalMessage(
        `You can assign a maximum of ${remainingMarks} marks to this question.`
      );
      setIsError(true);
      setModalIsOpen(true);
      return;
    }
  
    setLoading(true);
    try {
      let imageUrl = image;
  
      // Only upload if the image is a new file (not a pre-existing URL)
      if (image && typeof image !== "string") {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "question");
  
        const uploadResponse = await axios.post(
          "http://localhost:5000/paper/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
  
        imageUrl = uploadResponse.data.url;
      }
  
      await editQuestion(imageUrl);
    } catch (error) {
      console.error("Failed to edit question:", error.message);
      setModalMessage("Failed to edit question. Please try again.");
      setIsError(true);
      setModalIsOpen(true);
      setLoading(false);
    }
  };
  

  const editQuestion = async (imageUrl) => {
    const response = await axios.post('http://localhost:5000/paper/edit-ready-question', {
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
        navigate(`/ready_questions/${paperId}`);
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
        {loadingSpinner ? (<></>) : (
          <>
            <div className="add_question_container">
              <h2 className="add_question_heading">Edit Ready Question</h2>

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
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <div className="add_question_column">
                  <label className="add_question_label">Marks:</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={() => setMarks(marks)}
                    placeholder="Enter marks"
                    required
                    className="add_question_input"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="add_question_label">Upload Image (optional):</label>
                <div {...getRootProps({ className: 'add_question_dropbox' })}>
                  <input {...getInputProps()} />
                  {image ? (
                    <div className="add_question_image_preview">
                      <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="Question" className="add_question_preview_image" />
                      <FaTimes className="add_question_remove_image_icon" onClick={(e) => { e.stopPropagation(); handleRemoveImage() }} />
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
          </>
        )}
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

export default EditReadyQuestion;
