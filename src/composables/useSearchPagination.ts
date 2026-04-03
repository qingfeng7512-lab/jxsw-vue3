import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type SortOption<T> = {
  value: string
  label: string
  compare: (a: T, b: T) => number
}

export type UseSearchPaginationOptions<T> = {
  pageSize: number
  pageSizeOptions?: number[]
  source: Ref<T[]> | ComputedRef<T[]>
  searchOf: (item: T) => string
  sortOptions?: SortOption<T>[]
  defaultSort?: string
}

export type PagerToken = number | '...'

export function useSearchPagination<T>(options: UseSearchPaginationOptions<T>) {
  const route = useRoute()
  const router = useRouter()

  const keyword = ref('')
  const currentPage = ref(1)
  const selectedPageSize = ref(options.pageSize)
  const sortOptions = options.sortOptions ?? []
  const defaultSort = options.defaultSort ?? sortOptions[0]?.value ?? ''
  const selectedSort = ref(defaultSort)

  const pageSizeOptions = computed(() => {
    const merged = [...(options.pageSizeOptions ?? []), options.pageSize]
    const normalized = merged
      .map((x) => Number.parseInt(String(x), 10))
      .filter((x) => Number.isFinite(x) && x > 0)

    return Array.from(new Set(normalized)).sort((a, b) => a - b)
  })

  const parsePage = (value: unknown): number => {
    const parsed = Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  }

  const parsePageSize = (value: unknown): number => {
    const parsed = Number.parseInt(String(value ?? ''), 10)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return options.pageSize
    }

    return pageSizeOptions.value.includes(parsed) ? parsed : options.pageSize
  }

  const parseSort = (value: unknown): string => {
    const next = typeof value === 'string' ? value : defaultSort
    return sortOptions.some((x) => x.value === next) ? next : defaultSort
  }

  const filteredItems = computed(() => {
    const q = keyword.value.trim().toLowerCase()

    if (!q) {
      return options.source.value
    }

    return options.source.value.filter((item) => options.searchOf(item).toLowerCase().includes(q))
  })

  const sortedItems = computed(() => {
    const list = [...filteredItems.value]
    const sorter = sortOptions.find((x) => x.value === selectedSort.value)

    if (!sorter) {
      return list
    }

    return list.sort(sorter.compare)
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedItems.value.length / selectedPageSize.value)),
  )

  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * selectedPageSize.value
    return sortedItems.value.slice(start, start + selectedPageSize.value)
  })

  const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

  const hasActiveFilters = computed(() => {
    return (
      keyword.value.trim().length > 0 ||
      selectedPageSize.value !== options.pageSize ||
      selectedSort.value !== defaultSort ||
      currentPage.value !== 1
    )
  })

  const pagerTokens = computed<PagerToken[]>(() => {
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      return pageNumbers.value
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total]
    }

    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    }

    return [1, '...', current - 1, current, current + 1, '...', total]
  })

  watch(
    () => route.query,
    (query) => {
      keyword.value = typeof query.q === 'string' ? query.q : ''
      selectedPageSize.value = parsePageSize(query.size)
      selectedSort.value = parseSort(query.sort)
      currentPage.value = Math.min(parsePage(query.page), totalPages.value)
    },
    { immediate: true },
  )

  watch(totalPages, (nextTotal) => {
    if (currentPage.value > nextTotal) {
      currentPage.value = nextTotal
    }
  })

  watch([keyword, selectedPageSize, selectedSort], () => {
    currentPage.value = 1
  })

  watch([keyword, currentPage, selectedPageSize, selectedSort], ([q, page, size, sort]) => {
    const nextQuery: Record<string, string> = {}

    if (q.trim()) {
      nextQuery.q = q.trim()
    }

    if (page > 1) {
      nextQuery.page = String(page)
    }

    if (size !== options.pageSize) {
      nextQuery.size = String(size)
    }

    if (sort && sort !== defaultSort) {
      nextQuery.sort = sort
    }

    const currentQ = typeof route.query.q === 'string' ? route.query.q : ''
    const currentPageQuery = parsePage(route.query.page)
    const currentSizeQuery = parsePageSize(route.query.size)
    const currentSortQuery = parseSort(route.query.sort)
    const normalizedCurrentPage = route.query.page ? currentPageQuery : 1
    const normalizedNextPage = page > 1 ? page : 1
    const normalizedCurrentSort = route.query.sort ? currentSortQuery : defaultSort
    const normalizedNextSort = sort || defaultSort

    if (
      currentQ === (nextQuery.q ?? '') &&
      normalizedCurrentPage === normalizedNextPage &&
      currentSizeQuery === size &&
      normalizedCurrentSort === normalizedNextSort
    ) {
      return
    }

    router.replace({ query: nextQuery })
  })

  function resetPage() {
    currentPage.value = 1
  }

  function resetAll() {
    keyword.value = ''
    selectedPageSize.value = options.pageSize
    selectedSort.value = defaultSort
    currentPage.value = 1
  }

  return {
    keyword,
    currentPage,
    selectedPageSize,
    pageSizeOptions,
    selectedSort,
    sortOptions,
    hasActiveFilters,
    filteredItems,
    totalPages,
    pageNumbers,
    pagerTokens,
    pagedItems,
    resetPage,
    resetAll,
  }
}
