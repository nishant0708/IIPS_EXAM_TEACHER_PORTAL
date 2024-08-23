import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Create_paper.css';

const CreatePaper = () => {
  const [dateOfExamination, setDateOfExamination] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  const handleMarksChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      e.target.value = value;
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className="create-paper-container">
      <Form className='create-paper-form'>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="class">
              <Form.Label>Class:</Form.Label>
              <Form.Control as="select">
                <option value="Mtech">Mtech</option>
                <option value="MCA">MCA</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="semester">
              <Form.Label>Semester:</Form.Label>
              <Form.Control as="select">
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
                <option value="IX">IX</option>
                <option value="X">X</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="subject" className="mb-3">
          <Form.Label>Subject:</Form.Label>
          <Form.Control type="text" placeholder="Enter subject" />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="marks">
              <Form.Label>Marks:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter marks"
                onInput={handleMarksChange}
              />
            </Form.Group>
          </Col>
          <Col>
          
        <Form.Group controlId="dateOfExamination" className="mb-3">
          <Form.Label>Date of Examination:</Form.Label>
          <Form.Control
            type="date"
            value={dateOfExamination}
            onChange={(e) => setDateOfExamination(e.target.value)}
            className="form-control"
          />
        </Form.Group>
           
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="subjectCode">
              <Form.Label>Subject Code:</Form.Label>
              <Form.Control type="text" placeholder="Enter subject code" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="time">
              <Form.Label>Time:</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-control"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="duration">
              <Form.Label>Duration:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter duration (e.g., 1 hr, 1.15 hrs, 30 mins)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Form.Group>

        <Button variant="dark" type="submit" className="w-100">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreatePaper;
