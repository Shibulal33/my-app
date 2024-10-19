// src/App.tsx
import React, { useState } from 'react';
import { ApolloProvider, gql, useMutation } from '@apollo/client';
import client from './apolloClient';
import { saveAs } from 'file-saver';
import './App.css';
import { decodeBase64 } from './utils/downloadUtils';

interface GenerateIDCardData {
  generateIDCard: string; // Base64 encoded PDF
}

interface GenerateIDCardVars {
  entityId: string;
}

interface GenerateAllIDCardsData {
  generateAllIDCards: string; // Base64 encoded ZIP
}

interface GenerateAllIDCardsVars { }

const GENERATE_ID_CARD = gql`
  mutation GenerateIDCard($entityId: String!) {
    generateIDCard(entityId: $entityId)
  }
`;

// const GENERATE_ALL_ID_CARDS = gql`
//   mutation GenerateAllIDCards {
//     generateAllIDCards
//   }
// `;

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>ID Card Generator</h1>
        <SingleDownload />
        {/* <hr />
        <AllDownloadAsPdf />
        <hr />
        <AllDownload /> */}
      </div>
    </ApolloProvider>
  );
};

const SingleDownload: React.FC = () => {
  
  const [entityId, setEntityId] = useState<string>('');
  const [generateIDCard, { loading, error, data }] = useMutation<
    GenerateIDCardData,
    GenerateIDCardVars
  >(GENERATE_ID_CARD);

  const handleDownload = async () => {
    if (!entityId.trim()) {
      alert('Please enter a valid name.');
      return;
    }

    try {
      console.log('before res')
      const response = await generateIDCard({ variables: { entityId } });
      console.log('after res')

      if (response.data?.generateIDCard) {
        const pdfBase64 = response.data.generateIDCard;
        const pdfBytes = decodeBase64(pdfBase64);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `${entityId}_ID_Card.pdf`);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="single-download">
      <h2>Download All ID Card In Single PDF</h2>
      <input
        type="text"
        placeholder="Enter User Name"
        value={entityId}
        onChange={(e) => setEntityId(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && <p style={{ color: 'green' }}>PDF downloaded successfully!</p>}
    </div>
  );
};

// const AllDownloadAsPdf: React.FC = () => {
//   const [genAllIDCardsInOnePdf, { loading, error, data }] = useMutation<
//     GenerateAllIDCardsData,
//     GenerateAllIDCardsVars
//   >(GENERATE_ALL_ID_CARDS);

//   const handleDownloadAll = async () => {
//     try {

//       // const response = await genAllIDCardsInOnePdf({ variables: { tenantId } });
//       const response = await genAllIDCardsInOnePdf({ variables: { tenantId: '652e0b34a569e5001c121f78' } });


//       // if (response.data?.generateAllIDCards) {
//       //   const zipBase64 = response.data.generateAllIDCards;
//       //   const zipBytes = decodeBase64(zipBase64);
//       //   const blob = new Blob([zipBytes], { type: 'application/zip' });
//       //   saveAs(blob, 'id_cards.zip');
//       // }

//       if (response.data?.generateAllIDCards) {
//         const pdfBase64 = response.data.generateAllIDCards;
//         const pdfBytes = decodeBase64(pdfBase64);
//         const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//         saveAs(blob, `_ID_Card.pdf`);
//       }
//     } catch (err) {
//       console.error('Error downloading ZIP:', err);
//       alert('Failed to download ZIP file 22. Please try again.');
//     }
//   };

//   return (
//     <div className="all-download">
//       <h2>Download All ID Cards as Single PDF</h2>
//       <button onClick={handleDownloadAll} disabled={loading}>
//         {loading ? 'Generating...' : 'Download ZIP'}
//       </button>
//       {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
//       {data && <p style={{ color: 'green' }}>ZIP downloaded successfully!</p>}
//     </div>
//   );
// };

// const AllDownload: React.FC = () => {
//   const [generateAllIDCards, { loading, error, data }] = useMutation<
//     GenerateAllIDCardsData,
//     GenerateAllIDCardsVars
//   >(GENERATE_ALL_ID_CARDS);

//   const handleDownloadAll = async () => {
//     try {

//       const response = await generateAllIDCards();


//       if (response.data?.generateAllIDCards) {
//         const zipBase64 = response.data.generateAllIDCards;
//         const zipBytes = decodeBase64(zipBase64);
//         const blob = new Blob([zipBytes], { type: 'application/zip' });
//         saveAs(blob, 'id_cards.zip');
//       }
//     } catch (err) {
//       console.error('Error downloading ZIP:', err);
//       alert('Failed to download ZIP file11. Please try again.');
//     }
//   };

//   return (
//     <div className="all-download">
//       <h2>Download All ID Cards as ZIP</h2>
//       <button onClick={handleDownloadAll} disabled={loading}>
//         {loading ? 'Generating...' : 'Download ZIP'}
//       </button>
//       {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
//       {data && <p style={{ color: 'green' }}>ZIP downloaded successfully!</p>}
//     </div>
//   );
// };

export default App;
