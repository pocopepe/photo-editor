import { useRecoilState } from 'recoil';
import { uploadedFilesAtom } from '../recoil/atoms';

function NavBar() {
    const [uploadedFiles, setUploadedFiles] = useRecoilState(uploadedFilesAtom); // Assuming uploadedFilesAtom holds the array of uploaded files

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the uploaded file (optional chaining to handle null case)
        if (file) {
            const reader = new FileReader(); // Create a FileReader to read the file
            reader.onload = (e) => {
                const fileData = e.target?.result as string; // Get the file data as a data URL or text
                const newUploadedFiles = [...uploadedFiles, fileData]; // Add the new file data to the existing list
                localStorage.setItem(`uploadedFile_${uploadedFiles.length}`, fileData); // Store the file data in local storage with a unique key
                setUploadedFiles(newUploadedFiles); // Update the Recoil state with the new list
            };
            reader.readAsDataURL(file); // Read the file as a Data URL (for images)
        }
    };

    return (
        <nav className="bg-black text-white flex items-center justify-between px-4 py-2 shadow-md">
            <div className="flex items-center">
                <input
                    type="file"
                    accept="image/*" // Change this according to the types of files you want to accept
                    onChange={handleFileUpload}
                    className="hidden" // Hide the default file input
                    id="file-upload" // Give it an id for the label to access
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
