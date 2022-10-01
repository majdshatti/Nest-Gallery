import { Repository } from 'typeorm';
import { getOperatorValue, IFilterOptions } from './';
import { getWhereStatement } from './helper/getWhereStatement.helper';

export const filter = <T>(
  queries: any,
  repository: Repository<T>,
  options: IFilterOptions,
) => {
  const { sortableColumns, defaultSortBy, searchableColumns } = options;

  const tableAlias = repository.metadata.tableName;

  /** Initing query builder */
  let queryBuilder = repository.createQueryBuilder(tableAlias);

  /** Search */
  if (queries.search && searchableColumns?.length > 0) {
    for (const col of searchableColumns) {
      queryBuilder.orWhere(`${tableAlias}.${col} LIKE :${col}`, {
        [col]: `%${queries.search}%`,
      });
    }
  }

  /** Fields filtering */
  if (queries.filter) {
    for (const col in queries.filter) {
      // Example: $gte:10, $in:smth,smth2
      const queryFilter = queries.filter[col].split(':');
      const operator = queryFilter[0];
      let value = queryFilter[1];

      let sqlOperator = getOperatorValue(operator);

      if (!sqlOperator) continue;

      if (sqlOperator === 'IN') {
        value = value.split(',');
      }

      let sqlStatement = getWhereStatement(sqlOperator, col);

      sqlStatement = tableAlias + '.' + sqlStatement;

      queryBuilder.andWhere(sqlStatement, {
        [col]: value,
      });
    }
  }

  /** Sorting */
  if (queries.sortBy?.length > 0 && sortableColumns) {
    //* NOTE: taking only first tuple of query sorting params
    //* Example: ?sortBy=name:DESC --> ['name', 'DESC'] is what being taken
    const sortBy: string[] = queries.sortBy[0];

    const sortField: string = sortBy[0];
    // sortMethod only accepts DESC/ASC values
    const sortMethod: 'DESC' | 'ASC' = sortBy[1] === 'ASC' ? 'ASC' : 'DESC';
    if (sortableColumns.includes(sortField)) {
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
