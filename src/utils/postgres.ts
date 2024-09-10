import { ObjectWithAnyData } from '@/types';

export function createQueryToPopulateTable(data: ObjectWithAnyData[], table: string) {
  // Get the columns from the first user
  const columns = Object.keys(data[0]);

  // Create array vith concatenated values as string
  const values = data.map((item: ObjectWithAnyData) => (
    `(${columns.map((c) => item[c] !== null ? `'${item[c]}'` : 'NULL').join(', ')})`
  ));

  const query = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES ${values.join(', ')};
  `;

  return query;
}