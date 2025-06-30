
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useUploadMedia } from '@/hooks/useSupporterMedia';
import { Upload, Image, Video, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const MediaUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const uploadMutation = useUploadMedia();
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Alleen JPG, PNG, WebP, MP4 en WebM bestanden toegestaan');
      return;
    }
    
    // Validate file size
    const maxSize = selectedFile.type.startsWith('image/') ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`Bestand te groot. Max ${maxSize / 1024 / 1024}MB`);
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      // For now, use a dummy user ID - replace with actual auth when implemented
      const userId = 'anonymous-user-' + Date.now();
      
      await uploadMutation.mutateAsync({
        file,
        userId,
        caption: caption.trim() || undefined,
        hashtags: hashtags.trim() || undefined,
      });
      
      toast.success('Media succesvol geüpload!');
      setFile(null);
      setCaption('');
      setHashtags('');
      setPreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload mislukt. Probeer opnieuw.');
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setCaption('');
    setHashtags('');
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-az-red hover:bg-red-700 text-white mb-6"
      >
        <Upload className="w-4 h-4 mr-2" />
        Deel je AZ foto/video
      </Button>
    );
  }
  
  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-az-black dark:text-white">
            Deel je AZ moment
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {!file ? (
          <div className="border-2 border-dashed border-premium-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex space-x-4">
                <Image className="w-8 h-8 text-premium-gray-400" />
                <Video className="w-8 h-8 text-premium-gray-400" />
              </div>
              <p className="text-premium-gray-600 dark:text-gray-400">
                Klik om een foto of video te selecteren
              </p>
              <p className="text-sm text-premium-gray-500 dark:text-gray-500">
                Max 5MB voor foto's, 50MB voor video's
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              {file.type.startsWith('image/') ? (
                <img
                  src={preview!}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview!}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={clearFile}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Caption */}
            <Textarea
              placeholder="Beschrijf je AZ moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
            />
            
            {/* Hashtags */}
            <Input
              placeholder="Hashtags (bijv. #AZThuis, #AZAway, #AZTraining)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            
            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="w-full bg-az-red hover:bg-red-700"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploaden...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Deel nu
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
