import React from "react";

const HighlightText = ({ text, keyword }) => {
  if (text === null || text === undefined) return null;

  const str = String(text);

  if (!keyword) return <>{str}</>;

  const regex = new RegExp(`(${keyword})`, "gi");

  return (
    <>
      {str.split(regex).map((part, idx) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={idx} className="highlight">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default HighlightText;
