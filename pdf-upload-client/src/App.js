import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PdfViewer from './pdfViewer';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of uploaded files when the component mounts
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('description', description);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After successful upload, fetch the updated list of files
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>Upload File</button>
      <h1>Welcome</h1>

      <PdfViewer fileId={1}/>

      <div>
        <h2>Uploaded Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              {file.file_name} -{' '}
              <a href={`http://localhost:5000/files/${file.id}`} target="_blank" rel="noopener noreferrer">
                Open
              </a>{' '}
              |{' '}
              <a href={`http://localhost:5000/files/download/${file.id}`} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
