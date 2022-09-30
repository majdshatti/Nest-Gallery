import { Repository } from 'typeorm';
import { IFilterOptions } from './';

export const filter = <T>(
  queries: any,
  repository: Repository<T>,
  options: IFilterOptions,
) => {
  const { sortableColmuns, defaultSortBy } = options;

  const tableAlias = repository.metadata.tableName;

  /** Initing query builder */
  let queryBuilder = repository.createQueryBuilder(tableAlias);

  /** Sorting */
  if (queries.sortBy?.length > 0 && sortableColmuns) {
    //* NOTE: taking only first tuple of query sorting params
    //* Example: ?sortBy=name:DESC --> ['name', 'DESC'] is what being taken
    const sortBy: string[] = queries.sortBy[0];

    const sortField: string = sortBy[0];
    // sortMethod only accepts DESC/ASC values
    const sortMethod: 'DESC' | 'ASC' = sortBy[1] === 'ASC' ? 'ASC' : 'DESC';
    if (sortableColmuns.includes(sortField)) {
      queryBuilder.orderBy(tableAlias + '.' + sortField, sortMethod);
    }
  }

  /** Default Sorting */
  if (!queries.sortBy && defaultSortBy?.length > 0) {
    let [[sortField, sortMethod]] = defaultSortBy;

    // sortMethod only accepts DESC/ASC values
    sortMethod = sortMethod === 'ASC' ? 'ASC' : 'DESC';

    queryBuilder.orderBy(tableAlias + '.' + sortField, sortMethod);
  }

  return queryBuilder.getMany();
};
