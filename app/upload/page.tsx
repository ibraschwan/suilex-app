'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { RequireWallet } from '@/components/auth/RequireWallet';
import { useToast } from '@/components/ui/Toast';
import { useCurrentProfile } from '@/lib/hooks/useProfile';
import { usePublishDataset } from '@/lib/hooks/useDatasetUpload';
import { getExplorerUrl } from '@/lib/sui/client';
import { LivePreviewCard } from '@/components/ui/LivePreviewCard';

type UploadSource = 'manual' | 'kaggle' | 'huggingface';

interface FormData {
  source: UploadSource;
  file: File | null;
  datasetUrl: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  license: string;
  price: string;
  termsAccepted: boolean;
}

export default function UploadPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: profile } = useCurrentProfile();
  const { publish, progress, isPublishing } = usePublishDataset();

  const [formData, setFormData] = useState<FormData>({
    source: 'manual',
    file: null,
    datasetUrl: '',
    title: '',
    description: '',
    category: 'medical',
    fileType: 'csv',
    license: 'commercial',
    price: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Update form field
  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    updateField('file', file);

    // Auto-detect file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && ['csv', 'json', 'txt', 'pdf'].includes(extension)) {
      updateField('fileType', extension);
    }

    // If title is empty, suggest filename without extension
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      updateField('title', nameWithoutExt);
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (formData.source === 'manual' && !formData.file) {
      newErrors.file = 'Please upload a file';
    }
    if ((formData.source === 'kaggle' || formData.source === 'huggingface') && !formData.datasetUrl) {
      newErrors.datasetUrl = 'Please enter a dataset URL or ID';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (!profile) {
      addToast('Please create a profile first', 'error');
      router.push('/settings');
      return;
    }

    if (!formData.file) {
      addToast('No file selected', 'error');
      return;
    }

    try {
      const result = await publish({
        file: formData.file,
        profileId: profile.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileType: formData.fileType,
        license: formData.license,
        price: parseFloat(formData.price),
        listOnMarketplace: false,
      });

      addToast('Dataset published successfully!', 'success');

      const explorerUrl = getExplorerUrl('txblock', result.transactionDigest);
      addToast(`View on Explorer: ${explorerUrl}`, 'info', 10000);

      setTimeout(() => {
        router.push(`/dataset/${result.nftId}`);
      }, 2000);
    } catch (error: any) {
      console.error('Publish error:', error);
      addToast(error.message || 'Failed to publish dataset', 'error');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 lg:px-8">
        <RequireWallet
          message="Connect your Sui wallet to start listing your datasets on the marketplace"
          requireProfile={true}
        >
          <div className="mx-auto max-w-7xl">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 neon-text">
                List Your Dataset
              </h1>
              <p className="text-lg md:text-xl text-text-secondary-dark/80 mb-2">
                Join 1,234+ sellers earning on Suilex
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-text-secondary-dark/60">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-success text-lg">
                    check_circle
                  </span>
                  Simple upload process
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-success text-lg">
                    check_circle
                  </span>
                  2.5% platform fee
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-success text-lg">
                    check_circle
                  </span>
                  Instant marketplace listing
                </span>
              </div>
            </div>

            {/* Split-Screen Layout */}
            <div className="mx-auto max-w-[1600px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* LEFT SIDE: Form */}
                <div className="lg:col-span-2 space-y-8 custom-scrollbar">
                {/* Section 1: Upload */}
                <section id="upload">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-black">
                        1
                      </span>
                      Choose Data Source
                    </h2>
                    <p className="text-text-secondary-dark/70 text-sm ml-10">
                      Upload from your computer or import from a data platform
                    </p>
                  </div>

                  {/* Source Tabs */}
                  <div className="flex gap-2 mb-6">
                    {[
                      { id: 'manual', icon: 'upload_file', label: 'Manual Upload' },
                      { id: 'kaggle', icon: 'analytics', label: 'Kaggle' },
                      { id: 'huggingface', icon: 'hub', label: 'HuggingFace' },
                    ].map((source) => (
                      <button
                        key={source.id}
                        onClick={() => updateField('source', source.id)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                          formData.source === source.id
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'glass-card border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {source.icon}
                        </span>
                        <span className="hidden sm:inline">{source.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Upload */}
                  {formData.source === 'manual' && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                        isDragging
                          ? 'border-primary bg-primary/10 scale-[1.02]'
                          : errors.file
                          ? 'border-red-500'
                          : 'border-white/20 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv,.json,.txt,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
                          {formData.file ? 'check_circle' : 'cloud_upload'}
                        </span>
                        <p className="text-xl font-bold text-white mb-2">
                          {formData.file
                            ? formData.file.name
                            : isDragging
                            ? 'Drop your file here'
                            : 'Drag & drop your file here'}
                        </p>
                        <p className="text-sm text-text-secondary-dark/70 mb-6">
                          or click to browse your computer
                        </p>
                        <Button variant="pill" className="w-full sm:w-auto" type="button">
                          {formData.file ? 'Change File' : 'Choose File'}
                        </Button>
                        {formData.file && (
                          <p className="text-sm text-success mt-4 font-semibold">
                            ✓ {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        <p className="text-xs text-text-secondary-dark/50 mt-6">
                          Supported: CSV, JSON, TXT, PDF • Max size: 10GB
                        </p>
                      </label>
                    </div>
                  )}

                  {/* Kaggle/HF Import */}
                  {(formData.source === 'kaggle' || formData.source === 'huggingface') && (
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        {formData.source === 'kaggle' ? 'Kaggle Dataset URL' : 'HuggingFace Repo ID'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          formData.source === 'kaggle'
                            ? 'e.g., username/dataset-name'
                            : 'e.g., organization/dataset'
                        }
                        value={formData.datasetUrl}
                        onChange={(e) => updateField('datasetUrl', e.target.value)}
                        className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                          errors.datasetUrl
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/10 focus:border-primary'
                        }`}
                      />
                      {errors.datasetUrl && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.datasetUrl}
                        </p>
                      )}
                    </div>
                  )}

                  {errors.file && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.file}
                    </p>
                  )}
                </section>

                {/* Section 2: Details */}
                <section id="details">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-black">
                        2
                      </span>
                      Dataset Details
                    </h2>
                    <p className="text-text-secondary-dark/70 text-sm ml-10">
                      Help buyers understand what you're offering
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Medical Imaging Dataset for AI Training"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                          errors.title
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/10 focus:border-primary'
                        }`}
                        maxLength={100}
                      />
                      <div className="flex justify-between items-center mt-2">
                        {errors.title ? (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {errors.title}
                          </p>
                        ) : (
                          <p className="text-text-secondary-dark/60 text-xs">
                            Clear titles get 2x more views
                          </p>
                        )}
                        <p className="text-text-secondary-dark/60 text-xs">
                          {formData.title.length}/100
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Describe your dataset, what it contains, potential use cases, and any unique features..."
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition resize-none ${
                          errors.description
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/10 focus:border-primary'
                        }`}
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        {errors.description ? (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {errors.description}
                          </p>
                        ) : (
                          <p className="text-text-secondary-dark/60 text-xs">
                            Include use cases to boost interest
                          </p>
                        )}
                        <p className="text-text-secondary-dark/60 text-xs">
                          {formData.description.length}/500
                        </p>
                      </div>
                    </div>

                    {/* Category & File Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => updateField('category', e.target.value)}
                          className="w-full rounded-xl glass-card border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary transition [&>option]:bg-surface-dark [&>option]:text-white"
                        >
                          <option value="medical">Medical</option>
                          <option value="finance">Finance</option>
                          <option value="legal">Legal</option>
                          <option value="code">Code</option>
                          <option value="literature">Literature</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          File Type
                        </label>
                        <select
                          value={formData.fileType}
                          onChange={(e) => updateField('fileType', e.target.value)}
                          className="w-full rounded-xl glass-card border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary transition [&>option]:bg-surface-dark [&>option]:text-white"
                        >
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                          <option value="txt">TXT</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                    </div>

                    {/* License */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        License
                      </label>
                      <select
                        value={formData.license}
                        onChange={(e) => updateField('license', e.target.value)}
                        className="w-full rounded-xl glass-card border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary transition [&>option]:bg-surface-dark [&>option]:text-white"
                      >
                        <option value="commercial">Commercial Use Allowed</option>
                        <option value="research">Research Only</option>
                        <option value="attribution">Attribution Required</option>
                        <option value="custom">Custom License</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Section 3: Pricing */}
                <section id="pricing">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-black">
                        3
                      </span>
                      Set Your Price
                    </h2>
                    <p className="text-text-secondary-dark/70 text-sm ml-10">
                      Choose a competitive price based on market data
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Price (in SUI) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="500"
                          value={formData.price}
                          onChange={(e) => updateField('price', e.target.value)}
                          min="0"
                          step="0.01"
                          className={`w-full rounded-xl glass-card border px-5 py-5 pr-20 text-white text-xl font-bold placeholder:text-white/30 focus:outline-none transition ${
                            errors.price
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-primary'
                          }`}
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/70 font-black text-xl">
                          SUI
                        </span>
                      </div>
                      {errors.price ? (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.price}
                        </p>
                      ) : (
                        <p className="text-sm text-text-secondary-dark/60 mt-3">
                          Platform fee: 2.5% • You'll receive:{' '}
                          <span className="text-success font-semibold">
                            {formData.price && !isNaN(parseFloat(formData.price))
                              ? `~${(parseFloat(formData.price) * 0.975).toFixed(2)} SUI`
                              : '~0 SUI'}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Market Data */}
                    <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-primary/5">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          analytics
                        </span>
                        Market Insights
                      </h3>
                      <ul className="space-y-3 text-sm text-text-secondary-dark/70">
                        <li className="flex justify-between">
                          <span>Similar datasets in {formData.category}:</span>
                          <span className="text-white font-semibold">300-800 SUI</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Average price for your file size:</span>
                          <span className="text-white font-semibold">450 SUI</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Top seller premium:</span>
                          <span className="text-success font-semibold">+15%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 4: Terms & Publish */}
                <section id="publish" className="pb-12">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-black">
                        4
                      </span>
                      Review & Publish
                    </h2>
                    <p className="text-text-secondary-dark/70 text-sm ml-10">
                      Confirm your details and list on marketplace
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Terms Checkbox */}
                    <div
                      className={`glass-card rounded-2xl p-6 border ${
                        errors.termsAccepted ? 'border-red-500' : 'border-white/10'
                      }`}
                    >
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => updateField('termsAccepted', e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer accent-primary"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1">
                            I confirm the following <span className="text-red-500">*</span>
                          </p>
                          <ul className="text-sm text-text-secondary-dark/70 space-y-1">
                            <li>• I own the rights to this data</li>
                            <li>• The dataset contains no sensitive or personal information (PII)</li>
                            <li>• I agree to the Suilex Terms of Service</li>
                          </ul>
                        </div>
                      </label>
                      {errors.termsAccepted && (
                        <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.termsAccepted}
                        </p>
                      )}
                    </div>

                    {/* Publish Button */}
                    <Button
                      variant="pill"
                      size="lg"
                      className="w-full text-lg py-6"
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined animate-spin">
                            progress_activity
                          </span>
                          {progress.message}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined">rocket_launch</span>
                          Publish to Marketplace
                        </span>
                      )}
                    </Button>
                  </div>
                </section>
              </div>

              {/* RIGHT SIDE: Live Preview (Sticky) */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <LivePreviewCard
                  title={formData.title}
                  description={formData.description}
                  category={formData.category}
                  fileType={formData.fileType}
                  price={formData.price}
                  file={formData.file}
                  source={formData.source}
                />
              </div>
              </div>
            </div>
          </div>
        </RequireWallet>
      </main>

      <Footer />
    </div>
  );
}
