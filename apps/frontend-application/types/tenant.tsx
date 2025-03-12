export interface ITenant {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ITenantList {
    total : number,
    data : ITenant[]
  }
  