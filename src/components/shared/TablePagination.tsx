// import { TablePagination, useState } from '@/shared'
// import type { PaginatedTableProps } from '@/shared'

// export function CustomTablePagination({ totalCount, currentPage, onPaginationChange }: PaginatedTableProps) {
//   const [pageSize, setPageSize] = useState(10) // Default rows per page

//   const handlePageChange = (event: unknown, newPage: number) => {
//     onPaginationChange(newPage, pageSize) // Notify parent of page change
//   }

//   const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newSize = parseInt(event.target.value, 10)

//     setPageSize(newSize) // Update the page size
//     onPaginationChange(currentPage, newSize) // Notify parent with new page size
//   }

//   return (
//     <TablePagination
//       component='div'
//       count={totalCount} // Total number of items
//       page={currentPage} // Current page
//       rowsPerPage={pageSize} // Rows per page
//       onPageChange={handlePageChange} // Handle page change
//       onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
//     />
//   )
// }

import { TablePagination, useState } from '@/shared'
import type { PaginatedTableProps } from '@/shared'

export function CustomTablePagination({ totalCount, currentPage, onPaginationChange }: PaginatedTableProps) {
  const [pageSize, setPageSize] = useState(50) // Default rows per page

  const handlePageChange = (event: unknown, newPage: number) => {
    onPaginationChange(newPage, pageSize) // Notify parent of page change
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10)
    setPageSize(newSize) // Update the page size
    onPaginationChange(currentPage, newSize) // Notify parent with new page size
  }

  return (
    <TablePagination
      component='div'
      count={totalCount} // Total number of items
      page={currentPage} // Current page
      rowsPerPage={pageSize} // Rows per page
      onPageChange={handlePageChange} // Handle page change
      onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
      labelRowsPerPage='عدد السجلات بالصفحة'
      labelDisplayedRows={
        ({ from, to, count }) => `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}` // Translation for "of"
      }
    />
  )
}

export default CustomTablePagination
