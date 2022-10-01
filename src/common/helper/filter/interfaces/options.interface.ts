import { FilterOperator } from '../';

interface IFilterableColumnsObject {
  [key: string]: FilterOperator;
}

interface IPaginate {
  skip?: number;
  limit: number;
}

export interface IFilterOptions {
  sortableColumns?: string[];
  searchableColumns?: string[];
  defaultSortBy?: [[string, 'DESC' | 'ASC']];
  filterableColumns?: IFilterableColumnsObject;
  withRelations?: string[];
  selectFields?: string[];
  paginate?: IPaginate;
}
