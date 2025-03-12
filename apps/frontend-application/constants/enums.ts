export const enum formType {
	ADD = 'add',
	EDIT = 'edit',
	VIEW = 'view',
}

export const enum GOOD_RECIEIVE_NOTE_FIELDS {
	DATE = 'date',
	REF = 'ref',
	DESCRIPTION = 'description',
	VENDOR = 'vendor',
	INVOICE_NUMBER = 'invoiceNumber',
	INVOICE_DATE = 'invoiceDate',
	TOTAL_AMOUNT = 'totalAmount',
	STATUS = 'status',
}

export const enum PrField {
	Id = 'id',
	Type = 'type',
	Description = 'description',
	Requestor = 'requestor',
	Department = 'department',
	Date = 'date',
	Status = 'status',
	Amount = 'amount',
	CurrentStage = 'currentStage',
}

export const enum UnitField {
	Name = 'name',
	Description = 'description',
	Status = 'is_active',
}

export const enum VendorFields {
	Name = 'name',
	Description = 'description',
	IsActive = 'is_active',
}

export const enum LocationField {
	Name = 'name',
	LocationType = 'location_type',
	DeliveryPointID = 'delivery_point_id',
	Description = 'description',
	isActive = 'is_active',
}

export const enum PoField {
	Id = 'poId',
	Number = 'number',
	VendorId = 'vendorId',
	VendorName = 'vendorName',
	OrderDate = 'orderDate',
	DeliveryDate = 'deliveryDate',
	Status = 'status',
	CurrencyCode = 'currencyCode',
	BaseCurrencyCode = 'baseCurrencyCode',
	ExchangeRate = 'exchangeRate',
	Notes = 'notes',
	CreatedBy = 'createdBy',
	ApprovedBy = 'approvedBy',
	ApprovalDate = 'approvalDate',
	Email = 'email',
	Buyer = 'buyer',
	CreditTerms = 'creditTerms',
	Description = 'description',
	Remarks = 'remarks',
	BaseSubTotalPrice = 'baseSubTotalPrice',
	SubTotalPrice = 'subTotalPrice',
	BaseNetAmount = 'baseNetAmount',
	NetAmount = 'netAmount',
	BaseDiscAmount = 'baseDiscAmount',
	DiscountAmount = 'discountAmount',
	BaseTaxAmount = 'baseTaxAmount',
	TaxAmount = 'taxAmount',
	BaseTotalAmount = 'baseTotalAmount',
	TotalAmount = 'totalAmount',
}


export const enum ProductField {
	NAME = 'name',
	CODE = 'code',
	DESCRIPTION = 'description',
	CATEGORY = 'category_name',
	SUBCATEGORY = 'sub_category_name',
	ITEM_GROUP = 'item_group_name',
	STATUS = 'product_status_type',
}
