export const getWhereStatement = (operator: string, col: string) => {
  let sqlStatment: string = '';

  if (operator === 'IN') {
    sqlStatment = `${col} ${operator} (:...${col})`;
  } else if (operator === 'LIKE') {
    sqlStatment = `${col} ${operator} '%' || :${col} || '%'`;
  } else {
    sqlStatment = `${col} ${operator} :${col}`;
  }

  return sqlStatment;
};
