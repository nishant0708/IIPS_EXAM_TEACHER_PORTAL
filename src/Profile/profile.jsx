import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Navbar from '../Navbar/Navbar';
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import Modal from 'react-modal';
import AlertModal from '../AlertModal/AlertModal';
import defaultPhoto from "../Assets/profile_photo.png";
import ReactCrop from "react-easy-crop";
import getCroppedImg from "./getCroppedImg";


Modal.setAppElement('#root');

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo:"",
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    confirmPassword: ""
  });
  const [imageCropModal, setImageCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [newProfileData, setNewProfileData] = useState(profileData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordsMatch, setPasswordMatch] = useState(false);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/teacher/getteacherDetails`, {
          teacherId: localStorage.getItem("teacherId"),
        });
        
        const teacherData = response?.data?.teacher;
        if (teacherData) {
          setProfileData({
            name: teacherData.name,
            email: teacherData.email,
            mobile_no: teacherData.mobileNumber,
            password: teacherData.password,
            photo: teacherData.photo || defaultPhoto,
            confirmPassword: teacherData.password,
          });
        }
      } catch (error) {
        console.log("Error fetching teacher details:", error);
      }
    };
  
    fetchTeacherDetails();
  }, []);

  const openModal = () => {
    setNewProfileData({ ...profileData, password: "", confirmPassword: "" });
    setEditPassword(false);
    setPasswordMatch(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openAlertModal = (message, isError = false) => {
    setAlertMessage(message);
    setIsError(isError);
    setAlertIsOpen(true);
  };

  const handleSave = () => {
    const { email, mobile_no, password, confirmPassword } = newProfileData;

    if (!email.includes('@')) {
      openAlertModal("Please enter a valid email address.", true);
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile_no)) {
      openAlertModal("Please enter a valid 10-digit mobile number.", true);
      return;
    }

    if (editPassword) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        openAlertModal("Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.", true);
        return;
      }

      if (password !== confirmPassword) {
        openAlertModal("Passwords do not match.", true);
        return;
      }
    }

    // Merging /edit API call
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/teacher/edit`, {
      teacherId: localStorage.getItem("teacherId"),
      ...newProfileData,
    })
      .then((response) => {
        setProfileData({
          ...profileData,
          name: response?.data?.teacher?.name,
          email: response?.data?.teacher?.email,
          mobile_no: response?.data?.teacher?.mobileNumber,
        });
        openAlertModal("Profile updated successfully!");
        closeModal();
      })
      .catch((error) => {
        openAlertModal("An error occurred while updating the profile.", true);
        console.log(error);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
      setImageCropModal(true);
    }
  };
 

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
    setCroppedImage(croppedImage);
  };

 const saveCroppedImage = async () => {
  if (!croppedImage) return;

  // Prepare the image file for upload using FormData
  const formData = new FormData();
  formData.append("file", croppedImage);

  try {

    const uploadResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/upload`, formData);

    const imageUrl = uploadResponse.data.url;

  
    const teacherId = localStorage.getItem("teacherId");

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/teacher/set-photo`, {
      teacherId: teacherId,
      photo: imageUrl
    });

   
    localStorage.setItem("profilePhoto", imageUrl);
    setProfileData((prevData) => ({ ...prevData, photo: imageUrl }));

    setImageCropModal(false);
  } catch (error) {
    console.error("Error updating profile photo:", error);
  }
};

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      <Navbar />
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileData.photo} alt="Profile" className="profile-image" />
          <label htmlFor="file-input"  className="profile-plus-icon">
            <FaPlus />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
   
        </div>
        <div className="profile-details">
          <div className="profile-name">{profileData.name}</div>
          <p className="profile-email">Email: {profileData.email}</p>
          <p className="profile-mob">Mobile: {profileData.mobile_no}</p>
        </div>
        <button className="profile-edit-button" onClick={openModal}>Edit Profile</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className="profile-modal"
        overlayClassName="profile-overlay"
      >
        <h2>Edit Profile</h2>
        <form className="profile-modal-form">
          <label>
            Name:
            <input
              type="text"
              value={newProfileData.name}
              onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newProfileData.email}
              disabled
              onChange={(e) => setNewProfileData({ ...newProfileData, email: e.target.value })}
            />
          </label>
          <label>
            Mobile:
            <input
              type="text"
              value={newProfileData.mobile_no}
              onChange={(e) => setNewProfileData({ ...newProfileData, mobile_no: e.target.value })}
            />
          </label>

          <button type="button" className="profile-edit-password-button" onClick={() => setEditPassword(!editPassword)}>
            {editPassword ? "Cancel Edit Password" : "Edit Password"}
          </button>

          {editPassword && (
            <>
              <label>
                Password:
                <div className="profile-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={
                      passwordsMatch
                        ? "profile-input-normal"
                        : "profile-input-faded"
                    }
                    value={newProfileData.password}
                    onChange={(e) => {
                      setNewProfileData({
                        ...newProfileData,
                        password: e.target.value,
                      });
                      if(e.target.value == newProfileData.confirmPassword){
                        setPasswordMatch(true);
                      }else{
                        setPasswordMatch(false);
                      }
                    }}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="profile-eye-icon"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </label>
              <label>
                Confirm Password:
                <div className="profile-password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={
                      passwordsMatch
                        ? "profile-input-normal"
                        : "profile-input-faded"
                    }
                    value={newProfileData.confirmPassword}
                    onChange={(e) => {
                      setNewProfileData({
                        ...newProfileData,
                        confirmPassword: e.target.value,
                      });
                      if(newProfileData.password == e.target.value){
                        setPasswordMatch(true);
                      }else{
                        setPasswordMatch(false);
                      }
                    }}
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="profile-eye-icon"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </label>
            </>
          )}

          <div className="profile-modal-buttons">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </Modal>
      <Modal
  isOpen={imageCropModal}
  onRequestClose={() => setImageCropModal(false)}
  contentLabel="Crop Image"
  className="profile-crop-modal"
  overlayClassName="profile-overlay"
>
  <h2 className='crop_h2'>Crop Your Image</h2>
  <ReactCrop
    image={selectedImage}
    crop={crop}
    zoom={zoom}
    aspect={1}
    onCropChange={setCrop}
    onCropComplete={onCropComplete}
    onZoomChange={setZoom}
  />
  <div className="modal-buttons">
    <button onClick={saveCroppedImage}>Save</button>
    <button onClick={() => setImageCropModal(false)}>Cancel</button>
  </div>
</Modal>

      <AlertModal
        isOpen={alertIsOpen}
        onClose={() => setAlertIsOpen(false)}
        message={alertMessage}
        iserror={isError}
      />
    </>
  );
};

export default Profile;
