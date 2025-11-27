import { InitialProduct } from "@/components/lookup/product-tree-moq/types";

interface Props {
  initialProducts?: InitialProduct[];
}

export default function TableProductView({ initialProducts = [] }: Props) {
  return <pre>{JSON.stringify(initialProducts, null, 2)}</pre>;
}
