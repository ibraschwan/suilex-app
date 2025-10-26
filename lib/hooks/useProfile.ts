import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { ProfileData, ProfileContract } from '@/lib/sui/contracts';

/**
 * Hook to fetch user profile by address
 */
export function useProfile(address?: string) {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const targetAddress = address || currentAccount?.address;

  return useQuery({
    queryKey: ['profile', targetAddress],
    queryFn: async () => {
      if (!targetAddress) return null;
      return ProfileContract.getProfileByOwner(suiClient, targetAddress);
    },
    enabled: !!targetAddress,
    staleTime: 30000, // Cache for 30 seconds
  });
}

/**
 * Hook to get current user's profile
 */
export function useCurrentProfile() {
  const currentAccount = useCurrentAccount();
  return useProfile(currentAccount?.address);
}

/**
 * Hook to create a new profile
 */
export function useCreateProfile() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();

  return useMutation({
    mutationFn: async ({
      username,
      bio,
      avatarBlobId,
    }: {
      username: string;
      bio: string;
      avatarBlobId: string;
    }) => {
      return new Promise((resolve, reject) => {
        const tx = ProfileContract.createProfile(username, bio, avatarBlobId);

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resolve(result);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    onSuccess: () => {
      // Invalidate profile query to refetch
      if (currentAccount?.address) {
        queryClient.invalidateQueries({ queryKey: ['profile', currentAccount.address] });
      }
    },
  });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();

  return useMutation({
    mutationFn: async ({
      profileId,
      bio,
      avatarBlobId,
      twitter,
      github,
      website,
    }: {
      profileId: string;
      bio: string;
      avatarBlobId: string;
      twitter: string;
      github: string;
      website: string;
    }) => {
      return new Promise((resolve, reject) => {
        const tx = ProfileContract.updateProfile(
          profileId,
          bio,
          avatarBlobId,
          twitter,
          github,
          website
        );

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resolve(result);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    onSuccess: () => {
      if (currentAccount?.address) {
        queryClient.invalidateQueries({ queryKey: ['profile', currentAccount.address] });
      }
    },
  });
}

/**
 * Check if user has a profile
 */
export function useHasProfile() {
  const { data: profile, isLoading } = useCurrentProfile();
  return {
    hasProfile: !!profile,
    isLoading,
    profile,
  };
}
