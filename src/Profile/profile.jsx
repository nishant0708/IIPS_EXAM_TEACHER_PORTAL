import React, { useState } from 'react';
import './profile.css'; // Ensure the CSS file is created for styling
import Navbar from '../Navbar/Navbar';
import { FaPlus } from 'react-icons/fa'; // Importing the plus icon
import Modal from 'react-modal'; // Importing react-modal

import defaultPhoto from "../Assets/profile_photo.png"; // Corrected import statement

Modal.setAppElement('#root'); // Set the root element for accessibility

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo: defaultPhoto,
    name: "Niko",
    email: "niko@gmail.com",
    mobile_no: "1234567890",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProfileData, setNewProfileData] = useState(profileData);

  const openModal = () => {
    setNewProfileData(profileData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = () => {
    setProfileData(newProfileData);
    setModalIsOpen(false);
    alert("Profile updated successfully!");
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
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileData.photo} alt="Profile" className="profile-image" />
          <label htmlFor="file-input" className="plus-icon">
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
        <button className="edit-button" onClick={openModal}>Edit Profile</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Profile</h2>
        <form className="modal-form">
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
          <label>
            password:
            <input
              type="email"
              value={newProfileData.email}
              onChange={(e) => setNewProfileData({ ...newProfileData, email: e.target.value })}
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Profile;