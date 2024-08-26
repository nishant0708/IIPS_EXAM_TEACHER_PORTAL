import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Createpaper.css';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';

const Createpaper = () => {
  const [date, setDate] = useState(null); // Initial date set to null
  const [time, setTime] = useState(''); // Time state set to an empty string
  const [duration, setDuration] = useState({ hours: '', minutes: '' });
  const [marks, setMarks] = useState(''); // State to manage marks input
  const [testType, setTestType] = useState(''); // State to manage test type

  const handleDurationChange = (field, value) => {
    if (value >= 0) {
      setDuration({ ...duration, [field]: value });
    }
  };

  const handleMarksChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
    setMarks(value);
  };

  return (
    <>
    <Navbar/>
    <div className="create_paper_container">
      <form className="create_paper_form">
        <div className='create_paper_row'>
          <FormGroup label="Class:" className="create_paper_class">
            <select className="create_paper_input">
              <option value="">Select Class</option>
              <option value="Mtech">Mtech</option>
              <option value="Mca">Mca</option>
            </select>
          </FormGroup>

          <FormGroup label="Semester:" className="create_paper_semester">
            <select className="create_paper_input">
              <option value="">Select Semester</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={`${i + 1}th Sem`}>{`${i + 1}th Sem`}</option>
              ))}
            </select>
          </FormGroup>
        </div>

        <FormGroup label="Subject:" className="create_paper_subject">
          <input type="text" className="create_paper_input" placeholder="Subject" />
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
            <input type="text" className="create_paper_input" placeholder="Subject Code" />
          </FormGroup>

          <FormGroup label="Time:" className="create_paper_time">
            <input
              type="time"
              className="create_paper_input"
            
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
