import React from "react";
import PropTypes from "prop-types";
import "../Test/Test.css";
import { IoCheckmarkDone } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

const Test = ({ output }) => {
  const stdout = output?.stdout || "";
  const stderr = output?.stderr || "";

  // Helper function to wrap content in Markdown code blocks
  const wrapInCodeBlock = (text) => {
    return `\`\`\`\n${text}\n\`\`\``; // Markdown code block syntax
  };

  return (
    <div className="compiler-test">
      <div className="test-header">
        <IoCheckmarkDone />
        Test Output
      </div>
      <div className="test-output">
        {/* Render stdout */}
        {stdout && (
          <ReactMarkdown
            className="stdout-output"
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
          >
            {wrapInCodeBlock(stdout)}
          </ReactMarkdown>
        )}
        {/* Render stderr */}
        {stderr && (
          <ReactMarkdown
            className="stderr-output"
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
          >
            {wrapInCodeBlock(stderr)}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

Test.propTypes = {
  output: PropTypes.shape({
    stdout: PropTypes.string,
    stderr: PropTypes.string,
  }).isRequired,
};

export default Test;
