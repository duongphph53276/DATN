export interface OrderFilterProps {
  filters: {
    name: string;
    status: string;
    payment_method: string;
    created_at: string;
  };
  onFiltersChange: (filters: {
    name: string;
    status: string;
    payment_method: string;
    created_at: string;
  }) => void;
}