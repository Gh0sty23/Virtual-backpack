import React, { useRef, useState } from 'react';
import { saveLocalStorageToFile, loadLocalStorageFromFile } from './save';
import './Save.css';

const SaveModule: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');

  const handleSave = () => {
    saveLocalStorageToFile();
    setStatus('Saved!');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await loadLocalStorageFromFile(file);
        setStatus('Restored!');
      } catch (err) {
        setStatus('Error!');
      }
      setTimeout(() => setStatus(''), 2000);
      e.target.value = '';
    }
  };

  return (
    <div className="save-module">
      <button onClick={handleSave} className="save-btn">
        Download
      </button>
      <button onClick={handleLoadClick} className="save-btn">
        Restore
      </button>
      <input
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {status && <div className="save-status">{status}</div>}
    </div>
  );
};

export default SaveModule;