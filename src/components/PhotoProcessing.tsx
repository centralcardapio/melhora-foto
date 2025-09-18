import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Image, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { imageImprovementService } from "@/services/imageImprovementService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProcessingPhoto {
  name: string;
  url: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  transformedUrl?: string;
  aiDescription?: string;
}

interface PhotoProcessingProps {
  photos: Array<{ name: string; url: string }>;
  onComplete: () => void;
  selectedStyle?: string;
  customPrompt?: string;
}

export const PhotoProcessing = ({ photos, onComplete, selectedStyle = 'moderno-gourmet', customPrompt }: PhotoProcessingProps) => {
  const [processingPhotos, setProcessingPhotos] = useState<ProcessingPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const { user } = useAuth();
  
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
    
    // Buscar estilo do usuário no banco de dados
    let userStyle = selectedStyle; // Fallback para o estilo passado como parâmetro
    
    if (user) {
      try {
        const { data: styleData, error: styleError } = await supabase
          .from('user_styles')
          .select('selected_style')
          .eq('user_id', user.id)
          .single();

        if (!styleError && styleData?.selected_style) {
          userStyle = styleData.selected_style;
          console.log('🎨 Estilo do usuário obtido do banco:', userStyle);
        } else {
          console.log('⚠️ Usando estilo padrão:', userStyle);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar estilo do usuário:', error);
        console.log('⚠️ Usando estilo padrão:', userStyle);
      }
    }
    
    for (let i = 0; i < photos.length; i++) {
      // Start processing current photo
      photos[i].status = 'processing';
      setProcessingPhotos([...photos]);
      setCurrentPhotoIndex(i);
      
      try {
        // Update progress to 20% - starting AI processing
        photos[i].progress = 20;
        setProcessingPhotos([...photos]);
        setOverallProgress(((i * 100) + 20) / photos.length);
        
        // Usar Image Improvement Service para transformação real
        const aiResult = await imageImprovementService.transformImage({
          originalImageUrl: photos[i].url,
          style: userStyle, // Usar estilo do banco de dados
          prompt: customPrompt
        });
        
        if (!aiResult.success || !aiResult.imageUrl) {
          throw new Error(aiResult.error || 'Falha na transformação com o endpoint');
        }
        
        // Update progress to 80% - AI processing complete
        photos[i].progress = 80;
        photos[i].transformedUrl = aiResult.imageUrl;
        photos[i].aiDescription = aiResult.message || `Imagem transformada no estilo ${aiResult.styleUsed}`;
        setProcessingPhotos([...photos]);
        setOverallProgress(((i * 100) + 80) / photos.length);
        
        // Save to database with real AI transformation data
        if (user) {
          const { error } = await supabase
            .from('photo_transformations')
            .insert({
              user_id: user.id,
              original_image_url: photos[i].url,
              original_image_name: photos[i].name,
              status: 'completed',
              transformed_images: [
                {
                  url: aiResult.imageUrl,
                  downloadUrl: aiResult.downloadUrl,
                  version: 1,
                  feedback: '',
                  style: userStyle, // Usar o estilo obtido do banco de dados
                  ai_description: aiResult.message || `Imagem transformada no estilo ${aiResult.styleUsed}`,
                  created_at: new Date().toISOString()
                }
              ],
              reprocessing_count: 0
            });

          if (error) {
            console.error('Error saving transformation result:', error);
            throw new Error('Erro ao salvar resultado da transformação');
          }
        }
        
        // Complete processing
        photos[i].progress = 100;
        photos[i].status = 'completed';
        
      } catch (error) {
        console.error('Error processing photo:', error);
        photos[i].status = 'failed';
        photos[i].error = error instanceof Error ? error.message : 'Erro desconhecido';
      }
      
      setProcessingPhotos([...photos]);
      setOverallProgress(((i + 1) * 100) / photos.length);
      
      // Start next photo if exists
      if (i < photos.length - 1) {
        photos[i + 1].status = 'processing';
        setProcessingPhotos([...photos]);
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
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
      case 'failed':
        return 'Falhou';
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
                          {photo.progress}% - {photo.progress < 50 ? 'Analisando imagem...' : 'Aplicando melhorias com IA...'}
                        </p>
                      </div>
                    )}
                    
                    {photo.status === 'failed' && (
                      <div className="space-y-1">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          {photo.error || 'Erro no processamento'}
                        </p>
                      </div>
                    )}
                    
                    {photo.status !== 'processing' && photo.status !== 'failed' && (
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