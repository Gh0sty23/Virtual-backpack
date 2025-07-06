
// Utility functions to save and load localStorage to/from a JSON file
export function saveLocalStorageToFile(filename = 'virtual-backpack-backup.json') {
  const data = { ...localStorage };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

export function loadLocalStorageFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result);
          for (const key in data) {
            if (typeof data[key] === 'string') {
              localStorage.setItem(key, data[key]);
            } else {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          }
          resolve();
        } else {
          reject(new Error('File read error'));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

