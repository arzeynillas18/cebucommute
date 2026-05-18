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
  { id:'01b', code:'01B', origin:'Colon', dest:'SM City', area:'Downtown', color:'#0D9488', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through MJ Cuenco Ave. Subject to traffic.' },
  { id:'01c', code:'01C', origin:'Private', dest:'Colon', area:'Downtown', color:'#0F766E', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'01k', code:'01K', origin:'Urgello', dest:'Parkmall', area:'Uptown', color:'#14B8A6', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through Mandaue area. Subject to traffic.' },
  { id:'02b', code:'02B', origin:'South Bus Terminal', dest:'Colon', area:'Downtown', color:'#6366F1', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak; 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'03a', code:'03A', origin:'Mabolo', dest:'Carbon', area:'Downtown', color:'#EA580C', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through Osmena Blvd. Subject to traffic.' },
  { id:'03b', code:'03B', origin:'Mabolo', dest:'Carbon', area:'Downtown', color:'#F97316', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Alternative route via Juan Luna. Subject to traffic.' },
  { id:'03q', code:'03Q', origin:'Ayala', dest:'SM City', area:'Uptown', color:'#FB923C', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Express route Ayala to SM. Subject to traffic.' },
  { id:'04b', code:'04B', origin:'Lahug', dest:'Carbon', area:'Downtown', color:'#7C3AED', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak; 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through Jakosalem St. Subject to traffic.' },
  { id:'04h', code:'04H', origin:'Plaza Housing', dest:'Carbon', area:'Downtown', color:'#8B5CF6', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 20-30 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'04l', code:'04L', origin:'Lahug', dest:'Ayala', area:'Uptown', color:'#A855F7', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak (6AM-9AM, 4PM-7PM); 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through IT Park. Subject to traffic.' },
  { id:'04m', code:'04M', origin:'Lahug', dest:'Ayala', area:'Uptown', color:'#9333EA', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Via UP Cebu. Subject to traffic.' },
  { id:'06b', code:'06B', origin:'Guadalupe', dest:'Carbon', area:'Downtown', color:'#16A34A', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'06c', code:'06C', origin:'Guadalupe', dest:'Carbon', area:'Downtown', color:'#15803D', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Alternative Guadalupe route. Subject to traffic.' },
  { id:'06h', code:'06H', origin:'Guadalupe', dest:'SM City', area:'Uptown', color:'#22C55E', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'07b', code:'07B', origin:'Banawa', dest:'Carbon', area:'Downtown', color:'#B45309', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'08f', code:'08F', origin:'Alumnos', dest:'SM City', area:'Uptown', color:'#D97706', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'08g', code:'08G', origin:'Alumnos', dest:'Colon', area:'Downtown', color:'#F59E0B', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'09c', code:'09C', origin:'Basak', dest:'Colon', area:'Downtown', color:'#0284C7', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'10c', code:'10C', origin:'Carbon', dest:'Ayala', area:'Downtown', color:'#0369A1', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Passes through Osmena Blvd. Subject to traffic.' },
  { id:'10f', code:'10F', origin:'Bulacao', dest:'Colon', area:'Downtown', color:'#0891B2', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'South Cebu route. Subject to traffic.' },
  { id:'10m', code:'10M', origin:'Bulacao', dest:'SM City', area:'Uptown', color:'#06B6D4', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'South Cebu to SM express. Subject to traffic.' },
  { id:'11a', code:'11A', origin:'Inayawan', dest:'Colon', area:'Downtown', color:'#7C2D12', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'12g', code:'12G', origin:'Labangon', dest:'SM City', area:'Uptown', color:'#DC2626', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'12l', code:'12L', origin:'Labangon', dest:'Ayala', area:'Downtown', color:'#B91C1C', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'13b', code:'13B', origin:'Talamban', dest:'Carbon', area:'Downtown', color:'#BE185D', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'North Cebu route. Subject to traffic.' },
  { id:'13c', code:'13C', origin:'Talamban', dest:'Colon', area:'Downtown', color:'#9D174D', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'North Cebu to downtown. Subject to traffic.' },
  { id:'14d', code:'14D', origin:'Ayala', dest:'Colon', area:'Downtown', color:'#475569', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 10-15 min peak; 20-30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'17b', code:'17B', origin:'Apas', dest:'Carbon', area:'Downtown', color:'#BE185D', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'17c', code:'17C', origin:'Apas', dest:'Carbon', area:'Downtown', color:'#DB2777', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Alternative Apas route. Subject to traffic.' },
  { id:'17d', code:'17D', origin:'Apas', dest:'Carbon', area:'Downtown', color:'#EC4899', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic; holidays may vary.' },
  { id:'20a', code:'20A', origin:'Mandaue', dest:'Ayala', area:'Uptown', color:'#065F46', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Mandaue City route. Subject to traffic.' },
  { id:'21a', code:'21A', origin:'Mandaue', dest:'Cathedral', area:'Downtown', color:'#047857', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Mandaue to downtown Cebu. Subject to traffic.' },
  { id:'22a', code:'22A', origin:'Mandaue', dest:'Cathedral', area:'Downtown', color:'#059669', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Alternative Mandaue route. Subject to traffic.' },
  { id:'62b', code:'62B', origin:'Pit-os', dest:'Carbon', area:'Downtown', color:'#78350F', hours:'5:00 AM - 9:00 PM', fare:13, frequency:'Every 20-30 min; 30 min off-peak', firstTrip:'5:00 AM', lastTrip:'9:00 PM', notes:'Far north Cebu route. Subject to traffic.' },
  { id:'03l', code:'03L', origin:'Labangon', dest:'Carbon', area:'Downtown', color:'#CA8A04', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'04c', code:'04C', origin:'Lahug', dest:'Carbon', area:'Downtown', color:'#65A30D', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'06g', code:'06G', origin:'Guadalupe', dest:'Carbon', area:'Downtown', color:'#16A34A', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'09g', code:'09G', origin:'Basak', dest:'SM City', area:'Uptown', color:'#0284C7', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'10g', code:'10G', origin:'Bulacao', dest:'Ayala', area:'Uptown', color:'#0369A1', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'11d', code:'11D', origin:'Inayawan', dest:'SM City', area:'Uptown', color:'#92400E', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'12d', code:'12D', origin:'Labangon', dest:'Carbon', area:'Downtown', color:'#EF4444', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'12i', code:'12I', origin:'Labangon', dest:'Carbon', area:'Downtown', color:'#F97316', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'14b', code:'14B', origin:'Ayala', dest:'Colon', area:'Downtown', color:'#64748B', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'21b', code:'21B', origin:'Mandaue', dest:'Cathedral', area:'Downtown', color:'#10B981', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'22b', code:'22B', origin:'Mandaue', dest:'Cathedral', area:'Downtown', color:'#34D399', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'22d', code:'22D', origin:'Mandaue', dest:'Ayala', area:'Uptown', color:'#6EE7B7', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'22i', code:'22I', origin:'Mandaue', dest:'IT Park', area:'Uptown', color:'#2DD4BF', hours:'5:00 AM - 10:00 PM', fare:15, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
  { id:'03b2', code:'03B', origin:'Mabolo', dest:'Carbon', area:'Downtown', color:'#F97316', hours:'5:00 AM - 10:00 PM', fare:13, frequency:'Every 15-20 min', firstTrip:'5:00 AM', lastTrip:'10:00 PM', notes:'Subject to traffic.' },
];

// Routes to pre-generate GeoJSON for on first launch
export const PREGENERATE_ROUTES = ['01B', '04L', '03A'];

// Cebu city center region for map
export const CEBU_REGION = {
  latitude:      10.3000,
  longitude:     123.9000,
  latitudeDelta:  0.08,
  longitudeDelta: 0.07,
};