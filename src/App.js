import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Analytics } from '@vercel/analytics/react'; // Import Vercel Analytics
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Standings data (sorted by PTS, then GD, with actual current Semifinal Position)
const standingsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", MP: 1, W: 1, L: 0, D: 0, GF: 2, GA: 0, GD: 2, PTS: 3, PPG: "3.0", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", MP: 1, W: 1, L: 0, D: 0, GF: 1, GA: 0, GD: 1, PTS: 3, PPG: "3.0", SemifinalPosition: "W1" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 2, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W2" },
  { Team: "HTX City 15 W (Bracket B)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W3" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 2, GD: -1, PTS: 3, PPG: "1.5", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", MP: 2, W: 0, L: 0, D: 2, GF: 1, GA: 1, GD: 0, PTS: 2, PPG: "1.0", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", MP: 1, W: 0, L: 0, D: 1, GF: 1, GA: 1, GD: 0, PTS: 1, PPG: "1.0", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", MP: 2, W: 0, L: 1, D: 1, GF: 0, GA: 1, GD: -1, PTS: 1, PPG: "0.5", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", MP: 1, W: 0, L: 1, D: 0, GF: 0, GA: 1, GD: -1, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", MP: 0, W: 0, L: 0, D: 0, GF: 0, GA: 0, GD: 0, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
];

// Game results data (current tournament)
const gameResultsData = [
  { Match: "HTX Woodlands 14G Black 2-0 Inwood SC PSG South (Bracket A, April 5)" },
  { Match: "HTX City 15 W 1-0 HTX Tomball 14G Gold (Bracket B/C, April 5)" },
  { Match: "Inwood SC PSG East 1-1 GFI Academy (Bracket B/C, April 5)" },
  { Match: "HTX West 14G Gold 1-0 HTX City 15 W (Bracket B/C, April 12)" },
  { Match: "HTX Tomball 14G Gold 0-0 GFI Academy (Bracket B/C, April 12)" },
  { Match: "HTX Kingwood 14G Gold 2-0 HTX Woodlands 14G Black (Bracket A, April 12)" },
  { Match: "Inwood SC PSG South 1-0 Legacy Soccer 2015 Girls Green (Bracket A, April 12)" },
];

// Odds data
const oddsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "71.25%", SemifinalPosition: "A1" },
  { Team: "HTX West 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-233", PreTournamentOddsToAdvancePercent: "70%", CurrentOddsToAdvance: "-9900", CurrentOddsToAdvancePercent: "99%", ChanceToWinSemifinalAndAdvanceToState: "34.65%", SemifinalPosition: "WC1" },
  { Team: "HTX City 15 W (Bracket B)", PreTournamentOddsToAdvance: "-900", PreTournamentOddsToAdvancePercent: "90%", CurrentOddsToAdvance: "-1900", CurrentOddsToAdvancePercent: "95%", ChanceToWinSemifinalAndAdvanceToState: "61.75%", SemifinalPosition: "WC2" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", PreTournamentOddsToAdvance: "-3233", PreTournamentOddsToAdvancePercent: "97%", CurrentOddsToAdvance: "+150", CurrentOddsToAdvancePercent: "40%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "WC3" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+233", CurrentOddsToAdvancePercent: "30%", ChanceToWinSemifinalAndAdvanceToState: "10%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "+400", CurrentOddsToAdvancePercent: "20%", ChanceToWinSemifinalAndAdvanceToState: "5%", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", PreTournamentOddsToAdvance: "-567", PreTournamentOddsToAdvancePercent: "85%", CurrentOddsToAdvance: "+900", CurrentOddsToAdvancePercent: "10%", ChanceToWinSemifinalAndAdvanceToState: "3%", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", PreTournamentOddsToAdvance: "+300", PreTournamentOddsToAdvancePercent: "25%", CurrentOddsToAdvance: "+1900", CurrentOddsToAdvancePercent: "5%", ChanceToWinSemifinalAndAdvanceToState: "1%", SemifinalPosition: "" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", PreTournamentOddsToAdvance: "+1900", PreTournamentOddsToAdvancePercent: "5%", CurrentOddsToAdvance: "+9900", CurrentOddsToAdvancePercent: "1%", ChanceToWinSemifinalAndAdvanceToState: "0.15%", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", PreTournamentOddsToAdvance: "+900", PreTournamentOddsToAdvancePercent: "10%", CurrentOddsToAdvance: "+19900", CurrentOddsToAdvancePercent: "0.5%", ChanceToWinSemifinalAndAdvanceToState: "0.075%", SemifinalPosition: "" },
];

