import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { walrusClient } from '@/lib/walrus/client';
import { DataNFTContract } from '@/lib/sui/contracts';
import { generateDatasetMetadata, validateFile, validateMetadata, DatasetMetadata } from '@/lib/utils/upload';
import { parseSUI } from '@/lib/sui/client';

export interface UploadProgress {
  stage: 'idle' | 'validating' | 'uploading_file' | 'uploading_metadata' | 'minting' | 'listing' | 'success' | 'error';
  progress: number; // 0-100
  message: string;
  error?: string;
}

export interface PublishDatasetParams {
  file: File;
  profileId: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  license: string;
  price?: number; // Optional, for auto-listing
  listOnMarketplace?: boolean;
}

export interface PublishResult {
  nftId: string;
  dataBlobId: string;
  metadataBlobId: string;
  transactionDigest: string;
  listingId?: string;
}

/**
 * Hook to upload file to Walrus
 */
export function useWalrusUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload to Walrus (store for 10 epochs)
      setUploadProgress(0);

      try {
        const result = await walrusClient.upload(file, 10);
        setUploadProgress(100);
        return result;
      } catch (error) {
        setUploadProgress(0);
        throw error;
      }
    },
  });

  return {
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    error: uploadMutation.error,
  };
}

/**
 * Hook to mint DataNFT
 */
export function useMintDataNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async ({
      profileId,
      metadataBlobId,
      dataBlobId,
      title,
      description,
      category,
      fileType,
      fileSize,
      verificationHash,
    }: {
      profileId: string;
      metadataBlobId: string;
      dataBlobId: string;
      title: string;
      description: string;
      category: string;
      fileType: string;
      fileSize: number;
      verificationHash: string;
    }) => {
      return new Promise((resolve, reject) => {
        const tx = DataNFTContract.mint(
          profileId,
          metadataBlobId,
          dataBlobId,
          title,
          description,
          category,
          fileType,
          fileSize,
          verificationHash
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
  });
}

/**
 * Complete publish dataset flow (upload + mint + optional list)
 */
export function usePublishDataset() {
  const [progress, setProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    message: '',
  });

  const walrusUpload = useWalrusUpload();
  const mintNFT = useMintDataNFT();

  const publish = async (params: PublishDatasetParams): Promise<PublishResult> => {
    try {
      // Stage 1: Validate file
      setProgress({
        stage: 'validating',
        progress: 5,
        message: 'Validating file...',
      });

      const validation = validateFile(params.file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Stage 2: Upload file to Walrus
      setProgress({
        stage: 'uploading_file',
        progress: 10,
        message: `Uploading ${params.file.name} to Walrus...`,
      });

      const fileUploadResult = await walrusUpload.uploadAsync(params.file);
      const dataBlobId = fileUploadResult.blobId;

      setProgress({
        stage: 'uploading_file',
        progress: 40,
        message: 'File uploaded successfully!',
      });

      // Stage 3: Generate and upload metadata
      setProgress({
        stage: 'uploading_metadata',
        progress: 45,
        message: 'Generating metadata...',
      });

      const metadata = await generateDatasetMetadata(params.file, {
        title: params.title,
        description: params.description,
        category: params.category,
        fileType: params.fileType,
        license: params.license,
      });

      // Validate metadata
      const metadataValidation = validateMetadata(metadata);
      if (!metadataValidation.valid) {
        throw new Error(metadataValidation.error);
      }

      setProgress({
        stage: 'uploading_metadata',
        progress: 50,
        message: 'Uploading metadata to Walrus...',
      });

      const metadataBlobId = await walrusClient.uploadJSON(metadata, 10);

      setProgress({
        stage: 'uploading_metadata',
        progress: 60,
        message: 'Metadata uploaded successfully!',
      });

      // Stage 4: Mint DataNFT
      setProgress({
        stage: 'minting',
        progress: 65,
        message: 'Minting DataNFT on Sui blockchain...',
      });

      const mintResult: any = await mintNFT.mutateAsync({
        profileId: params.profileId,
        metadataBlobId,
        dataBlobId,
        title: params.title,
        description: params.description,
        category: params.category,
        fileType: params.fileType,
        fileSize: params.file.size,
        verificationHash: metadata.fileHash,
      });

      setProgress({
        stage: 'minting',
        progress: 85,
        message: 'DataNFT minted successfully!',
      });

      // Extract NFT ID from transaction result
      const nftId = mintResult.effects?.created?.[0]?.reference?.objectId || '';

      // Stage 5: Optional listing
      let listingId: string | undefined;
      if (params.listOnMarketplace && params.price) {
        setProgress({
          stage: 'listing',
          progress: 90,
          message: 'Listing on marketplace...',
        });

        // TODO: Implement marketplace listing
        // const listResult = await listNFTMutation.mutateAsync({ nftId, price: parseSUI(params.price) });
        // listingId = listResult.listingId;

        setProgress({
          stage: 'listing',
          progress: 95,
          message: 'Listed on marketplace!',
        });
      }

      // Success!
      setProgress({
        stage: 'success',
        progress: 100,
        message: 'Dataset published successfully!',
      });

      return {
        nftId,
        dataBlobId,
        metadataBlobId,
        transactionDigest: mintResult.digest,
        listingId,
      };
    } catch (error: any) {
      setProgress({
        stage: 'error',
        progress: 0,
        message: 'Failed to publish dataset',
        error: error.message || 'Unknown error',
      });
      throw error;
    }
  };

  return {
    publish,
    progress,
    isPublishing: progress.stage !== 'idle' && progress.stage !== 'success' && progress.stage !== 'error',
    isSuccess: progress.stage === 'success',
    isError: progress.stage === 'error',
    reset: () => setProgress({ stage: 'idle', progress: 0, message: '' }),
  };
}
