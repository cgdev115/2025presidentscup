import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Odds data (same as before)
const oddsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233", PreTournamentOddsToAdvancePercent: "70%", PreTournamentOddsToBeWildcard1: "+567", PreTournamentOddsToBeWildcard1Percent: "15%", CurrentOddsToAdvance: "-9900", CurrentOddsToAdvancePercent: "99%", CurrentOddsToBeWildcard1: "-1150", CurrentOddsToBeWildcard1Percent: "92%", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "WC1" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900", PreTournamentOddsToAdvancePercent: "90%", PreTournamentOddsToBeWildcard1: "+122", PreTournamentOddsToBeWildcard1Percent: "45%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", CurrentOddsToBeWildcard1: "+1900", CurrentOddsToBeWildcard1Percent: "5%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "WC2" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "-150", CurrentOddsToAdvancePercent: "60%", CurrentOddsToBeWildcard1: "+4900", CurrentOddsToBeWildcard1Percent: "2%", ChanceToWinSemifinalAndAdvanceToState: "21%", SemifinalPosition: "WC3" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "-3233", PreTournamentOddsToAdvancePercent: "97%", PreTournamentOddsToBeWildcard1: "+270", PreTournamentOddsToBeWildcard1Percent: "27%", CurrentOddsToAdvance: "+150", CurrentOddsToAdvancePercent: "40%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "18%", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567", PreTournamentOddsToAdvancePercent: "85%", PreTournamentOddsToBeWildcard1: "+233", PreTournamentOddsToBeWildcard1Percent: "30%", CurrentOddsToAdvance: "+400", CurrentOddsToAdvancePercent: "20%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "9%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "+1900", PreTournamentOddsToBeWildcard1Percent: "5%", CurrentOddsToAdvance: "+1900", CurrentOddsToAdvancePercent: "5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", PreTournamentOddsToBeWildcard1: "+3900", PreTournamentOddsToBeWildcard1Percent: "2.5%", CurrentOddsToAdvance: "+9900", CurrentOddsToAdvancePercent: "1%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.15%", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900", PreTournamentOddsToAdvancePercent: "10%", PreTournamentOddsToBeWildcard1: "+3900", PreTournamentOddsToBeWildcard1Percent: "2.5%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.05%", SemifinalPosition: "" },
];

// Projected points data (sorted by projected points)
const pointsData = [
  { Team: "HTX West 14G Gold (Bracket C)", ProjectedPoints: "8.25" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", ProjectedPoints: "6.5" },
  { Team: "HTX City 15 W (Bracket B)", ProjectedPoints: "5.65" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", ProjectedPoints: "5.3" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", ProjectedPoints: "4.7" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", ProjectedPoints: "3.75" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", ProjectedPoints: "2.4" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", ProjectedPoints: "1.25" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", ProjectedPoints: "0.85" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", ProjectedPoints: "0.7" },
];

// Columns for odds table
const oddsColumns = [
  { Header: 'Team', accessor: 'Team' },
  { Header: 'Pre-Tournament Odds to Advance (American)', accessor: 'PreTournamentOddsToAdvance' },
  { Header: 'Pre-Tournament Odds to Advance (%)', accessor: 'PreTournamentOddsToAdvancePercent' },
  { Header: 'Pre-Tournament Odds to Be Wildcard 1 (American)', accessor: 'PreTournamentOddsToBeWildcard1' },
  { Header: 'Pre-Tournament Odds to Be Wildcard 1 (%)', accessor: 'PreTournamentOddsToBeWildcard1Percent' },
  { Header: 'Current Odds to Advance (American)', accessor: 'CurrentOddsToAdvance' },
  { Header: 'Current Odds to Advance (%)', accessor: 'CurrentOddsToAdvancePercent' },
  { Header: 'Current Odds to Be Wildcard 1 (American)', accessor: 'CurrentOddsToBeWildcard1' },
  { Header: 'Current Odds to Be Wildcard 1 (%)', accessor: 'CurrentOddsToBeWildcard1Percent' },
  { Header: 'Chance to Win Semifinal and Advance to State (%)', accessor: 'ChanceToWinSemifinalAndAdvanceToState' },
  { Header: 'Semifinal Position', accessor: 'SemifinalPosition' },
];

// Columns for projected points table
const pointsColumns = [
  { Header: 'Team', accessor: 'Team' },
  { Header: 'Projected Points', accessor: 'ProjectedPoints' },
];

function App() {
  const [selectedRow, setSelectedRow] = useState(null);

  // Odds table instance
  const oddsTableInstance = useTable(
    {
      columns: oddsColumns,
      data: oddsData,
    },
    useSortBy
  );

  const {
    getTableProps: getOddsTableProps,
    getTableBodyProps: getOddsTableBodyProps,
    headerGroups: oddsHeaderGroups,
    rows: oddsRows,
    prepareRow: prepareOddsRow,
  } = oddsTableInstance;

  // Points table instance
  const pointsTableInstance = useTable(
    {
      columns: pointsColumns,
      data: pointsData,
    },
    useSortBy
  );

  const {
    getTableProps: getPointsTableProps,
    getTableBodyProps: getPointsTableBodyProps,
    headerGroups: pointsHeaderGroups,
    rows: pointsRows,
    prepareRow: preparePointsRow,
  } = pointsTableInstance;

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId === selectedRow ? null : rowId); // Toggle selection
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">2025 President's Cup Tournament Odds</h1>

      {/* Odds Table */}
      <h2 className="text-center mb-3">Tournament Odds</h2>
      <div className="table-responsive">
        <table {...getOddsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {oddsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getOddsTableBodyProps()}>
            {oddsRows.map(row => {
              prepareOddsRow(row);
              const isSelected = row.id === selectedRow;
              return (
                <tr
                  {...row.getRowProps()}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => handleRowClick(row.id)}
                  onTouchEnd={() => handleRowClick(row.id)}
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={isSelected ? 'selected-cell' : ''}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Projected Points Table */}
      <h2 className="text-center mb-3 mt-5">Projected Points</h2>
      <div className="table-responsive">
        <table {...getPointsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {pointsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getPointsTableBodyProps()}>
            {pointsRows.map(row => {
              preparePointsRow(row);
              const isSelected = row.id === selectedRow;
              return (
                <tr
                  {...row.getRowProps()}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => handleRowClick(row.id)}
                  onTouchEnd={() => handleRowClick(row.id)}
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={isSelected ? 'selected-cell' : ''}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
