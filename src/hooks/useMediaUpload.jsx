import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const compressFile = async (file) => {
    // Only attempt compression if it's an image
    if (file.type.startsWith('image/')) {
        try {
            return await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            });
        } catch (error) {
            console.error("Compression failed, using original file", error);
            return file;
        }
    }
    // Return PDFs and other files as-is
    return file;
};

const getResourceType = (file) => {
    // PDFs MUST be 'raw' to avoid the "Failed to load" image error
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return 'raw';
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
};

export const uploadToCloudinary = async (file) => {
    const compressed = await compressFile(file);
    const resourceType = getResourceType(file);

    const formData = new FormData();
    formData.append('file', compressed);
    formData.append('upload_preset', 'talacare_preset');
    formData.append('folder', 'talacare');

    const url = `https://api.cloudinary.com/v1_1/dmfucwoqb/${resourceType}/upload`;
        
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return {
        url: data.secure_url,
        resource_type: data.resource_type // 'image', 'video', or 'raw'
    };};

export function useMediaUpload(initialMedia = [], { multiple = true } = {}) {
    // Ensure initial state matches the mode
    const [mediaAttachments, setMediaAttachments] = useState(() => {
        if (initialMedia) return initialMedia;
        return multiple ? [] : null;
    });
    const [uploading, setUploading] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log("file:", file);

        const isVideo = file.type.startsWith('video/');
        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');

      // Append to array if multiple, otherwise replace object
        const updateState = (newEntry) => {
            setMediaAttachments(prev => {
                if (!multiple) return newEntry;
                return Array.isArray(prev) ? [...prev, newEntry] : [newEntry];
            });
        };

        try {
            setUploading(true);
            const { url, resource_type } = await uploadToCloudinary(file);
            const newEntry = { 
                url,                          // This is short for url: url
                type: resource_type,          // Keep the Cloudinary type (image/video/raw)
                isVideo: resource_type === 'video', 
                isPDF: file.type === 'application/pdf' || url.endsWith('.pdf'), 
                name: file.name 
            };
            updateState(newEntry); // Use the helper
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const resetMedia = () => setMediaAttachments(multiple ? [] : null);
    
    // Note: ensure deleteMedia is defined or passed in
    const deleteMedia = (url) => {
        setMediaAttachments(prev => 
            multiple ? prev.filter(item => item.url !== url) : null
        );
    };

    return {
        mediaAttachments, uploading, handleMediaUpload,
        resetMedia, setMedia: setMediaAttachments, deleteMedia,
        cropImageSrc, setCropImageSrc
    };
}