import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Download, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  availablePhotos: number;
}

export const PhotoUpload = ({ availablePhotos }: PhotoUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ifoodLink, setIfoodLink] = useState('');
  const [importedPhotos, setImportedPhotos] = useState<string[]>([]);
  const { toast } = useToast();

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
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
    const mockPhotos = Array.from({ length: Math.min(5, availablePhotos) }, (_, i) => 
      `https://picsum.photos/300/200?random=${i + 1}`
    );
    setImportedPhotos(mockPhotos);
    
    toast({
      title: "Fotos importadas com sucesso",
      description: `${mockPhotos.length} fotos foram importadas do iFood.`,
    });
  };

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
        {/* Upload Manual */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Manual</h3>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Solte as fotos aqui' : 'Arraste e solte suas fotos aqui'}
              </p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar arquivos
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: JPG, PNG, WebP
              </p>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Fotos selecionadas ({uploadedFiles.length}/{availablePhotos})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Importação iFood */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Importação do iFood</h3>
          
          <div className="space-y-3">
            <Label htmlFor="ifood-link">Link do restaurante no iFood</Label>
            <div className="flex gap-2">
              <Input
                id="ifood-link"
                placeholder="https://www.ifood.com.br/delivery/..."
                value={ifoodLink}
                onChange={(e) => setIfoodLink(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleIfoodImport} className="whitespace-nowrap">
                <Link className="h-4 w-4 mr-2" />
                Importar Fotos
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Importante:</strong> Serão importadas as primeiras fotos até o limite das fotos contratadas.
            </p>
          </div>

          {importedPhotos.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Fotos importadas ({importedPhotos.length})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {importedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Importada ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {(uploadedFiles.length > 0 || importedPhotos.length > 0) && (
          <div className="pt-4 border-t">
            <Button size="lg" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Transformar {uploadedFiles.length + importedPhotos.length} Fotos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};