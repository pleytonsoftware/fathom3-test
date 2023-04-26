import type { Prisma } from "@prisma/client";

export interface PaginationQuery {
    pagination?: {
        size: number;
        offset: number;
    };
    filterBy?: {
        key: string;
        value: string | number | boolean;
    };
    sortBy?: {
        field: string;
        direction: Prisma.SortOrder;
    };
}

export interface PaginationQueryParam {
    size: string;
    offset: string;
    filterby_key?: string;
    filterby_value?: string;
    sortby_field?: string;
    sortby_direction?: Prisma.SortOrder;
}
