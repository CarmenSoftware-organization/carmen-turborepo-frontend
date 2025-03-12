export interface ICurrency {
  code: string;
  description: string;
  active: boolean;
}

export interface ICurrencyList {
  total: number;
  data: ICurrency[];
}
