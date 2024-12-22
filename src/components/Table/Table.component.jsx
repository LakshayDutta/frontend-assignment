import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./Table.styles.css";
import { useEffect } from "react";

const recordsPerPage = 5;
const dynamicButtons = 2;

export const Table = ({ columns, data }) => {
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [controlMeta, setControlMeta] = useState("");

  /**
   * Logic used to update table controls and generating dynamic buttons based on what
   * page the user is.
   */
  const tableControl = useRef(null);
  const nextButton = useRef(null);
  const previousButton = useRef(null);
  const previousButtons = useRef(null);
  const nextButtons = useRef(null);

  const updateTable = () => {
    const lowerIndex = (currentPage - 1) * recordsPerPage;
    const upperIndex = lowerIndex + recordsPerPage;

    setRecords(data.slice(lowerIndex, upperIndex));
    setControlMeta(
      `On page ${currentPage}, showing records ${lowerIndex + 1}-${Math.min(
        upperIndex,
        totalRecords
      )} of ${totalRecords}`
    );

    // logic for disabling the next button if we are at the end of the pagination.
    if (upperIndex >= totalRecords) {
      nextButton.current.setAttribute("disabled", true);
    } else {
      nextButton.current.removeAttribute("disabled");
    }

    // logic for disabling the previous button if we are at the start of the pagination.
    if (lowerIndex <= 0) {
      previousButton.current.setAttribute("disabled", true);
    } else {
      previousButton.current.removeAttribute("disabled");
    }

    // dynamically generates "previous" buttons
    let previousButtonsInnerHTML = "";
    Array.from(new Array(Math.min(currentPage - 1, dynamicButtons))).forEach(
      (_, i) => {
        const buttonPage = currentPage - 1 - i;
        previousButtonsInnerHTML =
          `
          <button id="button-to-${buttonPage}" title="page ${buttonPage}">${buttonPage}</button>
        ` + previousButtonsInnerHTML;
      }
    );
    previousButtons.current.innerHTML = previousButtonsInnerHTML;

    // dynamically generates "next" buttons
    let nextButtonsInnerHTML = "";
    Array.from(
      new Array(Math.min(totalPages - currentPage, dynamicButtons))
    ).forEach((_, i) => {
      const buttonPage = currentPage + 1 + i;
      nextButtonsInnerHTML += `
          <button id="button-to-${buttonPage}" title="page ${buttonPage}">${buttonPage}</button>
        `;
    });
    nextButtons.current.innerHTML = nextButtonsInnerHTML;
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.id.includes("button-to")) {
        switch (e.target.id) {
          case "button-to-previous": {
            setCurrentPage((prev) => prev - 1);
            break;
          }
          case "button-to-next": {
            setCurrentPage((prev) => prev + 1);
            break;
          }
          default: {
            const page = Number(e.target.id.split("-").pop());
            setCurrentPage(page);
          }
        }
      }
    };
    if (tableControl.current) {
      tableControl.current.addEventListener("click", handleClick);
    }

    return () => tableControl.current.removeEventListener("click", handleClick);
  }, []);

  // single point of state updation
  useEffect(() => {
    updateTable();
  }, [currentPage]);

  return (
    <div className="table">
      <div className="table__header">
        <div className="table__row">
          {columns.map((column) => (
            <div className="table__cell" key={column}>
              {column}
            </div>
          ))}
        </div>
      </div>
      <div className="table__body">
        {records.map((row, index) => (
          <div className="table__row" key={index}>
            {columns.map((column) => (
              <div className="table__cell" key={column}>
                {row[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="table__footer" ref={tableControl}>
        <div className="table__footer-previous-buttons">
          <button id="button-to-previous" ref={previousButton} title="previous">
            &lt;
          </button>
          <div id="previousButtons" ref={previousButtons}></div>
        </div>

        <span className="table__footer-meta">{controlMeta}</span>

        <div className="table__footer-next-buttons">
          <div id="nextButtons" ref={nextButtons}></div>
          <button id="button-to-next" ref={nextButton} title="next">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
