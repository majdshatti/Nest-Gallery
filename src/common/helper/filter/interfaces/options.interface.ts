import { FilterOperator } from '../';

interface IFilterableColumnsObject {
  [key: string]: FilterOperator;
}

export interface IFilterOptions {
  sortableColumns?: string[];
  searchableColumns?: string[];
  defaultSortBy?: [[string, 'DESC' | 'ASC']];
  filterableColumns?: IFilterableColumnsObject;
  withRelations?: string[];
  selectFields?: string[];
}
