import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';
import { Adjudicator } from '@/types/adjudicator';

// Mock data for adjudicator admin profiles
export const mockAdjudicatorAdminProfiles: AdjudicatorAdminProfile[] = [
  {
    id: '1',
    userId: 'user-1',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    bio: 'Former principal dancer with National Ballet. 15+ years teaching experience specializing in classical ballet and pointe technique.',
    credentials: 'MFA in Dance, Certified Ballet Instructor',
    danceStyles: ['Ballet', 'Contemporary', 'Pointe'],
    price: 50,
    expectedTurnaround: 48,
    rating: 4.8,
    totalCritiques: 34,
    totalEarnings: 1700,
    accountStatus: 'active',
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2023-07-20T15:30:00Z',
    permissions: {
      availableForCritiques: true,
      publiclyVisible: true,
      canUseAdvancedTools: true
    },
    financial: {
      paymentSplitPercentage: 70,
      totalEarnings: 1700,
      payoutStatus: 'active',
      payoutSchedule: 'Monthly (15th)'
    },
    performance: {
      critiquesCompleted: 34,
      averageRating: 4.8,
      internalNotes: 'Excellent feedback from clients. Very detailed critiques.',
      lastActive: '2023-07-21',
      pendingCritiques: 2
    },
    tags: ['Ballet Specialist', 'Competition Judge', 'Quick Turnaround'],
    notificationsEnabled: true
  },
  {
    id: '2',
    userId: 'user-2',
    fullName: 'Michael Chen',
    email: 'michael.c@example.com',
    bio: 'Professional hip hop dancer and choreographer with experience working with major recording artists.',
    credentials: 'BFA in Dance, Professional Choreographer',
    danceStyles: ['Hip Hop', 'Jazz', 'Commercial'],
    price: 45,
    expectedTurnaround: 72,
    rating: 4.6,
    totalCritiques: 27,
    totalEarnings: 1215,
    accountStatus: 'active',
    createdAt: '2023-04-02T14:20:00Z',
    updatedAt: '2023-07-18T09:45:00Z',
    permissions: {
      availableForCritiques: true,
      publiclyVisible: true,
      canUseAdvancedTools: true
    },
    financial: {
      paymentSplitPercentage: 65,
      totalEarnings: 1215,
      payoutStatus: 'active',
      payoutSchedule: 'Monthly (15th)'
    },
    performance: {
      critiquesCompleted: 27,
      averageRating: 4.6,
      internalNotes: 'Great with contemporary styles.',
      lastActive: '2023-07-19',
      pendingCritiques: 3
    },
    tags: ['Hip Hop Specialist', 'Commercial Dance'],
    notificationsEnabled: true
  }
];

// Convert admin profiles to simple adjudicator data for client-facing components
export const mockAdjudicatorData: Adjudicator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    bio: 'Former principal dancer with National Ballet. 15+ years teaching experience specializing in classical ballet and pointe technique.',
    specialties: ['Ballet', 'Contemporary', 'Pointe'],
    rating: 4.8,
    price: 50,
    rate: 50,
    turnaroundTime: 48,
    totalCritiques: 34,
    reviewCount: 34,
    experience: 15,
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Michael Chen',
    bio: 'Professional hip hop dancer and choreographer with experience working with major recording artists.',
    specialties: ['Hip Hop', 'Jazz', 'Commercial'],
    rating: 4.6,
    price: 45,
    rate: 45,
    turnaroundTime: 72,
    totalCritiques: 27,
    reviewCount: 27,
    experience: 12,
    location: 'Los Angeles, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    bio: 'Contemporary dance specialist with Broadway experience. Expert in lyrical and modern dance techniques.',
    specialties: ['Contemporary', 'Lyrical', 'Modern'],
    rating: 4.9,
    price: 55,
    rate: 55,
    turnaroundTime: 24,
    totalCritiques: 42,
    reviewCount: 42,
    experience: 18,
    location: 'Chicago, IL',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Kim',
    bio: 'Former Juilliard instructor specializing in classical ballet and character dance. Competition judge for 10+ years.',
    specialties: ['Ballet', 'Character', 'Variations'],
    rating: 4.7,
    price: 60,
    rate: 60,
    turnaroundTime: 48,
    totalCritiques: 38,
    reviewCount: 38,
    experience: 20,
    location: 'Boston, MA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];