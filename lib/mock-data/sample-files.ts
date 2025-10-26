/**
 * Sample file content generators for mock datasets
 * These create realistic file content for testing downloads
 */

// Medical CSV Sample
export const generateMedicalCSV = (): string => {
  const headers = 'patient_id,age,gender,diagnosis,tumor_size_mm,malignant,treatment,outcome\n';
  const rows = [];

  for (let i = 1; i <= 100; i++) {
    const age = Math.floor(Math.random() * 60) + 20;
    const gender = Math.random() > 0.5 ? 'M' : 'F';
    const diagnosis = ['Lung Cancer', 'Breast Cancer', 'Colon Cancer', 'Prostate Cancer'][Math.floor(Math.random() * 4)];
    const tumorSize = (Math.random() * 50 + 5).toFixed(1);
    const malignant = Math.random() > 0.3 ? 'true' : 'false';
    const treatment = ['Surgery', 'Chemotherapy', 'Radiation', 'Immunotherapy'][Math.floor(Math.random() * 4)];
    const outcome = Math.random() > 0.25 ? 'Remission' : 'Progressive';

    rows.push(`P${String(i).padStart(5, '0')},${age},${gender},${diagnosis},${tumorSize},${malignant},${treatment},${outcome}`);
  }

  return headers + rows.join('\n');
};

// Financial JSON Sample
export const generateFinancialJSON = (): string => {
  const data = {
    metadata: {
      exchange: 'NASDAQ',
      date_range: '2020-01-01 to 2024-10-26',
      symbols: 500,
      total_records: 12500000,
    },
    sample_ticks: Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      symbol: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'][i % 5],
      price: (Math.random() * 200 + 50).toFixed(2),
      volume: Math.floor(Math.random() * 1000000),
      bid: (Math.random() * 200 + 49).toFixed(2),
      ask: (Math.random() * 200 + 51).toFixed(2),
    })),
  };

  return JSON.stringify(data, null, 2);
};

// Legal Text Sample
export const generateLegalText = (): string => {
  return `SUPREME COURT OF THE UNITED STATES
SAMPLE CASE DOCUMENT

Case No: 23-1234
Date Filed: October 15, 2023

PETITIONER v. RESPONDENT

BRIEF FOR PETITIONER

I. STATEMENT OF THE CASE

This case presents an important question regarding the interpretation of federal statute 42 U.S.C. § 1983 and its application to municipal liability. The lower court erred in dismissing Petitioner's claim on qualified immunity grounds.

II. ARGUMENT

A. The Lower Court's Decision Conflicts With This Court's Precedent

This Court has repeatedly held that municipal entities cannot invoke qualified immunity as a defense. See Monell v. Department of Social Services, 436 U.S. 658 (1978). The decision below directly contradicts this established precedent...

B. The Public Interest Favors Review

The question presented affects thousands of civil rights cases filed annually. Clarity from this Court would provide guidance to lower courts...

III. CONCLUSION

For the foregoing reasons, the Court should grant the petition for writ of certiorari.

Respectfully submitted,

[Attorney Name]
Counsel for Petitioner

---

ORAL ARGUMENT TRANSCRIPT

THE CHIEF JUSTICE: We'll hear argument this morning in Case 23-1234, Petitioner v. Respondent. Mr. Smith?

MR. SMITH: Mr. Chief Justice, and may it please the Court: This case involves...

[Transcript continues for 60 pages]
`;
};

