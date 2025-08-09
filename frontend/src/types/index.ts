export interface ProductType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  productTypeId: string;
  createdAt: string;
  updatedAt: string;
  productType: ProductType;
  variants: Variant[];
  addOns: AddOn[];
}

export interface Variant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface AddOn {
  id: string;
  name: string;
  description?: string;
  price: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface SelectedVariant {
  variant: Variant;
  quantity?: number;
}

export interface SelectedAddOn {
  addOn: AddOn;
  selected: boolean;
}

export interface ProductSelection {
  product: Product;
  selectedVariant?: Variant;
  selectedAddOns: SelectedAddOn[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
