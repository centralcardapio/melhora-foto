# Integração com Asaas

Este documento descreve como a integração com o gateway de pagamento Asaas foi implementada no projeto.

## Visão Geral

A integração com o Asaas permite que os usuários realizem pagamentos de forma segura através de links de pagamento. O fluxo é o seguinte:

1. O usuário seleciona um plano
2. O sistema gera um link de pagamento único
3. O usuário é redirecionado para o ambiente seguro do Asaas
4. Após o pagamento, o usuário retorna para o site
5. O status do pagamento é verificado e o usuário é notificado

## Configuração

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no seu arquivo `.env`:

```env
VITE_ASAAS_API_KEY=sua_chave_api_aqui
VITE_ASAAS_API_URL=https://sandbox.asaas.com/api/v3  # Use a URL de produção em produção
```

### Webhooks

Para receber notificações de atualização de status de pagamento, configure o webhook do Asaas para apontar para:

```
https://seu-dominio.com/api/webhooks/asaas
```

## Componentes Principais

### 1. PaymentButton

Um componente reutilizável que lida com a criação de links de pagamento.

**Props:**
- `planName`: Nome do plano
- `amount`: Valor do pagamento
- `onSuccess`: Callback chamado quando o pagamento é bem-sucedido
- `onError`: Callback chamado em caso de erro

**Exemplo de uso:**

```tsx
<PaymentButton
  planName="Plano Básico"
  amount={99.90}
  onSuccess={() => console.log('Pagamento bem-sucedido!')}
  onError={(error) => console.error('Erro no pagamento:', error)}
>
  Assinar Agora
</PaymentButton>
```

### 2. usePaymentLink

Hook personalizado que gerencia a criação de links de pagamento.

**Exemplo de uso:**

```tsx
const { createPaymentLink, loading, error } = usePaymentLink();

const handlePayment = async () => {
  try {
    const paymentLink = await createPaymentLink({
      planName: 'Plano Básico',
      value: 99.90,
      userEmail: 'cliente@exemplo.com',
      userName: 'Nome do Cliente'
    });
    
    if (paymentLink?.url) {
      window.open(paymentLink.url, '_blank');
    }
  } catch (err) {
    console.error('Erro ao criar link de pagamento:', err);
  }
};
```

### 3. Página de Status de Pagamento

A rota `/payment/status` exibe o status atual do pagamento e fornece feedback ao usuário.

## Fluxo de Pagamento

1. **Seleção de Plano**
   - O usuário seleciona um plano na página de planos
   - O botão de pagamento é habilitado

2. **Criação do Link de Pagamento**
   - Ao clicar no botão, um link de pagamento é gerado
   - O usuário é redirecionado para o ambiente seguro do Asaas

3. **Processamento do Pagamento**
   - O usuário preenche os dados de pagamento
   - O Asaas processa o pagamento

4. **Retorno para o Site**
   - Após o pagamento, o usuário retorna para o site
   - O status do pagamento é exibido

## Tratamento de Erros

- Erros de validação são exibidos como toasts
- Erros de rede são registrados no console
- O usuário pode tentar novamente em caso de falha

## Testes

Para testar em ambiente de desenvolvimento, use os cartões de teste do Asaas:

- **Número do cartão:** 4111 1111 1111 1111
- **Validade:** Qualquer data futura
- **CVV:** 123
- **Nome no cartão:** Qualquer nome
- **CPF:** 000.000.000-00
