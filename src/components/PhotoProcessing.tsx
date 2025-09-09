import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Image, CheckCircle, Clock } from "lucide-react";

interface ProcessingPhoto {
  name: string;
  url: string;
  status: 'waiting' | 'processing' | 'completed';
  progress: number;
}

interface PhotoProcessingProps {
  photos: Array<{ name: string; url: string }>;
  onComplete: () => void;
}

export const PhotoProcessing = ({ photos, onComplete }: PhotoProcessingProps) => {
  const [processingPhotos, setProcessingPhotos] = useState<ProcessingPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  
  useEffect(() => {
    // Initialize processing photos
    const initialPhotos: ProcessingPhoto[] = photos.map((photo, index) => ({
      name: photo.name,
      url: photo.url,
      status: index === 0 ? 'processing' : 'waiting',
      progress: 0
    }));
    
    setProcessingPhotos(initialPhotos);
    
    // Start processing simulation
    processPhotos(initialPhotos);
  }, [photos]);
  
  const processPhotos = async (initialPhotos: ProcessingPhoto[]) => {
    const photos = [...initialPhotos];
    
    for (let i = 0; i < photos.length; i++) {
      // Start processing current photo
      photos[i].status = 'processing';
      setProcessingPhotos([...photos]);
      setCurrentPhotoIndex(i);
      
      // Simulate 10 seconds processing for each photo
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms * 20 steps = 10 seconds
        
        photos[i].progress = progress;
        setProcessingPhotos([...photos]);
        setOverallProgress(((i * 100) + progress) / photos.length);
      }
      
      // Mark as completed
      photos[i].status = 'completed';
      setProcessingPhotos([...photos]);
      
      // Start next photo if exists
      if (i < photos.length - 1) {
        photos[i + 1].status = 'processing';
      }
    }
    
    // Wait a moment before completing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Complete processing
    onComplete();
  };

  const getStatusIcon = (status: ProcessingPhoto['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <ChefHat className="h-4 w-4 text-primary animate-pulse" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: ProcessingPhoto['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'processing':
        return 'Processando...';
      case 'waiting':
        return 'Aguardando';
    }
  };

  const completedCount = processingPhotos.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <ChefHat className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {completedCount}
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Profissionalizando as suas fotos</CardTitle>
            <CardDescription>
              Nossa IA está processando suas fotos para criar versões profissionais. 
              Aguarde enquanto trabalhamos na melhoria da iluminação, cores e composição.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            {/* Photo List */}
            <div className="space-y-3">
              {processingPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    photo.status === 'processing' ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{photo.name}</p>
                      {getStatusIcon(photo.status)}
                    </div>
                    
                    {photo.status === 'processing' && (
                      <div className="space-y-1">
                        <Progress value={photo.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {photo.progress}% - Aplicando melhorias...
                        </p>
                      </div>
                    )}
                    
                    {photo.status !== 'processing' && (
                      <Badge 
                        variant={photo.status === 'completed' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {getStatusText(photo.status)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Status Message */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Image className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {completedCount === processingPhotos.length 
                  ? "Processamento concluído! Redirecionando..."
                  : `${completedCount}/${processingPhotos.length} fotos processadas`
                }
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Você será notificado quando todas as fotos estiverem prontas para validação.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};