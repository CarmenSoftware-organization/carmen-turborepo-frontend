interface CommonResponseDto {
  data: {
    id: string;
  };
  paginate: null;
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}

interface SplitPrResponseDto {
  data: {
    original_pr_id: string;
    new_pr_id: string;
    new_pr_no: string;
    split_detail_count: number;
  };
  paginate: null;
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}
