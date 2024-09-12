// to use this modal you have to call function like this : 

// <AlertModal 
// isOpen={modalIsOpen} 
// onClose={() => setModalIsOpen(false)} 
// message="Your account has been created successfully." 
// iserror={true} if there is an error then iserror will be true else false
// />


import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './AlertModal.css'; 
import cross from "../Assets/cross-mark.svg";
import tick from "../Assets/accept-check-good-mark-ok-tick.svg";
import warning from "../Assets/icons8-warning-48.png";
import { FaRegThumbsUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const AlertModal = ({ isOpen, onClose, onConfirm, message, iserror, isConfirm }) => {
  var image = iserror ? cross : tick;

  const handleClose = (e) => {
    e.stopPropagation();
    if (onConfirm) {
      onConfirm(); // Trigger the callback for  any action
    }
    onClose(); // Always close the modal
  };

  const handleConfirmClose=(e)=>
  {
      e.stopPropagation();
      onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Success Modal"
      className="alert_modal"
      overlayClassName="alert_overlay"
    >
      <div className="alert_modal-content">
        {isConfirm ? (<img src={warning} alt='Warning' className='alert_success-icon'/>) : (
            <img 
            src={image}
            alt="Success" 
            className="alert_success-icon"
          />
        )}

        <h2>{isConfirm ? "Warning" : iserror ? "Failed" : "Success"}</h2>
        <p>{message}</p>
        {isConfirm ? (
            <>
              <div className='alert_display-flex'>
                <div>
                  <button onClick={handleClose} className='alert_confirm-button'>
                    <FaRegThumbsUp />
                    <div>Okay</div>
                    </button>
                </div>
                <button onClick={handleConfirmClose} className='alert_confirm-button'>
                  <IoMdClose />
                  <div>Close</div>
                  </button>
              </div>
            </>
        ) : (<button onClick={handleClose} className="alert_close-button">
          Close
        </button>)}
      </div>
    </Modal>
  );
};

// Define prop types
AlertModal.propTypes = {
  isAlert: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,  // isOpen should be a boolean
  onClose: PropTypes.func.isRequired, // onClose should be a function
  message: PropTypes.string.isRequired, // message should be a string
  iserror: PropTypes.bool.isRequired,  // iserror should be a boolean
  onConfirm: PropTypes.func, // onConfirm is optional and should be a function
  isConfirm: PropTypes.bool,
};

// Set default prop for optional onConfirm
AlertModal.defaultProps = {
  onConfirm: null,
  isConfirm: false,
};

export default AlertModal;
