import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker'; // Import TimePicker
import '../Create_paper/Createpaper.css'; // Ensure the same styles as Createpaper are applied
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; // Import AlertModal
import Loader from '../Loader/Loader';

const Editpaper = () => {
  const location = useLocation();  // Taking Current Values
  const current_values = location.state;
  
  const [date, setDate] = useState(new Date(current_values.date));  // Ensure date is in Date format
  const [time, setTime] = useState(current_values.time);
  const [loading,setLoading] = useState(true);
  const [duration, setDuration] = useState({ hours: current_values.duration.hours, minutes: current_values.duration.minutes });
  const [marks, setMarks] = useState(current_values.marks);
  const [testType, setTestType] = useState(current_values.testType);
  const [className, setClassName] = useState(current_values.className);
  const [semester, setSemester] = useState(current_values.semester);
  const [subject, setSubject] = useState(current_values.subject);
  const [subjectCode, setSubjectCode] = useState(current_values.subjectCode);
  const teacherId = localStorage.getItem("teacherId");

  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate();

  useEffect(()=>
  {
    setTimeout(()=>{setLoading(false)},1000);
  },[]);

  const handleDurationChange = (field, value) => {
    if (value >= 0) {
      setDuration({ ...duration, [field]: value });
    }
  };

  const handleMarksChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMarks(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paperData = {
      _id: current_values._id,
      className,
      semester,
      subject,
      marks,
      duration: {
        hours: duration.hours,
        minutes: duration.minutes,
      },
      subjectCode,
      time,
      date,
      testType,
      teacherId,
    };

    try {
      await axios.post('http://localhost:5000/paper/edit-paper', paperData);

      setModalMessage('Paper edited successfully!');
      setIsError(false); 
      setModalIsOpen(true); 

      // Navigate to the TeacherDashboard after successful edit
      navigate(`/teacherDashboard`);
    } catch (error) {
      console.error('Error editing paper:', error);

      setModalMessage('Failed to edit paper. Please try again.');
      setIsError(true); 
      setModalIsOpen(true); 
    }
  };

  return (
    <>
      <Navbar />
      <div className="create_paper_container">
        {loading ? (<Loader />) : (<>
          <form className="create_paper_form" onSubmit={handleSubmit}>
          <div className='create_paper_row'>
            <FormGroup label="Class:" className="create_paper_class">
              <select className="create_paper_input" value={className} onChange={(e) => setClassName(e.target.value)}>
                <option value="">Select Class</option>
                <option value="MTECH">Mtech</option>
                <option value="MCA">Mca</option>
              </select>
            </FormGroup>

            <FormGroup label="Semester:" className="create_paper_semester">
              <select className="create_paper_input" value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1}th Sem`}>{`${i + 1}th Sem`}</option>
                ))}
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Subject:" className="create_paper_subject">
            <input
              type="text"
              className="create_paper_input"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </FormGroup>

          <div className='create_paper_row'>
            <FormGroup label="Marks:" className="create_paper_marks">
              <input
                type="tel"
                className="create_paper_input"
                placeholder="Marks"
                value={marks}
                onChange={handleMarksChange}
              />
            </FormGroup>

            <FormGroup label="Duration:" className="create_paper_duration">
              <div className="create_paper_duration_inputs">
                <input
                  type="number"
                  placeholder="Hours"
                  className="create_paper_input create_paper_duration_hours"
                  value={duration.hours}
                  onChange={(e) => handleDurationChange('hours', e.target.value)}
                />
                :
                <input
                  type="number"
                  placeholder="Minutes"
                  className="create_paper_input create_paper_duration_minutes"
                  value={duration.minutes}
                  onChange={(e) => handleDurationChange('minutes', e.target.value)}
                />
              </div>
            </FormGroup>
          </div>

          <div className='create_paper_row'>
            <FormGroup label="Subject Code:" className="create_paper_subject_code">
              <input
                type="text"
                className="create_paper_input"
                placeholder="Subject Code"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Time: (12 hrs format)" className="create_paper_time">
              <TimePicker
                onChange={setTime}
                value={time}
                format="h:mm a" // 12-hour format with AM/PM
                className="create_paper_input"
              />
            </FormGroup>
          </div>

          <div className='create_paper_row'>
            <FormGroup label="Date of Examination:" className="create_paper_date">
              <ReactDatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                className="create_paper_input"
                placeholderText="DD / MM / YYYY"
              />
            </FormGroup>

            <FormGroup label="Test Type:" className="create_paper_test_type">
              <select className="create_paper_input" value={testType} onChange={(e) => setTestType(e.target.value)}>
                <option value="">Select Test Type</option>
                <option value="Internal 1">Internal 1</option>
                <option value="Internal 2">Internal 2</option>
                <option value="Internal 3">Internal 3</option>
                <option value="Endsem">Endsem</option>
              </select>
            </FormGroup>
          </div>

          <button type="submit" className="create_paper_submit_btn">EDIT</button>
        </form>
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

const FormGroup = ({ label, children, className }) => {
  return (
    <div className={`create_paper_group ${className}`}>
      <label className="create_paper_label">{label}</label>
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Editpaper;
