import crypto from 'crypto';

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  MIN: 1024, // 1 KB
  MAX: 10 * 1024 * 1024 * 1024, // 10 GB
};

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/zip': ['.zip'],
  'application/x-tar': ['.tar'],
  'application/gzip': ['.gz'],
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  hash: string;
  uploadedAt: number;
}

export interface DatasetMetadata {
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: number;
  fileName: string;
  fileHash: string;
  license: string;
  uploadedAt: number;
  version: string;
}

/**
 * Validate uploaded file
 */
export function validateFile(file: File): FileValidationResult {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size < FILE_SIZE_LIMITS.MIN) {
    return { valid: false, error: 'File is too small (min 1 KB)' };
  }

  if (file.size > FILE_SIZE_LIMITS.MAX) {
    return {
      valid: false,
      error: `File is too large (max ${FILE_SIZE_LIMITS.MAX / 1024 / 1024 / 1024} GB)`,
    };
  }

  // Check file type
  const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
  const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat();

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.includes(fileExtension);

  if (!isValidType && !isValidExtension) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Calculate file hash (SHA-256)
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate file metadata
 */
export async function generateFileMetadata(file: File): Promise<FileMetadata> {
  const hash = await calculateFileHash(file);

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    hash,
    uploadedAt: Date.now(),
  };
}

/**
 * Generate dataset metadata for Walrus storage
 */
export async function generateDatasetMetadata(
  file: File,
  formData: {
    title: string;
    description: string;
    category: string;
    fileType: string;
    license: string;
  }
): Promise<DatasetMetadata> {
  const fileMetadata = await generateFileMetadata(file);

  return {
    title: formData.title,
    description: formData.description,
    category: formData.category,
    fileType: formData.fileType,
    fileSize: file.size,
    fileName: file.name,
    fileHash: fileMetadata.hash,
    license: formData.license,
    uploadedAt: fileMetadata.uploadedAt,
    version: '1.0.0',
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get file type category
 */
export function getFileTypeCategory(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const categories: Record<string, string[]> = {
    'Tabular Data': ['csv', 'tsv', 'xls', 'xlsx'],
    'Text Data': ['txt', 'md', 'doc', 'docx'],
    'Structured Data': ['json', 'xml', 'yaml', 'yml'],
    'Code': ['py', 'js', 'ts', 'java', 'cpp', 'c'],
    'Archive': ['zip', 'tar', 'gz', 'rar'],
    'Document': ['pdf'],
    'Image': ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  };

  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(extension || '')) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Extract sample data from CSV file (first 5 rows)
 */
export async function extractCSVSample(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(0, 5);
        resolve(lines);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file.slice(0, 10000)); // Read first 10KB for sample
  });
}

/**
 * Validate metadata before minting
 */
export function validateMetadata(metadata: DatasetMetadata): FileValidationResult {
  if (!metadata.title || metadata.title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }

  if (!metadata.description || metadata.description.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters' };
  }

  if (metadata.fileSize <= 0) {
    return { valid: false, error: 'Invalid file size' };
  }

  if (!metadata.fileHash || metadata.fileHash.length !== 64) {
    return { valid: false, error: 'Invalid file hash' };
  }

  return { valid: true };
}
