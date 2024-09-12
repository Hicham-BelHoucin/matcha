import { QueryBuilder } from "./../sql-builder/queryBuilder";
import { Database } from "./../sql-builder/database";
import { createLike, deleteLike, getLikedUsers } from "./like.service";

const usersTable = new QueryBuilder("User");
const blockTable = new QueryBuilder("Block");
const messageTable = new QueryBuilder("Message");
const notificationTable = new QueryBuilder("Notification");
const intrestTable = new QueryBuilder("Intrest");
const likeTable = new QueryBuilder("Like");
const connectionTable = new QueryBuilder("Connection");
const pictureTable = new QueryBuilder("Picture");
const visitTable = new QueryBuilder("Visit");

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
  const matches = extractValueFromBrackets(error.detail);
  console.log(matches);
  switch (error.code) {
    case "23505": // Unique violation
      return `The '${matches[0]}' is already taken. Please try another one.`;
    case "23503": // Foreign key violation
      return `The '${matches[0]}' value does not exist. Please provide a valid '${matches[0]}'.`;
    case "23502": // Not null violation
      return `A required field is missing. Please ensure all required fields are filled.`;

    case "23514": // Check constraint violation
      return `A value provided does not meet the required condition. Please verify your inputs.`;

    case "42703": // Undefined column
      return `One of the columns specified does not exist in the database. Please check your query.`;

    case "42883": // Undefined function
      return `An undefined function was called. Please ensure all functions exist and are correctly defined.`;

    case "42P01": // Undefined table
      return `The specified table does not exist. Please check your database schema or query.`;

    case "22001": // String data, right truncation
      return `One of the fields contains too much data. Please shorten your input.`;

    case "42601": // Syntax error
      return `There is a syntax error in the query. Please review your SQL statement.`;
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
    console.error(err);
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
    return result[0];
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
    return result[0];
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
    return result[0];
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
    const query = usersTable
      .select([
        "id",
        "email",
        "username",
        "lastName",
        "firstName",
        "gender",
        "sexualPreferences",
        "biography",
        "profilePictureUrl",
        "location",
        "fameRating",
        "gpsLatitude",
        "gpsLongitude",
        "lastSeen",
        "birthDate",
      ])
      .findMany();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function likeUserProfile(userId: number, likedUserId: number) {
  try {
    await createLike({ userId, likedUserId });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function unlikeUserProfile(userId: number, likedUserId: number) {
  try {
    await deleteLike({ userId, likedUserId });
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
}

export async function sendMessage(
  senderId: number,
  receiverId: number,
  content: string
) {
  try {
    const query = messageTable.insert({
      senderId,
      receiverId,
      content,
    });
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserMessages(userId: number) {
  try {
    const query = messageTable
      .select()
      .where({
        receiverId: userId,
        senderId: userId,
      })
      .findMany();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getNotifications(userId: number) {
  try {
    const query = notificationTable
      .select()
      .where({
        userId,
      })
      .findMany();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function createIntrest(userId: number, intrest: string) {
  try {
    const query = intrestTable.insert({
      userId,
      intrest,
    });
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteIntrest(userId: number, intrest: string) {
  try {
    const query = intrestTable
      .where({
        userId,
        intrest,
      })
      .delete();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function addVisit(userId: number, visitedBy: number) {
  try {
    const query = visitTable.insert({
      userId,
      visitedBy,
    });
    const result = await Database.query(query);
    return result;
  } catch (err: any) {
    if (err && err.code) {
      throw new Error(generateErrorMessage(err));
    }
    throw new Error("An unexpected error occurred. Please try again later.");
  }
}

export async function getVisitedUsers(userId: number) {
  try {
    const query = visitTable
      .select()
      .where({
        userId,
      })
      .findMany();
    console.log(query);
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function addIntrest(userId: number, intrest: string) {
  try {
    const query = intrestTable.insert({
      userId,
      intrest,
    });
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function search(username: string) {
  try {
    const query = usersTable
      .select()
      .whereContains({
        username: username,
      })
      .findMany()
      .toString();
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}

// get messages between two users
export async function getMessages(userId: number, otherUserId: number) {
  try {
    const query = messageTable
      .select()
      .where({
        senderId: userId,
        receiverId: otherUserId,
      })
      .orWhere({
        senderId: otherUserId,
        receiverId: userId,
      })
      .findMany();

    console.log(query);
    const result = await Database.query(query);
    return result;
  } catch (err) {
    console.error(err);
  }
}
