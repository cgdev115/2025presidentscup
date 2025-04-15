import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Analytics } from '@vercel/analytics/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Initial standings data (as of April 13, 2025)
const initialStandingsData = [
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", MP: 2, W: 1, L: 0, D: 1, GF: 2, GA: 1, GD: 1, PTS: 4, PPG: "2.0", SemifinalPosition: "W1", Bracket: "C" },
  { Team: "HTX West 14G Gold (Bracket C)", MP: 1, W: 1, L: 0, D: 0, GF: 1, GA: 0, GD: 1, PTS: 3, PPG: "3.0", SemifinalPosition: "W2", Bracket: "C" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 2, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W3", Bracket: "A" },
  { Team: "HTX City 15 W (Bracket B)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "", Bracket: "B" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 1, GD: 1, PTS: 3, PPG: "1.5", SemifinalPosition: "A1", Bracket: "A" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 2, GD: -1, PTS: 3, PPG: "1.5", SemifinalPosition: "", Bracket: "A" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "", Bracket: "A" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", MP: 2, W: 0, L: 0, D: 2, GF: 1, GA: 1, GD: 0, PTS: 2, PPG: "1.0", SemifinalPosition: "", Bracket: "B" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", MP: 2, W: 0, L: 1, D: 1, GF: 0, GA: 1, GD: -1, PTS: 1, PPG: "0.5", SemifinalPosition: "", Bracket: "C" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", MP: 1, W: 0, L: 1, D: 0, GF: 0, GA: 1, GD: -1, PTS: 0, PPG: "0.0", SemifinalPosition: "", Bracket: "B" },
];

// Game results data (tournament games up to April 13, 2025)
const gameResultsData = [
  { Match: "HTX Woodlands 14G Black 2-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A, April 05)" },
  { Match: "HTX City 15 W 1-0 HTX Tomball 14G Gold (Bracket B/C, April 05)" },
  { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 1-1 GFI Academy GFI 2014 Girls DPL Next (Bracket B/C, April 05)" },
  { Match: "HTX Kingwood 14G Gold 2-0 HTX Woodlands 14G Black (Bracket A, April 12)" },
  { Match: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL 1-0 Legacy Soccer Legacy 2015 Girls Green (Bracket A, April 12)" },
  { Match: "Legacy Soccer Legacy 2014 Girls White 0-1 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket B/C, April 12)" },
  { Match: "HTX West 14G Gold 1-0 HTX City 15 W (Bracket B/C, April 12)" },
  { Match: "HTX Tomball 14G Gold 0-0 GFI Academy GFI 2014 Girls DPL Next (Bracket B/C, April 12)" },
  { Match: "Legacy Soccer Legacy 2015 Girls Green 1-0 HTX Kingwood 14G Gold (Bracket A, April 13)" },
];

// Remaining tournament games (group play and semifinals)
const remainingTournamentGames = [
  // Group Play - Bracket A
  {
    id: 1,
    date: "April 26, 2025",
    homeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)",
    awayTeam: "HTX Kingwood 14G Gold (Bracket A)",
    matchup: "Group Play - Bracket A",
  },
  {
    id: 2,
    date: "April 26, 2025",
    homeTeam: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)",
    awayTeam: "HTX Woodlands 14G Black (Bracket A)",
    matchup: "Group Play - Bracket A",
  },
  // Group Play - Bracket B/C
  {
    id: 3,
    date: "April 26, 2025",
    homeTeam: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)",
    awayTeam: "HTX West 14G Gold (Bracket C)",
    matchup: "Group Play - Bracket B/C",
  },
  {
    id: 4,
    date: "April 26, 2025",
    homeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)",
    awayTeam: "HTX City 15 W (Bracket B)",
    matchup: "Group Play - Bracket B/C",
  },
  {
    id: 5,
    date: "April 26, 2025",
    homeTeam: "HTX Tomball 14G Gold (Bracket C)",
    awayTeam: "Legacy Soccer Legacy 2014 Girls White (Bracket B)",
    matchup: "Group Play - Bracket B/C",
  },
  {
    id: 6,
    date: "April 27, 2025",
    homeTeam: "Legacy Soccer Legacy 2014 Girls White (Bracket B)",
    awayTeam: "HTX West 14G Gold (Bracket C)",
    matchup: "Group Play - Bracket B/C",
  },
  // Semifinals (teams will be updated dynamically)
  {
    id: 7,
    date: "May 03, 2025",
    homeTeam: "HTX Kingwood 14G Gold (Bracket A)", // A1 (to be updated)
    awayTeam: "HTX Woodlands 14G Black (Bracket A)", // W3 (to be updated)
    matchup: "A1 vs. Wildcard #3",
  },
  {
    id: 8,
    date: "May 03, 2025",
    homeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", // W1 (to be updated)
    awayTeam: "HTX West 14G Gold (Bracket C)", // W2 (to be updated)
    matchup: "Wildcard #1 vs. Wildcard #2",
  },
];

