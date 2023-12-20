import { useState } from "react";
// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../../pdf-worker";
import styles from '../styles/whitepaper.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer() {
  const [file, setFile] = useState("./TAFA XTRA WHITEPAPER 1.0.0.pdf");
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div style={{margin: '2rem 0 0 0',width: '100%'}}>
      <div>
        <br></br><br></br>
        <a href={file} download rel="noopener noreferrer" style={{color:'black',backgroundColor: 'white', borderRadius: '60px',padding: '3px 8px'}}>Download WhitePaper</a>
      </div>
      <div>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
