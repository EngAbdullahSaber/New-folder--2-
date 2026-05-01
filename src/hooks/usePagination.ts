import { useState } from '@/shared'

interface Pagination {
  pageIndex: number
  pageSize: number
  totalCount: number
}

export function usePagination(initialPageSize = 10) {
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: initialPageSize,
    totalCount: 0
  })

  const updatePage = (page: number) => {
    setPagination(p => ({ ...p, pageIndex: page }))
  }

  const updatePageSize = (size: number) => {
    setPagination(p => ({ ...p, pageSize: size, pageIndex: 0 }))
  }

  return {
    pagination,
    setPagination,
    updatePage,
    updatePageSize
  }
}
