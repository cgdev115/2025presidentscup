import React from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Data from the CSV
const data = [
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "N/A (Bracket A Winner)", PreTournamentOddsToBeWildcard1: "N/A (Bracket A Winner)", CurrentOddsToAdvance: "100% (100%)", CurrentOddsToBeWildcard1: "N/A (Bracket A Winner)", ChanceToWinSemifinalAndAdvanceToState: "65%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233 (70%)", PreTournamentOddsToBeWildcard1: "+567 (15%)", CurrentOddsToAdvance: "-9900 (99%)", CurrentOddsToBeWildcard1: "-1150 (92%)", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "WC1" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900 (90%)", PreTournamentOddsToBeWildcard1: "+122 (45%)", CurrentOddsToAdvance: "-1900 (95%)", CurrentOddsToBeWildcard1: "+1900 (5%)", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "WC2" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300 (25%)", PreTournamentOddsToBeWildcard1: "0% (0%)", CurrentOddsToAdvance: "-150 (60%)", CurrentOddsToBeWildcard1: "+4900 (2%)", ChanceToWinSemifinalAndAdvanceToState: "21%", SemifinalPosition: "WC3" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567 (85%)", PreTournamentOddsToBeWildcard1: "+233 (30%)", CurrentOddsToAdvance: "+150 (40%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "22%", SemifinalPosition: "" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300 (25%)", PreTournamentOddsToBeWildcard1: "0% (0%)", CurrentOddsToAdvance: "+400 (20%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "8%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300 (25%)", PreTournamentOddsToBeWildcard1: "+1900 (5%)", CurrentOddsToAdvance: "+1900 (5%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900 (5%)", PreTournamentOddsToBeWildcard1: "+3900 (2.5%)", CurrentOddsToAdvance: "+9900 (1%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "0.15%", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900 (10%)", PreTournamentOddsToBeWildcard1: "+3900 (2.5%)", CurrentOddsToAdvance: "+19900 (0.5%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900 (5%)", PreTournamentOddsToBeWildcard1: "0% (0%)", CurrentOddsToAdvance: "+19900 (0.5%)", CurrentOddsToBeWildcard1: "0% (0%)", ChanceToWinSemifinalAndAdvanceToState: "0.05%", SemifinalPosition: "" },
];

// Define columns
const columns = [
  { Header: 'Team', accessor: 'Team' },
  { Header: 'Pre-Tournament Odds to Advance', accessor: 'PreTournamentOddsToAdvance' },
  { Header: 'Pre-Tournament Odds to Be Wildcard 1', accessor: 'PreTournamentOddsToBeWildcard1' },
  { Header: 'Current Odds to Advance', accessor: 'CurrentOddsToAdvance' },
  { Header: 'Current Odds to Be Wildcard 1', accessor: 'CurrentOddsToBeWildcard1' },
  { Header: 'Chance to Win Semifinal and Advance to State', accessor: 'ChanceToWinSemifinalAndAdvanceToState' },
  { Header: 'Semifinal Position', accessor: 'SemifinalPosition' },
];

function App() {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

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
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
