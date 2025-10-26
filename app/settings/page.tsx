'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ProfileData, ProfileContract } from '@/lib/sui/contracts';
import { walrusClient } from '@/lib/walrus/client';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const router = useRouter();
  const { addToast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarBlobId, setAvatarBlobId] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Card customization
  const [cardRarity, setCardRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('rare');

  // 3D tilt effect
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    if (currentAccount) {
      loadProfile();
    }
  }, [currentAccount]);

  // Validate username - only alphanumeric, underscore, and dash
  const validateUsername = (value: string): boolean => {
    const validPattern = /^[a-zA-Z0-9_-]+$/;

    if (!value) {
      setUsernameError('');
      return true;
    }

    if (!validPattern.test(value)) {
      setUsernameError('Only letters, numbers, dash (-) and underscore (_) allowed. No emojis or special characters.');
      return false;
    }

    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const loadProfile = async () => {
    if (!currentAccount) return;

    try {
      setLoading(true);
      const profileData = await ProfileContract.getProfileByOwner(suiClient, currentAccount.address);

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username);
        setBio(profileData.bio);
        setTwitter(profileData.twitter);
        setGithub(profileData.github);
        setWebsite(profileData.website);
        setAvatarBlobId(profileData.avatarBlobId);

        if (profileData.avatarBlobId) {
          setAvatarPreview(walrusClient.getPublicUrl(profileData.avatarBlobId));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      setUploadingAvatar(true);
      const result = await walrusClient.upload(file, 10);
      setAvatarBlobId(result.blobId);
      setAvatarPreview(walrusClient.getPublicUrl(result.blobId));
      addToast('Avatar uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      addToast('Failed to upload avatar. Please try again.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!currentAccount) {
      addToast('Please connect your wallet', 'error');
      return;
    }

    if (!username || username.length < 3) {
      addToast('Username must be at least 3 characters', 'error');
      return;
    }

    if (!validateUsername(username)) {
      addToast('Invalid username format. Only letters, numbers, dash and underscore allowed.', 'error');
      return;
    }

    try {
      setSaving(true);

      const tx = ProfileContract.createProfile(
        username,
        bio || '',
        avatarBlobId || ''
      );

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Profile created:', result);
            addToast('Profile created successfully!', 'success');
            router.push(`/profile/${currentAccount.address}`);
          },
          onError: (error) => {
            console.error('Error creating profile:', error);
            addToast(`Failed to create profile: ${error.message}`, 'error');
          },
        }
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      addToast('Failed to create profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentAccount || !profile) return;

    try {
      setSaving(true);

      const tx = ProfileContract.updateProfile(
        profile.id,
        bio || '',
        avatarBlobId || '',
        twitter || '',
        github || '',
        website || ''
      );

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Profile updated:', result);
            addToast('Profile updated successfully!', 'success');
            router.push(`/profile/${currentAccount.address}`);
          },
          onError: (error) => {
            console.error('Error updating profile:', error);
            addToast(`Failed to update profile: ${error.message}`, 'error');
          },
        }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (username && username.length >= 3) score += 25;
    if (bio && bio.length >= 10) score += 25;
    if (avatarBlobId) score += 25;
    if (twitter || github || website) score += 25;
    return score;
  };

  const completeness = calculateCompleteness();

  // Handle card tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  if (!currentAccount) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-white/20 text-8xl mb-4 block">
              account_circle
            </span>
            <h1 className="text-white text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-text-secondary-dark">
              Please connect your Sui wallet to access settings.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] flex items-center justify-center">
          <div className="text-white text-xl shimmer">Loading your profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isNewProfile = !profile;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[84px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Hero Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 neon-text">
              {isNewProfile ? '⚡ Build Your Trader Card' : '⚡ Customize Your Card'}
            </h1>
            <p className="text-base md:text-lg text-text-secondary-dark/80 mb-2">
              {isNewProfile
                ? 'Create your unique identity on the Suilex marketplace'
                : 'Update your trader profile and stand out'}
            </p>

            {/* Completeness Bar */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-text-secondary-dark/60 text-sm font-semibold">
                Profile Completeness:
              </span>
              <div className="w-48 h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full progress-gradient transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <span className="text-white font-bold text-lg">{completeness}%</span>
            </div>
          </div>

          {/* Split-Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT SIDE: Card Editor */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Username {isNewProfile && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    disabled={!isNewProfile}
                    placeholder="Choose your trader name"
                    className={`w-full h-14 rounded-xl glass-card border px-5 text-white text-lg font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                      usernameError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary focus:ring-primary/20'
                    }`}
                    minLength={3}
                    maxLength={20}
                  />
                  {username && username.length >= 3 && isNewProfile && !usernameError && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-success text-2xl pulse-glow">
                      check_circle
                    </span>
                  )}
                  {usernameError && isNewProfile && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-red-500 text-2xl">
                      error
                    </span>
                  )}
                </div>
                {usernameError && isNewProfile ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {usernameError}
                  </p>
                ) : (
                  <p className="text-text-secondary-dark/60 text-xs mt-2">
                    {isNewProfile
                      ? `${username.length}/20 characters • This cannot be changed later`
                      : 'Username cannot be changed'}
                  </p>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Avatar
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-surface-dark border-2 border-white/10 relative group">
                    {avatarPreview ? (
                      <>
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <span className="material-symbols-outlined text-white text-4xl">
                              edit
                            </span>
                          </label>
                        </div>
                      </>
                    ) : (
                      <label
                        htmlFor="avatar-upload"
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-white/20 text-5xl mb-2">
                          add_photo_alternate
                        </span>
                        <span className="text-white/40 text-xs font-semibold">Upload</span>
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={uploadingAvatar}
                      className="mb-2"
                    >
                      {uploadingAvatar ? (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined animate-spin text-sm">
                            progress_activity
                          </span>
                          Uploading...
                        </span>
                      ) : (
                        'Choose Image'
                      )}
                    </Button>
                    <p className="text-text-secondary-dark/60 text-xs">
                      JPG, PNG or GIF • Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Bio / About
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself and your data expertise..."
                  rows={5}
                  className="w-full rounded-xl glass-card border border-white/10 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  maxLength={500}
                />
                <p className="text-text-secondary-dark/60 text-xs mt-2">
                  {bio.length}/500 characters
                </p>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Social Links
                </label>
                <div className="space-y-3">
                  {/* Twitter */}
                  <div className="flex items-center gap-3 glass-card rounded-xl p-3 border border-white/10">
                    <span className="material-symbols-outlined text-[#1DA1F2] text-2xl">
                      alternate_email
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username or twitter.com/username"
                      className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-3 glass-card rounded-xl p-3 border border-white/10">
                    <span className="material-symbols-outlined text-white text-2xl">
                      code
                    </span>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="github.com/username"
                      className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-3 glass-card rounded-xl p-3 border border-white/10">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      language
                    </span>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card Rarity Selector */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Card Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'common', label: 'Common', color: 'border-gray-500' },
                    { id: 'rare', label: 'Rare', color: 'border-blue-500' },
                    { id: 'epic', label: 'Epic', color: 'border-purple-500' },
                    { id: 'legendary', label: 'Legendary', color: 'border-yellow-500' },
                  ].map((rarity) => (
                    <button
                      key={rarity.id}
                      onClick={() => setCardRarity(rarity.id as any)}
                      className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                        cardRarity === rarity.id
                          ? `${rarity.color} border-2 bg-white/10 scale-105`
                          : 'glass-card border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {rarity.label}
                    </button>
                  ))}
                </div>
                <p className="text-text-secondary-dark/60 text-xs mt-2">
                  Choose your card border style (unlock more by earning achievements)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="pill"
                  size="lg"
                  onClick={isNewProfile ? handleCreateProfile : handleUpdateProfile}
                  disabled={saving || !username || username.length < 3}
                  className="flex-1 text-lg"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Saving...
                    </span>
                  ) : isNewProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined">add_card</span>
                      Create Profile
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined">save</span>
                      Save Changes
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE: Live Trading Card Preview */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="mb-4">
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                      visibility
                    </span>
                    Live Card Preview
                  </h3>
                  <p className="text-text-secondary-dark/60 text-xs">
                    This is how your profile will appear to others
                  </p>
                </div>

                {/* Trading Card - 4:5 Aspect Ratio */}
                <div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ ...tiltStyle, aspectRatio: '4/5' }}
                  className={`relative rounded-3xl overflow-hidden transition-transform duration-300 ease-out w-full max-w-[320px] mx-auto ${
                    cardRarity === 'common'
                      ? 'card-common'
                      : cardRarity === 'rare'
                      ? 'card-rare'
                      : cardRarity === 'epic'
                      ? 'card-epic'
                      : 'card-legendary'
                  }`}
                >
                  {/* Holographic Overlay */}
                  {cardRarity !== 'common' && (
                    <div className="absolute inset-0 foil-texture pointer-events-none z-10" />
                  )}

                  {/* Card Content */}
                  <div className="relative glass-card p-6 h-full flex flex-col">
                    {/* Avatar */}
                    <div className="mb-4 flex justify-center">
                      <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-white/20 relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/30 text-6xl">
                              person
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Username */}
                    <h2 className="text-white text-lg font-black mb-2 text-center">
                      {username || (
                        <span className="text-white/20 italic text-base">Your Username</span>
                      )}
                    </h2>

                    {/* Bio */}
                    <p className="text-text-secondary-dark/70 text-[11px] mb-3 text-center min-h-[2rem] line-clamp-2 leading-tight">
                      {bio || (
                        <span className="text-white/20 italic">
                          Your bio will appear here...
                        </span>
                      )}
                    </p>

                    {/* Stats (Mock) */}
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      <div className="glass-card rounded-lg p-1.5 text-center border border-white/10">
                        <div className="text-primary text-base font-black leading-none mb-0.5">0</div>
                        <div className="text-text-secondary-dark/60 text-[9px] font-semibold leading-tight">
                          Datasets
                        </div>
                      </div>
                      <div className="glass-card rounded-lg p-1.5 text-center border border-white/10">
                        <div className="text-success text-base font-black leading-none mb-0.5">0</div>
                        <div className="text-text-secondary-dark/60 text-[9px] font-semibold leading-tight">
                          Sales
                        </div>
                      </div>
                      <div className="glass-card rounded-lg p-1.5 text-center border border-white/10">
                        <div className="text-warning text-base font-black leading-none mb-0.5">0</div>
                        <div className="text-text-secondary-dark/60 text-[9px] font-semibold leading-tight">
                          SUI
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    {(twitter || github || website) && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        {twitter && (
                          <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#1DA1F2] text-base">
                              alternate_email
                            </span>
                          </div>
                        )}
                        {github && (
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-base">
                              code
                            </span>
                          </div>
                        )}
                        {website && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-base">
                              language
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Badges (Coming Soon) */}
                    <div className="flex items-center justify-center gap-1.5 opacity-40">
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/40 text-xs">
                          verified
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/40 text-sm">
                          star
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/40 text-sm">
                          emoji_events
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="mt-4 glass-card rounded-xl p-4 border border-white/5">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">
                      info
                    </span>
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-1">
                        Collectible Profile Card
                      </h4>
                      <p className="text-text-secondary-dark/60 text-xs">
                        Your profile is a unique NFT on Sui. Earn badges and unlock rare card
                        styles as you trade!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
