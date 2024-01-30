import React, { useCallback, useState, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/dragdropimageupload.module.css';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

interface DragDropImageUploadProps {
  onFileUpload: (file: File) => void;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({ onFileUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the media here ...</p> :
          <div className={styles.d_con}>
            <div>
              Drag and drop media here
            </div>
            <div>
              <div>
                {<FontAwesomeIcon icon={faUpload} />}
              </div>
              <div>
                <button type='button' title='browse files'>Browse Files</button>
              </div>
            </div>
            
            <div>
              <div>Max. media size: (50M)</div> 
              
              <div className={styles.files_}>JPG, PNG, JPEG, SVG, MP4</div>
            </div>
          </div>
      }
      {imagePreview && (
      <div className={styles.img_prev}>
        <Image src={imagePreview} alt="Preview" className={styles.preview} width={150} height={100} style={{objectFit: 'cover',margin: '10px auto'}}/>
      </div>
      )}
    </div>
  );
};


export default DragDropImageUpload;
