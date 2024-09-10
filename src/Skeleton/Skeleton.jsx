import React from "react";
import PropTypes from "prop-types";
import "./Skeleton.css";
const Skeleton = ({ exams }) => {
  return (
    <>
      {exams.length > 0 ? (
        exams.map((key) => (
          <div className="skeleton-card dashboard-card" key={key}>
            <div className="skeleton skeleton-header"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
};

Skeleton.propTypes = {
  exams: PropTypes.node,
};
export default Skeleton;
