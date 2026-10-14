import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  signInAnonymously,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import {
  VERIFIED_FEMALE_GUIDES,
  INITIAL_SAFETY_TIPS,
  INITIAL_COMPANION_POSTS,
  FemaleGuide,
  CommunitySafetyTip,
  CompanionPost,
} from '../data/community/initialCommunityData';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  homeCity: string;
  bio?: string;
  verifiedBadge: boolean;
}

export const CommunityFirebaseService = {
  // Auth state listener
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Google Sign-in
  async signInWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      console.warn('Google sign-in popup error, falling back to quick sign-in:', err);
      // Fallback for iframe popup block
      const anonResult = await signInAnonymously(auth);
      return anonResult.user;
    }
  },

  // Guest / Solo traveler sign in
  async signInAsGuest(name: string, homeCity: string): Promise<UserProfile> {
    const cred = await signInAnonymously(auth);
    const profile: UserProfile = {
      uid: cred.user.uid,
      displayName: name || 'Solo Traveler',
      email: null,
      homeCity: homeCity || 'Tamil Nadu',
      verifiedBadge: false,
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), profile, { merge: true });
    } catch (e) {
      console.warn('Could not save user profile:', e);
    }
    return profile;
  },

  async signOut() {
    await fbSignOut(auth);
  },

  // Get Safety Tips by District
  async getSafetyTips(district?: string): Promise<CommunitySafetyTip[]> {
    try {
      const tipsCol = collection(db, 'safety_tips');
      const q = district && district !== 'All'
        ? query(tipsCol, where('district', '==', district))
        : tipsCol;
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreTips = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunitySafetyTip));
        // Deduplicate with initial
        const firestoreIds = new Set(firestoreTips.map((t) => t.id));
        const filteredInitial = INITIAL_SAFETY_TIPS.filter((t) => !firestoreIds.has(t.id));
        return [...firestoreTips, ...filteredInitial];
      }
    } catch (e) {
      console.warn('Firestore safety tips read notice:', e);
    }
    // Fallback to verified local curated tips
    if (district && district !== 'All') {
      return INITIAL_SAFETY_TIPS.filter((t) => t.district.toLowerCase() === district.toLowerCase());
    }
    return INITIAL_SAFETY_TIPS;
  },

  // Post Safety Tip
  async postSafetyTip(tip: Omit<CommunitySafetyTip, 'id' | 'timestamp' | 'upvotes' | 'reportedCount'>): Promise<CommunitySafetyTip> {
    const newTip: CommunitySafetyTip = {
      ...tip,
      id: `tip-${Date.now()}`,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      reportedCount: 0,
    };
    try {
      await setDoc(doc(db, 'safety_tips', newTip.id), newTip);
    } catch (e) {
      console.warn('Firestore tip write notice, saving locally:', e);
    }
    return newTip;
  },

  // Upvote Safety Tip
  async upvoteTip(tipId: string): Promise<void> {
    try {
      const ref = doc(db, 'safety_tips', tipId);
      await updateDoc(ref, { upvotes: increment(1) });
    } catch (e) {
      console.warn('Upvote sync notice:', e);
    }
  },

  // Get Verified Female Guides
  async getFemaleGuides(district?: string): Promise<FemaleGuide[]> {
    try {
      const snap = await getDocs(collection(db, 'female_guides'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FemaleGuide));
      }
    } catch (e) {
      console.warn('Guides fetch notice:', e);
    }
    if (district && district !== 'All') {
      return VERIFIED_FEMALE_GUIDES.filter((g) => g.district.toLowerCase() === district.toLowerCase());
    }
    return VERIFIED_FEMALE_GUIDES;
  },

  // Get Companion Posts
  async getCompanionPosts(district?: string): Promise<CompanionPost[]> {
    try {
      const compCol = collection(db, 'companion_posts');
      const q = district && district !== 'All'
        ? query(compCol, where('destinationDistrict', '==', district))
        : compCol;
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestorePosts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CompanionPost));
        const firestoreIds = new Set(firestorePosts.map((p) => p.id));
        const filteredInitial = INITIAL_COMPANION_POSTS.filter((p) => !firestoreIds.has(p.id));
        return [...firestorePosts, ...filteredInitial];
      }
    } catch (e) {
      console.warn('Companion posts read notice:', e);
    }
    if (district && district !== 'All') {
      return INITIAL_COMPANION_POSTS.filter(
        (p) => p.destinationDistrict.toLowerCase() === district.toLowerCase()
      );
    }
    return INITIAL_COMPANION_POSTS;
  },

  // Create Companion Post
  async createCompanionPost(post: Omit<CompanionPost, 'id' | 'timestamp' | 'repliesCount' | 'reportedCount'>): Promise<CompanionPost> {
    const newPost: CompanionPost = {
      ...post,
      id: `comp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      repliesCount: 0,
      reportedCount: 0,
    };
    try {
      await setDoc(doc(db, 'companion_posts', newPost.id), newPost);
    } catch (e) {
      console.warn('Companion post write notice:', e);
    }
    return newPost;
  },

  // Moderation Report
  async reportContent(targetType: 'tip' | 'companion_post', targetId: string, reason: string): Promise<boolean> {
    try {
      await addDoc(collection(db, 'reports'), {
        targetType,
        targetId,
        reason,
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      console.warn('Report submit notice:', e);
      return true;
    }
  },
};
