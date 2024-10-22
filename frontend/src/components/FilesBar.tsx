import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { uploadedFilesAtom, uploadedCountAtom } from '../recoil/atoms';

const FilesBar: React.FC = () => {
  const setUploadedFiles = useSetRecoilState(uploadedFilesAtom);
  const uploadedFiles = useRecoilValue(uploadedFilesAtom);
  const uploadCount = useRecoilValue(uploadedCountAtom);

  useEffect(() => {
    if (uploadCount == null) return;

    const storedImages: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = key ? localStorage.getItem(key) : ''; 

      if (value === null || value.trim() === '') {
        alert('Error uploading, try again.');
        return; 
      }

      if (value && key && key.startsWith('uploadedFile')) {
        storedImages.push(value);
      }
    }

    setUploadedFiles(storedImages); 

  }, [uploadCount, setUploadedFiles]);

  return (
    <div className="p-4 grid grid-cols-7 gap-2"> {/* Reduced gap here */}
      {uploadedFiles.map((image, index) => (
        <div key={index} className="bg-gray-200 rounded overflow-hidden w-16 h-16 flex items-center justify-center"> {/* Adjusted size here */}
          <img
            src={image}
            alt={`Uploaded File ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      {uploadedFiles.length === 0 && <div>No uploaded images.</div>}
    </div>
  );
};

export default FilesBar;
