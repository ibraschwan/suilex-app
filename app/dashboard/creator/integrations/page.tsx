'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  SiKaggle,
  SiHuggingface,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiAmazon,
  SiGooglecloud
} from 'react-icons/si';
import { IconType } from 'react-icons';

type IntegrationStatus = 'connected' | 'disconnected' | 'error';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: IconType;
  logoColor: string;
  status: IntegrationStatus;
  category: 'data-source' | 'database' | 'storage';
}

interface FormValues {
  [key: string]: string;
}

const integrations: Integration[] = [
  {
    id: 'kaggle',
    name: 'Kaggle',
    description: 'Import datasets directly from Kaggle',
    logo: SiKaggle,
    logoColor: '#20BEFF',
    status: 'disconnected',
    category: 'data-source',
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    description: 'Access datasets from HuggingFace Hub',
    logo: SiHuggingface,
    logoColor: '#FFD21E',
    status: 'disconnected',
    category: 'data-source',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Connect to PostgreSQL databases',
    logo: SiPostgresql,
    logoColor: '#4169E1',
    status: 'disconnected',
    category: 'database',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Connect to MySQL databases',
    logo: SiMysql,
    logoColor: '#4479A1',
    status: 'disconnected',
    category: 'database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Connect to MongoDB databases',
    logo: SiMongodb,
    logoColor: '#47A248',
    status: 'disconnected',
    category: 'database',
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'Import data from AWS S3 buckets',
    logo: SiAmazon,
    logoColor: '#FF9900',
    status: 'disconnected',
    category: 'storage',
  },
  {
    id: 'gcs',
    name: 'Google Cloud Storage',
    description: 'Import data from GCS buckets',
    logo: SiGooglecloud,
    logoColor: '#4285F4',
    status: 'disconnected',
    category: 'storage',
  },
];

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormValues>({});

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
    setFormValues({});
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIntegration(null);
    setFormValues({});
    setErrors({});
  };

  const handleFormChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormValues = {};

    if (!selectedIntegration) return false;

    if (selectedIntegration.id === 'kaggle' || selectedIntegration.id === 'huggingface') {
      if (!formValues.apiKey?.trim()) {
        newErrors.apiKey = 'API key/token is required';
      }
    } else if (selectedIntegration.category === 'database') {
      if (!formValues.host?.trim()) newErrors.host = 'Host is required';
      if (!formValues.port?.trim()) newErrors.port = 'Port is required';
      if (!formValues.database?.trim()) newErrors.database = 'Database name is required';
      if (!formValues.username?.trim()) newErrors.username = 'Username is required';
      if (!formValues.password?.trim()) newErrors.password = 'Password is required';
    } else if (selectedIntegration.category === 'storage') {
      if (!formValues.accessKeyId?.trim()) newErrors.accessKeyId = 'Access Key ID is required';
      if (!formValues.secretAccessKey?.trim()) newErrors.secretAccessKey = 'Secret Access Key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // TODO: Actually save the integration credentials
    alert('Integration saved successfully!');
    handleCloseModal();
  };

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-text-secondary-dark';
    }
  };

  const getStatusText = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Not connected';
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Header />

      <div className="flex h-full min-h-screen pt-[60px]">
        {/* Sidebar */}
        <DashboardSidebar mode="creator" />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8 lg:p-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
            {/* Header */}
            <header className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Integrations
              </h1>
              <p className="text-text-secondary-dark/80 text-lg">
                Connect external data sources to seamlessly import datasets to your marketplace.
              </p>
            </header>

            {/* Data Sources */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Data Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter((int) => int.category === 'data-source')
                  .map((integration) => {
                    const LogoIcon = integration.logo;
                    return (
                      <Card key={integration.id} className="p-6 hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 flex items-center justify-center">
                            <LogoIcon size={64} style={{ color: integration.logoColor }} />
                          </div>
                          <span className={`text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {getStatusText(integration.status)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{integration.name}</h3>
                        <p className="text-text-secondary-dark/70 text-sm mb-6">
                          {integration.description}
                        </p>
                        <Button
                          variant={integration.status === 'connected' ? 'ghost' : 'pill'}
                          className="w-full"
                          onClick={() => handleConnect(integration)}
                        >
                          {integration.status === 'connected' ? 'Manage' : 'Connect'}
                        </Button>
                      </Card>
                    );
                  })}
              </div>
            </section>

            {/* Databases */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Databases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter((int) => int.category === 'database')
                  .map((integration) => {
                    const LogoIcon = integration.logo;
                    return (
                      <Card key={integration.id} className="p-6 hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 flex items-center justify-center">
                            <LogoIcon size={64} style={{ color: integration.logoColor }} />
                          </div>
                          <span className={`text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {getStatusText(integration.status)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{integration.name}</h3>
                        <p className="text-text-secondary-dark/70 text-sm mb-6">
                          {integration.description}
                        </p>
                        <Button
                          variant={integration.status === 'connected' ? 'ghost' : 'pill'}
                          className="w-full"
                          onClick={() => handleConnect(integration)}
                        >
                          {integration.status === 'connected' ? 'Manage' : 'Connect'}
                        </Button>
                      </Card>
                    );
                  })}
              </div>
            </section>

            {/* Cloud Storage */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Cloud Storage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter((int) => int.category === 'storage')
                  .map((integration) => {
                    const LogoIcon = integration.logo;
                    return (
                      <Card key={integration.id} className="p-6 hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 flex items-center justify-center">
                            <LogoIcon size={64} style={{ color: integration.logoColor }} />
                          </div>
                          <span className={`text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {getStatusText(integration.status)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{integration.name}</h3>
                        <p className="text-text-secondary-dark/70 text-sm mb-6">
                          {integration.description}
                        </p>
                        <Button
                          variant={integration.status === 'connected' ? 'ghost' : 'pill'}
                          className="w-full"
                          onClick={() => handleConnect(integration)}
                        >
                          {integration.status === 'connected' ? 'Manage' : 'Connect'}
                        </Button>
                      </Card>
                    );
                  })}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Connection Modal */}
      {showModal && selectedIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <Card className="max-w-5xl w-full min-w-0 md:min-w-[650px] lg:min-w-[750px] p-6 sm:p-8 lg:p-12 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 text-white/70 hover:text-white transition w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="flex items-center gap-4 sm:gap-5 mb-8 lg:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                {(() => {
                  const LogoIcon = selectedIntegration.logo;
                  return <LogoIcon size={80} style={{ color: selectedIntegration.logoColor }} />;
                })()}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{selectedIntegration.name}</h2>
                <p className="text-text-secondary-dark text-sm sm:text-base">{selectedIntegration.description}</p>
              </div>
            </div>

            <div className="space-y-5 lg:space-y-6">
              {/* Dynamic form based on integration type */}
              {(selectedIntegration.id === 'kaggle' || selectedIntegration.id === 'huggingface') && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    API {selectedIntegration.id === 'kaggle' ? 'Key' : 'Token'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formValues.apiKey || ''}
                    onChange={(e) => handleFormChange('apiKey', e.target.value)}
                    placeholder={`Enter your ${selectedIntegration.name} ${selectedIntegration.id === 'kaggle' ? 'API key' : 'access token'}`}
                    className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                      errors.apiKey ? 'border-red-500' : 'border-white/10 focus:border-primary'
                    }`}
                  />
                  {errors.apiKey && <p className="text-red-500 text-sm mt-2">{errors.apiKey}</p>}
                  <p className="text-text-secondary-dark/60 text-sm mt-2">
                    {selectedIntegration.id === 'kaggle'
                      ? 'Find your API key in Kaggle Account Settings → API'
                      : 'Get your token from HuggingFace Settings → Access Tokens'}
                  </p>
                </div>
              )}

              {selectedIntegration.category === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Host <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formValues.host || ''}
                      onChange={(e) => handleFormChange('host', e.target.value)}
                      placeholder="localhost or database.example.com"
                      className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.host ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    {errors.host && <p className="text-red-500 text-sm mt-2">{errors.host}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Port <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formValues.port || ''}
                        onChange={(e) => handleFormChange('port', e.target.value)}
                        placeholder={selectedIntegration.id === 'postgresql' ? '5432' : selectedIntegration.id === 'mysql' ? '3306' : '27017'}
                        className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                          errors.port ? 'border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                      />
                      {errors.port && <p className="text-red-500 text-sm mt-2">{errors.port}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Database <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formValues.database || ''}
                        onChange={(e) => handleFormChange('database', e.target.value)}
                        placeholder="database_name"
                        className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                          errors.database ? 'border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                      />
                      {errors.database && <p className="text-red-500 text-sm mt-2">{errors.database}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formValues.username || ''}
                      onChange={(e) => handleFormChange('username', e.target.value)}
                      placeholder="username"
                      className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.username ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formValues.password || ''}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                  </div>
                </>
              )}

              {selectedIntegration.category === 'storage' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Access Key ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formValues.accessKeyId || ''}
                      onChange={(e) => handleFormChange('accessKeyId', e.target.value)}
                      placeholder="Enter access key ID"
                      className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.accessKeyId ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    {errors.accessKeyId && <p className="text-red-500 text-sm mt-2">{errors.accessKeyId}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Secret Access Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formValues.secretAccessKey || ''}
                      onChange={(e) => handleFormChange('secretAccessKey', e.target.value)}
                      placeholder="Enter secret access key"
                      className={`w-full rounded-xl glass-card border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.secretAccessKey ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    {errors.secretAccessKey && <p className="text-red-500 text-sm mt-2">{errors.secretAccessKey}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Region
                    </label>
                    <input
                      type="text"
                      value={formValues.region || ''}
                      onChange={(e) => handleFormChange('region', e.target.value)}
                      placeholder="e.g., us-east-1"
                      className="w-full rounded-xl glass-card border border-white/10 px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8 lg:pt-10">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 sm:flex-initial sm:min-w-[160px] order-2 sm:order-1"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="pill"
                  size="lg"
                  className="flex-1 sm:flex-initial sm:min-w-[200px] order-1 sm:order-2"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Connecting...
                    </span>
                  ) : (
                    'Save & Connect'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
