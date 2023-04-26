export type SortDirection = "asc" | "desc";

export interface Pagination {
    size: number;
    offset: number;
    filterby_key?: string;
    filterby_value?: string;
    sortby_field?: string;
    sortby_direction?: SortDirection;
}

export interface PaginationResult<T> {
    data: Array<T>;
    total: number;
}
