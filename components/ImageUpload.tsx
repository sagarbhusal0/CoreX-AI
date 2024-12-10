import React, { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface ImageUploadProps {
    onImageSelect: (imageData: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelect(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
                <FiUpload className="mr-2" />
                Upload Image
            </button>
        </div>
    );
};

export default ImageUpload;