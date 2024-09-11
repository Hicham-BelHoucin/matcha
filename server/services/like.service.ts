import { QueryBuilder } from "../sql-builder/queryBuilder";
import { Database } from "../sql-builder/database";

const likeTable = new QueryBuilder("Like");

export interface Like {
  id: number;
  userId: number;
  likedUserId: number;
}

export async function getLikes(userId: number): Promise<Like[]> {
  const query = likeTable
    .select()
    .where({
      userId,
    })
    .toString();
  return Database.query(query);
}

export async function createLike(like: {
  userId: number;
  likedUserId: number;
}): Promise<void> {
  const query = likeTable.insert(like).toString();
  console.log(query);
  await Database.query(query);
}

export async function deleteLike(like: {
  userId: number;
  likedUserId: number;
}): Promise<void> {
  const query = likeTable
    .where({
      userId: like.userId,
      likedUserId: like.likedUserId,
    })
    .delete();
  console.log(query.toString());
  await Database.query(query);
}

export async function getLikedUsers(userId: number): Promise<number[]> {
  const query = likeTable
    .select("likedUserId")
    .where({
      userId,
    })
    .toString();
  const likes = await Database.query(query);
  return likes.map((like: Like) => like.likedUserId);
}
