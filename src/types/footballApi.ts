
export interface FootballApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface Fixture {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number;
    };
    venue?: {
      name: string;
      city: string;
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
    home: Team & { winner: boolean | null };
    away: Team & { winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export interface FixtureStatistic {
  type: string;
  value: string | number;
}

export interface TeamStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: FixtureStatistic[];
}

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string; // "Goalkeeper" | "Defender" | "Midfielder" | "Attacker"
  photo: string;
}

export interface SquadResponse {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  players: SquadPlayer[];
}

export interface PlayerStatisticsResponse {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: { date: string; place: string; country: string };
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo: string;
  };
  statistics: PlayerSeasonStats[];
}

export interface PlayerSeasonStats {
  team: { id: number; name: string; logo: string };
  league: { id: number; name: string; country: string; logo: string; flag: string; season: number };
  games: { appearences: number; lineups: number; minutes: number; number: number | null; position: string; rating: string | null; captain: boolean };
  substitutes: { in: number; out: number; bench: number };
  shots: { total: number | null; on: number | null };
  goals: { total: number | null; conceded: number | null; assists: number | null; saves: number | null };
  passes: { total: number | null; key: number | null; accuracy: number | null };
  tackles: { total: number | null; blocks: number | null; interceptions: number | null };
  duels: { total: number | null; won: number | null };
  dribbles: { attempts: number | null; success: number | null; past: number | null };
  fouls: { drawn: number | null; committed: number | null };
  cards: { yellow: number; yellowred: number; red: number };
  penalty: { won: number | null; commited: number | null; scored: number | null; missed: number | null; saved: number | null };
}
