export interface IFilterOptions {
  sortableColmuns?: string[];
  searchableColumns?: string[];
  defaultSortBy?: [[string, 'DESC' | 'ASC']];
  filterableColums?: {};
}
