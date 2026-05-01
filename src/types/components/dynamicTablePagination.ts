export interface PaginatedTableProps {
  totalCount: number // Total number of items
  currentPage: number // Current page index (0-based)
  onPaginationChange: (pageIndex: number, pageSize: number) => void // Callback to notify parent of changes
}
