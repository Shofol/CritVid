import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listFiles, VIDEO_UPLOADS_BUCKET, PROCESSED_CRITIQUES_BUCKET, deleteFile } from '@/lib/storage';
import { FileIcon, FolderIcon, TrashIcon, RefreshCwIcon, CloudIcon, VideoIcon, ArrowLeftIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const StorageManagement = () => {
  const navigate = useNavigate();
  const [videoFiles, setVideoFiles] = useState<any[]>([]);
  const [critiqueFiles, setCritiqueFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [activeBucket, setActiveBucket] = useState<string>(VIDEO_UPLOADS_BUCKET);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<{totalSize: number, fileCount: number}>({ totalSize: 0, fileCount: 0 });

  const loadFiles = async (bucket: string, path: string = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const files = await listFiles(bucket, path);
      if (bucket === VIDEO_UPLOADS_BUCKET) {
        setVideoFiles(files || []);
      } else {
        setCritiqueFiles(files || []);
      }
      setCurrentPath(path);
      
      // Calculate storage stats
      let totalSize = 0;
      let fileCount = 0;
      
      files?.forEach(file => {
        if (!file.id) { // It's a file, not a folder
          totalSize += file.metadata?.size || 0;
          fileCount++;
        }
      });
      
      setStorageStats({ totalSize, fileCount });
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (bucket: string, path: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteFile(bucket, path);
      // Reload the current directory
      loadFiles(bucket, currentPath);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    }
  };

  const navigateToFolder = (bucket: string, path: string) => {
    loadFiles(bucket, path);
  };

  const navigateUp = () => {
    // Go up one directory level
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/');
    loadFiles(activeBucket, newPath);
  };

  const handleTabChange = (value: string) => {
    setActiveBucket(value);
    loadFiles(value, '');
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Load files on initial render
  useEffect(() => {
    loadFiles(activeBucket);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileList = (files: any[], bucket: string) => {
    if (isLoading) {
      return <div className="py-8 text-center">Loading files...</div>;
    }

    if (files.length === 0) {
      return <div className="py-8 text-center">No files found in this location.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center space-x-2">
                {file.id ? (
                  <FolderIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <FileIcon className="h-5 w-5 text-gray-500" />
                )}
                <CardTitle className="text-sm truncate">{file.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {!file.id && (
                <CardDescription>
                  Size: {formatBytes(file.metadata?.size || 0)}
                  <br />
                  Last modified: {new Date(file.metadata?.lastModified || 0).toLocaleString()}
                </CardDescription>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              {file.id ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateToFolder(bucket, `${currentPath ? `${currentPath}/` : ''}${file.name}`)}
                >
                  Open Folder
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl, '_blank')}
                >
                  View File
                </Button>
              )}
              {!file.id && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteFile(bucket, `${currentPath ? `${currentPath}/` : ''}${file.name}`)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Storage Management</h1>
        </div>
        <Button onClick={() => loadFiles(activeBucket, currentPath)}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CloudIcon className="h-5 w-5 mr-2" />
              Storage Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Files: {storageStats.fileCount}</p>
            <p>Total Size: {formatBytes(storageStats.totalSize)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <VideoIcon className="h-5 w-5 mr-2" />
              Video Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bucket: {VIDEO_UPLOADS_BUCKET}</p>
            <p>Files: {activeBucket === VIDEO_UPLOADS_BUCKET ? videoFiles.length : '—'}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => handleTabChange(VIDEO_UPLOADS_BUCKET)}
              className="w-full"
            >
              Manage Videos
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileIcon className="h-5 w-5 mr-2" />
              Processed Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bucket: {PROCESSED_CRITIQUES_BUCKET}</p>
            <p>Files: {activeBucket === PROCESSED_CRITIQUES_BUCKET ? critiqueFiles.length : '—'}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => handleTabChange(PROCESSED_CRITIQUES_BUCKET)}
              className="w-full"
            >
              Manage Critiques
            </Button>
          </CardFooter>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>File Browser</CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateUp}
                disabled={!currentPath}
              >
                Up One Level
              </Button>
            </div>
          </div>
          <CardDescription>
            Current Path: {currentPath || 'Root'} | Bucket: {activeBucket}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeBucket} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value={VIDEO_UPLOADS_BUCKET}>Video Uploads</TabsTrigger>
              <TabsTrigger value={PROCESSED_CRITIQUES_BUCKET}>Processed Critiques</TabsTrigger>
            </TabsList>
            <TabsContent value={VIDEO_UPLOADS_BUCKET}>
              {renderFileList(videoFiles, VIDEO_UPLOADS_BUCKET)}
            </TabsContent>
            <TabsContent value={PROCESSED_CRITIQUES_BUCKET}>
              {renderFileList(critiqueFiles, PROCESSED_CRITIQUES_BUCKET)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageManagement;