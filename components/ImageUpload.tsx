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

    const handleClipboardClick = () => {
        navigator.clipboard.read()
            .then(async (items) => {
                for (const item of items) {
                    const imageType = item.types.find(type => type.startsWith('image/'));
                    if (imageType) {
                        const blob = await item.getType(imageType);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            onImageSelect(reader.result as string);
                        };
                        reader.readAsDataURL(blob);
                        break;
                    }
                }
            })
            .catch(() => {
                document.execCommand('paste');
            });
    };

    const handleRemoveImage = () => {
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
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
                onClick={handleClipboardClick}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label="Paste Image"
                title="Paste Image (Ctrl/Cmd + V)"
            >
                <FiClipboard className="text-2xl" />
            </button>
        </div>
    );
};

export default ImageUpload;