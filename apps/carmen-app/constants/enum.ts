export enum VIEW {
  LIST = "list",
  GRID = "grid",
}

export enum INVENTORY_TYPE {
  INVENTORY = "inventory",
  DIRECT = "direct",
  CONSIGNMENT = "consignment",
}

export enum PrDocType {
  BLANK = 0,
  TEMPLATE = 1,
}

export enum TaxType {
  NONE = "none",
  INCLUDED = "included",
  ADD = "add",
}

export enum DOC_TYPE {
  MANUAL = "manual",
  PURCHASE_ORDER = "purchase_order",
}

export enum ALLOCATE_EXTRA_COST_TYPE {
  MANUAL = "manual",
  BY_VALUE = "by_value",
  BY_QTY = "by_qty",
}

export enum DOC_STATUS {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  VOIDED = "voided",
}

export enum CREDIT_NOTE_TYPE {
  QUANTITY_RETURN = "quantity_return",
  AMOUNT_DISCOUNT = "amount_discount",
}


export enum BUSINESS_UNIT_CONFIG_KEY {
  CALCULATION_METHOD = "calculation_method",
  CURRENCY_BASE = "currency_base",
  DATE_FORMAT = "date_format",
  LONG_TIME_FORMAT = "long_time_format",
  SHORT_TIME_FORMAT = "short_time_format",
  TIMEZONE = "timezone",
  PERPAGE = "perpage",
}