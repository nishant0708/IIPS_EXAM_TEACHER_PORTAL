import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx"; // Import xlsx for Excel export
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import "../papers/papers.css";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import image from "../Assets/profile_photo.png";
import { PiExport } from "react-icons/pi";

const CompletedPaperStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false); // Loading state for sending emails
  const { paperId } = useParams();
  const [evaluationStatus, setEvaluationStatus] = useState({});
  const [completedStudentIds, setCompletedStudentIds] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [paperDetailing,setpaperDetails]=useState();

  useEffect(() => {
    axios
      .post("iipsonlineexambackend-production.up.railway.app/student/getStudentByPaperId", { paperId })
      .then((res) => {
        const sortedStudents = res.data.students.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );
        setStudents(sortedStudents);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

    axios
      .post("iipsonlineexambackend-production.up.railway.app/student/getFirstCompletedQuestionByPaperId", {
        paperId,
      })
      .then((res) => {
        setQuestionId(res.data.question._id);
      })
      .catch((err) => {
        console.error("Error fetching first question:", err);
      });

    axios
      .post("iipsonlineexambackend-production.up.railway.app/paper/getCompletedPaperByPaperId", {
        paperId,
      })
      .then((res) => {
    setpaperDetails(res.data.paper);
        setCompletedStudentIds(res.data.students);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [paperId]);

  useEffect(() => {
    students.forEach((student) => {
      axios
        .post("iipsonlineexambackend-production.up.railway.app/paper/evaluate_status", {
          studentId: student._id,
          paperId: paperId,
        })
        .then((res) => {
          setEvaluationStatus((prevStatus) => ({
            ...prevStatus,
            [student._id]: {
              status: res.data.status,
              totalMarks: res.data.totalMarks || "N/A",
            },
          }));
        })
        .catch((err) => {
          console.error(`Error fetching evaluation for student ${student._id}:`, err);
        });
    });
  }, [students, paperId]);

  const getAttemptionStatus = (studentId) => {
    return completedStudentIds.includes(studentId) ? "Attempted" : "Not-Attempted";
  };

  // Sort students by attempted status and then alphabetically within each group
  const sortedStudents = students.slice().sort((a, b) => {
    const aStatus = getAttemptionStatus(a._id);
    const bStatus = getAttemptionStatus(b._id);

    if (aStatus === bStatus) return a.fullName.localeCompare(b.fullName);
    return aStatus === "Attempted" ? -1 : 1;
  });

  // Check if all attempted students are evaluated
  const allAttemptedEvaluated = sortedStudents
    .filter((student) => getAttemptionStatus(student._id) === "Attempted")
    .every((student) => evaluationStatus[student._id]?.status === "Evaluated");

  const handleCardClick = (studentId) => {
    if (questionId) {
      const attemptedStudentIds = sortedStudents
        .filter((student) => getAttemptionStatus(student._id) === "Attempted")
        .map((student) => student._id);

      localStorage.setItem("studentId", studentId);
      localStorage.setItem("paperId", paperId);
      localStorage.setItem("studentIds", JSON.stringify(attemptedStudentIds));
      window.location.href = `/Evaluation/${questionId}`;
    } else {
      console.error("Question ID not found.");
    }
  };

  // Function to send results email to students
  const sendMailToStudents = () => {
    setSendingEmails(true); // Start loading state
    axios
      .post("iipsonlineexambackend-production.up.railway.app/paper/sendmailtostudent", {
        paperId,
        students,
        evaluationStatus,
      })
      .then((res) => {
        console.log("Emails sent successfully:", res.data);
      })
      .catch((err) => {
        console.error("Error sending emails:", err);
      })
      .finally(() => {
        setSendingEmails(false); // End loading state
      });
  };

  const exportToExcel = async () => {
    const year = new Date().getFullYear();
    const testType = paperDetailing.testType;
    const subject = paperDetailing.subject;
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");
  
    // Add a blank row to separate from the headers
    worksheet.addRow([]);
  
    // Make the table headers bold
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("B1").font = { bold: true };
    worksheet.getCell("C1").font = { bold: true };
    worksheet.getCell("D1").font = { bold: true };
    worksheet.getCell("E1").font = { bold: true };
  
    // Add column definitions with width and alignment
    worksheet.columns = [
      { header: "Roll Number", key: "RollNumber", width: 15 },
      { header: "Name", key: "Name", width: 30 },
      { header: "Email", key: "Email", width: 45 },
      { header: "Marks Alloted", key: "MarksAlloted", width: 15, style: { alignment: { vertical: 'middle', horizontal: 'center' } } },
      { header: "Maximum Marks", key: "MaximumMarks", width: 15, style: { alignment: { vertical: 'middle', horizontal: 'center' } } },
    ];
  
    // Add data rows starting from row 3
    sortedStudents.forEach((student) => {
      worksheet.addRow({
        RollNumber: student.rollNumber,
        Name: student.fullName,
        Email: student.email,
        MarksAlloted: evaluationStatus[student._id]?.totalMarks || "N/A",
        MaximumMarks: paperDetailing.marks,
      });
    });
  
    // Center align the content of columns D and E
    worksheet.getColumn('D').eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    worksheet.getColumn('E').eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  
    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${testType}-${subject}-${year}.xlsx`);
  };
  

  return (
    <>
      <Navbar />
      <div className="exam-list-container">
        {loading ? (
          <Skeleton exams={students} />
        ) : students.length > 0 ? (
          <>
            <div className="header">
              <h2>Students:</h2>
              {allAttemptedEvaluated && (
                <div className="export_completed_paper_buttons_div">
                  <button className="export_completed_paper_buttons" onClick={exportToExcel}>
                    <PiExport /> Export Excel
                  </button>
                  <button
                    className="export_completed_paper_buttons"
                    onClick={sendMailToStudents}
                    disabled={sendingEmails}
                  >
                    {sendingEmails ? "Sending Emails..." : "Send Result to Students"}
                  </button>
                </div>
              )}
            </div>
            <div className="exam-table">
              {sortedStudents.map((student, index) => {
                const attemption = getAttemptionStatus(student._id);
                const evalInfo = evaluationStatus[student._id] || {};
                const evalStatus = evalInfo.status || "Not Evaluated";

                // Define color based on evaluation status
                const evalColor =
                  evalStatus === "Evaluated"
                    ? "green"
                    : evalStatus === "Evaluation in Progress"
                    ? "yellow"
                    : "red";

                return (
                  <div
                    className="papers_table"
                    key={index}
                    onClick={attemption === "Attempted" ? () => handleCardClick(student._id) : null}
                    style={{
                      cursor: attemption === "Attempted" ? "pointer" : "not-allowed",
                    }}
                  >
                    <div className="table-data completed-student">
                      <div className="evaluation-attemption">
                        <div
                          className={`evaluation ${evalStatus.toLowerCase().replace(/ /g, "-")}`}
                          style={{ color: evalColor }}
                        >
                          <GoDotFill />
                          <div className="completed_student_dashboard_evaluation">
                            {evalStatus}&nbsp;
                            {evalStatus === "Evaluated" && (
                              <>Alloted Marks: {evalInfo.totalMarks}</>
                            )}
                          </div>
                        </div>
                        <div className={`attemption ${attemption}`}>
                          {attemption === "Attempted" ? (
                            <>
                              <FaCheck />
                              <div>Attempted</div>
                            </>
                          ) : (
                            <>
                              <ImCross />
                              <div>Not Attempted</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="student-image-name">
                        <div className="student-image">
                          <img src={image} alt="Image" />
                        </div>
                        <div className="student-name">
                          <div className="classhead">{student.fullName}</div>
                          <div className="classsubhead">{student.rollNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="no-exams">
            <img src={Nothing} alt="No papers to show" />
            <h2>No students to show!</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedPaperStudentDashboard;
