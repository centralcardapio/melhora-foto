import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePaymentLink } from "@/hooks/usePaymentLink";
import { useAuth } from "@/contexts/AuthContext";
import { HTMLAttributes, MouseEvent } from 'react';

// Criando um tipo que estende as props do botão, mas remove 'onError' se existir
type ButtonPropsWithoutError = Omit<ButtonProps, 'onError' | 'onClick'>;

interface PaymentButtonProps extends ButtonPropsWithoutError {
  planName: string;
  amount: number;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const PaymentButton = ({
  planName,
  amount,
  description = "",
  onSuccess,
  onError,
  children,
  ...props
}: PaymentButtonProps) => {
  const { user } = useAuth();
  const { createPaymentLink, loading } = usePaymentLink();

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      // Chama o onClick original se existir
      if (props.onClick) {
        props.onClick(e);
      }

      if (!user?.email) {
        toast.error("Você precisa estar logado para continuar");
        return;
      }

      toast.info("Preparando seu pagamento...");
      
      const paymentLink = await createPaymentLink({
        planName,
        value: amount,
        userEmail: user.email,
        userName: user.user_metadata?.full_name || "Cliente"
      });
      
      if (paymentLink?.url) {
        // Abre o link de pagamento em uma nova aba
        window.open(paymentLink.url, '_blank');
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento';
      toast.error(`Não foi possível processar o pagamento: ${errorMessage}`);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        children || `Pagar R$ ${amount.toFixed(2)}`
      )}
    </Button>
  );
};

export default PaymentButton;
