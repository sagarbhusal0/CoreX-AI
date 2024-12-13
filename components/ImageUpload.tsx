import React, { useRef, useCallback, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';

interface ImageUploadProps {
    onImageSelect: (imageData: string | null) => void;
    selectedImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePaste = useCallback(async (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        
        if (!items) return;

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        onImageSelect(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
                break;
            }
        }
    }, [onImageSelect]);

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);

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
        <div className="flex items-stretch">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
            />
            <div className="flex gap-2 bg-[#2c2c2c] p-3 rounded-lg">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Upload Image"
                    title="Upload Image"
                >
                    <FiUpload className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;