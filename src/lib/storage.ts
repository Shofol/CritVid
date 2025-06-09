/**
 * Storage utility functions for handling file uploads and downloads
 * using Supabase Storage buckets with local fallbacks
 */

import { supabase } from "./supabase";

// Bucket names
export const VIDEO_UPLOADS_BUCKET = "video-uploads";
export const PROCESSED_CRITIQUES_BUCKET = "processed-critiques";
export const DANCE_CRITIQUES_BUCKET = "dance-critiques";

// In-memory fallback when cloud storage fails
const memoryStorageCache = new Map<string, Blob>();

/**
 * Upload a video file to the video-uploads bucket
 * @param file The file to upload
 * @param path Optional path within the bucket
 * @returns The file path in the bucket
 */
export async function uploadVideo(file: File, path?: string): Promise<string> {
  try {
    const filePath = path ? `${path}/${file.name}` : file.name;

    // Store in memory cache as fallback
    const cacheKey = `${VIDEO_UPLOADS_BUCKET}/${filePath}`;
    memoryStorageCache.set(cacheKey, file);

    try {
      const { data, error } = await supabase.storage
        .from(VIDEO_UPLOADS_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      return data.path;
    } catch (error) {
      console.warn(
        "Error uploading video to Supabase, using memory cache:",
        error
      );
      return filePath; // Return the path even though it's only in memory cache
    }
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    throw error;
  }
}

/**
 * Upload a critique file (audio, drawing data, etc.) to the processed-critiques bucket
 * @param file The file to upload
 * @param fileName The name for the file
 * @param path Optional path within the bucket
 * @returns The file path in the bucket
 */
export async function uploadCritique(
  file: File | Blob,
  fileName: string,
  path?: string
): Promise<string> {
  try {
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Store in memory cache as fallback
    const cacheKey = `${PROCESSED_CRITIQUES_BUCKET}/${filePath}`;
    memoryStorageCache.set(cacheKey, file);

    try {
      const { data, error } = await supabase.storage
        .from(PROCESSED_CRITIQUES_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      return data.path;
    } catch (supabaseError) {
      console.warn(
        "Error uploading critique to Supabase, using memory cache:",
        supabaseError
      );
      return filePath; // Return the path even though it's only in memory cache
    }
  } catch (error) {
    console.error("Error in uploadCritique:", error);
    throw error;
  }
}

/**
 * Upload a recorded critique video to the dance-critiques bucket
 * @param videoBlob The video blob to upload
 * @param fileName Optional custom filename
 * @returns The file path in the bucket
 */
export async function uploadRecordedVideo(
  videoBlob: Blob,
  fileName?: string
): Promise<string> {
  try {
    console.log("🚀 Starting upload to dance-critiques bucket:", {
      blobSize: videoBlob.size,
      blobType: videoBlob.type,
      fileName,
      bucketName: DANCE_CRITIQUES_BUCKET,
    });

    const timestamp = new Date().getTime();
    const filePath = fileName || `critique-recording-${timestamp}.webm`;

    // Store in memory cache as fallback
    const cacheKey = `${DANCE_CRITIQUES_BUCKET}/${filePath}`;
    memoryStorageCache.set(cacheKey, videoBlob);

    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(
        "👤 User authentication status:",
        user ? "authenticated" : "anonymous"
      );

      // Check if bucket exists
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error("❌ Error checking buckets:", bucketsError);
      } else {
        const bucketExists = buckets.some(
          (b) => b.id === DANCE_CRITIQUES_BUCKET
        );
        console.log(
          "🪣 Bucket exists:",
          bucketExists,
          "Available buckets:",
          buckets.map((b) => b.id)
        );
      }

      console.log("⬆️ Attempting upload to bucket:", DANCE_CRITIQUES_BUCKET);

      const { data, error } = await supabase.storage
        .from(DANCE_CRITIQUES_BUCKET)
        .upload(filePath, videoBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "video/webm",
        });

      if (error) {
        console.error("❌ Supabase upload error:", {
          message: error.message,
          error: error,
        });
        throw error;
      }

      console.log("✅ Upload successful:", data.path);
      return data.path;
    } catch (error) {
      console.warn(
        "Error uploading recorded video to Supabase, using memory cache:",
        error
      );
      return filePath; // Return the path even though it's only in memory cache
    }
  } catch (error) {
    console.error("Error in uploadRecordedVideo:", error);
    throw error;
  }
}

/**
 * Get a public URL for a file in a bucket
 * @param bucket The bucket name
 * @param path The file path
 * @returns The public URL for the file
 */
export function getPublicUrl(bucket: string, path: string): string {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.warn("Error getting public URL:", error);
    // Return a placeholder URL for memory-cached items
    return `memory://${bucket}/${path}`;
  }
}

/**
 * Get a signed URL for a file in a bucket (for private files)
 * @param bucket The bucket name
 * @param path The file path
 * @param expiresIn Expiration time in seconds (default: 60 minutes)
 * @returns The signed URL for the file or a blob URL for memory-cached items
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.warn("Error getting signed URL, checking memory cache:", error);

    // Check if we have this file in memory cache
    const cacheKey = `${bucket}/${path}`;
    const cachedFile = memoryStorageCache.get(cacheKey);

    if (cachedFile) {
      // Create a blob URL for the cached file
      const blobUrl = URL.createObjectURL(cachedFile);
      console.log(`Created blob URL for memory-cached file: ${blobUrl}`);
      return blobUrl;
    }

    console.error("File not found in memory cache either");
    return `memory://${bucket}/${path}?error=not_found`;
  }
}

/**
 * Download a file from a bucket
 * @param bucket The bucket name
 * @param path The file path
 * @returns The file data
 */
export async function downloadFile(
  bucket: string,
  path: string
): Promise<Blob> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    return data;
  } catch (error) {
    console.warn(
      "Error downloading from Supabase, checking memory cache:",
      error
    );

    // Check if we have this file in memory cache
    const cacheKey = `${bucket}/${path}`;
    const cachedFile = memoryStorageCache.get(cacheKey);

    if (cachedFile) {
      console.log(`Retrieved file from memory cache: ${cacheKey}`);
      return cachedFile;
    }

    console.error("File not found in memory cache either");
    throw error;
  }
}

/**
 * List all files in a bucket or folder
 * @param bucket The bucket name
 * @param path Optional path within the bucket
 * @returns Array of file objects
 */
export async function listFiles(bucket: string, path?: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || "");

    if (error) throw error;

    return data;
  } catch (error) {
    console.warn("Error listing files from Supabase:", error);

    // Return an empty array as fallback
    return [];
  }
}

/**
 * Delete a file from a bucket
 * @param bucket The bucket name
 * @param path The file path
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  try {
    // Remove from memory cache first
    const cacheKey = `${bucket}/${path}`;
    memoryStorageCache.delete(cacheKey);

    // Then try to remove from Supabase
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
    } catch (supabaseError) {
      console.warn(
        "Error deleting file from Supabase (but removed from memory cache):",
        supabaseError
      );
    }
  } catch (error) {
    console.error("Error in deleteFile:", error);
  }
}
