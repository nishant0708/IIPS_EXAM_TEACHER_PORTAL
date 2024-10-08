import React from "react";
import PropTypes from "prop-types";
import "../Test/Test.css";
import { IoCheckmarkDone } from "react-icons/io5";

const CompletedTest = ({ output }) => {
    return (
        <div className="compiler-test">
            <div className="test-header">
                <IoCheckmarkDone />
                Test Output
            </div>
            <div className="test-output">
              {output}
            </div>
        </div>
    );
};

// Define prop types for the Test component
CompletedTest.propTypes = {
    output: PropTypes.string.isRequired,  // Ensure 'output' is a required string
};

export default CompletedTest;
