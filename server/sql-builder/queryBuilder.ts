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
    this.columns = Array.isArray(columns)
      ? columns.map((column) => `"${column}"`).join(", ")
      : columns;
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
    console.log(
      `INSERT INTO "${this.tableName}" (${columns}) VALUES (${values})`
    );
    return `INSERT INTO "${this.tableName}" (${columns}) VALUES (${values})`;
  }

  where(conditions: { [key: string]: any }): this {
    const conditionStr = Object.entries(conditions)
      .map(([key, value]) => `"${key}" = '${value}'`)
      .join(" AND ");
    this.conditions = `WHERE ${conditionStr}`;
    return this;
  }

  orWhere(conditions: { [key: string]: any }): this {
    const conditionStr = Object.entries(conditions)
      .map(([key, value]) => `"${key}" = '${value}'`)
      .join(" OR ");
    this.conditions = `WHERE ${conditionStr}`;
    return this;
  }

  whereContains(conditions: { [key: string]: any }): this {
    const conditionStr = Object.entries(conditions)
      .map(([key, value]) => `"${key}" LIKE '%${value}%'`)
      .join(" AND ");
    this.conditions = `WHERE ${conditionStr}`;
    return this;
  }

  toString(): string {
    const columns = Array.isArray(this.columns)
      ? this.columns.join(", ")
      : this.columns;
    const query =
      `SELECT ${columns} FROM "${this.tableName}" ${this.joins}${this.conditions}`.trim();
    // return the query string
    this.conditions = "";
    this.joins = "";
    return query;
  }
}
