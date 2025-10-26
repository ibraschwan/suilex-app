'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { DownloadProgressModal } from '../ui/DownloadProgressModal';
import { useToast } from '../ui/Toast';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { walrusClient } from '@/lib/walrus/client';

interface DownloadButtonProps {
  nftId: string;
  dataBlobId: string;
  fileName: string;
  fileSize: number;
  userAddress?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DownloadButton({
  nftId,
  dataBlobId,
  fileName,
  fileSize,
  userAddress,
  variant = 'pill',
  size = 'lg',
  className = '',
}: DownloadButtonProps) {
  const { addToast } = useToast();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Check if user has DataAccessCap on mount
  useEffect(() => {
    const checkAccess = async () => {
      if (!currentAccount && !userAddress) {
        // Check for mock purchases in development mode
        if (process.env.NODE_ENV === 'development') {
          const mockPurchases = JSON.parse(localStorage.getItem('mock_purchases') || '[]');
          const hasMockPurchase = mockPurchases.some((p: any) => p.nftId === nftId);
          setHasAccess(hasMockPurchase);
        } else {
          setHasAccess(false);
        }
        setCheckingAccess(false);
        return;
      }

      try {
        // Query user's DataAccessCap objects
        const address = userAddress || currentAccount?.address;
        if (!address) {
          setHasAccess(false);
          setCheckingAccess(false);
          return;
        }

        const objects = await suiClient.getOwnedObjects({
          owner: address,
          filter: {
            StructType: `${process.env.NEXT_PUBLIC_PROFILE_PACKAGE_ID}::data_nft::DataAccessCap`,
          },
          options: {
            showContent: true,
          },
        });

        // Check if any DataAccessCap is for this NFT
        let found = false;
        for (const obj of objects.data) {
          if (obj.data && obj.data.content?.dataType === 'moveObject') {
            const fields = (obj.data.content as any).fields;
            if (fields.nft_id === nftId) {
              found = true;
              break;
            }
          }
        }

        setHasAccess(found);
      } catch (error) {
        console.error('Error checking access:', error);
        // In development, fall back to checking mock purchases
        if (process.env.NODE_ENV === 'development') {
          const mockPurchases = JSON.parse(localStorage.getItem('mock_purchases') || '[]');
          const hasMockPurchase = mockPurchases.some((p: any) => p.nftId === nftId);
          setHasAccess(hasMockPurchase);
        } else {
          setHasAccess(false);
        }
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [nftId, currentAccount, userAddress, suiClient]);

  const handleDownload = async () => {
    if (!currentAccount && !userAddress && process.env.NODE_ENV !== 'development') {
      addToast('Please connect your wallet to download', 'error');
      return;
    }

    if (hasAccess === false) {
      addToast('You do not have access to this dataset. Purchase it first.', 'error');
      return;
    }

    try {
      setIsDownloading(true);
      setShowProgressModal(true);
      setDownloadProgress(10);

      // Check if we should use mock download
      const useMockDownload = process.env.NODE_ENV === 'development' && !currentAccount;

      if (useMockDownload) {
        // Mock download simulation
        addToast('Starting mock download...', 'info');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDownloadProgress(30);

        // Create mock file content
        const mockContent = `Mock Dataset: ${fileName}\n\nThis is a simulated download for development purposes.\n\nDataset ID: ${nftId}\nFile Size: ${fileSize} bytes\nBlob ID: ${dataBlobId}\n\nIn production, this would download the actual dataset from Walrus.`;

        await new Promise(resolve => setTimeout(resolve, 1000));
        setDownloadProgress(70);

        // Create blob and trigger download
        const blob = new Blob([mockContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace(/\.[^/.]+$/, '') + '_mock.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setDownloadProgress(100);
        addToast('Mock download complete!', 'success');
      } else {
        // Real download from Walrus
        setDownloadProgress(30);
        const arrayBuffer = await walrusClient.download(dataBlobId);

        setDownloadProgress(70);

        // Create blob and trigger download
        const blob = new Blob([arrayBuffer]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setDownloadProgress(100);
        addToast('Download complete!', 'success');

        // TODO: Increment download count on blockchain
        // await DataNFTContract.incrementDownloadCount(nftId);
      }

    } catch (error: any) {
      console.error('Download error:', error);
      setShowProgressModal(false);

      if (error.message?.includes('404') || error.message?.includes('not found')) {
        addToast('Dataset file not found. Please contact the seller.', 'error');
      } else if (error.message?.includes('network')) {
        addToast('Network error. Please check your connection and try again.', 'error');
      } else {
        addToast(`Failed to download dataset: ${error.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  if (checkingAccess) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Checking access...
      </Button>
    );
  }

  if (!currentAccount && !userAddress && process.env.NODE_ENV !== 'development') {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <span className="material-symbols-outlined">lock</span>
        Connect Wallet to Download
      </Button>
    );
  }

  if (hasAccess === false) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <span className="material-symbols-outlined">lock</span>
        Purchase Required
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isDownloading}
        className={className}
      >
        {isDownloading ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Downloading...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">download</span>
            Download Dataset
          </>
        )}
      </Button>

      <DownloadProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        fileName={fileName}
        fileSize={`${(fileSize / 1024 / 1024).toFixed(2)} MB`}
      />
    </>
  );
}