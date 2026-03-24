// ─── Jeepney Route Constants ──────────────────────────────────────────────────

export interface JeepneyRoute {
  id:        string;
  code:      string;
  origin:    string;
  dest:      string;
  area:      'Downtown' | 'Uptown';
  color:     string;
  hours:     string;
  fare:      number;
  frequency: string;
  firstTrip: string;
  lastTrip:  string;
  notes:     string;
}

export const JEEPNEY_ROUTES: JeepneyRoute[] = [
  {
    id:        '01b',
    code:      '01B',
    origin:    'Colon',
    dest:      'SM City',
    area:      'Downtown',
    color:     '#0D9488',
    hours:     '5:00 AM - 10:00 PM',
    fare:      13,
    frequency: 'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak',
    firstTrip: '5:00 AM',
    lastTrip:  '10:00 PM',
    notes:     'Subject to traffic; holidays may vary.',
  },
  {
    id:        '04l',
    code:      '04L',
    origin:    'Carbon',
    dest:      'IT Park',
    area:      'Uptown',
    color:     '#7C3AED',
    hours:     '5:00 AM - 10:00 PM',
    fare:      13,
    frequency: 'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak',
    firstTrip: '5:00 AM',
    lastTrip:  '10:00 PM',
    notes:     'Subject to traffic; holidays may vary.',
  },
  {
    id:        '03a',
    code:      '03A',
    origin:    'Ayala',
    dest:      'Colon',
    area:      'Downtown',
    color:     '#EA580C',
    hours:     '5:00 AM - 10:00 PM',
    fare:      13,
    frequency: 'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak',
    firstTrip: '5:00 AM',
    lastTrip:  '10:00 PM',
    notes:     'Subject to traffic; holidays may vary.',
  },
  {
    id:        '10c',
    code:      '10C',
    origin:    'Carbon',
    dest:      'Ayala',
    area:      'Downtown',
    color:     '#0284C7',
    hours:     '5:00 AM - 10:00 PM',
    fare:      13,
    frequency: 'Every 15-20 min; 30 min off-peak',
    firstTrip: '5:00 AM',
    lastTrip:  '10:00 PM',
    notes:     'Subject to traffic; holidays may vary.',
  },
  {
    id:        '17b',
    code:      '17B',
    origin:    'Lahug',
    dest:      'SM City',
    area:      'Uptown',
    color:     '#BE185D',
    hours:     '5:00 AM - 9:00 PM',
    fare:      13,
    frequency: 'Every 15-20 min peak; 30 min off-peak',
    firstTrip: '5:00 AM',
    lastTrip:  '9:00 PM',
    notes:     'Subject to traffic; holidays may vary.',
  },
];

// Routes to pre-generate GeoJSON for on first launch
export const PREGENERATE_ROUTES = ['01B', '04L', '03A'];

// Cebu city center region for map
export const CEBU_REGION = {
  latitude:      10.3157,
  longitude:     123.8854,
  latitudeDelta:  0.05,
  longitudeDelta: 0.04,
};