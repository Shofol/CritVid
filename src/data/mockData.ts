import { User, DancerProfile, Adjudicator, VideoSubmission, Critique } from '@/types';
import { VideoSubmissionExtended } from '@/types/videoLibrary';

// Mock Users - Safe array
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    role: 'dancer',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'dancer',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'adjudicator',
    profileImage: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james@example.com',
    role: 'adjudicator',
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@critvid.com',
    role: 'admin',
    profileImage: 'https://randomuser.me/api/portraits/women/5.jpg'
  }
];

// Mock Dancer Profiles - Safe array
export const mockDancerProfiles: DancerProfile[] = [
  {
    id: '1',
    userId: '1',
    name: 'Emma Johnson',
    dateOfBirth: '2005-06-15',
    danceStyles: ['Ballet', 'Contemporary'],
    age: 18
  },
  {
    id: '2',
    userId: '2',
    name: 'Michael Chen',
    dateOfBirth: '2010-03-22',
    danceStyles: ['Hip Hop', 'Breaking'],
    age: 13
  }
];

// Mock Adjudicators - Safe array
export const mockAdjudicators: Adjudicator[] = [
  {
    id: '1',
    userId: '3',
    credentials: 'Former Principal Dancer, NYC Ballet',
    danceStyles: ['Ballet', 'Contemporary', 'Modern'],
    price: 75,
    averageTurnaround: 5,
    rating: 4.8
  },
  {
    id: '2',
    userId: '4',
    credentials: 'Professional Choreographer, 15 years experience',
    danceStyles: ['Hip Hop', 'Breaking', 'Jazz'],
    price: 60,
    averageTurnaround: 3,
    rating: 4.6
  }
];

// Mock Video Submissions - Safe array
export const mockVideoSubmissions: VideoSubmission[] = [
  {
    id: '1',
    dancerId: '1',
    title: 'Swan Lake Variation',
    danceStyle: 'Ballet',
    videoUrl: '/sample-dance-video.mp4',
    feedbackRequested: 'Looking for feedback on my technique and extensions',
    status: 'completed',
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '2',
    dancerId: '1',
    title: 'Contemporary Solo',
    danceStyle: 'Contemporary',
    videoUrl: '/sample-dance-video.mp4',
    feedbackRequested: 'Need help with emotional expression',
    status: 'assigned',
    createdAt: '2023-06-15T09:45:00Z'
  },
  {
    id: '3',
    dancerId: '2',
    title: 'Breaking Routine',
    danceStyle: 'Breaking',
    videoUrl: '/sample-dance-video.mp4',
    feedbackRequested: 'Want to improve my power moves',
    status: 'pending',
    createdAt: '2023-06-20T16:15:00Z'
  },
  {
    id: '4',
    dancerId: '1',
    title: 'Recent Jazz Performance',
    danceStyle: 'Jazz',
    videoUrl: '/sample-dance-video.mp4',
    feedbackRequested: 'Looking for feedback on my rhythm and timing',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// Mock Videos for Video Library (Extended)
export const mockVideos: VideoSubmissionExtended[] = mockVideoSubmissions.map(video => ({
  id: video.id,
  dancerId: video.dancerId,
  title: video.title,
  danceStyle: video.danceStyle,
  videoUrl: video.videoUrl,
  thumbnailUrl: '/placeholder.svg',
  feedbackRequested: video.feedbackRequested,
  status: video.status as 'pending' | 'assigned' | 'completed',
  createdAt: video.createdAt
}));

// Mock Critiques - Safe array
export const mockCritiques: Critique[] = [
  {
    id: '1',
    submissionId: '1',
    adjudicatorId: '1',
    videoUrl: '/sample-dance-video.mp4',
    voiceOverUrl: 'https://example.com/voiceover1.mp3',
    transcription: 'Your arabesque is beautiful, but try to maintain height through your supporting leg. Your port de bras shows excellent musicality...',
    aiSuggestions: [
      'Practice relevés on one leg to strengthen your supporting leg',
      'Work on slow controlled adagio to improve balance',
      'Focus on maintaining turnout during transitions'
    ],
    rating: 5,
    createdAt: '2023-05-15T10:20:00Z'
  }
];

// Current logged in user (for demo purposes)
export const currentUser = mockUsers[0];

// Export default mockData object for compatibility
export const mockData = {
  users: mockUsers,
  dancerProfiles: mockDancerProfiles,
  adjudicators: mockAdjudicators,
  videoSubmissions: mockVideoSubmissions,
  videos: mockVideos,
  critiques: mockCritiques,
  currentUser
};

export default mockData;