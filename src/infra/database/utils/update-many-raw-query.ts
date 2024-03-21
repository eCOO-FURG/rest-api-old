import { Decimal } from "@prisma/client/runtime/library";

type Entry = {
  id: number | string;
  [key: string]: number | string | Date | Decimal | null;
};

export function updateManyRawQuery(entries: Entry[], table: string) {
  const fields = Object.keys(entries[0]!).filter((key) => key !== "id");

  const setSql = fields
    .map((field) => `"${field}" = data."${field}"`)
    .join(", ");

  const entriesValues = entries
    .map((entry) => {
      const values = fields.map((field) => {
        const value = entry[field];
        if (field === "updated_at") {
          return `'${new Date().toISOString()}'::timestamp without time zone`;
        }
        if (value === null) {
          return "null";
        }
        if (value instanceof Date) {
          return `'${value.toISOString()}'::timestamp without time zone`;
        }
        if (value instanceof Decimal) {
          return value.toNumber();
        }
        if (typeof value === "number") {
          return value;
        }
        return `'${value}'`;
      });
      return `('${entry.id}', ${values.join(", ")})`;
    })
    .join(", ");

  const sql = `
    UPDATE "${table}"
    SET ${setSql}
    FROM (VALUES ${entriesValues}) AS data(id, ${fields
    .map((field) => `"${field}"`)
    .join(", ")})
    WHERE "${table}".id::text = data.id;
  `;

  return {
    sql,
  };
}
