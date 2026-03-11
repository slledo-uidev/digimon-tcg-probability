export interface CardCategory {
  color?: string;
  type?: string;
  level?: number;
  cost?: number;
  [key: string]: any; // Permite propiedades adicionales personalizadas
}

export interface Card {
  id: string;
  name: string;
  quantity: number;
  categories: CardCategory;
}

export interface CardInDeck extends Card {
  remaining: number;
}
