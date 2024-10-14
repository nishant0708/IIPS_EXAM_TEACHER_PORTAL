import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-modal";
import AlertModal from "../AlertModal/AlertModal";
import defaultPhoto from "../Assets/profile_photo.png";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; // Utility to crop the image

Modal.setAppElement("#root");

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo: defaultPhoto,
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [newProfileData, setNewProfileData] = useState(profileData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordsMatch, setPasswordMatch] = useState(false);
  const [modalCropIsOpen, setModalCropIsOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [submitDisplay,setSubmitDisplay] = useState(false);

  useEffect(() => {
    // Fetch teacher details only when the component mounts
    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.post("http://localhost:5000/teacher/getteacherDetails", {
          teacherId: localStorage.getItem("teacherId"),
        });
  
        const teacherData = response?.data?.teacher;
        if (teacherData) {
          setProfileData((prevData) => ({
            ...prevData,
            photo: teacherData.profilePic || defaultPhoto,
            name: teacherData.name,
            email: teacherData.email,
            mobile_no: teacherData.mobileNumber,
            password: teacherData.password,
            confirmPassword: teacherData.password,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchTeacherDetails();
  }, []); // Empty dependency array to ensure this effect only runs on mount
  

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

    if (!email.includes("@")) {
      openAlertModal("Please enter a valid email address.", true);
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile_no)) {
      openAlertModal("Please enter a valid 10-digit mobile number.", true);
      return;
    }

    if (editPassword) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        openAlertModal(
          "Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.",
          true
        );
        return;
      }

      if (password !== confirmPassword) {
        openAlertModal("Passwords do not match.", true);
        return;
      }
    }

    axios
      .post("http://localhost:5000/teacher/edit", {
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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          photo: e.target.result,
        });
      };
      reader.readAsDataURL(file);
      setModalCropIsOpen(true);
      setSubmitDisplay(true);
    }
  };

  const saveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(profileData.photo, croppedAreaPixels);
      setProfileData((prevData) => ({
        ...prevData,
        photo: croppedImage,
      }));
      setModalCropIsOpen(false);
    } catch (error) {
      console.error("Error cropping the image: ", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const editProfilePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("file", profileData.photo);
  
      // Upload the image to the server (assuming the endpoint is '/paper/upload')
      const uploadResponse = await axios.post("http://localhost:5000/paper/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const profilePicUrl = uploadResponse.data.url; // Extract the uploaded image URL
  
      // Update the teacher's profile picture with the new URL
      const response = await axios.post("http://localhost:5000/teacher/editProfilePicture", {
        link: profilePicUrl,
        teacherId: localStorage.getItem("teacherId"),
      });


  
      // Update state with the new profile picture
      setProfileData((prevData) => ({
        ...prevData,
        photo: profilePicUrl, // Set the new profile picture URL
      }));
  
      // Show success alert
      setAlertIsOpen(true);
      setAlertMessage(response.data.message);
    } catch (err) {
      // Handle error
      setIsError(true);
      setAlertIsOpen(true);
      setAlertMessage("Failed to update profile picture. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalCropIsOpen}
        onRequestClose={() => {
          setModalCropIsOpen(false);
        }}
        contentLabel="Cropper"
        className="profile-cropper-modal"
        overlayClassName="profile-overlay"
      >
        <Cropper
          className="profile-cropper"
          image={profileData.photo}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        <center>
          <div className="profile-crop-button-container">
            <button className="profile-button-crop" onClick={saveCroppedImage}>
              Crop
            </button>
            <button className="profile-button-cancel" onClick={() => setModalCropIsOpen(false)}>
              Cancel
            </button>
          </div>
          <div className="profile-cropper-note">Note: On pressing Cancel, Image will not be cropped but is saved!!!</div>
        </center>
      </Modal>
      <Navbar />
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={profileData.photo}
            alt="Profile"
            className="profile-image"
          />
          <label htmlFor="file-input" className="profile-plus-icon">
            <FaPlus />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-details">
          {
            submitDisplay && <button className="profile-image-submit" onClick={editProfilePicture}>Submit Profile Picture</button>
          }
          <div className="profile-name">{profileData.name}</div>
          <p className="profile-email">Email: {profileData.email}</p>
          <p className="profile-mob">Mobile: {profileData.mobile_no}</p>
        </div>
        <button className="profile-edit-button" onClick={openModal}>
          Edit Profile
        </button>
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
              onChange={(e) =>
                setNewProfileData({ ...newProfileData, name: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newProfileData.email}
              disabled
              onChange={(e) =>
                setNewProfileData({ ...newProfileData, email: e.target.value })
              }
            />
          </label>
          <label>
            Mobile:
            <input
              type="text"
              value={newProfileData.mobile_no}
              onChange={(e) =>
                setNewProfileData({
                  ...newProfileData,
                  mobile_no: e.target.value,
                })
              }
            />
          </label>

          <button
            type="button"
            className="profile-edit-password-button"
            onClick={() => setEditPassword(!editPassword)}
          >
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
                      if (e.target.value == newProfileData.confirmPassword) {
                        setPasswordMatch(true);
                      } else {
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
                      if (newProfileData.password == e.target.value) {
                        setPasswordMatch(true);
                      } else {
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
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
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