// Initial playoff data (will be updated dynamically)
const initialPlayoffData = [
  {
    Matchup: "A1 vs. Wildcard #3 (Saturday, May 03, 2025 at Meyer Park - Meyer Park #24W)",
    Team1: "HTX Kingwood 14G Gold (Bracket A)",
    Team1Chance: "71.25%",
    Team2: "HTX Woodlands 14G Black (Bracket A)",
    Team2Chance: "10%",
  },
  {
    Matchup: "Wildcard #1 vs. Wildcard #2 (Saturday, May 03, 2025 at Bear Creek Park - Field 23S)",
    Team1: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)",
    Team1Chance: "34.65%",
    Team2: "HTX West 14G Gold (Bracket C)",
    Team2Chance: "61.75%",
  },
];

// Odds data
const oddsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "71.25%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233", PreTournamentOddsToAdvancePercent: "70%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "W2" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900", PreTournamentOddsToAdvancePercent: "90%", CurrentOddsToAdvance: "+150", CurrentOddsToAdvancePercent: "40%", ChanceToWinSemifinalAndAdvanceToState: "5%", SemifinalPosition: "" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "-3233", PreTournamentOddsToAdvancePercent: "97%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "W3" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+233", CurrentOddsToAdvancePercent: "30%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "+400", CurrentOddsToAdvancePercent: "20%", ChanceToWinSemifinalAndAdvanceToState: "5%", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567", PreTournamentOddsToAdvancePercent: "85%", CurrentOddsToAdvance: "+900", CurrentOddsToAdvancePercent: "10%", ChanceToWinSemifinalAndAdvanceToState: "3%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+1900", CurrentOddsToAdvancePercent: "5%", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "-9900", CurrentOddsToAdvancePercent: "99%", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "W1" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900", PreTournamentOddsToAdvancePercent: "10%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
];

// Projected points data
const pointsData = [
  { Team: "HTX West 14G Gold (Bracket C)", ProjectedPoints: "9.0" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", ProjectedPoints: "6.0" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "HTX City 15 W (Bracket B)", ProjectedPoints: "4.5" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", ProjectedPoints: "4.5" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", ProjectedPoints: "3.0" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", ProjectedPoints: "1.5" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", ProjectedPoints: "0.0" },
];

// Team records data
const teamRecordsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", TotalGames: 15, Wins: 5, Losses: 8, Draws: 2, GoalsFor: 29, GoalsAgainst: 22, GD: 7 },
  { Team: "HTX West 14G Gold (Bracket C)", TotalGames: 16, Wins: 9, Losses: 4, Draws: 3, GoalsFor: 37, GoalsAgainst: 16, GD: 21 },
  { Team: "HTX Woodlands 14G Black (Bracket A)", TotalGames: 16, Wins: 9, Losses: 4, Draws: 3, GoalsFor: 31, GoalsAgainst: 23, GD: 8 },
  { Team: "HTX City 15 W (Bracket B)", TotalGames: 15, Wins: 12, Losses: 2, Draws: 1, GoalsFor: 54, GoalsAgainst: 19, GD: 35 },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", TotalGames: 15, Wins: 4, Losses: 8, Draws: 3, GoalsFor: 18, GoalsAgainst: 23, GD: -5 },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", TotalGames: 13, Wins: 4, Losses: 8, Draws: 1, GoalsFor: 19, GoalsAgainst: 37, GD: -18 },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", TotalGames: 14, Wins: 1, Losses: 12, Draws: 1, GoalsFor: 12, GoalsAgainst: 47, GD: -35 },
  { Team: "HTX Tomball 14G Gold (Bracket C)", TotalGames: 14, Wins: 9, Losses: 2, Draws: 3, GoalsFor: 35, GoalsAgainst: 14, GD: 21 },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", TotalGames: 16, Wins: 7, Losses: 4, Draws: 5, GoalsFor: 24, GoalsAgainst: 18, GD: 6 },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", TotalGames: 15, Wins: 3, Losses: 9, Draws: 3, GoalsFor: 15, GoalsAgainst: 34, GD: -19 },
];

