/**
 * Frame Your Moments — Media Compression & Cloudinary Uploader Utility
 */
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './supabaseClient';

/**
 * Format bytes to readable KB / MB string
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Client-Side Smart Image Compressor (Canvas based)
 * Compresses images above threshold (default 500KB) while preserving high quality
 */
export async function compressImage(file, options = {}) {
  const {
    maxSizeKB = 500,
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.82,
    outputType = 'image/webp'
  } = options;

  const originalSize = file.size;

  // If already under threshold and not an unoptimized huge raw format, return as is
  if (originalSize <= maxSizeKB * 1024 && file.type === 'image/webp') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
      savedPercent: 0,
      previewUrl: URL.createObjectURL(file)
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down proportionally if larger than maximum dimension
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Use smooth image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file,
              originalSize,
              compressedSize: originalSize,
              wasCompressed: false,
              savedPercent: 0,
              previewUrl: URL.createObjectURL(file)
            });
            return;
          }

          const compressedSize = blob.size;
          // Determine if we actually saved space
          const wasCompressed = compressedSize < originalSize;
          const finalBlob = wasCompressed ? blob : file;
          const finalSize = wasCompressed ? compressedSize : originalSize;
          const savedPercent = wasCompressed
            ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
            : 0;

          // Convert blob to File object
          const finalFile = new File(
            [finalBlob],
            file.name.replace(/\.[^/.]+$/, wasCompressed ? '.webp' : ''),
            { type: wasCompressed ? outputType : file.type }
          );

          resolve({
            file: finalFile,
            originalSize,
            compressedSize: finalSize,
            wasCompressed,
            savedPercent,
            previewUrl: URL.createObjectURL(finalFile)
          });
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      // Fallback: return original file
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        wasCompressed: false,
        savedPercent: 0,
        previewUrl: URL.createObjectURL(file)
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Upload single media item (Image/Video) to Cloudinary via unsigned upload
 */
export async function uploadToCloudinary(file, options = {}) {
  const { onProgress, isVideo = false } = options;

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${isVideo ? 'video' : 'image'}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'frameyourmoments');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            url: res.secure_url || res.url,
            publicId: res.public_id,
            width: res.width,
            height: res.height,
            format: res.format,
            bytes: res.bytes
          });
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Cloudinary upload failed: ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
}

/**
 * Video URL Helpers (YouTube, Instagram, Direct MP4)
 */

export function extractYouTubeId(url = '') {
  if (!url) return null;
  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function extractInstagramCode(url = '') {
  if (!url) return null;
  // match /reel/CODE/ or /p/CODE/ or /tv/CODE/
  const match = url.match(/(?:instagram\.com\/(?:reel|p|tv)\/)([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

export function getInstagramEmbedUrl(codeOrUrl = '') {
  if (!codeOrUrl) return null;
  const code = extractInstagramCode(codeOrUrl) || codeOrUrl;
  return `https://www.instagram.com/reel/${code}/embed`;
}
