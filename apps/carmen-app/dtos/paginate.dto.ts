export interface PaginateDto {
  page: number | string;
  pages: number;
  perpage: number | string;
  total: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
