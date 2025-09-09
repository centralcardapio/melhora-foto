import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Download, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PhotoProcessing } from '@/components/PhotoProcessing';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PhotoUploadProps {
  availablePhotos: number;
  onProcessingComplete?: () => void;
}

export const PhotoUpload = ({
  availablePhotos,
  onProcessingComplete
}: PhotoUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ifoodLink, setIfoodLink] = useState('');
  const [importedPhotos, setImportedPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [photosToProcess, setPhotosToProcess] = useState<Array<{ name: string; url: string }>>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = availablePhotos - uploadedFiles.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    if (acceptedFiles.length > remainingSlots) {
      toast({
        title: "Limite de fotos atingido",
        description: `Você pode adicionar apenas ${remainingSlots} fotos com seus créditos atuais.`,
        variant: "destructive"
      });
    }
    setUploadedFiles(prev => [...prev, ...filesToAdd]);
  }, [availablePhotos, uploadedFiles.length, toast]);

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp']
    },
    maxFiles: availablePhotos - uploadedFiles.length
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleIfoodImport = () => {
    if (!ifoodLink.trim()) {
      toast({
        title: "Link obrigatório",
        description: "Por favor, insira o link do iFood para importar as fotos.",
        variant: "destructive"
      });
      return;
    }

    // Simulate import (replace with actual API call)
    const mockPhotos = Array.from({
      length: Math.min(20, availablePhotos * 2) // Import more photos for selection
    }, (_, i) => `https://picsum.photos/300/200?random=${i + Date.now()}`);
    setImportedPhotos(mockPhotos);
    setSelectedPhotos(new Set()); // Reset selection
    toast({
      title: "Fotos importadas com sucesso",
      description: `${mockPhotos.length} fotos foram importadas do iFood.`
    });
  };

  const handleTransformPhotos = async () => {
    if (!user) return;
    
    // Prepare photos to process
    const photos = [
      ...uploadedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file
      })),
      ...Array.from(selectedPhotos).map(index => ({
        name: `Foto importada ${index + 1}`,
        url: importedPhotos[index],
        file: null
      }))
    ];

    if (photos.length === 0) return;

    try {
      // Save photo transformations to database
      for (const photo of photos) {
        const { error } = await supabase
          .from('photo_transformations')
          .insert({
            user_id: user.id,
            original_image_url: photo.url,
            original_image_name: photo.name,
            status: 'processing',
            transformed_images: [
              {
                url: photo.url, // For now, using the same image
                version: 1,
                feedback: ''
              }
            ],
            reprocessing_count: 0
          });

        if (error) {
          console.error('Error saving photo transformation:', error);
        }
      }

      // Decrease user photo credits by the number of photos being processed
      const { data: currentCredits, error: fetchError } = await supabase
        .from('photo_credits')
        .select('total_used')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current credits:', fetchError);
      } else {
        const { error: creditError } = await supabase
          .from('photo_credits')
          .update({
            total_used: (currentCredits?.total_used || 0) + photos.length
          })
          .eq('user_id', user.id);

        if (creditError) {
          console.error('Error updating photo credits:', creditError);
        }
      }

      // Start processing
      setPhotosToProcess(photos.map(p => ({ name: p.name, url: p.url })));
      setIsProcessing(true);

    } catch (error) {
      console.error('Error starting photo processing:', error);
      toast({
        title: "Erro ao processar fotos",
        description: "Não foi possível iniciar o processamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    onProcessingComplete?.();
  };

  if (isProcessing) {
    return (
      <PhotoProcessing 
        photos={photosToProcess}
        onComplete={handleProcessingComplete}
      />
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Selecione as fotos para transformação
        </CardTitle>
        <CardDescription>
          Escolha um dos métodos abaixo para selecionar as fotos para submeter para transformação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Options - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Manual */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload</h3>
            
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}>
              <input {...getInputProps()} />
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <div className="space-y-2">
                <p className="font-medium">
                  {isDragActive ? 'Solte as fotos aqui' : 'Arraste e solte suas fotos aqui'}
                </p>
                <p className="text-sm text-muted-foreground">
                  ou clique para selecionar arquivos
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPG, JPEG, PNG, WebP, BMP
                </p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Fotos selecionadas ({uploadedFiles.length}/{availablePhotos})</h4>
                <div className="grid grid-cols-2 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
                      <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Importação iFood */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Importação do iFood</h3>
            
            <div className="space-y-3">
              <Label htmlFor="ifood-link">Link do restaurante no iFood</Label>
              <div className="flex gap-2">
                <Input id="ifood-link" placeholder="https://www.ifood.com.br/delivery/..." value={ifoodLink} onChange={e => setIfoodLink(e.target.value)} className="flex-1" />
                <Button onClick={handleIfoodImport} className="whitespace-nowrap">
                  <Link className="h-4 w-4 mr-2" />
                  Importar Fotos
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Importante:</strong> Serão importadas todas as fotos do seu cardápio para que você possa selecionar quais fotos deseja profissionalizar
              </p>
            </div>

            {importedPhotos.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">
                  Fotos importadas ({importedPhotos.length}) - Selecione até {availablePhotos} fotos
                  {selectedPhotos.size > 0 && (
                    <span className="ml-2 text-primary">({selectedPhotos.size} selecionadas)</span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {importedPhotos.map((photo, index) => {
                    const isSelected = selectedPhotos.has(index);
                    const canSelect = selectedPhotos.size < availablePhotos || isSelected;
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${!canSelect && !isSelected ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (!canSelect && !isSelected) return;
                          
                          const newSelected = new Set(selectedPhotos);
                          if (isSelected) {
                            newSelected.delete(index);
                          } else {
                            newSelected.add(index);
                          }
                          setSelectedPhotos(newSelected);
                        }}
                      >
                        <img 
                          src={photo} 
                          alt={`Importada ${index + 1}`} 
                          className="w-full h-16 object-cover rounded-lg" 
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {(uploadedFiles.length > 0 || selectedPhotos.size > 0) && (
          <div className="pt-4 border-t">
            <Button size="lg" className="w-full" onClick={handleTransformPhotos}>
              <Download className="h-4 w-4 mr-2" />
              Transformar {uploadedFiles.length + selectedPhotos.size} Fotos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};