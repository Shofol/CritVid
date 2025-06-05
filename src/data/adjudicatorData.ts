import { Adjudicator } from '@/types/findAdjudicator';

export const adjudicators: Adjudicator[] = [
  {
    id: '1',
    userId: '101',
    name: 'Sarah Williams',
    profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    credentials: 'Former Principal Dancer, NYC Ballet',
    danceStyles: ['Ballet', 'Contemporary', 'Modern'],
    price: 75,
    averageTurnaround: 5,
    rating: 4.8,
    totalCritiques: 127,
    bio: 'With 15 years of experience as a principal dancer with the NYC Ballet, I specialize in classical ballet technique and contemporary movement. My critiques focus on proper alignment, musicality, and artistic expression.',
    availability: 'Available within 5 days'
  },
  {
    id: '2',
    userId: '102',
    name: 'James Rodriguez',
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    credentials: 'Professional Choreographer, 15 years experience',
    danceStyles: ['Hip Hop', 'Breaking', 'Jazz'],
    price: 60,
    averageTurnaround: 3,
    rating: 4.6,
    totalCritiques: 95,
    bio: 'Award-winning choreographer with experience working with major artists and dance companies. I provide detailed feedback on rhythm, dynamics, and performance quality.',
    availability: 'Available within 3 days'
  },
  {
    id: '3',
    userId: '103',
    name: 'Elena Petrova',
    profileImage: 'https://randomuser.me/api/portraits/women/42.jpg',
    credentials: 'Former Bolshoi Ballet Soloist, Dance Educator',
    danceStyles: ['Ballet', 'Character', 'Folk'],
    price: 85,
    averageTurnaround: 4,
    rating: 4.9,
    totalCritiques: 156,
    bio: 'Trained at the Vaganova Academy and former soloist with the Bolshoi Ballet. I provide thorough technical analysis with a focus on classical ballet traditions and proper execution.',
    availability: 'Available within 4 days'
  },
  {
    id: '4',
    userId: '104',
    name: 'Marcus Johnson',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    credentials: 'Broadway Performer, Tap & Jazz Specialist',
    danceStyles: ['Tap', 'Jazz', 'Musical Theatre'],
    price: 65,
    averageTurnaround: 2,
    rating: 4.7,
    totalCritiques: 88,
    bio: 'Broadway veteran with credits in Hamilton, Chicago, and more. My critiques focus on performance quality, showmanship, and technical precision in jazz and tap.',
    availability: 'Available within 2 days'
  },
  {
    id: '5',
    userId: '105',
    name: 'Aisha Patel',
    profileImage: 'https://randomuser.me/api/portraits/women/63.jpg',
    credentials: 'Kathak Master, Indian Classical Dance Expert',
    danceStyles: ['Kathak', 'Bollywood', 'Fusion'],
    price: 70,
    averageTurnaround: 3,
    rating: 4.8,
    totalCritiques: 112,
    bio: 'Trained in Kathak for over 20 years and experienced in various Indian classical and contemporary fusion styles. I provide detailed feedback on footwork, expressions, and storytelling.',
    availability: 'Available within 3 days'
  }
];

export const danceStyleOptions = [
  'Ballet',
  'Contemporary',
  'Modern',
  'Hip Hop',
  'Breaking',
  'Jazz',
  'Tap',
  'Character',
  'Folk',
  'Musical Theatre',
  'Kathak',
  'Bollywood',
  'Fusion'
];
