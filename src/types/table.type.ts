import { ColumnDef } from "@tanstack/react-table";

export interface ITableMeta {
  page: number;
  limit: number;
  total: number;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: ITableMeta;
}
