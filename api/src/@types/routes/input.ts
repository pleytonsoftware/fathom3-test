import type { Prisma } from "@prisma/client";

export interface FindAllOptions {
    pagination?: {
        size: number;
        offset: number;
    };
    filterBy?: Record<string, string | number | boolean>;
    sortBy?: {
        field: string;
        direction: Prisma.SortOrder;
    };
}
