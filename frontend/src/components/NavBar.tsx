import { useRecoilState } from 'recoil';
import { uploadedFilesAtom } from '../recoil/atoms';

function NavBar() {
    const [uploadedFiles, setUploadedFiles] = useRecoilState(uploadedFilesAtom); 

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader(); 
            reader.onload = (e) => {
                const fileData = e.target?.result as string; 
                const newUploadedFiles = [...uploadedFiles, fileData]; 
                localStorage.setItem(`uploadedFile_${uploadedFiles.length}`, fileData); 
                setUploadedFiles(newUploadedFiles);
            };
            reader.readAsDataURL(file); 
        }
    };

    return (
        <nav className="bg-black text-white flex items-center justify-between px-4 py-2 shadow-md">
            <div className="flex items-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden" 
                    id="file-upload" 
                />
                <label
                    htmlFor="file-upload"
                    className="bg-black text-white rounded-l px-4 py-2 cursor-pointer hover:bg-gray-700 transition duration-200"
                >
                    File Upload
                </label>
            </div>
            <div className="max-w-7xl mx-auto flex items-center">
                <div className="text-2xl font-mono font-bold">
                    Photo Editor
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
