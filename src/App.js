body {
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: #343a40;
  font-weight: bold;
  font-size: 1.8rem; /* Smaller font size for mobile */
}

h2 {
  color: #343a40;
  font-weight: bold;
  font-size: 1.5rem;
}

h3.subtitle {
  color: #6c757d; /* Lighter gray color to differentiate from the main title */
  font-weight: normal;
  font-size: 1.2rem; /* Smaller than the main title */
}

.table {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
  table-layout: auto; /* Allow table to adjust column widths */
}

.thead-dark th {
  background-color: #343a40;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  white-space: normal; /* Allow header text to wrap */
  padding: 8px; /* Reduced padding for mobile */
  font-size: 0.9rem; /* Smaller font size for headers */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table td, .table th {
  vertical-align: middle;
  text-align: center;
  padding: 6px; /* Reduced padding for mobile */
  font-size: 0.85rem; /* Smaller font size for cells */
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Ensure long words break */
}

.table th:hover {
  background-color: #495057;
  cursor: pointer;
}

.table-responsive {
  margin-top: 20px;
  overflow-x: auto; /* Ensure horizontal scrolling if needed */
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}

/* Styling for semifinalist rows */
.semifinalist-row {
  font-weight: bold; /* Make text bold for semifinalist rows */
}

/* Styling for sticky Team column */
.sticky-column {
  position: sticky;
  left: 0;
  z-index: 1; /* Ensure it stays above other columns */
  border-right: 2px solid #dee2e6; /* Add a border to separate from other columns */
}

/* Ensure sticky column in header has the dark background */
.thead-dark th.sticky-column {
  background-color: #343a40;
  color: #ffffff;
  z-index: 2; /* Higher z-index for header to stay above body cells */
}

/* Ensure sticky column in table body has a solid white background */
.table tbody td.sticky-column {
  background-color: #ffffff; /* Solid white background to prevent scrolling text from showing through */
  z-index: 1;
}

/* Styling for the header image */
.header-image {
  text-align: center;
  margin-bottom: 20px;
}

.header-image img {
  max-width: 300px; /* Default size for desktop */
  height: auto;
}

/* Styling for the disclaimer footer */
.disclaimer {
  color: #6c757d; /* Lighter gray color for a subtle look */
  font-size: 0.9rem; /* Smaller font size */
  padding: 20px 0; /* Add padding for spacing */
  border-top: 1px solid #dee2e6; /* Add a subtle separator line */
}

/* Ensure sticky behavior and background are enforced on mobile */
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem; /* Even smaller font size for mobile */
  }

  h2 {
    font-size: 1.2rem;
  }

  h3.subtitle {
    font-size: 1rem; /* Smaller subtitle on mobile */
  }

  .table td, .table th {
    font-size: 0.75rem; /* Further reduce font size on mobile */
    padding: 4px; /* Further reduce padding */
  }

  .thead-dark th {
    font-size: 0.8rem;
    padding: 6px;
  }

  .container {
    padding: 10px; /* Reduce padding on mobile */
  }

  /* Ensure table fits within the screen width */
  .table {
    min-width: 100%;
  }

  /* Adjust column widths for better readability */
  .table th, .table td {
    max-width: 150px; /* Limit column width to prevent excessive stretching */
  }

  /* Ensure sticky column works on mobile */
  .sticky-column {
    position: sticky;
    left: 0;
    min-width: 150px; /* Ensure Team column has enough width */
    border-right: 2px solid #dee2e6;
  }

  .thead-dark th.sticky-column {
    background-color: #343a40;
    color: #ffffff;
  }

  .table tbody td.sticky-column {
    background-color: #ffffff; /* Solid white background on mobile */
  }

  /* Adjust header image size for mobile */
  .header-image img {
    max-width: 200px; /* Smaller size for mobile */
  }

  /* Adjust disclaimer font size for mobile */
  .disclaimer {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.2rem;
  }

  h2 {
    font-size: 1rem;
  }

  h3.subtitle {
    font-size: 0.9rem; /* Even smaller subtitle on very small screens */
  }

  .table td, .table th {
    font-size: 0.65rem;
    padding: 3px;
  }

  .thead-dark th {
    font-size: 0.7rem;
    padding: 5px;
  }

  .table th, .table td {
    max-width: 120px; /* Further reduce column width on very small screens */
  }

  .sticky-column {
    min-width: 120px; /* Adjust for smaller screens */
  }

  /* Further adjust header image size for very small screens */
  .header-image img {
    max-width: 150px; /* Even smaller for very small screens */
  }

  /* Further adjust disclaimer font size for very small screens */
  .disclaimer {
    font-size: 0.7rem;
  }
}
