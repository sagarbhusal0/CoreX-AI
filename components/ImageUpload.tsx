import React, { useRef, useCallback, useEffect } from 'react';
import { FiUpload, FiClipboard, FiX } from 'react-icons/fi';

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

    const handleRemoveImage = () => {
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
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
                    aria-label="Upload Image"
                    title="Upload Image"
                >
                    <FiUpload className="text-2xl" />
                </button>
                <button
                    type="button"
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Paste Image"
                    title="Paste Image (Ctrl/Cmd + V)"
                >
                    <FiClipboard className="text-2xl" />
                </button>
            </div>
            {selectedImage && (
                <div className="relative inline-block">
                    <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="max-h-40 rounded-lg"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                    >
                        <FiX className="text-white text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;