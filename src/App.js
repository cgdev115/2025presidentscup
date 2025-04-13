import React from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Standings data (sorted by PTS, then GD, with actual current Semifinal Position)
const standingsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", MP: 1, W: 1, L: 0, D: 0, GF: 2, GA: 0, GD: 2, PTS: 3, PPG: "3.0", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", MP: 1, W: 1, L: 0, D: 0, GF: 1, GA: 0, GD: 1, PTS: 3, PPG: "3.0", SemifinalPosition: "W1" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 2, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W2" },
  { Team: "HTX City 15 W (Bracket B)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W3" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", MP: 2, W: 0, L: 0, D: 2, GF: 1, GA: 1, GD: 0, PTS: 2, PPG: "1.0", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", MP: 1, W: 0, L: 0, D: 1, GF: 1, GA: 1, GD: 0, PTS: 1, PPG: "1.0", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", MP: 2, W: 0, L: 1, D: 1, GF: 0, GA: 1, GD: -1, PTS: 1, PPG: "0.5", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", MP: 0, W: 0, L: 0, D: 0, GF: 0, GA: 0, GD: 0, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", MP: 0, W: 0, L: 0, D: 0, GF: 0, GA: 0, GD: 0, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", MP: 1, W: 0, L: 1, D: 0, GF: 0, GA: 2, GD: -2, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
];

// Game results data
const gameResultsData = [
  { Match: "HTX Woodlands 14G Black 2-0 Inwood SC PSG South (Bracket A, April 5)" },
  { Match: "HTX City 15 W 1-0 HTX Tomball 14G Gold (Bracket B/C, April 5)" },
  { Match: "Inwood SC PSG East 1-1 GFI Academy (Bracket B/C, April 5)" },
  { Match: "HTX West 14G Gold 1-0 HTX City 15 W (Bracket B/C, April 12)" },
  { Match: "HTX Tomball 14G Gold 0-0 GFI Academy (Bracket B/C, April 12)" },
  { Match: "HTX Kingwood 14G Gold 2-0 HTX Woodlands 14G Black (Bracket A, April 12)" },
];

// Odds data
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

// Projected playoffs data (with date and location)
const playoffData = [
  {
    Matchup: "A1 vs. Wildcard #3 (Saturday, May 03, 2025 at Meyer Park - Meyer Park #24W)",
    Team1: "HTX Kingwood 14G Gold (Bracket A)",
    Team1Chance: "61.75%",
    Team2: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)",
    Team2Chance: "21%",
  },
  {
    Matchup: "Wildcard #1 vs. Wildcard #2 (Saturday, May 03, 2025 at Bear Creek Park - Field 23S)",
    Team1: "HTX West 14G Gold (Bracket C)",
    Team1Chance: "34.65%",
    Team2: "HTX City 15 W (Bracket B)",
    Team2Chance: "61.75%",
  },
];

// Columns for standings table
const standingsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'MP', accessor: 'MP' },
  { Header: 'W', accessor: 'W' },
  { Header: 'L', accessor: 'L' },
  { Header: 'D', accessor: 'D' },
  { Header: 'GF', accessor: 'GF' },
  { Header: 'GA', accessor: 'GA' },
  { Header: 'GD', accessor: 'GD' },
  { Header: 'PTS', accessor: 'PTS' },
  { Header: 'PPG', accessor: 'PPG' },
  { Header: 'Semifinal Position', accessor: 'SemifinalPosition' },
];

// Columns for game results list
const gameResultsColumns = [
  { Header: 'Match', accessor: 'Match', className: 'sticky-column' },
];

// Columns for odds table
const oddsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
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
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Projected Points', accessor: 'ProjectedPoints' },
];

// Columns for projected playoffs table
const playoffColumns = [
  { Header: 'Matchup', accessor: 'Matchup', className: 'sticky-column' },
  { Header: 'Team 1', accessor: 'Team1' },
  { Header: 'Team 1 Chance to Win (%)', accessor: 'Team1Chance' },
  { Header: 'Team 2', accessor: 'Team2' },
  { Header: 'Team 2 Chance to Win (%)', accessor: 'Team2Chance' },
];

function App() {
  // Standings table instance (no sorting for users)
  const standingsTableInstance = useTable({
    columns: standingsColumns,
    data: standingsData,
  });

  const {
    getTableProps: getStandingsTableProps,
    getTableBodyProps: getStandingsTableBodyProps,
    headerGroups: standingsHeaderGroups,
    rows: standingsRows,
    prepareRow: prepareStandingsRow,
  } = standingsTableInstance;

  // Game results table instance (no sorting for users)
  const gameResultsTableInstance = useTable({
    columns: gameResultsColumns,
    data: gameResultsData,
  });

  const {
    getTableProps: getGameResultsTableProps,
    getTableBodyProps: getGameResultsTableBodyProps,
    headerGroups: gameResultsHeaderGroups,
    rows: gameResultsRows,
    prepareRow: prepareGameResultsRow,
  } = gameResultsTableInstance;

  // Odds table instance (with sorting)
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

  // Points table instance (no sorting for users)
  const pointsTableInstance = useTable({
    columns: pointsColumns,
    data: pointsData,
  });

  const {
    getTableProps: getPointsTableProps,
    getTableBodyProps: getPointsTableBodyProps,
    headerGroups: pointsHeaderGroups,
    rows: pointsRows,
    prepareRow: preparePointsRow,
  } = pointsTableInstance;

  // Playoff table instance (no sorting for users)
  const playoffTableInstance = useTable({
    columns: playoffColumns,
    data: playoffData,
  });

  const {
    getTableProps: getPlayoffTableProps,
    getTableBodyProps: getPlayoffTableBodyProps,
    headerGroups: playoffHeaderGroups,
    rows: playoffRows,
    prepareRow: preparePlayoffRow,
  } = playoffTableInstance;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">2025 President's Cup Tournament Odds</h1>

      {/* Standings Table */}
      <h2 className="text-center mb-3">Current Standings</h2>
      <div className="table-responsive">
        <table {...getStandingsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {standingsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className={column.className}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getStandingsTableBodyProps()}>
            {standingsRows.map(row => {
              prepareStandingsRow(row);
              const isSemifinalist = row.original.SemifinalPosition !== "";
              return (
                <tr
                  {...row.getRowProps()}
                  className={isSemifinalist ? 'semifinalist-row' : ''}
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
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

      {/* Game Results Table */}
      <h2 className="text-center mb-3 mt-5">Game Results</h2>
      <div className="table-responsive">
        <table {...getGameResultsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {gameResultsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className={column.className}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getGameResultsTableBodyProps()}>
            {gameResultsRows.map(row => {
              prepareGameResultsRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
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

      {/* Odds Table */}
      <h2 className="text-center mb-3 mt-5">Tournament Odds</h2>
      <div className="table-responsive">
        <table {...getOddsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {oddsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.className}>
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
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
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
                  <th {...column.getHeaderProps()} className={column.className}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getPointsTableBodyProps()}>
            {pointsRows.map(row => {
              preparePointsRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
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

      {/* Projected District Playoffs Table */}
      <h2 className="text-center mb-3 mt-5">Projected District Playoffs</h2>
      <div className="table-responsive">
        <table {...getPlayoffTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {playoffHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className={column.className}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getPlayoffTableBodyProps()}>
            {playoffRows.map(row => {
              preparePlayoffRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
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
