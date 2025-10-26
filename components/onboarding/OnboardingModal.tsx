'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { walrusClient } from '@/lib/walrus/client';
import { ProfileContract } from '@/lib/sui/contracts';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useToast } from '../ui/Toast';
import { markOnboardingSkipped } from '@/lib/hooks/useOnboarding';
import { mockProfiles } from '@/lib/mock-data';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export function OnboardingModal({ isOpen, onClose, onSkip }: OnboardingModalProps) {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBlobId, setAvatarBlobId] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  if (!isOpen) return null;

  // Validate username - only alphanumeric, underscore, and dash
  const validateUsername = (value: string): boolean => {
    // Only allow alphanumeric, underscore, and dash
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
      addToast('Avatar uploaded!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      addToast('Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!username || username.length < 3) {
      addToast('Username must be at least 3 characters', 'error');
      return;
    }

    if (!validateUsername(username)) {
      addToast('Invalid username format. Only letters, numbers, dash and underscore allowed.', 'error');
      return;
    }

    // MOCK MODE: Create profile in localStorage if no wallet connected (development)
    if (!currentAccount && process.env.NODE_ENV === 'development') {
      try {
        setCreating(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create mock profile in localStorage
        const mockProfile = {
          id: `profile-${username.toLowerCase()}`,
          username,
          bio: bio || '',
          avatarBlobId: avatarBlobId || '',
          walletAddress: 'mock-address-' + Math.random().toString(36).substring(7),
          createdAt: Math.floor(Date.now() / 1000),
          stats: {
            datasetsListed: 0,
            totalSales: 0,
            totalEarnings: 0,
          },
        };

        localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

        setShowSuccess(true);
        addToast('Mock trader card created!', 'success');

        // Close modal immediately in mock mode
        setTimeout(() => {
          onClose();
          router.push('/marketplace');
        }, 1500);
      } catch (error) {
        console.error('Error creating mock profile:', error);
        addToast('Failed to create mock profile', 'error');
        setCreating(false);
      }
      return;
    }

    // REAL MODE: Create on blockchain
    if (!currentAccount) {
      addToast('Please connect your wallet', 'error');
      return;
    }

    try {
      setCreating(true);

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
          onSuccess: () => {
            setShowSuccess(true);
            addToast('Trader card created!', 'success');

            setTimeout(() => {
              onClose();
              router.push('/marketplace');
            }, 2000);
          },
          onError: (error) => {
            console.error('Error creating profile:', error);
            addToast(`Failed to create profile: ${error.message}`, 'error');
            setCreating(false);
          },
        }
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      addToast('Failed to create profile', 'error');
      setCreating(false);
    }
  };

  // Quick-fill with Trespass profile for testing
  const handleQuickFillTrespass = () => {
    const trespassProfile = mockProfiles.find(p => p.username === 'Trespass');
    if (trespassProfile) {
      setUsername(trespassProfile.username);
      setBio(trespassProfile.bio);
      addToast('Filled with Trespass profile!', 'info');
    }
  };

  const handleSkip = () => {
    markOnboardingSkipped();
    onSkip();
    addToast('You can create your profile later from Settings', 'info');
  };

  // Get user initials for avatar placeholder
  const getInitials = () => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in-up">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        onClick={!creating && !showSuccess ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="bg-[#0a0a0a] rounded-3xl border-2 border-primary p-8 md:p-12 shadow-2xl shadow-primary/20">
          {/* Success State */}
          {showSuccess && (
            <div className="text-center py-12">
              <div className="inline-block mb-6">
                <span className="material-symbols-outlined text-8xl text-success pulse-glow">
                  check_circle
                </span>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 neon-text">
                Trader Card Created! 🎉
              </h2>
              <p className="text-text-secondary-dark/80 text-lg">
                Welcome to the Suilex marketplace...
              </p>
            </div>
          )}

          {/* Onboarding Form */}
          {!showSuccess && (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 neon-text">
                  ⚡ Welcome to Suilex!
                </h1>
                <p className="text-lg text-text-secondary-dark/80 mb-8">
                  Create your unique Trader Card to start buying & selling datasets
                </p>

                {/* Progress Steps - Premium Numbered Pills */}
                <div className="flex items-center justify-center gap-3">
                  {[
                    { num: 1, label: 'Username' },
                    { num: 2, label: 'Avatar' },
                    { num: 3, label: 'Ready' },
                  ].map((s, index) => (
                    <div key={s.num} className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                          step >= s.num
                            ? 'bg-primary border-primary shadow-lg shadow-primary/30'
                            : 'bg-[#0a0a0a] border-white/10'
                        }`}
                      >
                        <span
                          className={`font-black text-sm ${
                            step >= s.num ? 'text-white' : 'text-white/30'
                          }`}
                        >
                          {s.num}
                        </span>
                        <span
                          className={`hidden sm:inline text-sm font-bold ${
                            step >= s.num ? 'text-white' : 'text-white/30'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <span className="material-symbols-outlined text-white/20">
                          arrow_forward
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Form */}
                <div className="space-y-6">
                  {/* Step 1: Username */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          Choose Your Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            placeholder="Enter trader name..."
                            className={`w-full h-14 rounded-xl bg-[#0a0a0a]/50 border-2 px-5 text-white text-lg font-bold placeholder:text-white/30 focus:outline-none transition-all ${
                              usernameError
                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'
                                : 'border-white/20 focus:border-primary focus:shadow-[0_0_0_3px_rgba(43,157,244,0.2)]'
                            }`}
                            minLength={3}
                            maxLength={20}
                            autoFocus
                          />
                          {username && username.length >= 3 && !usernameError && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-success text-2xl pulse-glow">
                              check_circle
                            </span>
                          )}
                          {usernameError && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-red-500 text-2xl">
                              error
                            </span>
                          )}
                        </div>
                        {usernameError ? (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {usernameError}
                          </p>
                        ) : (
                          <p className="text-text-secondary-dark/60 text-xs mt-2">
                            {username.length}/20 characters • Your marketplace identity (cannot change later)
                          </p>
                        )}
                      </div>

                      <div className="bg-[#0a0a0a] rounded-xl p-6 border border-primary/20 shadow-lg shadow-primary/5">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">
                            info
                          </span>
                          <div>
                            <h4 className="text-white text-sm font-semibold mb-2">
                              Why create a Trader Card?
                            </h4>
                            <ul className="text-text-secondary-dark/70 text-xs space-y-1">
                              <li>• Build reputation as you trade</li>
                              <li>• Showcase your datasets</li>
                              <li>• Track earnings & sales</li>
                              <li>• Unlock achievement badges</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Development Quick Fill */}
                      {process.env.NODE_ENV === 'development' && !currentAccount && (
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-lg">
                                science
                              </span>
                              <span className="text-primary text-xs font-semibold">
                                Dev Mode: Quick Fill
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleQuickFillTrespass}
                              className="text-xs"
                            >
                              Fill "Trespass"
                            </Button>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="pill"
                        size="lg"
                        className="w-full"
                        onClick={() => setStep(2)}
                        disabled={!username || username.length < 3 || !!usernameError}
                      >
                        Next: Add Avatar
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Avatar */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          Upload Avatar (Optional)
                        </label>
                        <div className="flex items-center gap-6">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#0a0a0a] border-2 border-primary/30 relative group shadow-lg shadow-primary/10">
                            {avatarPreview ? (
                              <>
                                <img
                                  src={avatarPreview}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <label htmlFor="avatar-upload-modal" className="cursor-pointer">
                                    <span className="material-symbols-outlined text-white text-4xl">
                                      edit
                                    </span>
                                  </label>
                                </div>
                              </>
                            ) : (
                              <label
                                htmlFor="avatar-upload-modal"
                                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                              >
                                <span className="material-symbols-outlined text-primary text-5xl mb-2">
                                  add_photo_alternate
                                </span>
                                <span className="text-white/50 text-xs font-semibold">Upload</span>
                              </label>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id="avatar-upload-modal"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              size="md"
                              onClick={() => document.getElementById('avatar-upload-modal')?.click()}
                              disabled={uploadingAvatar}
                              className="mb-2"
                            >
                              {uploadingAvatar ? 'Uploading...' : 'Choose Image'}
                            </Button>
                            <p className="text-text-secondary-dark/60 text-xs">
                              JPG, PNG or GIF • Max 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="pill"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(3)}
                        >
                          Next: Bio
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Bio */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          About You (Optional)
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell the community about yourself and your data expertise..."
                          rows={6}
                          className="w-full rounded-xl bg-[#0a0a0a]/50 border-2 border-white/20 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(43,157,244,0.2)] transition-all resize-none"
                          maxLength={500}
                        />
                        <p className="text-text-secondary-dark/60 text-xs mt-2">
                          {bio.length}/500 characters
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(2)}
                          disabled={creating}
                        >
                          Back
                        </Button>
                        <Button
                          variant="pill"
                          size="lg"
                          className="flex-1"
                          onClick={handleCreateProfile}
                          disabled={creating}
                        >
                          {creating ? (
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined animate-spin">
                                progress_activity
                              </span>
                              Creating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined">add_card</span>
                              Create Trader Card
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Premium Live Card Preview */}
                <div>
                  <div className="sticky top-4">
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-primary">
                      ⚡ Live Preview
                    </h3>

                    {/* Premium Trading Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border-2 border-primary shadow-2xl shadow-primary/30">
                      {/* Foil effect - more subtle */}
                      <div className="absolute inset-0 foil-texture pointer-events-none z-10 opacity-30" />

                      {/* Inner glow */}
                      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(43,157,244,0.15)] pointer-events-none z-10" />

                      <div className="relative p-8">
                        {/* Avatar - Premium Initials Design */}
                        <div className="mb-6 flex justify-center">
                          <div className="relative">
                            {/* Gradient border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5">
                              <div className="w-full h-full rounded-2xl bg-[#0a0a0a]" />
                            </div>

                            {/* Avatar content */}
                            <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                              {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                  <span className="text-white text-6xl font-black tracking-tighter">
                                    {getInitials()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Username */}
                        <h2 className="text-white text-2xl font-black mb-2 text-center tracking-tight">
                          {username || <span className="text-white/20 italic">Your Username</span>}
                        </h2>

                        {/* Bio */}
                        <p className="text-text-secondary-dark/70 text-sm mb-6 text-center min-h-[3rem] line-clamp-3">
                          {bio || <span className="text-white/20 italic">Your bio will appear here...</span>}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-[#0a0a0a]/80 rounded-xl p-3 text-center border border-primary/10">
                            <div className="text-primary text-xl font-black">0</div>
                            <div className="text-text-secondary-dark/60 text-xs font-semibold">Datasets</div>
                          </div>
                          <div className="bg-[#0a0a0a]/80 rounded-xl p-3 text-center border border-success/10">
                            <div className="text-success text-xl font-black">0</div>
                            <div className="text-text-secondary-dark/60 text-xs font-semibold">Sales</div>
                          </div>
                          <div className="bg-[#0a0a0a]/80 rounded-xl p-3 text-center border border-warning/10">
                            <div className="text-warning text-xl font-black">0</div>
                            <div className="text-text-secondary-dark/60 text-xs font-semibold">Earned</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skip Button */}
              <div className="text-center mt-10">
                <button
                  onClick={handleSkip}
                  className="text-text-secondary-dark/60 hover:text-primary text-sm font-medium transition-colors"
                  disabled={creating}
                >
                  Skip for now (create later from Settings)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