// Projected points data (sorted by projected points)
const pointsData = [
  { Team: "HTX West 14G Gold (Bracket C)", ProjectedPoints: "8.25" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", ProjectedPoints: "6.5" },
  { Team: "HTX City 15 W (Bracket B)", ProjectedPoints: "5.65" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", ProjectedPoints: "4.1" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", ProjectedPoints: "3.75" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", ProjectedPoints: "3.45" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", ProjectedPoints: "2.8" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", ProjectedPoints: "2.4" },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", ProjectedPoints: "1.25" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", ProjectedPoints: "0.7" },
];

// Projected playoffs data (with date and location)
const playoffData = [
  {
    Matchup: "A1 vs. Wildcard #3 (Saturday, May 03, 2025 at Meyer Park - Meyer Park #24W)",
    Team1: "HTX Kingwood 14G Gold (Bracket A)",
    Team1Chance: "71.25%",
    Team2: "HTX Woodlands 14G Black (Bracket A)",
    Team2Chance: "10%",
  },
  {
    Matchup: "Wildcard #1 vs. Wildcard #2 (Saturday, May 03, 2025 at Bear Creek Park - Field 23S)",
    Team1: "HTX West 14G Gold (Bracket C)",
    Team1Chance: "34.65%",
    Team2: "HTX City 15 W (Bracket B)",
    Team2Chance: "61.75%",
  },
];

// Team records data (summary for main table)
const teamRecordsData = [
  { Team: "HTX Kingwood 14G Gold (Bracket A)", TotalGames: 12, Wins: 8, Losses: 2, Draws: 2, GoalsFor: 24, GoalsAgainst: 10 },
  { Team: "HTX West 14G Gold (Bracket C)", TotalGames: 12, Wins: 7, Losses: 3, Draws: 2, GoalsFor: 20, GoalsAgainst: 12 },
  { Team: "HTX Woodlands 14G Black (Bracket A)", TotalGames: 13, Wins: 6, Losses: 4, Draws: 3, GoalsFor: 18, GoalsAgainst: 14 },
  { Team: "HTX City 15 W (Bracket B)", TotalGames: 13, Wins: 5, Losses: 4, Draws: 4, GoalsFor: 15, GoalsAgainst: 13 },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", TotalGames: 12, Wins: 4, Losses: 5, Draws: 3, GoalsFor: 12, GoalsAgainst: 15 },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", TotalGames: 12, Wins: 3, Losses: 4, Draws: 5, GoalsFor: 10, GoalsAgainst: 11 },
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", TotalGames: 11, Wins: 3, Losses: 4, Draws: 4, GoalsFor: 9, GoalsAgainst: 10 },
  { Team: "HTX Tomball 14G Gold (Bracket C)", TotalGames: 12, Wins: 2, Losses: 5, Draws: 5, GoalsFor: 8, GoalsAgainst: 12 },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", TotalGames: 11, Wins: 2, Losses: 6, Draws: 3, GoalsFor: 7, GoalsAgainst: 14 },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", TotalGames: 10, Wins: 1, Losses: 7, Draws: 2, GoalsFor: 5, GoalsAgainst: 16 },
];

// Mapping of full team names to shortened names used in gameResultsData
const teamNameMapping = {
  "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)": "Inwood SC PSG South",
  "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)": "Inwood SC PSG East",
  "GFI Academy GFI 2014 Girls DPL Next (Bracket B)": "GFI Academy",
};

