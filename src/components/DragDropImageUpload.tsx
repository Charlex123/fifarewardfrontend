import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import styles from '../styles/dragdropimageupload.module.css';
import { FaUpload } from 'react-icons/fa6';

interface DragDropImageUploadProps {
  onFileUpload: (file: File) => void;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({ onFileUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const onDrop = useCallback((acceptedFiles: File[]) => {
    
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size is too large. Maximum size is 5MB.');
        return;
      }
      setError('');
    }
    
    onFileUpload(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={styles.dropzone}>
      <input {...getInputProps()} required/>
      {
        isDragActive ?
          <p>Drop the media here ...</p> :
          <div className={styles.d_con}>
            <div>
              Drag and drop media here
            </div>
            <div>
              <div>
                {<FaUpload />}
              </div>
              <div>
                <button type='button' title='browse files'>Browse Files</button>
              </div>
            </div>
            
            <div>
              <div>Max. media size: (5M)</div> 
              
              <div className={styles.files_}>JPG, PNG, JPEG, SVG, GIF</div>
            </div>
          </div>
      }
      {imagePreview && (
      <>
        <div className={styles.img_prev}>
          <Image src={imagePreview} alt="Preview" className={styles.preview} width={100} height={100} style={{objectFit: 'cover',margin: '0 auto',width: '100%',position: 'absolute',height: '100%',zIndex: 0,borderRadius: '16px'}}/>
        </div>
        <div>{error}</div>
      </>
      )}
    </div>
  );
};


export default DragDropImageUpload;
