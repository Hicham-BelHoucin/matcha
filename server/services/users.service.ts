import { QueryBuilder } from "./../sql-builder/queryBuilder";
import { Database } from "./../sql-builder/database";

const usersTable = new QueryBuilder("User");

export interface User {
  id: number;
  email: string;
  username: string;
  lastName: string;
  firstName: string;
  password: string;
  gender: string;
  sexualPreferences: string;
  biography: string;
  profilePictureUrl: string;
  location: string;
  fameRating: number;
  gpsLatitude: number;
  gpsLongitude: number;
  lastSeen: string;
  birthDate: string;
}

function extractValueFromBrackets(input: string): string[] {
  const regex = /\(([^)]+)\)/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

function generateErrorMessage(error: any): string {
  switch (error.code) {
    case "23505": // Unique violation
      const matches = extractValueFromBrackets(error.detail);
      return `The ${matches[0]} is already taken. Please try another one.`;
    // Add more cases for different error codes if needed
    default:
      return `An unexpected error occurred. Please try again later.`;
  }
}

export async function createUser(data: {
  [key: string]: string | number | boolean | Date;
}) {
  try {
    const query = usersTable.insert(data).toString();
    const result = await Database.query(query);
    return result;
  } catch (err: any) {
    if (err && err.code === "23505") {
      //   console.error(err);
      throw new Error(generateErrorMessage(err));
    }
    throw new Error("");
  }
}

export async function findUserById(id: number) {
  try {
    const query = usersTable
      .select()
      .where({
        id,
      })
      .findOne();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const query = usersTable
      .select()
      .where({
        email,
      })
      .findOne();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function findUserByUsername(username: string) {
  try {
    const query = usersTable
      .select()
      .where({
        username,
      })
      .findOne();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserById(
  id: number,
  data: {
    [key: string]: string | number | boolean | Date;
  }
) {
  try {
    const query = usersTable.updateById(id, data);
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteUserById(id: number) {
  try {
    const query = usersTable
      .where({
        id,
      })
      .delete();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUsers() {
  try {
    const query = usersTable.findMany();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}