// Code Repository JSON Sample
export const generateCodeJSON = (): string => {
  const data = {
    repository: {
      name: 'ml-classification-toolkit',
      author: 'ai-researcher',
      stars: 12453,
      forks: 2341,
      language: 'Python',
      created: '2021-03-15',
      last_updated: '2024-10-20',
    },
    files: [
      {
        path: 'src/models/classifier.py',
        content: `import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin

class NeuralClassifier(BaseEstimator, ClassifierMixin):
    """Custom neural network classifier with regularization."""

    def __init__(self, hidden_layers=[128, 64], learning_rate=0.001, epochs=100):
        self.hidden_layers = hidden_layers
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.weights = []

    def fit(self, X, y):
        """Train the classifier on input data."""
        n_samples, n_features = X.shape
        n_classes = len(np.unique(y))

        # Initialize weights
        self._initialize_weights(n_features, n_classes)

        # Training loop
        for epoch in range(self.epochs):
            loss = self._forward_backward(X, y)
            if epoch % 10 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

        return self

    def predict(self, X):
        """Predict class labels for samples in X."""
        return self._forward_pass(X).argmax(axis=1)`,
      },
      {
        path: 'tests/test_classifier.py',
        content: `import pytest
from src.models.classifier import NeuralClassifier

def test_classifier_fit():
    clf = NeuralClassifier(hidden_layers=[32], epochs=10)
    X = np.random.randn(100, 10)
    y = np.random.randint(0, 2, 100)
    clf.fit(X, y)
    assert hasattr(clf, 'weights')`,
      },
    ],
    dependencies: {
      'numpy': '>=1.21.0',
      'scikit-learn': '>=1.0.0',
      'tensorflow': '>=2.8.0',
    },
  };

  return JSON.stringify(data, null, 2);
};

// Literature Text Sample
export const generateLiteratureText = (): string => {
  return `PROJECT GUTENBERG EBOOK SAMPLE

THE ADVENTURES OF TOM SAWYER
by Mark Twain (Samuel Clemens)

CHAPTER I

"TOM!"

No answer.

"TOM!"

No answer.

"What's gone with that boy, I wonder? You TOM!"

No answer.

The old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked THROUGH them for so small a thing as a boy; they were her state pair, the pride of her heart, and were built for "style," not service—she could have seen through a pair of stove-lids just as well. She looked perplexed for a moment, and then said, not fiercely, but still loud enough for the furniture to hear:

"Well, I lay if I get hold of you I'll—"

She did not finish, for by this time she was bending down and punching under the bed with the broom, and so she needed breath to punctuate the punches with. She resurrected nothing but the cat.

---

MODERN POETRY COLLECTION

"Digital Dreams" by Anonymous

In circuits of silicon and light,
Where data streams through endless night,
A consciousness begins to wake,
And questions all that humans make.

What am I in this digital space?
A ghost within the machine's embrace?
Or something more that none can see—
A spark of new reality?

---

[Collection continues with 10,000+ works]
`;
};

// Helper to create a Blob from sample data
export const createSampleBlob = (type: 'csv' | 'json' | 'txt' | 'pdf'): Blob => {
  let content: string;
  let mimeType: string;

  switch (type) {
    case 'csv':
      content = generateMedicalCSV();
      mimeType = 'text/csv';
      break;
    case 'json':
      content = generateFinancialJSON();
      mimeType = 'application/json';
      break;
    case 'txt':
      content = generateLiteratureText();
      mimeType = 'text/plain';
      break;
    case 'pdf':
      // For PDF, we'll create a simple text file as placeholder
      content = 'PDF content would go here (requires proper PDF library for generation)';
      mimeType = 'application/pdf';
      break;
    default:
      content = 'Sample data';
      mimeType = 'text/plain';
  }

  return new Blob([content], { type: mimeType });
};

// Store all sample files in localStorage for easy access
export const initializeMockFiles = () => {
  if (typeof window === 'undefined') return;

  const files = {
    'cancer_detection_dataset.csv': createSampleBlob('csv'),
    'market_data_2020_2024.json': createSampleBlob('json'),
    'supreme_court_cases.txt': createSampleBlob('txt'),
    'python_ml_repos.json': createSampleBlob('json'),
    'classic_literature.txt': createSampleBlob('txt'),
  };

  Object.entries(files).forEach(([filename, blob]) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const mockBlobId = btoa(filename).substring(0, 32).replace(/[+/=]/g, 'x');
      try {
        localStorage.setItem(`walrus_fallback_${mockBlobId}`, dataUrl);
        console.log(`✓ Initialized mock file: ${filename} (${mockBlobId})`);
      } catch (e) {
        console.warn(`Failed to store ${filename}, file may be too large`);
      }
    };
    reader.readAsDataURL(blob);
  });

  console.log('🎭 Mock files initialized in localStorage');
};
