/**
 * Utilitários para cálculo de preços dinâmicos com base no número de passageiros.
 */

/**
 * Extrai o valor numérico e o símbolo da moeda de uma string de preço (ex: "R$ 899" -> { value: 899, symbol: "R$" })
 */
export const parsePrice = (priceStr) => {
  if (!priceStr || typeof priceStr !== 'string') return { value: 0, symbol: 'R$' };
  
  // Remove pontos de milhar e espaços, substitui vírgula por ponto
  const cleanStr = priceStr.replace(/\./g, '').replace(',', '.').trim();
  
  // Captura o símbolo (letras iniciais e $) e o valor numérico
  const match = cleanStr.match(/^([^\d\s]+)\s*([\d.]+)$/);
  
  if (match) {
    return {
      symbol: match[1],
      value: parseFloat(match[2])
    };
  }
  
  // Fallback se não bater no regex
  const numericValue = parseFloat(cleanStr.replace(/[^\d.]/g, '')) || 0;
  return { value: numericValue, symbol: 'R$' };
};

/**
 * Formata um valor numérico de volta para string de moeda
 */
export const formatPrice = (value, symbol = 'R$') => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  
  return `${symbol} ${formattedValue}`;
};

/**
 * Calcula o preço total com base em adultos e crianças
 * Regra: Adulto (100%), Criança (50%)
 */
export const calculateTotalPrice = (priceStr, adults = 1, children = 0) => {
  const { value, symbol } = parsePrice(priceStr);
  
  const totalAdults = adults * value;
  const totalChildren = children * (value * 0.5); // Crianças pagam metade
  
  const total = totalAdults + totalChildren;
  
  return {
    total,
    totalFormatted: formatPrice(total, symbol),
    unitValue: value,
    symbol
  };
};
