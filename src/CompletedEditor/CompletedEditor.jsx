import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../Editor/Editor.css";
import { Editor as Ed } from "@monaco-editor/react";
import { FaPlay, FaHistory } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CompletedEditor = ({ question, onOutput, studentId }) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [runList, setRunList] = useState([]);
  // const studentId = localStorage.getItem("studentId") || "";
  const paperId = localStorage.getItem("paperId") || "";
  const responseUrl = "iipsonlineexambackend-production.up.railway.app/student/getResponse";

  useEffect(() => {
    console.log("Student ID:", studentId);
    console.log("Paper ID:", paperId);
    if (response && response.questions) {
      const currentQuestion = response.questions.find(
        (q) => q.questionId === question._id
      );
      if (currentQuestion) {
        setUserCode(currentQuestion.finalCode || "");

        // Set runList with sorted runHistory
        const sortedRunHistory = currentQuestion.runHistory.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setRunList(sortedRunHistory);

        // Check if the finalCode exists in runHistory
        const matchingRun = sortedRunHistory.find(
          (run) => run.code === currentQuestion.finalCode
        );
        if (matchingRun) {
          setInput(matchingRun.input || "");
          setUserOutput(
            matchingRun.output.stdout || matchingRun.output.stderr || ""
          );
        } else if (sortedRunHistory.length > 0) {
          // Use the last entry in runHistory
          const lastRun = sortedRunHistory[sortedRunHistory.length - 1];
          setInput(lastRun.input || "");
          setUserOutput(
            lastRun.output.stdout || lastRun.output.stderr || ""
          );
        }
      }
    }
  }, [response, question]);

  useEffect(() => {
    if (paperId && studentId && question?._id) {
      axios
        .post(responseUrl, { paperId, studentId })
        .then((res) => {
          setResponse(res.data.response);
        })
        .catch((err) => {
          console.error("Error fetching response:", err);
        });
    }
  }, [paperId, studentId, question]);

  const handleEditorChange = (newValue) => {
    setUserCode(newValue);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
  };

  const handleRunClick = async () => {
    const code = editorRef.current.getValue();
    setUserCode(code);

    const needsInputModal = (code) => {
      switch (question?.compilerReq) {
        case "cpp":
        case "c":
          return (
            code.includes("cin") ||
            code.includes("scanf") ||
            code.includes("getline") ||
            code.includes("gets") ||
            code.includes("fgets") ||
            code.includes("getchar") ||
            code.includes("cin.get") ||
            code.includes("cin.getline")
          );
        case "java":
          return (
            (code.includes("Scanner") && code.includes("next")) ||
            (code.includes("BufferedReader") && code.includes("readLine")) ||
            code.includes("InputStreamReader") ||
            (code.includes("Console") && code.includes("readLine")) ||
            code.includes("DataInputStream")
          );
        case "python":
          return (
            code.includes("input") ||
            code.includes("sys.stdin.read") ||
            code.includes("sys.stdin.readline") ||
            code.includes("fileinput.input")
          );
        default:
          return false;
      }
    };

    if (needsInputModal(code)) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`iipsonlineexambackend-production.up.railway.app/student/compile`, {
        code: code,
        language: question?.compilerReq,
        input: input || "",
      });

      const output = {
        stdout: res.data.stdout || "",
        stderr: res.data.stderr || "",
      };
      setUserOutput(output);
      onOutput(output);
    } catch (err) {
      const errorOutput =
        "Error: " + (err.response ? err.response.data.error : err.message);
      setUserOutput(errorOutput);
      onOutput(errorOutput);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async (inputValue) => {
    setLoading(true);
    try {
      const res = await axios.post(`iipsonlineexambackend-production.up.railway.app/student/compile`, {
        code: userCode,
        language: question?.compilerReq,
        input: inputValue || "",
      });

      const output = {
        stdout: res.data.stdout || "",
        stderr: res.data.stderr || "",
      };
      setUserOutput(output);
      onOutput(output);
    } catch (err) {
      const errorOutput =
        "Error: " + (err.response ? err.response.data.error : err.message);
      setUserOutput(errorOutput);
      onOutput(errorOutput);
      console.log(userOutput);
    } finally {
      setLoading(false);
    }
  };

  const handleInputSubmit = () => {
    setIsModalOpen(false);
    executeCode(input);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle run selection from dropdown
  const handleRunSelect = (run, type = "run") => {
    if (type === "run") {
      setUserCode(run.code);
      setInput(run.input || "");
      setUserOutput(run.output.stdout || run.output.stderr || "");
      onOutput(run.output);
    } else if (type === "final") {
      const finalRun = response.questions.find(
        (q) => q.questionId === question._id
      );
      if (finalRun) {
        setUserCode(finalRun.finalCode || "");
        // Find corresponding run history if any
        const matchingRun = runList.find(
          (run) => run.code === finalRun.finalCode
        );
        if (matchingRun) {
          setInput(matchingRun.input || "");
          setUserOutput(
            matchingRun.output.stdout || matchingRun.output.stderr || ""
          );
        } else {
          setInput("");
          setUserOutput("");
        }
        onOutput({
          stdout: matchingRun?.output.stdout || "",
          stderr: matchingRun?.output.stderr || "",
        });
      }
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="compiler-editor">
      <div className="editor-header">
        <div className="editor-run-history">
          <div className="editor-run-history" onClick={toggleDropdown}>
            <FaHistory style={{ cursor: "pointer", marginRight: "5px" }} />
            <div>{runList.length} Run History</div>
          </div>
          {isDropdownOpen && (
            <div className="run-history-dropdown">
              {/* Final Code Option */}
              <div
                className="run-history-item final-code-item"
                onClick={() => handleRunSelect(null, "final")}
              >
                <strong>Final Code</strong>
              </div>
              {/* Divider */}
              {runList.length > 0 && <hr className="dropdown-divider" />}
              {/* Run History Entries */}
              {runList.length > 0 ? (
                runList.map((run, index) => (
                  <div
                    key={run._id}
                    className="run-history-item"
                    onClick={() => handleRunSelect(run, "run")}
                  >
                    Run {index + 1}
                    
                  </div>
                ))
              ) : (
                <div className="run-history-item">No run history available.</div>
              )}
            </div>
          )}
        </div>

        <div className="editor-run" onClick={handleRunClick}>
          <FaPlay size={15} />
          <div>{loading ? "Running..." : "Run"}</div>
        </div>
      </div>
      <div className="editor-editor" ref={editorContainerRef}>
        <Ed
          theme="vs-dark"
          defaultLanguage={question?.compilerReq}
          value={userCode || ""}
          className="editor-monaco"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{ readOnly: true }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Input Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Input Required</h2>
          <label>Enter Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
          />
          <button onClick={handleInputSubmit}>Submit</button>
        </div>
      </Modal>
    </div>
  );
};

CompletedEditor.propTypes = {
  question: PropTypes.shape({
    compilerReq: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }),
  onOutput: PropTypes.func.isRequired,
  studentId: PropTypes.string.isRequired,
};

export default CompletedEditor;