// Columns for standings table (with sorting)
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
  { Header: 'Current Odds to Advance (American)', accessor: 'CurrentOddsToAdvance' },
  { Header: 'Current Odds to Advance (%)', accessor: 'CurrentOddsToAdvancePercent' },
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

// Columns for team records table
const teamRecordsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Total Games', accessor: 'TotalGames' },
  { Header: 'Wins', accessor: 'Wins' },
  { Header: 'Losses', accessor: 'Losses' },
  { Header: 'Draws', accessor: 'Draws' },
  { Header: 'Goals For', accessor: 'GoalsFor' },
  { Header: 'Goals Against', accessor: 'GoalsAgainst' },
  { Header: 'GD', accessor: 'GD' },
];

function App() {
  // State for standings (dynamic)
  const [standings, setStandings] = useState(initialStandingsData);
  // State for playoff data (dynamic)
  const [playoffData, setPlayoffData] = useState(initialPlayoffData);
  // State for user-entered scores
  const [gameScores, setGameScores] = useState(
    remainingTournamentGames.reduce((acc, game) => {
      acc[game.id] = { homeScore: '', awayScore: '' };
      return acc;
    }, {})
  );

  // Function to handle score input changes
  const handleScoreChange = (gameId, field, value) => {
    // Ensure only non-negative integers
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
      setGameScores(prev => ({
        ...prev,
        [gameId]: {
          ...prev[gameId],
          [field]: value,
        },
      }));
    }
  };

  // Function to update standings and semifinal positions
  useEffect(() => {
    let newStandings = [...initialStandingsData].map(team => ({ ...team }));

    // Reset SemifinalPosition for all teams
    newStandings.forEach(team => {
      team.SemifinalPosition = "";
    });

    // Update standings based on user-entered scores
    remainingTournamentGames.forEach(game => {
      const scores = gameScores[game.id];
      const homeScore = Number(scores.homeScore);
      const awayScore = Number(scores.awayScore);

      // Only update if both scores are valid numbers
      if (scores.homeScore !== '' && scores.awayScore !== '' && !isNaN(homeScore) && !isNaN(awayScore)) {
        const homeTeam = newStandings.find(team => team.Team === game.homeTeam);
        const awayTeam = newStandings.find(team => team.Team === game.awayTeam);

        if (homeTeam && awayTeam) {
          // Increment matches played
          homeTeam.MP += 1;
          awayTeam.MP += 1;

          // Update goals
          homeTeam.GF += homeScore;
          homeTeam.GA += awayScore;
          awayTeam.GF += awayScore;
          awayTeam.GA += homeScore;

          // Update goal difference
          homeTeam.GD = homeTeam.GF - homeTeam.GA;
          awayTeam.GD = awayTeam.GF - awayTeam.GA;

          // Determine match outcome
          if (homeScore > awayScore) {
            homeTeam.W += 1;
            homeTeam.PTS += 3;
            awayTeam.L += 1;
          } else if (awayScore > homeScore) {
            awayTeam.W += 1;
            awayTeam.PTS += 3;
            homeTeam.L += 1;
          } else {
            homeTeam.D += 1;
            awayTeam.D += 1;
            homeTeam.PTS += 1;
            awayTeam.PTS += 1;
          }

          // Update PPG
          homeTeam.PPG = (homeTeam.PTS / homeTeam.MP).toFixed(1);
          awayTeam.PPG = (awayTeam.PTS / awayTeam.MP).toFixed(1);
        }
      }
    });

    // Sort standings by PTS (descending), then GD (descending)
    newStandings.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      return b.GD - a.GD;
    });

    // Determine new semifinal positions
    // A1: Top team in Bracket A
    const bracketATeams = newStandings.filter(team => team.Bracket === "A");
    bracketATeams.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      return b.GD - a.GD;
    });
    if (bracketATeams.length > 0) {
      const a1Team = bracketATeams[0];
      a1Team.SemifinalPosition = "A1";
    }

    // W1, W2, W3: Top 3 teams in Brackets B and C
    const bracketBCTeams = newStandings.filter(team => team.Bracket === "B" || team.Bracket === "C");
    bracketBCTeams.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      return b.GD - a.GD;
    });
    if (bracketBCTeams.length > 0) {
      bracketBCTeams[0].SemifinalPosition = "W1";
      if (bracketBCTeams.length > 1) {
        bracketBCTeams[1].SemifinalPosition = "W2";
      }
      if (bracketBCTeams.length > 2) {
        bracketBCTeams[2].SemifinalPosition = "W3";
      }
    }

    // Update playoff data with new teams
    const a1Team = newStandings.find(team => team.SemifinalPosition === "A1") || { Team: "TBD" };
    const w1Team = newStandings.find(team => team.SemifinalPosition === "W1") || { Team: "TBD" };
    const w2Team = newStandings.find(team => team.SemifinalPosition === "W2") || { Team: "TBD" };
    const w3Team = newStandings.find(team => team.SemifinalPosition === "W3") || { Team: "TBD" };

    const newPlayoffData = [
      {
        Matchup: "A1 vs. Wildcard #3 (Saturday, May 03, 2025 at Meyer Park - Meyer Park #24W)",
        Team1: a1Team.Team,
        Team1Chance: a1Team.SemifinalPosition ? "71.25%" : "TBD",
        Team2: w3Team.Team,
        Team2Chance: w3Team.SemifinalPosition ? "10%" : "TBD",
      },
      {
        Matchup: "Wildcard #1 vs. Wildcard #2 (Saturday, May 03, 2025 at Bear Creek Park - Field 23S)",
        Team1: w1Team.Team,
        Team1Chance: w1Team.SemifinalPosition ? "34.65%" : "TBD",
        Team2: w2Team.Team,
        Team2Chance: w2Team.SemifinalPosition ? "61.75%" : "TBD",
      },
    ];

    setStandings(newStandings);
    setPlayoffData(newPlayoffData);
  }, [gameScores]);

  // Table instances
  const standingsTableInstance = useTable(
    {
      columns: standingsColumns,
      data: standings,
      initialState: { sortBy: [{ id: 'PTS', desc: true }, { id: 'GD', desc: true }] },
    },
    useSortBy
  );

  const gameResultsTableInstance = useTable({
    columns: gameResultsColumns,
    data: gameResultsData,
  });

  const oddsTableInstance = useTable(
    {
      columns: oddsColumns,
      data: oddsData,
    },
    useSortBy
  );

  const pointsTableInstance = useTable({
    columns: pointsColumns,
    data: pointsData,
  });

  const playoffTableInstance = useTable({
    columns: playoffColumns,
    data: playoffData,
  });

  const teamRecordsTableInstance = useTable({
    columns: teamRecordsColumns,
    data: teamRecordsData,
  });

  const {
    getTableProps: getStandingsTableProps,
    getTableBodyProps: getStandingsTableBodyProps,
    headerGroups: standingsHeaderGroups,
    rows: standingsRows,
    prepareRow: prepareStandingsRow,
  } = standingsTableInstance;

  const {
    getTableProps: getGameResultsTableProps,
    getTableBodyProps: getGameResultsTableBodyProps,
    headerGroups: gameResultsHeaderGroups,
    rows: gameResultsRows,
    prepareRow: prepareGameResultsRow,
  } = gameResultsTableInstance;

  const {
    getTableProps: getOddsTableProps,
    getTableBodyProps: getOddsTableBodyProps,
    headerGroups: oddsHeaderGroups,
    rows: oddsRows,
    prepareRow: prepareOddsRow,
  } = oddsTableInstance;

  const {
    getTableProps: getPointsTableProps,
    getTableBodyProps: getPointsTableBodyProps,
    headerGroups: pointsHeaderGroups,
    rows: pointsRows,
    prepareRow: preparePointsRow,
  } = pointsTableInstance;

  const {
    getTableProps: getPlayoffTableProps,
    getTableBodyProps: getPlayoffTableBodyProps,
    headerGroups: playoffHeaderGroups,
    rows: playoffRows,
    prepareRow: preparePlayoffRow,
  } = playoffTableInstance;

  const {
    getTableProps: getTeamRecordsTableProps,
    getTableBodyProps: getTeamRecordsTableBodyProps,
    headerGroups: teamRecordsHeaderGroups,
    rows: teamRecordsRows,
    prepareRow: prepareTeamRecordsRow,
  } = teamRecordsTableInstance;

  return (
    <div className="container mt-5">
      <div className="header-image">
        <img src="/presidents-cup-2025.png" alt="2025 President's Cup Logo" />
      </div>
      <h1 className="text-center mb-2">2025 President's Cup Tournament Odds</h1>
      <h3 className="text-center subtitle mb-4">Female U11 - Eastern District Playoffs</h3>

      {/* Standings Table with Input Form for Remaining Tournament Games */}
      <h2 className="text-center mb-3">Current Standings</h2>
      <h4 className="text-center mb-3">Enter Scores for Remaining Tournament Games</h4>
      <div className="mb-4">
        {remainingTournamentGames.map(game => (
          <div key={game.id} className="mb-3">
            <p>
              {game.date}: {game.matchup} ({game.homeTeam} vs {game.awayTeam})
            </p>
            <div className="d-flex align-items-center justify-content-center">
              <input
                type="number"
                className="form-control w-25 mx-2"
                placeholder="Home Score"
                value={gameScores[game.id].homeScore}
                onChange={(e) => handleScoreChange(game.id, 'homeScore', e.target.value)}
                min="0"
                step="1"
              />
              <span> - </span>
              <input
                type="number"
                className="form-control w-25 mx-2"
                placeholder="Away Score"
                value={gameScores[game.id].awayScore}
                onChange={(e) => handleScoreChange(game.id, 'awayScore', e.target.value)}
                min="0"
                step="1"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="table-responsive">
        <table {...getStandingsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {standingsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.className}>
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
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
                <tr {...row.getRowProps()} className={isSemifinalist ? 'semifinalist-row' : ''}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className={cell.column.className}>
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
                    <td {...cell.getCellProps()} className={cell.column.className}>
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
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
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
                    <td {...cell.getCellProps()} className={cell.column.className}>
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
                    <td {...cell.getCellProps()} className={cell.column.className}>
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
                    <td {...cell.getCellProps()} className={cell.column.className}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Team Records Table (Summary Only) */}
      <h2 className="text-center mb-3 mt-5">Team Records</h2>
      <div className="table-responsive">
        <table {...getTeamRecordsTableProps()} className="table table-striped table-bordered">
          <thead className="thead-dark">
            {teamRecordsHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className={column.className}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTeamRecordsTableBodyProps()}>
            {teamRecordsRows.map(row => {
              prepareTeamRecordsRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className={cell.column.className}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="text-center mt-5 mb-3 disclaimer">
        <p>
          Disclaimer: These predictions are based on past performance and do not guarantee future outcomes. Think of it like predicting the weather—sometimes it’s sunny, sometimes it rains soccer balls! ⚽🌦️
        </p>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
