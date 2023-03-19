export interface StoreProduct {
	product_id: string;
	store_id: string;
	stock_available: number;
	stock_locked: number;
	product: Product;
}

export interface Product {
	reorder_level: number;
	name: string;
	price: number;
	measurement_unit: string;
	org_id: string;
	product_id: string;
	version_id: number;
	timestamp: Date;
}

export interface Customer {
	email: string;
	is_member: boolean;
	membership_points: number;
	address: string;
	preferred_payment_method: string;
	name: string;
	phone_number: string;
	org_id: string;
	id: string;
}

export interface CreatedCustomerBill {
	org_id: string;
	store_id: string;
	customer_id: string;
	user_id: string;
	payment_method: string;
	discount_price: number;
	delivery_address: string;
	delivery_charge: number;
	products_total: number;
	net_price: number;
	billed_at: Date;
	id: string;
	products_billed: CreatedProductsBilled[];
}

export interface CreatedProductsBilled {
	product_id: string;
	product_quantity: number;
	total_cost: number;
	version_id: number;
	customer_bill_id: string;
}

export interface ProductBilled {
	reorder_level: number;
	name: string;
	price: number;
	measurement_unit: string;
	product_id: string;
	product_quantity: number;
	total_cost: number;
	version_id: number;
}

export interface CustomerBill {
	org_id: string;
	store_id: string;
	customer_id: string;
	user_id: string;
	payment_method: string;
	discount_price: number;
	delivery_address: string;
	delivery_charge: number;
	products_total: number;
	net_price: number;
	billed_at: string;
	id: string;
	products_billed: ProductBilled[];
}
