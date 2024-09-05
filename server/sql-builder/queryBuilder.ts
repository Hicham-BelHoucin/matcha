// src/QueryBuilder.ts
export class QueryBuilder {
  private tableName: string;
  private columns: string[] | string = "*";
  private conditions: string = "";
  private joins: string = ""; // New property to store JOIN clauses

  constructor(tableName: string, columns?: string[] | string) {
    this.tableName = tableName;
    if (columns) {
      this.columns = columns;
    }
  }

  select(columns: string[] | string = "*"): this {
    this.columns = columns;
    return this;
  }

  findMany(): string {
    return `SELECT ${this.columns} FROM "${this.tableName}" ${this.joins}${this.conditions}`.trim();
  }

  findOne(): string {
    return `SELECT ${this.columns} FROM "${this.tableName}" ${this.joins}${this.conditions} LIMIT 1`.trim();
  }

  include(joinTable: string, joinColumn: string, targetColumn: string): this {
    this.joins += ` JOIN "${joinTable}" ON "${this.tableName}"."${joinColumn}" = "${joinTable}"."${targetColumn}"`;
    return this;
  }

  deleteMany(): string {
    return `DELETE FROM "${this.tableName}" ${this.conditions}`.trim();
  }

  delete(): string {
    return `DELETE FROM "${this.tableName}" ${this.conditions} LIMIT 1`.trim();
  }

  updateById(
    id: number,
    data: { [key: string]: string | number | boolean | Date }
  ): string {
    const values = Object.entries(data)
      .map(
        ([key, value]) =>
          `"${key}" = ${typeof value === "string" ? `'${value}'` : value}`
      )
      .join(", ");
    return `UPDATE "${this.tableName}" SET ${values} WHERE id = ${id}`.trim();
  }

  insert(data: { [key: string]: string | number | boolean | Date }): string {
    const columns = Object.keys(data)
      .map((value) => `"${value}"`)
      .join(", ");
    const values = Object.values(data)
      .map((value) => (typeof value === "string" ? `'${value}'` : value))
      .join(", ");
    return `INSERT INTO "${this.tableName}" (${columns}) VALUES (${values})`;
  }

  where(conditions: { [key: string]: any }): this {
    const conditionStr = Object.entries(conditions)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(" AND ");
    this.conditions = `WHERE ${conditionStr}`;
    return this;
  }

  toString(): string {
    const columns = Array.isArray(this.columns)
      ? this.columns.join(", ")
      : this.columns;
    return `SELECT ${columns} FROM "${this.tableName}" ${this.joins}${this.conditions}`.trim();
  }
}
