import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Compass,
  MapPin,
  Clock,
  ThumbsUp,
  Flag,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Heart,
  Share2,
  AlertCircle,
  X,
  UserCheck,
} from 'lucide-react';
import { TN_DISTRICTS } from '../config/appConfig';
import {
  CommunityFirebaseService,
  UserProfile,
} from '../services/communityFirebaseService';
import {
  FemaleGuide,
  CommunitySafetyTip,
  CompanionPost,
} from '../data/community/initialCommunityData';

type CommunityTab = 'tips' | 'guides' | 'companions';

interface WomensCommunityViewProps {
  initialDistrict?: string;
}

export const WomensCommunityView: React.FC<WomensCommunityViewProps> = ({
  initialDistrict = 'All',
}) => {
  const [activeTab, setActiveTab] = useState<CommunityTab>('tips');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Data states
  const [safetyTips, setSafetyTips] = useState<CommunitySafetyTip[]>([]);
  const [guides, setGuides] = useState<FemaleGuide[]>([]);
  const [companionPosts, setCompanionPosts] = useState<CompanionPost[]>([]);
  const [loading, setLoading] = useState(true);

  // User auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('tamizn_community_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal states
  const [isPostTipModalOpen, setIsPostTipModalOpen] = useState(false);
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reportingItem, setReportingItem] = useState<{ type: 'tip' | 'companion_post'; id: string } | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Forms
  const [tipForm, setTipForm] = useState({
    title: '',
    category: 'Safety' as CommunitySafetyTip['category'],
    district: 'Chennai',
    content: '',
  });

  const [companionForm, setCompanionForm] = useState({
    destinationDistrict: 'Dindigul',
    travelMonth: 'November 2026',
    preferredPacing: 'Slow travel' as CompanionPost['preferredPacing'],
    description: '',
  });

  const [guestName, setGuestName] = useState('');
  const [guestCity, setGuestCity] = useState('');

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [selectedDistrict]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tList, gList, cList] = await Promise.all([
        CommunityFirebaseService.getSafetyTips(selectedDistrict),
        CommunityFirebaseService.getFemaleGuides(selectedDistrict),
        CommunityFirebaseService.getCompanionPosts(selectedDistrict),
      ]);
      setSafetyTips(tList);
      setGuides(gList);
      setCompanionPosts(cList);
    } catch (e) {
      console.warn('Community data load notice:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInGoogle = async () => {
    const user = await CommunityFirebaseService.signInWithGoogle();
    if (user) {
      const profile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Solo Traveler',
        email: user.email,
        homeCity: 'Tamil Nadu',
        verifiedBadge: true,
      };
      setCurrentUser(profile);
      localStorage.setItem('tamizn_community_user', JSON.stringify(profile));
      setIsAuthModalOpen(false);
    }
  };

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    const profile = await CommunityFirebaseService.signInAsGuest(guestName, guestCity);
    setCurrentUser(profile);
    localStorage.setItem('tamizn_community_user', JSON.stringify(profile));
    setIsAuthModalOpen(false);
  };

  const handleUpvoteTip = async (tipId: string) => {
    setSafetyTips((prev) =>
      prev.map((t) => (t.id === tipId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    await CommunityFirebaseService.upvoteTip(tipId);
  };

  const handleSubmitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipForm.title.trim() || !tipForm.content.trim()) return;

    const author = currentUser || {
      displayName: 'Solo Traveler',
      homeCity: 'Tamil Nadu',
      verifiedBadge: false,
    };

    const newTip = await CommunityFirebaseService.postSafetyTip({
      authorName: author.displayName,
      authorCity: author.homeCity,
      isVerifiedUser: author.verifiedBadge,
      district: tipForm.district,
      category: tipForm.category,
      title: tipForm.title,
      content: tipForm.content,
      authorId: currentUser?.uid || 'guest-author',
    });

    setSafetyTips((prev) => [newTip, ...prev]);
    setIsPostTipModalOpen(false);
    setTipForm({ title: '', category: 'Safety', district: 'Chennai', content: '' });
  };

  const handleSubmitCompanion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companionForm.description.trim()) return;

    const author = currentUser || {
      displayName: 'Solo Traveler',
      homeCity: 'Tamil Nadu',
      verifiedBadge: false,
    };

    const newPost = await CommunityFirebaseService.createCompanionPost({
      authorName: author.displayName,
      authorCity: author.homeCity,
      isVerifiedUser: author.verifiedBadge,
      destinationDistrict: companionForm.destinationDistrict,
      travelMonth: companionForm.travelMonth,
      preferredPacing: companionForm.preferredPacing,
      description: companionForm.description,
      authorId: currentUser?.uid || 'guest-author',
    });

    setCompanionPosts((prev) => [newPost, ...prev]);
    setIsCompanionModalOpen(false);
    setCompanionForm({
      destinationDistrict: 'Dindigul',
      travelMonth: 'November 2026',
      preferredPacing: 'Slow travel',
      description: '',
    });
  };

  const handleReport = async () => {
    if (!reportingItem) return;
    await CommunityFirebaseService.reportContent(reportingItem.type, reportingItem.id, reportReason || 'Inappropriate content');
    setReportSuccess(true);
    setTimeout(() => {
      setReportingItem(null);
      setReportReason('');
      setReportSuccess(false);
    }, 1500);
  };

  const filteredTips = safetyTips.filter((tip) => {
    if (selectedCategory !== 'All' && tip.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 p-8 sm:p-10 text-white shadow-xl border border-rose-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5" />
            PART 9: WOMEN'S TRAVEL COMMUNITY
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Tamil Nadu Women Travelers Network
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-light">
            A safe, verified space for solo female adventurers, travel companions, certified local women guides, and crowd-sourced safety advisories across all 38 districts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {currentUser ? (
              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-[11px]">
                  {currentUser.displayName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-white">{currentUser.displayName}</span>
                  <span className="text-rose-200 text-[10px] block">{currentUser.homeCity}</span>
                </div>
                {currentUser.verifiedBadge && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                    Verified
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Join / Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsPostTipModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-rose-950 hover:bg-rose-50 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-rose-700" />
              <span>Post a Safety Tip</span>
            </button>

            <button
              onClick={() => setIsCompanionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-stone-950" />
              <span>Find Travel Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* District Filter & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        
        {/* Main Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-rose-900 text-white shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Safety Tips by District ({filteredTips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-rose-900 text-white shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Verified Female Guides ({guides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('companions')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'companions'
                ? 'bg-rose-900 text-white shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4 text-rose-400" />
            <span>Companion Finder ({companionPosts.length})</span>
          </button>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold whitespace-nowrap">Filter District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="All">All 38 Districts</option>
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Category Pills (For Tips Tab) */}
      {activeTab === 'tips' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['All', 'Safety', 'Transport', 'Stays', 'Food', 'Solo-friendly'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: SAFETY TIPS */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          {filteredTips.length === 0 ? (
            <div className="p-8 bg-stone-50 rounded-3xl border border-dashed border-stone-300 text-center space-y-2">
              <p className="text-sm text-stone-600 font-semibold">
                No safety tips logged for {selectedDistrict} yet.
              </p>
              <button
                onClick={() => setIsPostTipModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-600 transition-colors"
              >
                Be the first to share a safety tip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-200">
                          {tip.category}
                        </span>
                        <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-600" />
                          <span>{tip.district}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(tip.timestamp).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-stone-900">{tip.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{tip.content}</p>
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-800 text-[11px]">{tip.authorName}</span>
                      <span className="text-[10px] text-stone-400 font-light">({tip.authorCity})</span>
                      {tip.isVerifiedUser && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Traveler" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvoteTip(tip.id)}
                        className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold text-xs border border-stone-200 flex items-center gap-1 transition-colors"
                        title="Upvote helpful safety tip"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{tip.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setReportingItem({ type: 'tip', id: tip.id })}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Report inappropriate content"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERIFIED FEMALE GUIDES & LOCAL HOSTS */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-serif font-bold text-stone-900">{guide.name}</h3>
                      {guide.verified && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          Verified Guide
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-rose-800 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      <span>{guide.district} District</span>
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    ★ {guide.rating}
                  </div>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-950 font-medium">
                  {guide.specialization}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">{guide.shortBio}</p>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Languages:</span>
                  {guide.languages.map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <a
                  href={guide.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Connect via Tourism Board</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COMPANION FINDER */}
      {activeTab === 'companions' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Women Companion Safety Notice: </strong>
              <span>Always video-call or meet in a busy, public daylight area (such as a TTDC Hotel Tamil Nadu restaurant or official bus stand) before departing on shared travels.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companionPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      <span>Travelling to {post.destinationDistrict}</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 font-bold bg-stone-100 px-2 py-0.5 rounded">
                      {post.travelMonth}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-medium">"{post.description}"</p>

                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Preferred Pace: </span>
                    <span>{post.preferredPacing}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-stone-800">{post.authorName}</strong>
                    <span className="text-[10px] text-stone-400">({post.authorCity})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Reply request sent to ${post.authorName}! Stay connected safely.`)}
                      className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Reply Safely</span>
                    </button>

                    <button
                      onClick={() => setReportingItem({ type: 'companion_post', id: post.id })}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Report post"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST SAFETY TIP MODAL */}
      {isPostTipModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-900">Post a Verified Safety Tip</h3>
              <button onClick={() => setIsPostTipModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTip} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Safe late night autos at Coimbatore Junction"
                  value={tipForm.title}
                  onChange={(e) => setTipForm({ ...tipForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">District</label>
                  <select
                    value={tipForm.district}
                    onChange={(e) => setTipForm({ ...tipForm, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={tipForm.category}
                    onChange={(e) => setTipForm({ ...tipForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {['Safety', 'Transport', 'Stays', 'Food', 'Solo-friendly'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Details & Advice</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share authentic, firsthand local safety advice for fellow women travelers..."
                  value={tipForm.content}
                  onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostTipModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold shadow-md"
                >
                  Publish Safety Tip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPANION POST MODAL */}
      {isCompanionModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-900">Find a Travel Companion</h3>
              <button onClick={() => setIsCompanionModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCompanion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Destination District</label>
                  <select
                    value={companionForm.destinationDistrict}
                    onChange={(e) => setCompanionForm({ ...companionForm, destinationDistrict: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Travel Month</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., November 2026"
                    value={companionForm.travelMonth}
                    onChange={(e) => setCompanionForm({ ...companionForm, travelMonth: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Preferred Pace</label>
                <select
                  value={companionForm.preferredPacing}
                  onChange={(e) => setCompanionForm({ ...companionForm, preferredPacing: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Slow travel">Slow travel (Relaxed visits, quiet heritage)</option>
                  <option value="Moderate">Moderate (Comfortable 4-5 spots per day)</option>
                  <option value="Action-packed">Action-packed (Early dawn sunrise to sunset)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Trip Plans & What You Seek</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe where you're heading, whether you want to share car rentals, explore cafes, or visit temples together..."
                  value={companionForm.description}
                  onChange={(e) => setCompanionForm({ ...companionForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompanionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-md"
                >
                  Post Companion Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Women Travelers Network</h3>
              <p className="text-xs text-stone-500 mt-1">
                Connect with verified female guides and solo travelers across Tamil Nadu.
              </p>
            </div>

            <button
              onClick={handleSignInGoogle}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 text-[10px] text-stone-400">
              <span className="flex-1 h-px bg-stone-200" />
              <span>OR ENTER QUICK PROFILE</span>
              <span className="flex-1 h-px bg-stone-200" />
            </div>

            <form onSubmit={handleGuestSignIn} className="space-y-2.5 text-left text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-0.5">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-0.5">Home City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai / Madurai"
                  value={guestCity}
                  onChange={(e) => setGuestCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold transition-colors shadow-sm mt-1"
              >
                Join Network
              </button>
            </form>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* REPORT MODAL (Part 9.5 Moderation) */}
      {reportingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 text-rose-700">
              <Flag className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-stone-900">Report Inappropriate Content</h3>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs text-center font-bold">
                Thank you. Report received and sent for moderator review.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-stone-600">
                  Please let us know why this post violates community safety guidelines:
                </p>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Spam / Commercial advertising">Spam / Commercial advertising</option>
                  <option value="Harassment or inappropriate language">Harassment or inappropriate language</option>
                  <option value="False or misleading safety advice">False or misleading safety advice</option>
                  <option value="Suspicious companion request">Suspicious companion request</option>
                </select>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReportingItem(null)}
                    className="px-3 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
