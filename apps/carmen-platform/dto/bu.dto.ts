interface IDbConnectionDto {
    host: string;
    port: number;
    schema: string;
    database: string;
    password: string;
    provider: string;
    username: string;
}

interface IConfigDto {
    id: string;
    key: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

interface IBuDto {
    id: string;
    cluster_id: string;
    code: string;
    name: string;
    description?: string;
    is_hq: boolean;
    is_active: boolean;
    db_connection: IDbConnectionDto;
    config: IConfigDto[];
}