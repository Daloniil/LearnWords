export type MetroStation = {
    name: string;
    line: 'red' | 'blue' | 'green';
    latitude: number;
    longitude: number;
};

export type StationInfo =
    | { type: 'station'; name: string; line: 'red' | 'blue' | 'green' }
    | { type: 'between'; first: string; second: string, timeToNextStation: number }
    | { type: 'none' }