import { FilterOperator } from '../';
import { isObjKey } from '../../dataStructures/isObjectKey.helper';

export const getOperatorValue = (operator: string): string | false => {
  if (operator[0] !== '$') return false;

  // reform $gte/$gt/$lt...etc to /GTE/GT/LT...etc
  operator = operator.replace('$', '').toUpperCase();

  if (!isObjKey(operator, FilterOperator)) {
    return false;
  }

  return FilterOperator[operator];
};
