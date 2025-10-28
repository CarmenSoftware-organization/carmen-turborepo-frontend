export interface BuTypeFormDto {
  name: string;
  description?: string;
  note?: string;
  is_active: boolean;
}
export interface BuTypeGetAllDto extends BuTypeFormDto {
  id: string;
}

export interface BuTypeEditDto extends BuTypeFormDto {
  id: string;
}
