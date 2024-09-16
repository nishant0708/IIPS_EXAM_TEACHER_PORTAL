import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker'; // Import TimePicker
import './Createpaper.css';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal'; // Import AlertModal
import Loader from '../Loader/Loader';

const Createpaper = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '' });
  const [marks, setMarks] = useState('');
  const [testType, setTestType] = useState('');
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const teacherId = localStorage.getItem("teacherId");
  const [loading,setLoading] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirmIsOpen,setModalConfirmIsOpen] = useState(false);
  const [modalConfirmMessage,setModalConfirmMessage] = useState("");
  const [isError, setIsError] = useState(false); 
  const handleConfirmSubmit=(e)=>
    {
        e.preventDefault();
        setModalConfirmIsOpen(true);
        setModalConfirmMessage('Please make sure Subject Code, Date, Time and Duration are absolutely correct!!!');
    }
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

  const handleSubmit = async () => {
    const minutes = duration.minutes === '' ? 0 : duration.minutes;
    const paperData = {
      className,
      semester,
      subject,
      marks,
      duration: {
        hours: duration.hours,
        minutes: minutes,
      },
      subjectCode,
      time, 
      date,
      testType,
      teacherId,
    };

    try {
      const response = await axios.post('http://localhost:5000/paper/create', paperData);
      console.log('Paper created successfully:', response.data);

      setModalMessage('Paper created successfully!');
      setIsError(false); 
      setModalIsOpen(true); 

      const { paperId } = response.data;
      
      // Navigate to the QuestionPaperDashboard with the created paper's ID
      navigate(`/questionPaperDashboard/${paperId}`);
    } catch (error) {
      console.error('Error creating paper:', error);

      setModalMessage('Failed to create paper. Please try again.');
      setIsError(true); 
      setModalIsOpen(true); 
    }
  };

  return (<>
    <Navbar />
    <div className='create_paper_container_main'>
      {loading ? (<Loader />): (<>
        <div className="create_paper_container">
        <form className="create_paper_form" onSubmit={handleConfirmSubmit}>
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

          <button type="submit" className="create_paper_submit_btn">SUBMIT</button>
        </form>
      </div>
      </>)}
      
      {/* Alert Modal */}
      <AlertModal 
        isOpen={modalIsOpen} 
        onClose={() => setModalIsOpen(false)} 
        message={modalMessage} 
        iserror={isError}
      />
      <AlertModal
      isOpen={modalConfirmIsOpen}
      onClose={()=>{setModalConfirmIsOpen(false)}}
      message={modalConfirmMessage}
      iserror={false}
      isConfirm={true}
      onConfirm={handleSubmit}/>
    </div>
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

export default Createpaper;
