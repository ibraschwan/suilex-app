import axios, { AxiosInstance } from 'axios';

export interface WalrusUploadResponse {
  blobId: string;
  endEpoch: number;
  suiRef?: {
    objectId: string;
    version: string;
    digest: string;
  };
}

export interface WalrusDownloadResponse {
  data: ArrayBuffer;
  contentType?: string;
}

export class WalrusClient {
  private publisherUrl: string;
  private aggregatorUrl: string;
  private apiKey?: string;
  private axiosInstance: AxiosInstance;

  constructor(
    publisherUrl?: string,
    aggregatorUrl?: string,
    apiKey?: string
  ) {
    this.publisherUrl = publisherUrl || process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
    this.aggregatorUrl = aggregatorUrl || process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';
    this.apiKey = apiKey || process.env.WALRUS_API_KEY;

    this.axiosInstance = axios.create({
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
    });
  }

  /**
   * Upload a file to Walrus
   * @param file - File or Blob to upload
   * @param epochs - Number of epochs to store (default: 5)
   * @returns Blob ID and storage information
   */
  async upload(file: File | Blob, epochs: number = 5): Promise<WalrusUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.axiosInstance.put(
        `${this.publisherUrl}/v1/store?epochs=${epochs}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Walrus returns different response formats, handle both
      if (response.data.newlyCreated) {
        return {
          blobId: response.data.newlyCreated.blobObject.blobId,
          endEpoch: response.data.newlyCreated.blobObject.storage.endEpoch,
          suiRef: response.data.newlyCreated.blobObject.id,
        };
      } else if (response.data.alreadyCertified) {
        return {
          blobId: response.data.alreadyCertified.blobId,
          endEpoch: response.data.alreadyCertified.endEpoch,
          suiRef: response.data.alreadyCertified.event?.txDigest,
        };
      }

      throw new Error('Unexpected Walrus response format');
    } catch (error) {
      console.error('Walrus upload error:', error);

      // Fallback for local development: use browser data URL
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Walrus upload failed, using local fallback for development');
        return this.createLocalFallback(file);
      }

      throw new Error(`Failed to upload to Walrus: ${error}`);
    }
  }

  /**
   * Create a local fallback for development (uses browser data URL)
   * @param file - File to create fallback for
   * @returns Mock upload response with data URL as blobId
   */
  private async createLocalFallback(file: File | Blob): Promise<WalrusUploadResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Generate a mock blob ID from the first 32 chars of the data URL hash
        const mockBlobId = btoa(dataUrl.substring(0, 100)).substring(0, 32);

        // Store in localStorage for retrieval
        try {
          localStorage.setItem(`walrus_fallback_${mockBlobId}`, dataUrl);
        } catch (e) {
          console.warn('Failed to store in localStorage, file too large');
        }

        resolve({
          blobId: mockBlobId,
          endEpoch: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload JSON data to Walrus
   * @param data - JSON object to upload
   * @param epochs - Number of epochs to store
   * @returns Blob ID
   */
  async uploadJSON(data: any, epochs: number = 5): Promise<string> {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const result = await this.upload(blob, epochs);
    return result.blobId;
  }

  /**
   * Download a blob from Walrus
   * @param blobId - The blob ID to download
   * @returns Blob data as ArrayBuffer
   */
  async download(blobId: string): Promise<ArrayBuffer> {
    try {
      const response = await this.axiosInstance.get(
        `${this.aggregatorUrl}/v1/${blobId}`,
        {
          responseType: 'arraybuffer',
        }
      );

      return response.data;
    } catch (error) {
      console.error('Walrus download error:', error);
      throw new Error(`Failed to download from Walrus: ${error}`);
    }
  }

  /**
   * Download JSON data from Walrus
   * @param blobId - The blob ID to download
   * @returns Parsed JSON object
   */
  async downloadJSON<T = any>(blobId: string): Promise<T> {
    const buffer = await this.download(blobId);
    const text = new TextDecoder().decode(buffer);
    return JSON.parse(text);
  }

  /**
   * Get a public URL for a blob (for direct HTTP access)
   * @param blobId - The blob ID
   * @returns Public URL or data URL for local fallback
   */
  getPublicUrl(blobId: string): string {
    // Check if this is a local fallback blob ID
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const fallbackData = localStorage.getItem(`walrus_fallback_${blobId}`);
      if (fallbackData) {
        return fallbackData;
      }
    }

    return `${this.aggregatorUrl}/v1/${blobId}`;
  }

  /**
   * Check if a blob exists
   * @param blobId - The blob ID to check
   * @returns True if blob exists
   */
  async exists(blobId: string): Promise<boolean> {
    try {
      await this.axiosInstance.head(`${this.aggregatorUrl}/v1/${blobId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete a blob (if supported by your Walrus configuration)
   * Note: Walrus is immutable by default, deletion may not be available
   * @param blobId - The blob ID to delete
   */
  async delete(blobId: string): Promise<void> {
    // Walrus is designed to be immutable
    // This method is placeholder for future support or custom implementations
    console.warn('Walrus blobs are immutable. Delete operation not supported.');
    throw new Error('Delete operation not supported for Walrus blobs');
  }
}

// Export singleton instance
export const walrusClient = new WalrusClient();
