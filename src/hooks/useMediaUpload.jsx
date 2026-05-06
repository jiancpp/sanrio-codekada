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
    if (file.type === 'application/pdf') return 'raw';
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
    formData.append('display_name', `TalaCare_${Date.now()}_${file.name}`);

    const url = `https://api.cloudinary.com/v1_1/dmfucwoqb/${resourceType}/upload`;
    
    // Changing 'auto' to 'auto' is usually fine, b ut for PDFs 
    // Cloudinary handles them as 'raw' or 'image' depending on settings.
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Cloudinary upload failed');
    const data = await response.json();
    return data.secure_url;
};

export function useMediaUpload(initialMedia = [], { multiple = true } = {}) {
    const [mediaAttachments, setMediaAttachments] = useState(initialMedia);
    const [uploading, setUploading] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState(null);

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log("file:", file);

        const isVideo = file.type.startsWith('video/');
        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');

        // Only trigger crop if it's an image and single-upload mode
        // if (!multiple && isImage) {
        //     const reader = new FileReader();
        //     reader.onload = () => setCropImageSrc(reader.result);
        //     reader.readAsDataURL(file);
        //     e.target.value = "";
        //     return;
        // }

        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);
            console.log("uploaded url:", url);
            
            // Store the type so your UI can render an <img>, <video>, or <a> tag
            const newEntry = { 
                url, 
                isVideo, 
                isPDF, 
                name: file.name // Helpful for PDF labels
            };

            setMediaAttachments(multiple ? [newEntry] : newEntry);
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