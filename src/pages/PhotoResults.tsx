import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChefHat, Download, ThumbsDown, RefreshCw, Eye, Package } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { imageImprovementService } from "@/services/imageImprovementService";

interface TransformedPhoto {
  id: string;
  originalUrl: string;
  originalName: string;
  transformedImages: Array<{
    url: string;
    downloadUrl?: string;
    version: number;
    feedback?: string;
    style?: string;
    ai_description?: string;
    created_at?: string;
  }>;
  reprocessingCount: number;
  status: string;
  created_at: string;
}

const PhotoResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [photos, setPhotos] = useState<TransformedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [feedbackStates, setFeedbackStates] = useState<Record<string, { showFeedback: boolean; comment: string }>>({});
  const [isReprocessing, setIsReprocessing] = useState<Record<string, boolean>>({});

  // Load photo transformations
  useEffect(() => {
    const loadPhotoTransformations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('photo_transformations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedPhotos: TransformedPhoto[] = data.map(item => {
          let transformedImages: Array<{url: string; downloadUrl?: string; version: number; feedback?: string; style?: string; ai_description?: string; created_at?: string}> = [];
          
          if (Array.isArray(item.transformed_images)) {
            transformedImages = item.transformed_images.map((img: any, index) => ({
              url: img?.url || '',
              downloadUrl: img?.downloadUrl || '',
              version: img?.version || index + 1,
              feedback: img?.feedback || '',
              style: img?.style || '',
              ai_description: img?.ai_description || '',
              created_at: img?.created_at || ''
            }));
          }
          
          return {
            id: item.id,
            originalUrl: item.original_image_url,
            originalName: item.original_image_name,
            transformedImages,
            reprocessingCount: item.reprocessing_count,
            status: item.status || 'completed',
            created_at: item.created_at || ''
          };
        });

        setPhotos(transformedPhotos);
      } catch (error) {
        console.error('Error loading photo transformations:', error);
        toast({
          title: "Erro ao carregar fotos",
          description: "Não foi possível carregar suas fotos transformadas.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPhotoTransformations();
  }, [user, toast]);


  const handleFeedbackToggle = (photoId: string, imageVersion: number) => {
    const key = `${photoId}-${imageVersion}`;
    setFeedbackStates(prev => ({
      ...prev,
      [key]: {
        showFeedback: !prev[key]?.showFeedback,
        comment: prev[key]?.comment || ''
      }
    }));
  };

  const handleCommentChange = (photoId: string, imageVersion: number, comment: string) => {
    const key = `${photoId}-${imageVersion}`;
    setFeedbackStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        comment
      }
    }));
  };

  const validateComment = (comment: string): boolean => {
    const inappropriateContent = ['pornografia', 'pornographic', 'porn'];
    const lowerComment = comment.toLowerCase();
    
    // Only block pornographic content
    return !inappropriateContent.some(word => lowerComment.includes(word));
  };

  const handleReprocessRequest = async (photoId: string, imageVersion: number) => {
    const key = `${photoId}-${imageVersion}`;
    const comment = feedbackStates[key]?.comment || '';
    
    if (!validateComment(comment)) {
      toast({
        title: "Comentário inválido",
        description: "O comentário contém conteúdo inadequado.",
        variant: "destructive"
      });
      return;
    }

    setIsReprocessing(prev => ({ ...prev, [key]: true }));

    try {
      // Find the photo and current image
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Get the current transformed image (the one being reprocessed)
      const currentImage = photo.transformedImages.find(img => img.version === imageVersion);
      if (!currentImage) {
        throw new Error('Imagem não encontrada para reprocessamento');
      }

      console.log('🔄 Reprocessando imagem com feedback:', {
        photoId,
        imageVersion,
        currentImageUrl: currentImage.url,
        feedback: comment
      });

      // Usar o novo serviço de reprocessamento com custom_prompt
      const aiResult = await imageImprovementService.reprocessImage(
        currentImage.url, // Usar a foto já melhorada, não a original
        comment // Usar o feedback do usuário como custom_prompt
      );

      if (!aiResult.success || !aiResult.imageUrl) {
        throw new Error(aiResult.error || 'Falha no reprocessamento com IA');
      }

      // Add new transformed image with real AI result
      const newTransformedImage = {
        url: aiResult.imageUrl,
        downloadUrl: aiResult.downloadUrl,
        version: photo.transformedImages.length + 1,
        feedback: comment,
        style: currentImage.style, // Manter o estilo original da foto
        ai_description: aiResult.message || `Reprocessamento: ${comment}`,
        created_at: new Date().toISOString()
      };

      // Update the photo in database
      const updatedTransformedImages = [...photo.transformedImages, newTransformedImage];
      
      const { error } = await supabase
        .from('photo_transformations')
        .update({
          transformed_images: updatedTransformedImages,
          reprocessing_count: photo.reprocessingCount + 1,
          feedback: {
            ...photo.transformedImages.reduce((acc, img, idx) => ({ ...acc, [`v${idx + 1}`]: img.feedback }), {}),
            [`v${newTransformedImage.version}`]: comment
          }
        })
        .eq('id', photoId);

      if (error) throw error;

      // Update local state
      setPhotos(prev => prev.map(p => p.id === photoId ? {
        ...p,
        transformedImages: updatedTransformedImages,
        reprocessingCount: p.reprocessingCount + 1
      } : p));

      // Reset feedback state
      setFeedbackStates(prev => ({
        ...prev,
        [key]: { showFeedback: false, comment: '' }
      }));

      toast({
        title: "Reprocessamento concluído",
        description: "A foto foi reprocessada com IA baseado no seu feedback."
      });

    } catch (error) {
      console.error('Error reprocessing photo:', error);
      toast({
        title: "Erro no reprocessamento",
        description: "Não foi possível reprocessar a foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsReprocessing(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDownloadSingle = (imageUrl: string, fileName: string, downloadUrl?: string) => {
    const link = document.createElement('a');
    // Usar downloadUrl se disponível, senão usar imageUrl - garantir HTTPS
    const urlToUse = downloadUrl || imageUrl;
    link.href = urlToUse.startsWith('http://') ? urlToUse.replace('http://', 'https://') : urlToUse;
    link.download = `${fileName}_profissional.jpg`;
    link.target = '_blank'; // Abrir em nova aba para garantir o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formatar nome do estilo para exibição
  const formatStyleName = (style: string): string => {
    const styleNames: Record<string, string> = {
      'classico-italiano': 'Clássico Italiano',
      'pub-moderno': 'Pub Moderno',
      'cafe-aconchegante': 'Café Aconchegante',
      'rustico-madeira': 'Rústico de Madeira',
      'contemporaneo-asiatico': 'Contemporâneo Asiático',
      'moderno-gourmet': 'Moderno Gourmet',
      'saudavel-vibrante': 'Saudável & Vibrante',
      'clean-minimalista': 'Clean & Minimalista',
      'alta-gastronomia': 'Alta Gastronomia'
    };

    return styleNames[style] || style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    
    try {
      // Get the latest version of each photo
      const latestPhotos = photos.map(photo => {
        const latestImage = photo.transformedImages[photo.transformedImages.length - 1];
        return {
          url: latestImage.url,
          downloadUrl: latestImage.downloadUrl,
          name: `${photo.originalName}_profissional_v${latestImage.version}.jpg`
        };
      });

      // Download each photo individually (in a real implementation, you'd create a ZIP)
      for (const photo of latestPhotos) {
        const link = document.createElement('a');
        // Usar downloadUrl se disponível, senão usar url
        link.href = photo.downloadUrl || photo.url;
        link.download = photo.name;
        link.target = '_blank'; // Abrir em nova aba para garantir o download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: "Download concluído",
        description: `${latestPhotos.length} fotos profissionais foram baixadas.`
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar todas as fotos. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Suas Fotos Profissionais</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Compare e baixe suas fotos profissionais</p>
            </div>
            
            {photos.length > 0 && (
              <Button onClick={handleDownloadAll} size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Baixar Todas (ZIP)</span>
                <span className="sm:hidden">Baixar Todas</span>
              </Button>
            )}
          </div>

          {/* Results */}
          {photos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma foto processada</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem fotos transformadas.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Voltar ao Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{photo.originalName}</CardTitle>
                      <div className="flex items-center gap-2">
                        {photo.transformedImages[0]?.style && (
                          <Badge variant="outline" className="text-xs">
                            {photo.transformedImages[0].style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        )}
                        <Badge variant={photo.status === 'completed' ? 'default' : 'secondary'}>
                          {photo.status === 'completed' ? 'Concluído' : photo.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* For each transformed version */}
                      {photo.transformedImages.map((transformedImage, index) => {
                        const key = `${photo.id}-${transformedImage.version}`;
                        const feedbackState = feedbackStates[key];
                        const canReprocess = photo.reprocessingCount < 2;
                        
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  Versão {transformedImage.version}
                                </Badge>
                                {transformedImage.version > 1 && (
                                  <Badge variant="outline">Reprocessada</Badge>
                                )}
                                {transformedImage.style && (
                                  <Badge variant="outline" className="text-xs">
                                    IA: {formatStyleName(transformedImage.style)}
                                  </Badge>
                                )}
                              </div>
                              {transformedImage.created_at && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(transformedImage.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {/* Original Photo */}
                               <div>
                                 <h4 className="font-medium mb-2 text-center">Foto Original</h4>
                                 <div className="relative group cursor-pointer">
                                    <img 
                                      src={photo.originalUrl} 
                                      alt="Foto original"
                                      className="w-full h-80 object-cover rounded-lg"
                                      onClick={() => setSelectedPhoto(photo.originalUrl)}
                                      onError={(e) => {
                                        console.error('Error loading original image:', photo.originalUrl);
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                     <Eye className="h-8 w-8 text-white" />
                                   </div>
                                 </div>
                               </div>

                               {/* Transformed Photo */}
                               <div>
                                 <h4 className="font-medium mb-2 text-center">
                                   Foto Profissional {transformedImage.style ? `(${formatStyleName(transformedImage.style)})` : ''}
                                 </h4>
                                 <div className="relative group cursor-pointer">
                                    <img 
                                      src={transformedImage.url.startsWith('http://') ? transformedImage.url.replace('http://', 'https://') : transformedImage.url} 
                                      alt="Foto transformada"
                                      className="w-full h-80 object-cover rounded-lg"
                                      onClick={() => setSelectedPhoto(transformedImage.url.startsWith('http://') ? transformedImage.url.replace('http://', 'https://') : transformedImage.url)}
                                      onError={(e) => {
                                        console.error('Error loading transformed image:', transformedImage.url);
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                     <Eye className="h-8 w-8 text-white" />
                                   </div>
                                 </div>
                                 
                                 {/* Action Buttons - Right aligned below transformed photo */}
                                 <div className="flex items-center justify-end gap-2 mt-4">
                                   <Button 
                                     variant="outline" 
                                     size="sm"
                                     onClick={() => handleDownloadSingle(transformedImage.url, photo.originalName, transformedImage.downloadUrl)}
                                   >
                                     <Download className="h-4 w-4 mr-2" />
                                     Baixar
                                   </Button>
                                   
                                    {transformedImage.version < 3 && canReprocess && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleFeedbackToggle(photo.id, transformedImage.version)}
                                      >
                                        <ThumbsDown className="h-4 w-4 mr-2" />
                                        Não gostei
                                      </Button>
                                    )}
                                  </div>
                                  
                                  {/* Version 3 limit message */}
                                  {transformedImage.version >= 3 && (
                                    <div className="mt-2 text-center">
                                      <p className="text-sm text-muted-foreground">
                                        Limite de reprocessamentos atingido para esta foto
                                      </p>
                                    </div>
                                  )}
                               </div>
                             </div>

                             {/* Remaining reprocessings badge */}
                             {canReprocess && transformedImage.version === photo.transformedImages.length && transformedImage.version < 3 && (
                               <div className="flex justify-end mt-2">
                                 <Badge variant="outline" className="text-xs">
                                   Reprocessamentos restantes: {2 - photo.reprocessingCount}
                                 </Badge>
                               </div>
                             )}

                             {/* Feedback Form */}
                             {feedbackState?.showFeedback && transformedImage.version < 3 && (
                              <div className="mt-4 p-4 bg-muted rounded-lg">
                                <h5 className="font-medium mb-2">O que não gostou nesta foto?</h5>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Descreva os pontos que gostaria de melhorar relacionados à apresentação da comida.
                                </p>
                                <Textarea
                                  placeholder="Ex: A iluminação está muito escura, gostaria de mais contraste nas cores, a foto está desfocada..."
                                  value={feedbackState.comment}
                                  onChange={(e) => handleCommentChange(photo.id, transformedImage.version, e.target.value)}
                                  className="mb-3"
                                />
                                <div className="flex items-center gap-2">
                                  {canReprocess && (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleReprocessRequest(photo.id, transformedImage.version)}
                                      disabled={!feedbackState.comment.trim() || isReprocessing[key]}
                                    >
                                      {isReprocessing[key] ? (
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                      )}
                                      {isReprocessing[key] ? 'Reprocessando...' : 'Reprocessar Foto'}
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleFeedbackToggle(photo.id, transformedImage.version)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                                {!canReprocess && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Limite de reprocessamentos atingido para esta foto.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center">Visualização da Foto</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="flex justify-center items-center min-h-[60vh]">
              <img 
                src={selectedPhoto} 
                alt="Foto em tamanho maior"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Error loading image:', selectedPhoto);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoResults;