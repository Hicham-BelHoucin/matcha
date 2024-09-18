import sqlite3
import os
import psycopg2
import json
from werkzeug.exceptions import InternalServerError, BadRequest


class Model:
    def __init__(self, table):
        self.table = table
        self.delete_fields = []
        self.select_fields = []
        self.where_conditions = []
        self.join_clauses = []
        self.group_by_fields = []
        self.having_conditions = []
        self.insert_fields = []
        self.update_fields = []
        self.order_by_fields = []
        self.limit_value = None
        self.offset_value = None
        self.query = None
        self.connection = None

    def initialize(self):
        if not self.connection:
            # Use PostgreSQL connection
            self.connection = psycopg2.connect(
                user=os.getenv('POSTGRES_USER', 'your_db_user'),
                password=os.getenv('POSTGRES_PASSWORD', 'your_db_password'),
                database=os.getenv('POSTGRES_DB', 'your_db_name'),
                host=os.getenv('DB_HOST', 'localhost'),
                port=os.getenv('DB_PORT', '5432')
            )
            print("Database connected")
    
    def sanitize_input(self, value):
        if isinstance(value, str):
            # Escape single quotes by replacing them with doubled single quotes
            value = value.replace("'", "''")
        return value

    # Insert method
    def insert(self, data):
        fields = ', '.join(f'"{key}"' for key in data.keys())
        values = ', '.join(
            f"'{self.sanitize_input(value)}'" if str(value).find('ARRAY') else str(value) 
            for value in data.values()
        )
        self.query = f'INSERT INTO "{self.table}" ({fields}) VALUES ({values})'
        print(self.query)
        self.insert_fields = data
        return self

    # Update method
    def update(self, data):
        self.update_fields = data
        return self

    # Delete method
    def delete(self):
        self.query = f'DELETE FROM "{self.table}"'
        self.delete_fields = ["*"]
        return self

    def select(self, *fields):
        self.select_fields.extend(fields)
        return self

    def where(self, condition):
        self.where_conditions.append(condition)
        return self

    def join(self, table, on_condition, join_type='INNER'):
        self.join_clauses.append(
            f"{join_type} JOIN \"{table}\" {table[0].lower() if not self.update_fields else ''} ON {on_condition}"
        )
        return self

    def group_by(self, *fields):
        self.group_by_fields.extend(fields)
        return self

    def having(self, condition):
        self.having_conditions.append(condition)
        return self

    def order_by(self, field, direction='ASC'):
        self.order_by_fields.append(f"{self.table[0].lower()}.\"{field}\" {direction}")
        return self

    def limit(self, amount):
        self.limit_value = amount
        return self

    def offset(self, amount):
        self.offset_value = amount
        return self

    def build(self):
        # Handle SELECT fields
        if not self.select_fields or '*' in self.select_fields:
            select_clause = "SELECT *"
        else:
            # select_clause = "SELECT " + ", ".join([f'"{field}"' for field in self.select_fields])
            select_clause = "SELECT " + ", ".join([
                self.table[0].lower() + f'."{field}"' if not 'COALESCE' in field else field for field in self.select_fields
            ])
        # Start building the query
        if not self.delete_fields:
            self.query = f"{select_clause} FROM \"{self.table}\" {self.table[0].lower() if not self.update_fields else ''}"
        
        if self.update_fields:
            #extract name and value from update_fields
            updates = ', '.join([f'"{key}" = \'{value}\'' for key, value in self.update_fields.items()])
            self.query = f' UPDATE "{self.table}" SET {updates}'

        if self.join_clauses:
            self.query += ' ' + ' '.join(self.join_clauses)

        if self.where_conditions:
            self.query += ' WHERE ' + ' AND '.join(self.where_conditions)
    

        if self.group_by_fields:
            self.query += ' GROUP BY ' + ', '.join(self.group_by_fields)

        if self.having_conditions:
            self.query += ' HAVING ' + ' AND '.join(self.having_conditions)

        if self.order_by_fields:
            self.query += ' ORDER BY ' + ', '.join(self.order_by_fields)

        if self.limit_value is not None:
            self.query += f' LIMIT {self.limit_value}'

        if self.offset_value is not None:
            self.query += f' OFFSET {self.offset_value}'

        return self

    def execute(self):
        self.initialize()
        try:
            with self.connection.cursor() as cursor:
                if self.update_fields:
                    # For update
                    cursor.execute(self.query, self.update_fields)
                    self.connection.commit()
                    return "Data updated successfully"
                elif self.insert_fields:
                    # For insert
                    cursor.execute(self.query, self.insert_fields)
                    self.connection.commit()
                    return "Data inserted successfully"
                else:
                    # For select or delete
                    # print(self.query)
                    cursor.execute(self.query)
                    if cursor.description:  # Only for SELECT
                        colnames = [desc[0] for desc in cursor.description]
                        rows = cursor.fetchall()
                        result = [dict(zip(colnames, row)) for row in rows]
                        return result
                    else:
                        self.connection.commit()  # Commit DELETE
                        return "Operation executed successfully"
        except Exception as e:
            print(f"An error occurred: {e}")
            raise InternalServerError("An error occurred")
        finally:
            self.__init__(self.table)  # Reset the query builder

