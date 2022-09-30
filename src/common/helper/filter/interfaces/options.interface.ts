export interface IFilterOptions {
  sortableColumns?: string[];
  searchableColumns?: string[];
  defaultSortBy?: [[string, 'DESC' | 'ASC']];
  filterableColums?: {};
}
