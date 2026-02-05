import React, { useState, useRef } from 'react';
import { uploadDocument } from '../services/document.service';
import bg2 from '../assets/bg3.png';

const DocumentUpload = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bg2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '800px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Document Management</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 24px',
              marginRight: '10px',
              backgroundColor: activeTab === 'upload' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'upload' ? 'white' : '#333',
              border: '2px solid #007bff',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'upload' ? '0 2px 4px rgba(0, 123, 255, 0.3)' : 'none'
            }}
          >
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab('review')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'review' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'review' ? 'white' : '#333',
              border: '2px solid #007bff',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'review' ? '0 2px 4px rgba(0, 123, 255, 0.3)' : 'none'
            }}
          >
            Review
          </button>
        </div>
        {activeTab === 'upload' && <UploadDocument />}
        {activeTab === 'review' && <Review />}
      </div>
    </div>
  );
};

const UploadDocument = () => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [activeView, setActiveView] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const uploadFile = async (doc: string, file: File) => {
    setUploading(prev => ({ ...prev, [doc]: true }));
    try {
      const url = await uploadDocument(doc, file);
      setUploadedDocs(prev => ({ ...prev, [doc]: url }));
      setSelectedFiles(prev => ({ ...prev, [doc]: null }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [doc]: false }));
    }
  };

  const documents = [
    'DRM APP',
    'D&G Letter',
    'Estimate reference',
    'Func distribution letter',
    'Top sheet'
  ];

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>Upload Documents</h3>
      {documents.map((doc, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          transition: 'box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <span style={{ flex: 1, fontWeight: 'bold', color: '#333' }}>{doc}</span>
          {uploadedDocs[doc] ? (
            <button
              onClick={() => setActiveView(doc)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                ref={(el) => fileInputRefs.current[doc] = el}
                onChange={(e) => setSelectedFiles(prev => ({ ...prev, [doc]: e.target.files?.[0] || null }))}
                style={{ display: 'none' }}
              />
              {selectedFiles[doc] && (
                <span style={{ fontSize: '14px', color: '#555' }}>{selectedFiles[doc]!.name}</span>
              )}
              <button
                onClick={() => {
                  if (selectedFiles[doc]) {
                    uploadFile(doc, selectedFiles[doc]!);
                  } else {
                    fileInputRefs.current[doc]?.click();
                  }
                }}
                disabled={uploading[doc]}
                style={{
                  padding: '8px 16px',
                  backgroundColor: uploading[doc] ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: uploading[doc] ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading[doc] ? 'Uploading...' : selectedFiles[doc] ? 'Upload' : 'Choose File'}
              </button>
            </div>
          )}
        </div>
      ))}
      {activeView && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Viewing {activeView}</h4>
          <iframe
            src={uploadedDocs[activeView]}
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setActiveView(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Review = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h3 style={{ color: '#555' }}>Review Section</h3>
      <p style={{ color: '#777' }}>Review functionality will be implemented here.</p>
    </div>
  );
};

export default DocumentUpload;
