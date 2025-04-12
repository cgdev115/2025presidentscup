import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Updated data with separate columns for odds and percentages
const data = [
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "-3233", PreTournamentOddsToAdvancePercent: "97%", PreTournamentOddsToBeWildcard1: "+270", PreTournamentOddsToBeWildcard1Percent: "27%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233", PreTournamentOddsToAdvancePercent: "70%", PreTournamentOddsToBeWildcard1: "+567", PreTournamentOddsToBeWildcard1Percent: "15%", CurrentOddsToAdvance: "-9900", CurrentOddsToAdvancePercent: "99%", CurrentOddsToBeWildcard1: "-1150", CurrentOddsToBeWildcard1Percent: "92%", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "WC1" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900", PreTournamentOddsToAdvancePercent: "90%", PreTournamentOddsToBeWildcard1: "+122", PreTournamentOddsToBeWildcard1Percent: "45%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", CurrentOddsToBeWildcard1: "+1900", CurrentOddsToBeWildcard1Percent: "5%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "WC2" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "-150", CurrentOddsToAdvancePercent: "60%", CurrentOddsToBeWildcard1: "+4900", CurrentOddsToBeWildcard1Percent: "2%", ChanceToWinSemifinalAndAdvanceToState: "21%", SemifinalPosition: "WC3" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567", PreTournamentOddsToAdvancePercent: "85%", PreTournamentOddsToBeWildcard1: "+233", PreTournamentOddsToBeWildcard1Percent: "30%", CurrentOddsToAdvance: "+150", CurrentOddsToAdvancePercent: "40%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "22%", SemifinalPosition: "" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "+400", CurrentOddsToAdvancePercent: "20%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "8%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", PreTournamentOddsToBeWildcard1: "+1900", PreTournamentOddsToBeWildcard1Percent: "5%", CurrentOddsToAdvance: "+1900", CurrentOddsToAdvancePercent: "5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", PreTournamentOddsToBeWildcard1: "+3900", PreTournamentOddsToBeWildcard1Percent: "2.5%", CurrentOddsToAdvance: "+9900", CurrentOddsToAdvancePercent: "1%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.15%", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900", PreTournamentOddsToAdvancePercent: "10%", PreTournamentOddsToBeWildcard1: "+3900", PreTournamentOddsToBeWildcard1Percent: "2.5%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", PreTournamentOddsToBeWildcard1: "0%", PreTournamentOddsToBeWildcard1Percent: "0%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", CurrentOddsToBeWildcard1: "0%", CurrentOddsToBeWildcard1Percent: "0%", ChanceToWinSemifinalAndAdvanceToState: "0.05%", SemifinalPosition: "" },
];

// Define columns with separate odds and percent columns
const columns = [
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

function App() {
  const [selectedRow, setSelectedRow] = useState(null);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId === selectedRow ? null : rowId); // Toggle selection
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">2025 President's Cup Tournament Odds</h1>
      <div className="table-responsive">
        <table {...getTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {headerGroups.map(headerGroup => (
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
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              const isSelected = row.id === selectedRow;
              return (
                <tr
                  {...row.getRowProps()}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => handleRowClick(row.id)} // For desktop click
                  onTouchEnd={() => handleRowClick(row.id)} // For mobile touch
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
