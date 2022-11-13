import { Repository } from 'typeorm';
// Filter related
import {
  getOperatorValue,
  IFilterOptions,
  getWhereStatement,
  IFilterResult,
  QueryFilterDto,
} from './';
// Utils
import { isObjKey } from 'src/common/utils/';

export const filter = async <T>(
  queries: QueryFilterDto,
  repository: Repository<T>,
  options: IFilterOptions,
): Promise<IFilterResult> => {
  const {
    sortableColumns,
    defaultSortBy,
    searchableColumns,
    withRelations,
    selectFields,
    paginate,
    filterableColumns,
    conditions,
  } = options;

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

  /** Conditions */
  if (conditions) {
    for (const cond in conditions) {
      queryBuilder.andWhere(`${tableAlias}.${cond} = :${cond}`, {
        [cond]: `${conditions[cond]}`,
      });
    }
  }

  /** Fields filtering */
  if (queries.filter) {
    let relationAlias;

    for (const col in queries.filter) {
      // Make sure that user does not pass any unexisted column
      if (!isObjKey(col, filterableColumns)) {
        continue;
      }

      // Check wether the table alias is a relation instead
      if (col.includes('.')) {
        if (withRelations.includes(col.split('.')[0])) {
          relationAlias = col.split('.')[0];
        }
      }

      // Example: $gte:10, $in:smth,smth2
      const queryFilter: string[] = queries.filter[col].split(':');
      const operator: string = queryFilter[0];
      let value: string | string[] = queryFilter[1];

      // Convert $gte to >=
      let sqlOperator = getOperatorValue(operator);

      if (!sqlOperator) continue;

      // Convert value to array for the query builder in case of in
      if (sqlOperator === 'IN') {
        value = value.split(',');
      }

      const sqlStatement: string =
        (!relationAlias ? tableAlias + '.' : '') +
        getWhereStatement(sqlOperator, col);

      queryBuilder.andWhere(sqlStatement, {
        [col]: value,
      });
    }
  }
  console.log(queryBuilder.getQueryAndParameters());
  /** Relations */
  if (withRelations?.length > 0) {
    for (const relation of withRelations) {
      queryBuilder.leftJoinAndSelect(`${tableAlias}.${relation}`, relation);
    }
  }

  /** Select */
  if (selectFields?.length > 0) {
    queryBuilder.select(selectFields);
  }

  /** Sorting */
  if (queries.sortBy?.length > 0 && sortableColumns) {
    //* NOTE: taking only first tuple of query sorting params
    //* Example: ?sortBy=name:DESC --> ['name', 'DESC'] is what being taken
    const sortBy: [string, string] = queries.sortBy[0];
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

  /** Pagination */
  let itemsPerPage: number;
  let currentPage: number = 1;
  let limit: number;

  // Get limit from URl if not get it from default setting
  if (queries.limit || paginate.limit) {
    limit = queries.limit ?? paginate.limit;
    queryBuilder.take(limit);
    itemsPerPage = limit;
  }

  // Skipping items if a page param passed in the URL
  if (queries.page) {
    queryBuilder.skip((queries.page - 1) * limit);
    currentPage = queries.page;
  }

  const totalItems: number = await queryBuilder.getCount();
  const totalPages: number = itemsPerPage
    ? Math.ceil(totalItems / itemsPerPage)
    : undefined;

  // Get filtered data
  const data = await queryBuilder.getMany();

  // Extra Meta Data
  let nextPage = undefined;
  let previousPage = undefined;

  if (currentPage < totalPages) nextPage = currentPage + 1;

  if (currentPage > 1 && currentPage <= totalPages + 1)
    previousPage = currentPage - 1;

  return {
    data,
    meta: {
      itemsPerPage,
      totalItems,
      totalPages,
      currentPage,
      nextPage,
      previousPage,
    },
  };
};
