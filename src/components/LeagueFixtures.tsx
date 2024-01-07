import React, { useEffect, useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
import bettingstyle from '../styles/betting.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Loading from './Loading'
import { faCalendar, faCalendarAlt, faFontAwesome } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

interface Fixture {
    _id: string;
    fid: number;
    fixture: {
        id: number;
        referee: string | null;
        timezone: string;
        date: string;
        timestamp: number;
        periods: {
            first: number;
            second: number;
        };
        venue: {
            id: number | null;
            name: string;
            city: string;
        };
        status: {
            long: string;
            short: string;
            elapsed: number;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
        round: string;
    };
    teams: {
        home: {
          id: number;
          name: string;
          logo: string;
          winner: boolean | null;
        };
        away: {
          id: number;
          name: string;
          logo: string;
          winner: boolean | null;
        };
    };
    goals: {
        home: number;
        away: number;
    };
    score: {
      halftime: { home: number; away: number };
      fulltime: { home: number; away: number };
      extratime: { home: number | null; away: number | null };
      penalty: { home: number | null; away: number | null };
    };
    __v: number;
  }
  
  interface League {
    leagueId: number;
    leagueName: string;
    fixtures: Fixture[];
  }

const LoadLeagueFixtures:React.FC<{Props: League[]}> = (props) => {
  
  console.log('league fixtures props',props)
  // types.ts

return (
    <>
      <div className={bettingstyle.main}>
        
        <div className={bettingstyle.main_in}>
          
        </div>
      </div>
    </>
  );
}

export default LoadLeagueFixtures
