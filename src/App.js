import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Analytics } from '@vercel/analytics/react'; // Import Vercel Analytics
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Standings data (sorted by PTS, then GD, with actual current Semifinal Position)
const standingsData = [
  { Team: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)", MP: 2, W: 1, L: 0, D: 1, GF: 2, GA: 1, GD: 1, PTS: 4, PPG: "2.0", SemifinalPosition: "W1" },
  { Team: "HTX West 14G Gold (Bracket C)", MP: 1, W: 1, L: 0, D: 0, GF: 1, GA: 0, GD: 1, PTS: 3, PPG: "3.0", SemifinalPosition: "W2" },
  { Team: "HTX Woodlands 14G Black (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 2, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "W3" },
  { Team: "HTX City 15 W (Bracket B)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "" },
  { Team: "HTX Kingwood 14G Gold (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 2, GA: 1, GD: 1, PTS: 3, PPG: "1.5", SemifinalPosition: "A1" },
  { Team: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 2, GD: -1, PTS: 3, PPG: "1.5", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2015 Girls Green (Bracket A)", MP: 2, W: 1, L: 1, D: 0, GF: 1, GA: 1, GD: 0, PTS: 3, PPG: "1.5", SemifinalPosition: "" },
  { Team: "GFI Academy GFI 2014 Girls DPL Next (Bracket B)", MP: 2, W: 0, L: 0, D: 2, GF: 1, GA: 1, GD: 0, PTS: 2, PPG: "1.0", SemifinalPosition: "" },
  { Team: "HTX Tomball 14G Gold (Bracket C)", MP: 2, W: 0, L: 1, D: 1, GF: 0, GA: 1, GD: -1, PTS: 1, PPG: "0.5", SemifinalPosition: "" },
  { Team: "Legacy Soccer Legacy 2014 Girls White (Bracket B)", MP: 1, W: 0, L: 1, D: 0, GF: 0, GA: 1, GD: -1, PTS: 0, PPG: "0.0", SemifinalPosition: "" },
];

// Game results data (updated with new tournament stats up to April 13, 2025)
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

// Projected points data (sorted by projected points)
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
    Team1: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)",
    Team1Chance: "34.65%",
    Team2: "HTX West 14G Gold (Bracket C)",
    Team2Chance: "61.75%",
  },
];

// Team records data (summary for main table, updated with actual stats from PDFs and added GD)
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

// Historical games data (Fall 2024 and Spring 2025, updated with actual data from PDFs)
const historicalGamesData = {
  "HTX Kingwood 14G Gold (Bracket A)": {
    fall2024: [
      { Match: "HTX Kingwood 14G Gold 3-0 HTX South 14G Gold (Sept 07, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 1-0 HTX Kingwood 14G Gold (Sept 15, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "HTX Kingwood 14G Gold 6-0 HTX Kingwood 14G Black (Sept 21, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "HTX City 15 W 4-2 HTX Kingwood 14G Gold (Sept 28, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX Tomball 14G Gold 6-0 HTX Kingwood 14G Gold (Oct 05, 2024)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "HTX Kingwood 14G Gold 0-3 HTX Woodlands 14G Black (Oct 12, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "HTX West 14G Gold 1-0 HTX Kingwood 14G Gold (Oct 19, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX Kingwood 14G Gold 3-0 GFI Academy GFI 2015 Girls DPL Next (Nov 09, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "HTX Woodlands 14G White 0-0 HTX Kingwood 14G Gold (Nov 16, 2024)", HomeTeam: "HTX Woodlands 14G White" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G White 0-4 HTX Kingwood 14G Gold (Nov 23, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G White" },
    ],
    spring2025: [
      { Match: "HTX Kingwood 14G Gold 1-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Feb 08, 2025)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "HTX Kingwood 14G Gold 2-0 Legacy Soccer Legacy 2014 Girls White (Mar 01, 2025)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 3-0 HTX Kingwood 14G Gold (Mar 08, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "HTX City 15 W 5-1 HTX Kingwood 14G Gold (Mar 29, 2025)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX West 14G Gold 3-2 HTX Kingwood 14G Gold (Mar 30, 2025)", HomeTeam: "HTX West 14G Gold" },
    ],
  },
  "HTX West 14G Gold (Bracket C)": {
    fall2024: [
      { Match: "HTX West 14G Gold 5-0 GFI Academy GFI 2015 Girls DPL Next (Sept 08, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX Kingwood 14G Black 0-8 HTX West 14G Gold (Sept 15, 2024)", HomeTeam: "HTX Kingwood 14G Black" },
      { Match: "HTX West 14G Gold 4-1 HTX Woodlands 14G White (Sept 22, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX West 14G Gold 0-0 HTX South 14G Gold (Oct 05, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G White 2-4 HTX West 14G Gold (Oct 06, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G White" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 0-0 HTX West 14G Gold (Oct 12, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "HTX West 14G Gold 1-0 HTX Kingwood 14G Gold (Oct 19, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX City 15 W 3-1 HTX West 14G Gold (Oct 26, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 2-0 HTX West 14G Gold (Nov 03, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX Woodlands 14G Black 1-0 HTX West 14G Gold (Nov 09, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX West 14G Gold 3-2 HTX Tomball 14G Gold (Nov 19, 2024)", HomeTeam: "HTX West 14G Gold" },
    ],
    spring2025: [
      { Match: "HTX West 14G Gold 1-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Mar 01, 2025)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX West 14G Gold 2-4 HTX City 15 W (Mar 22, 2025)", HomeTeam: "HTX West 14G Gold" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-4 HTX West 14G Gold (Mar 22, 2025)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 0-1 HTX West 14G Gold (Mar 29, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "HTX West 14G Gold 3-2 HTX Kingwood 14G Gold (Mar 30, 2025)", HomeTeam: "HTX West 14G Gold" },
    ],
  },
  "HTX Woodlands 14G Black (Bracket A)": {
    fall2024: [
      { Match: "HTX Woodlands 14G Black 1-0 Inwood SC ID PSG Academy Houston South 14G Blue (Sept 07, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Woodlands 14G Black 0-0 HTX City 15 W (Sept 08, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Woodlands 14G White 0-7 HTX Woodlands 14G Black (Sept 14, 2024)", HomeTeam: "HTX Woodlands 14G White" },
      { Match: "HTX South 14G Gold 0-3 HTX Woodlands 14G Black (Sept 28, 2024)", HomeTeam: "HTX South 14G Gold" },
      { Match: "HTX Woodlands 14G Black 6-0 HTX Kingwood 14G Black (Oct 06, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Kingwood 14G Gold 0-3 HTX Woodlands 14G Black (Oct 12, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-3 HTX Woodlands 14G Black (Oct 20, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G White 0-4 HTX Woodlands 14G Black (Nov 03, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G White" },
      { Match: "HTX Woodlands 14G Black 1-0 HTX West 14G Gold (Nov 09, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "GFI Academy GFI 2015 Girls DPL Next 0-7 HTX Woodlands 14G Black (Nov 23, 2024)", HomeTeam: "GFI Academy GFI 2015 Girls DPL Next" },
    ],
    spring2025: [
      { Match: "The ACDMY The ACDMY 14G 2-9 HTX Woodlands 14G Black (Feb 01, 2025)", HomeTeam: "The ACDMY The ACDMY 14G" },
      { Match: "HTX Tomball 14G Gold 1-0 HTX Woodlands 14G Black (Feb 02, 2025)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "HTX City 15 E 1-1 HTX Woodlands 14G Black (Mar 07, 2025)", HomeTeam: "HTX City 15 E" },
      { Match: "HTX Woodlands 14G Black 0-1 Legacy Soccer Legacy 2015 Girls Green (Mar 08, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Woodlands 14G Black 0-2 HTX Tomball 14G Gold (Mar 22, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Woodlands 14G Black 1-0 GFI Academy GFI 2014 Girls DPL Next (Mar 30, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
    ],
  },
  "HTX City 15 W (Bracket B)": {
    fall2024: [
      { Match: "HTX Woodlands 14G Black 0-0 HTX City 15 W (Sept 08, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX South 14G Gold 3-5 HTX City 15 W (Sept 14, 2024)", HomeTeam: "HTX South 14G Gold" },
      { Match: "GFI Academy GFI 2015 Girls DPL Next 1-5 HTX City 15 W (Sept 15, 2024)", HomeTeam: "GFI Academy GFI 2015 Girls DPL Next" },
      { Match: "HTX City 15 W 4-2 HTX Kingwood 14G Gold (Sept 28, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-5 HTX City 15 W (Oct 05, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX City 15 W 0-2 HTX Tomball 14G Gold (Oct 12, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX City 15 W 3-1 HTX West 14G Gold (Oct 26, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX City 15 W 8-1 Inwood SC ID PSG Academy Houston East 14G White (Nov 09, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 2-1 HTX City 15 W (Nov 15, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "HTX City 15 W 10-0 HTX Kingwood 14G Black (Nov 21, 2024)", HomeTeam: "HTX City 15 W" },
    ],
    spring2025: [
      { Match: "HTX City 15 W 3-0 Legacy Soccer Legacy 2014 Girls White (Feb 02, 2025)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX City 15 W 4-2 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Mar 01, 2025)", HomeTeam: "HTX City 15 W" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL 1-7 HTX City 15 W (Mar 08, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL" },
      { Match: "HTX West 14G Gold 2-4 HTX City 15 W (Mar 22, 2025)", HomeTeam: "HTX West 14G Gold" },
      { Match: "HTX City 15 W 5-1 HTX Kingwood 14G Gold (Mar 29, 2025)", HomeTeam: "HTX City 15 W" },
    ],
  },
  "Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Bracket A)": {
    fall2024: [
      { Match: "HTX Woodlands 14G Black 1-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Sept 07, 2024)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 1-0 HTX Kingwood 14G Gold (Sept 15, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 1-0 Inwood SC ID PSG Academy Houston South 14G Blue (Sept 21, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 0-0 HTX West 14G Gold (Oct 12, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "GFI Academy GFI 2015 Girls DPL Next 0-4 Inwood SC ID PSG Academy Houston South 14G Blue (Oct 13, 2024)", HomeTeam: "GFI Academy GFI 2015 Girls DPL Next" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 4-1 Inwood SC ID PSG Academy Houston East 14G White (Oct 26, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "HTX Kingwood 14G Black 0-2 Inwood SC ID PSG Academy Houston South 14G Blue (Nov 09, 2024)", HomeTeam: "HTX Kingwood 14G Black" },
      { Match: "HTX Woodlands 14G White 4-4 Inwood SC ID PSG Academy Houston South 14G Blue (Nov 10, 2024)", HomeTeam: "HTX Woodlands 14G White" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 2-1 HTX City 15 W (Nov 15, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 1-2 HTX South 14G Gold (Nov 16, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
    ],
    spring2025: [
      { Match: "HTX Kingwood 14G Gold 1-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Feb 08, 2025)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "HTX West 14G Gold 1-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Mar 01, 2025)", HomeTeam: "HTX West 14G Gold" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL 1-7 HTX City 15 W (Mar 08, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 6-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Mar 22, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL 0-3 Legacy Soccer Legacy 2014 Girls White (Mar 23, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL" },
    ],
  },
  "GFI Academy GFI 2014 Girls DPL Next (Bracket B)": {
    fall2024: [
      { Match: "HTX West 14G Gold 5-0 GFI Academy GFI 2014 Girls DPL Next (Sept 08, 2024)", HomeTeam: "HTX West 14G Gold" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 0-2 Legacy Soccer Legacy 2014 Girls White (Sept 14, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 3-2 Inwood SC ID PSG Academy Houston East 14G White (Sept 21, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "HTX Kingwood 14G Black 3-0 GFI Academy GFI 2014 Girls DPL Next (Sept 28, 2024)", HomeTeam: "HTX Kingwood 14G Black" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 0-7 HTX Tomball 14G Gold (Sept 29, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 0-4 Inwood SC ID PSG Academy Houston South 14G Blue (Oct 13, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "HTX Kingwood 14G Gold 3-0 GFI Academy GFI 2014 Girls DPL Next (Nov 09, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 0-7 HTX Woodlands 14G Black (Nov 23, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
    ],
    spring2025: [
      { Match: "GFI Academy GFI 2014 Girls DPL Next 5-0 Legacy Soccer Legacy 2015 Girls Green (Mar 02, 2025)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 3-2 The ACDMY The ACDMY 14G (Mar 22, 2025)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 5-1 HTX City 15 E (Mar 29, 2025)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "The ACDMY The ACDMY 14G 0-3 GFI Academy GFI 2014 Girls DPL Next (Mar 29, 2025)", HomeTeam: "The ACDMY The ACDMY 14G" },
      { Match: "HTX Woodlands 14G Black 1-0 GFI Academy GFI 2014 Girls DPL Next (Mar 30, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
    ],
  },
  "Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Bracket C)": {
    fall2024: [
      { Match: "Legacy Soccer Legacy 2014 Girls White 6-0 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Sept 07, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 3-2 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Sept 21, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 0-3 HTX Tomball 14G Gold (Sept 22, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 2-4 HTX West 14G Gold (Oct 06, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "HTX Kingwood 14G Black 5-2 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Oct 12, 2024)", HomeTeam: "HTX Kingwood 14G Black" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 4-1 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Oct 26, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 0-4 HTX Woodlands 14G Black (Nov 03, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "HTX City 15 W 8-1 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Nov 09, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 1-4 HTX South 14G Gold (Nov 16, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 1-4 HTX South 14G Gold (Nov 17, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
    ],
    spring2025: [
      { Match: "HTX City 15 W 4-2 Inwood SC ID PSG Academy Houston East 14G Blue EDPL (Mar 01, 2025)", HomeTeam: "HTX City 15 W" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 3-0 HTX Kingwood 14G Gold (Mar 08, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 6-0 Inwood SC ID PSG Academy Houston South 14G Blue EDPL (Mar 22, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 0-1 HTX West 14G Gold (Mar 29, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
    ],
  },
  "HTX Tomball 14G Gold (Bracket C)": {
    fall2024: [
      { Match: "HTX Tomball 14G Gold 7-0 HTX Woodlands 14G White (Sept 07, 2024)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-1 HTX Tomball 14G Gold (Sept 08, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "HTX Tomball 14G Gold 7-1 HTX South 14G Gold (Sept 21, 2024)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL 0-3 HTX Tomball 14G Gold (Sept 22, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston East 14G Blue EDPL" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue 1-3 HTX Tomball 14G Gold (Sept 28, 2024)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue" },
      { Match: "HTX Tomball 14G Gold 6-0 HTX Kingwood 14G Gold (Oct 05, 2024)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "HTX City 15 W 0-2 HTX Tomball 14G Gold (Oct 12, 2024)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX Tomball 14G Gold 4-1 HTX Kingwood 14G Black (Oct 19, 2024)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "HTX West 14G Gold 3-2 HTX Tomball 14G Gold (Nov 19, 2024)", HomeTeam: "HTX West 14G Gold" },
    ],
    spring2025: [
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-1 HTX Tomball 14G Gold (Feb 01, 2025)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "HTX Tomball 14G Gold 1-0 HTX Woodlands 14G Black (Feb 02, 2025)", HomeTeam: "HTX Tomball 14G Gold" },
      { Match: "The ACDMY The ACDMY 14G 2-4 HTX Tomball 14G Gold (Mar 02, 2025)", HomeTeam: "The ACDMY The ACDMY 14G" },
      { Match: "HTX Woodlands 14G Black 0-2 HTX Tomball 14G Gold (Mar 22, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX Tomball 14G Gold 5-1 HTX City 15 E (Mar 24, 2025)", HomeTeam: "HTX Tomball 14G Gold" },
    ],
  },
  "Legacy Soccer Legacy 2015 Girls Green (Bracket A)": {
    fall2024: [
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-1 HTX Tomball 14G Gold (Sept 07, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-0 HTX Woodlands 14G Black (Sept 07, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-0 Inwood SC ID PSG Academy Houston South 14G Blue (Sept 15, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 0-0 HTX Woodlands 14G Black (Sept 21, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 0-2 Inwood SC ID PSG Academy Houston East 14G White (Sept 28, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-2 HTX City 15 W (Oct 05, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 0-4 Legacy Soccer Legacy 2014 Girls White (Oct 12, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 0-2 Legacy Soccer Legacy 2014 Girls White (Oct 26, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 8-1 HTX Kingwood 14G Black (Nov 03, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 8-1 HTX Kingwood 14G Black (Nov 17, 2024)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
    ],
    spring2025: [
      { Match: "Legacy Soccer Legacy 2015 Girls Green 1-1 HTX Tomball 14G Gold (Feb 01, 2025)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 5-0 Legacy Soccer Legacy 2015 Girls Green (Mar 02, 2025)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "HTX Woodlands 14G Black 0-1 Legacy Soccer Legacy 2015 Girls Green (Mar 08, 2025)", HomeTeam: "HTX Woodlands 14G Black" },
      { Match: "HTX City 15 E 1-5 Legacy Soccer Legacy 2015 Girls Green (Mar 09, 2025)", HomeTeam: "HTX City 15 E" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 3-1 HTX City 15 E (Mar 22, 2025)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
      { Match: "Legacy Soccer Legacy 2015 Girls Green 8-2 The ACDMY The ACDMY 14G (Mar 26, 2025)", HomeTeam: "Legacy Soccer Legacy 2015 Girls Green" },
    ],
  },
  "Legacy Soccer Legacy 2014 Girls White (Bracket B)": {
    fall2024: [
      { Match: "Legacy Soccer Legacy 2014 Girls White 6-0 Inwood SC ID PSG Academy Houston East 14G White (Sept 07, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "GFI Academy GFI 2014 Girls DPL Next 0-2 Legacy Soccer Legacy 2014 Girls White (Sept 14, 2024)", HomeTeam: "GFI Academy GFI 2014 Girls DPL Next" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 1-0 Inwood SC ID PSG Academy Houston South 14G Blue (Sept 21, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX Woodlands 14G White 0-2 Legacy Soccer Legacy 2014 Girls White (Sept 29, 2024)", HomeTeam: "HTX Woodlands 14G White" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-5 HTX City 15 W (Oct 05, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX South 14G Gold 1-0 Legacy Soccer Legacy 2014 Girls White (Oct 12, 2024)", HomeTeam: "HTX South 14G Gold" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-3 HTX Woodlands 14G Black (Oct 20, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX Kingwood 14G Gold 2-0 Legacy Soccer Legacy 2014 Girls White (Oct 26, 2024)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 2-0 HTX West 14G Gold (Nov 03, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "HTX Woodlands 14G White 4-4 Inwood SC ID PSG Academy Houston South 14G Blue (Nov 10, 2024)", HomeTeam: "HTX Woodlands 14G White" }, // Not a match for this team
      { Match: "Legacy Soccer Legacy 2014 Girls White 8-1 HTX Kingwood 14G Black (Nov 17, 2024)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
    ],
    spring2025: [
      { Match: "HTX City 15 W 3-0 Legacy Soccer Legacy 2014 Girls White (Feb 02, 2025)", HomeTeam: "HTX City 15 W" },
      { Match: "HTX Kingwood 14G Gold 2-0 Legacy Soccer Legacy 2014 Girls White (Mar 01, 2025)", HomeTeam: "HTX Kingwood 14G Gold" },
      { Match: "Legacy Soccer Legacy 2014 Girls White 0-4 HTX West 14G Gold (Mar 22, 2025)", HomeTeam: "Legacy Soccer Legacy 2014 Girls White" },
      { Match: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL 0-3 Legacy Soccer Legacy 2014 Girls White (Mar 23, 2025)", HomeTeam: "Inwood SC ID PSG Academy Houston South 14G Blue EDPL" },
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

// Columns for team records table (summary, with GD column)
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

// Columns for detailed games table (Fall 2024, Spring 2025, three columns)
const detailedGamesColumns = [
  { Header: 'Team Score', accessor: 'TeamScore', className: 'sticky-column' },
  { Header: 'Opponent Score', accessor: 'OpponentScore' },
  { Header: 'Opponent & Date', accessor: 'OpponentDate' },
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

  // Function to get games for a specific team and determine match result
  const getTeamGames = (teamName) => {
    const fall2024Games = historicalGamesData[teamName]?.fall2024 || [];
    const spring2025Games = historicalGamesData[teamName]?.spring2025 || [];

    // Process games to split into three columns and determine result
    const processGames = (games) => {
      return games.map(game => {
        // Extract score and opponent (e.g., "HTX City 15 W 1-0 Inwood SC PSG South (Sept 10, 2024)")
        const matchParts = game.Match.split(' ');
        const scoreIndex = matchParts.findIndex(part => part.includes('-')); // Find index of score (e.g., "1-0")
        const score = matchParts[scoreIndex]; // e.g., "1-0"
        const opponentStartIndex = scoreIndex + 1;
        const opponentEndIndex = matchParts.findIndex((part, idx) => idx > scoreIndex && part.startsWith('(')); // Find start of date
        const opponent = matchParts.slice(opponentStartIndex, opponentEndIndex).join(' '); // e.g., "Inwood SC PSG South"
        const date = matchParts.slice(opponentEndIndex).join(' '); // e.g., "(Sept 10, 2024)"

        // Split the score into team score and opponent score
        const [teamScore, opponentScore] = score.split('-').map(Number);

        // Determine result (win, loss, draw) based on score
        let result;
        if (teamScore > opponentScore) {
          result = 'win';
        } else if (teamScore < opponentScore) {
          result = 'loss';
        } else {
          result = 'draw';
        }

        // Debug: Log the result to confirm it's being set correctly
        console.log(`Team: ${teamName}, Match: ${game.Match}, Result: ${result}`);

        return {
          TeamScore: teamScore,
          OpponentScore: opponentScore,
          OpponentDate: `${opponent} ${date}`,
          Result: result,
        };
      });
    };

    return {
      fall2024: processGames(fall2024Games),
      spring2025: processGames(spring2025Games),
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
                            <table className="table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  {detailedGamesColumns.map(column => (
                                    <th key={column.Header} className={column.className}>
                                      {column.Header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.fall2024.map((game, index) => (
                                  <tr key={index} className={game.Result === 'win' ? 'win-row' : game.Result === 'loss' ? 'loss-row' : ''}>
                                    <td>{game.TeamScore}</td>
                                    <td>{game.OpponentScore}</td>
                                    <td>{game.OpponentDate}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <h4 className="text-center mb-3 mt-4">Spring 2025 Games</h4>
                            <table className="table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  {detailedGamesColumns.map(column => (
                                    <th key={column.Header} className={column.className}>
                                      {column.Header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {teamGames.spring2025.map((game, index) => (
                                  <tr key={index} className={game.Result === 'win' ? 'win-row' : game.Result === 'loss' ? 'loss-row' : ''}>
                                    <td>{game.TeamScore}</td>
                                    <td>{game.OpponentScore}</td>
                                    <td>{game.OpponentDate}</td>
                                  </tr>
                                ))}
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