// Historical games data (Fall 2024 and Spring 2025, updated with actual team names)
const historicalGamesData = {
  "HTX Kingwood 14G Gold (Bracket A)": {
    fall2024: [
      { Match: "HTX Kingwood 14G Gold 3-1 HTX West 14G Gold (Sept 10, 2024)" },
      { Match: "HTX Kingwood 14G Gold 2-0 HTX City 15 W (Sept 17, 2024)" },
      { Match: "HTX Kingwood 14G Gold 1-1 GFI Academy (Sept 24, 2024)" },
      { Match: "HTX Kingwood 14G Gold 4-0 HTX Tomball 14G Gold (Oct 1, 2024)" },
      { Match: "HTX Kingwood 14G Gold 2-1 Legacy Soccer 2015 Girls Green (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "HTX Kingwood 14G Gold 2-2 Inwood SC PSG South (Feb 15, 2025)" },
      { Match: "HTX Kingwood 14G Gold 3-0 Inwood SC PSG East (Feb 22, 2025)" },
      { Match: "HTX Kingwood 14G Gold 1-0 HTX Woodlands 14G Black (Mar 1, 2025)" },
      { Match: "HTX Kingwood 14G Gold 0-1 Legacy Soccer 2014 Girls White (Mar 8, 2025)" },
      { Match: "HTX Kingwood 14G Gold 4-2 HTX City 15 W (Mar 15, 2025)" },
    ],
  },
  "HTX West 14G Gold (Bracket C)": {
    fall2024: [
      { Match: "HTX West 14G Gold 2-1 HTX Woodlands 14G Black (Sept 10, 2024)" },
      { Match: "HTX West 14G Gold 1-1 Inwood SC PSG South (Sept 17, 2024)" },
      { Match: "HTX West 14G Gold 3-0 GFI Academy (Sept 24, 2024)" },
      { Match: "HTX West 14G Gold 0-2 Inwood SC PSG East (Oct 1, 2024)" },
      { Match: "HTX West 14G Gold 4-1 Legacy Soccer 2015 Girls Green (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "HTX West 14G Gold 1-0 HTX Tomball 14G Gold (Feb 15, 2025)" },
      { Match: "HTX West 14G Gold 2-2 Legacy Soccer 2014 Girls White (Feb 22, 2025)" },
      { Match: "HTX West 14G Gold 3-1 HTX City 15 W (Mar 1, 2025)" },
      { Match: "HTX West 14G Gold 1-2 HTX Kingwood 14G Gold (Mar 8, 2025)" },
      { Match: "HTX West 14G Gold 3-2 GFI Academy (Mar 15, 2025)" },
    ],
  },
  "HTX Woodlands 14G Black (Bracket A)": {
    fall2024: [
      { Match: "HTX Woodlands 14G Black 1-1 HTX City 15 W (Sept 10, 2024)" },
      { Match: "HTX Woodlands 14G Black 2-0 Inwood SC PSG South (Sept 17, 2024)" },
      { Match: "HTX Woodlands 14G Black 0-1 GFI Academy (Sept 24, 2024)" },
      { Match: "HTX Woodlands 14G Black 3-2 Inwood SC PSG East (Oct 1, 2024)" },
      { Match: "HTX Woodlands 14G Black 1-0 HTX Tomball 14G Gold (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "HTX Woodlands 14G Black 2-2 Legacy Soccer 2015 Girls Green (Feb 15, 2025)" },
      { Match: "HTX Woodlands 14G Black 1-0 Legacy Soccer 2014 Girls White (Feb 22, 2025)" },
      { Match: "HTX Woodlands 14G Black 0-1 HTX West 14G Gold (Mar 1, 2025)" },
      { Match: "HTX Woodlands 14G Black 2-1 HTX Kingwood 14G Gold (Mar 8, 2025)" },
      { Match: "HTX Woodlands 14G Black 1-1 HTX City 15 W (Mar 15, 2025)" },
    ],
  },
  "HTX City 15 W (Bracket B)": {
    fall2024: [
      { Match: "HTX City 15 W 1-0 Inwood SC PSG South (Sept 10, 2024)" },
      { Match: "HTX City 15 W 1-1 GFI Academy (Sept 17, 2024)" },
      { Match: "HTX City 15 W 0-2 Inwood SC PSG East (Sept 24, 2024)" },
      { Match: "HTX City 15 W 2-1 HTX Tomball 14G Gold (Oct 1, 2024)" },
      { Match: "HTX City 15 W 0-0 Legacy Soccer 2015 Girls Green (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "HTX City 15 W 1-1 Legacy Soccer 2014 Girls White (Feb 15, 2025)" },
      { Match: "HTX City 15 W 2-0 HTX West 14G Gold (Feb 22, 2025)" },
      { Match: "HTX City 15 W 0-1 HTX Kingwood 14G Gold (Mar 1, 2025)" },
      { Match: "HTX City 15 W 1-0 HTX Woodlands 14G Black (Mar 8, 2025)" },
      { Match: "HTX City 15 W 0-1 Inwood SC PSG South (Mar 15, 2025)" },
    ],
  },
  "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)": {
    fall2024: [
      { Match: "Inwood SC PSG South 0-1 GFI Academy (Sept 10, 2024)" },
      { Match: "Inwood SC PSG South 1-1 Inwood SC PSG East (Sept 17, 2024)" },
      { Match: "Inwood SC PSG South 2-0 HTX Tomball 14G Gold (Sept 24, 2024)" },
      { Match: "Inwood SC PSG South 0-2 Legacy Soccer 2015 Girls Green (Oct 1, 2024)" },
      { Match: "Inwood SC PSG South 1-0 Legacy Soccer 2014 Girls White (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "Inwood SC PSG South 0-0 HTX West 14G Gold (Feb 15, 2025)" },
      { Match: "Inwood SC PSG South 1-2 HTX Kingwood 14G Gold (Feb 22, 2025)" },
      { Match: "Inwood SC PSG South 2-1 HTX Woodlands 14G Black (Mar 1, 2025)" },
      { Match: "Inwood SC PSG South 0-1 HTX City 15 W (Mar 8, 2025)" },
      { Match: "Inwood SC PSG South 1-1 GFI Academy (Mar 15, 2025)" },
    ],
  },
  "GFI Academy GFI 2014 Girls DPL Next (Bracket B)": {
    fall2024: [
      { Match: "GFI Academy 1-1 Inwood SC PSG East (Sept 10, 2024)" },
      { Match: "GFI Academy 0-0 HTX Tomball 14G Gold (Sept 17, 2024)" },
      { Match: "GFI Academy 1-2 Legacy Soccer 2015 Girls Green (Sept 24, 2024)" },
      { Match: "GFI Academy 2-1 Legacy Soccer 2014 Girls White (Oct 1, 2024)" },
      { Match: "GFI Academy 0-1 HTX West 14G Gold (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "GFI Academy 0-0 HTX Kingwood 14G Gold (Feb 15, 2025)" },
      { Match: "GFI Academy 1-1 HTX Woodlands 14G Black (Feb 22, 2025)" },
      { Match: "GFI Academy 0-1 HTX City 15 W (Mar 1, 2025)" },
      { Match: "GFI Academy 2-0 Inwood SC PSG South (Mar 8, 2025)" },
      { Match: "GFI Academy 1-1 Inwood SC PSG East (Mar 15, 2025)" },
    ],
  },
  "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)": {
    fall2024: [
      { Match: "Inwood SC PSG East 0-0 HTX Tomball 14G Gold (Sept 10, 2024)" },
      { Match: "Inwood SC PSG East 1-1 Legacy Soccer 2015 Girls Green (Sept 17, 2024)" },
      { Match: "Inwood SC PSG East 0-1 Legacy Soccer 2014 Girls White (Sept 24, 2024)" },
      { Match: "Inwood SC PSG East 2-0 HTX West 14G Gold (Oct 1, 2024)" },
      { Match: "Inwood SC PSG East 0-2 HTX Kingwood 14G Gold (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "Inwood SC PSG East 1-0 HTX Woodlands 14G Black (Feb 15, 2025)" },
      { Match: "Inwood SC PSG East 0-0 HTX City 15 W (Feb 22, 2025)" },
      { Match: "Inwood SC PSG East 1-1 Inwood SC PSG South (Mar 1, 2025)" },
      { Match: "Inwood SC PSG East 0-1 GFI Academy (Mar 8, 2025)" },
      { Match: "Inwood SC PSG East 1-0 HTX Tomball 14G Gold (Mar 15, 2025)" },
    ],
  },
  "HTX Tomball 14G Gold (Bracket C)": {
    fall2024: [
      { Match: "HTX Tomball 14G Gold 0-1 Legacy Soccer 2015 Girls Green (Sept 10, 2024)" },
      { Match: "HTX Tomball 14G Gold 0-0 Legacy Soccer 2014 Girls White (Sept 17, 2024)" },
      { Match: "HTX Tomball 14G Gold 1-2 HTX West 14G Gold (Sept 24, 2024)" },
      { Match: "HTX Tomball 14G Gold 0-0 HTX Kingwood 14G Gold (Oct 1, 2024)" },
      { Match: "HTX Tomball 14G Gold 1-1 HTX Woodlands 14G Black (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "HTX Tomball 14G Gold 0-0 HTX City 15 W (Feb 15, 2025)" },
      { Match: "HTX Tomball 14G Gold 1-1 Inwood SC PSG South (Feb 22, 2025)" },
      { Match: "HTX Tomball 14G Gold 0-1 GFI Academy (Mar 1, 2025)" },
      { Match: "HTX Tomball 14G Gold 1-0 Inwood SC PSG East (Mar 8, 2025)" },
      { Match: "HTX Tomball 14G Gold 0-2 Legacy Soccer 2015 Girls Green (Mar 15, 2025)" },
    ],
  },
  "Legacy Soccer Legacy 2015 Girls Green (Bracket A)": {
    fall2024: [
      { Match: "Legacy Soccer 2015 Girls Green 0-2 Legacy Soccer 2014 Girls White (Sept 10, 2024)" },
      { Match: "Legacy Soccer 2015 Girls Green 0-1 HTX West 14G Gold (Sept 17, 2024)" },
      { Match: "Legacy Soccer 2015 Girls Green 1-1 HTX Kingwood 14G Gold (Sept 24, 2024)" },
      { Match: "Legacy Soccer 2015 Girls Green 0-0 HTX Woodlands 14G Black (Oct 1, 2024)" },
      { Match: "Legacy Soccer 2015 Girls Green 1-2 HTX City 15 W (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "Legacy Soccer 2015 Girls Green 0-1 Inwood SC PSG South (Feb 15, 2025)" },
      { Match: "Legacy Soccer 2015 Girls Green 1-0 GFI Academy (Feb 22, 2025)" },
      { Match: "Legacy Soccer 2015 Girls Green 0-2 Inwood SC PSG East (Mar 1, 2025)" },
      { Match: "Legacy Soccer 2015 Girls Green 1-1 HTX Tomball 14G Gold (Mar 8, 2025)" },
      { Match: "Legacy Soccer 2015 Girls Green 0-1 Legacy Soccer 2014 Girls White (Mar 15, 2025)" },
    ],
  },
  "Legacy Soccer Legacy 2014 Girls White (Bracket B)": {
    fall2024: [
      { Match: "Legacy Soccer 2014 Girls White 0-3 HTX West 14G Gold (Sept 10, 2024)" },
      { Match: "Legacy Soccer 2014 Girls White 0-1 HTX Kingwood 14G Gold (Sept 17, 2024)" },
      { Match: "Legacy Soccer 2014 Girls White 0-2 HTX Woodlands 14G Black (Sept 24, 2024)" },
      { Match: "Legacy Soccer 2014 Girls White 0-0 HTX City 15 W (Oct 1, 2024)" },
      { Match: "Legacy Soccer 2014 Girls White 0-1 Inwood SC PSG South (Oct 8, 2024)" },
    ],
    spring2025: [
      { Match: "Legacy Soccer 2014 Girls White 0-1 GFI Academy (Feb 15, 2025)" },
      { Match: "Legacy Soccer 2014 Girls White 0-0 Inwood SC PSG East (Feb 22, 2025)" },
      { Match: "Legacy Soccer 2014 Girls White 1-2 HTX Tomball 14G Gold (Mar 1, 2025)" },
      { Match: "Legacy Soccer 2014 Girls White 0-2 Legacy Soccer 2015 Girls Green (Mar 8, 2025)" },
      { Match: "Legacy Soccer 2014 Girls White 1-1 HTX West 14G Gold (Mar 15, 2025)" },
    ],
  },
};

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

// Columns for team records table (summary)
const teamRecordsColumns = [
  { Header: 'Team', accessor: 'Team', className: 'sticky-column' },
  { Header: 'Total Games', accessor: 'TotalGames' },
  { Header: 'Wins', accessor: 'Wins' },
  { Header: 'Losses', accessor: 'Losses' },
  { Header: 'Draws', accessor: 'Draws' },
  { Header: 'Goals For', accessor: 'GoalsFor' },
  { Header: 'Goals Against', accessor: 'GoalsAgainst' },
];

// Columns for detailed games table (Fall 2024, Spring 2025, Current Tournament, Remaining Matchups)
const detailedGamesColumns = [
  { Header: 'Match', accessor: 'Match', className: 'sticky-column' },
];

function App() {
  // State to manage which team's detailed records are expanded
  const [expandedTeam, setExpandedTeam] = useState(null);

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

  // Team records table instance (no sorting for users)
  const teamRecordsTableInstance = useTable({
    columns: teamRecordsColumns,
    data: teamRecordsData,
  });

  const {
    getTableProps: getTeamRecordsTableProps,
    getTableBodyProps: getTeamRecordsTableBodyProps,
    headerGroups: teamRecordsHeaderGroups,
    rows: teamRecordsRows,
    prepareRow: prepareTeamRecordsRow,
  } = teamRecordsTableInstance;

  // Function to get games for a specific team
  const getTeamGames = (teamName) => {
    const fall2024Games = historicalGamesData[teamName]?.fall2024 || [];
    const spring2025Games = historicalGamesData[teamName]?.spring2025 || [];
    
    // Use the shortened name if it exists in the mapping, otherwise use the full teamName
    const searchName = teamNameMapping[teamName] || teamName;
    const currentTournamentGames = gameResultsData.filter(game => game.Match.includes(searchName));
    const remainingMatchups = playoffData.filter(matchup => matchup.Team1 === teamName || matchup.Team2 === teamName);

    return {
      fall2024: fall2024Games,
      spring2025: spring2025Games,
      currentTournament: currentTournamentGames,
      remainingMatchups: remainingMatchups.map(matchup => ({
        Match: `${matchup.Matchup} (${matchup.Team1 === teamName ? matchup.Team1Chance : matchup.Team2Chance} chance to win)`,
      })),
    };
  };

  // Function to toggle expanded team
  const toggleTeamDetails = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="header-image">
          <img src="/presidents-cup-2025.png" alt="2025 President's Cup Logo" />
        </div>
        <h1 className="text-center mb-2">2025 President's Cup Tournament Odds</h1>
        <h3 className="text-center subtitle mb-4">Female U11 - Eastern District Playoffs</h3>

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

        {/* Team Records Table with Expandable Details */}
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
                const teamName = row.original.Team;
                const isExpanded = expandedTeam === teamName;
                const teamGames = getTeamGames(teamName);

                return (
                  <React.Fragment key={row.id}>
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td
                          {...cell.getCellProps()}
                          className={cell.column.className}
                          onClick={() => cell.column.Header === 'Team' && toggleTeamDetails(teamName)}
                          style={cell.column.Header === 'Team' ? { cursor: 'pointer' } : {}}
                        >
                          {cell.column.Header === 'Team' ? (
                            <span>
                              {cell.render('Cell')} {isExpanded ? '▼' : '▶'}
                            </span>
                          ) : (
                            cell.render('Cell')
                          )}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={teamRecordsColumns.length} className="expanded-details">
                          <div className="expanded-section">
                            <h4 className="text-center mb-3">Fall 2024 Games</h4>
                            <table className="table table-striped table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th className="sticky-column">Match</th>
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.fall2024.map((game, index) => (
                                  <tr key={index}>
                                    <td className="sticky-column">{game.Match}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <h4 className="text-center mb-3 mt-4">Spring 2025 Games</h4>
                            <table className="table table-striped table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th className="sticky-column">Match</th>
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.spring2025.map((game, index) => (
                                  <tr key={index}>
                                    <td className="sticky-column">{game.Match}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <h4 className="text-center mb-3 mt-4">Current Tournament Results</h4>
                            <table className="table table-striped table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th className="sticky-column">Match</th>
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.currentTournament.length > 0 ? (
                                  teamGames.currentTournament.map((game, index) => (
                                    <tr key={index}>
                                      <td className="sticky-column">{game.Match}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td className="sticky-column">No current tournament results available.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>

                            <h4 className="text-center mb-3 mt-4">Remaining Matchups</h4>
                            <table className="table table-striped table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th className="sticky-column">Match</th>
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.remainingMatchups.length > 0 ? (
                                  teamGames.remainingMatchups.map((game, index) => (
                                    <tr key={index}>
                                      <td className="sticky-column">{game.Match}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td className="sticky-column">No remaining matchups available.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Humorous Disclaimer */}
        <footer className="text-center mt-5 mb-3 disclaimer">
          <p>
            Disclaimer: These predictions are based on past performance and do not guarantee future outcomes. Think of it like predicting the weather—sometimes it’s sunny, sometimes it rains soccer balls! ⚽🌦️
          </p>
        </footer>
      </div>
      <Analytics /> {/* Add Vercel Analytics component */}
    </>
  );
}

export default App;
