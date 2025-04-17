'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Info } from 'lucide-react';
import Image from 'next/image';

interface UploadResponse {
    id: string;
    url: string;
    description?: string;
}

interface FileWithDescription extends File {
    description?: string;
}

export default function TestUploadPage() {
    const [files, setFiles] = useState<FileWithDescription[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const filesWithDescription = acceptedFiles.map(file => ({
            ...file,
            description: ''
        }));
        setFiles(prev => [...prev, ...filesWithDescription]);
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDescriptionChange = (index: number, description: string) => {
        setFiles(prev => prev.map((file, i) =>
            i === index ? { ...file, description } : file
        ));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one file to upload');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                // if (file.description) {
                //     formData.append('description', file.description);
                // }

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                console.log('response', response);

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
                }

                return response.json();
            });

            const results = await Promise.all(uploadPromises);
            setUploadedFiles(prev => [...prev, ...results]);
            setFiles([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Image Upload</h1>
                <p className="text-muted-foreground">
                    Upload and manage your images with our easy-to-use interface.
                    Supports multiple file uploads with drag and drop functionality.
                </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                <div className="flex items-start gap-3 mb-4">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <h3 className="font-semibold mb-1">API Information</h3>
                        <p className="text-sm text-muted-foreground">
                            Endpoint: <code className="bg-muted px-2 py-1 rounded">/api/upload</code>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Method: <code className="bg-muted px-2 py-1 rounded">POST</code>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Max File Size: 5MB
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Supported Formats: JPEG, PNG, GIF, WebP
                        </p>
                    </div>
                </div>
            </div>

            <div
                {...getRootProps()}
                style={{
                    borderColor: isDragActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    backgroundColor: isDragActive ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                }}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-foreground">
                    {isDragActive
                        ? 'Drop the files here'
                        : 'Drag and drop files here, or click to select files'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Selected Files</h2>
                    <div className="space-y-4">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'hsl(var(--muted))',
                                }}
                                className="p-4 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-foreground">{file.name}</span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        style={{
                                            color: 'hsl(var(--destructive))',
                                        }}
                                        className="hover:opacity-80"
                                        aria-label="Remove file"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm text-foreground mb-1">
                                        Description (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={file.description || ''}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        placeholder="Add a description for this image"
                                        className="w-full px-3 py-2 rounded-md border"
                                        style={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        style={{
                            backgroundColor: uploading ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--primary))',
                            color: 'hsl(var(--primary-foreground))',
                        }}
                        className="mt-4 w-full py-2 px-4 rounded-md font-medium transition-opacity"
                    >
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            )}

            {error && (
                <div
                    style={{
                        backgroundColor: 'hsl(var(--destructive) / 0.1)',
                        color: 'hsl(var(--destructive))',
                    }}
                    className="mt-4 p-3 rounded-md"
                >
                    {error}
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-3">Uploaded Files</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    borderColor: 'hsl(var(--border))',
                                }}
                                className="border rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={file.url}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                    width={1920}
                                    height={1080}
                                />
                                <div className="p-3">
                                    <p className="text-sm text-muted-foreground truncate">
                                        ID: {file.id}
                                    </p>
                                    {file.description && (
                                        <p className="text-sm text-foreground mt-1">
                                            {file.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

