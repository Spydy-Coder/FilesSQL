import React, { useState } from 'react';
import axios from 'axios';

const PdfViewer = ({ fileId }) => {
  const [pdfData, setPdfData] = useState('');
  const [fileType, setFileType] = useState('');

  const fetchPdfData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${fileId}`, {
        responseType: 'arraybuffer',
      });
      const typeResponse = await axios.get(`http://localhost:5000/files/${fileId}/type`);
      const { fileType } = typeResponse.data;
      setFileType(fileType);
      console.log(response)
      const pdfBlob = new Blob([response.data], { type: `application/${fileType}` });
      const pdfDataUrl = URL.createObjectURL(pdfBlob);
      setPdfData(pdfDataUrl);

      window.open(pdfDataUrl, '_blank');
    } catch (error) {
      console.error('Error fetching PDF data:', error);
    }
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = `document.${fileType}`; // Set the desired filename
    link.click();
  };

  return (
    <div>
      <button onClick={fetchPdfData}>Load PDF</button>
      <button onClick={downloadPdf} disabled={!pdfData}>
        Download PDF
      </button>
      
    </div>
  );
};

export default PdfViewer;
