import { createUser, findUserByEmail, User } from "../services/users.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}

const SECRET = process.env.JWT_SECRET || "secret";

export const login = async (email: string, password: string) => {
  const user = (await findUserByEmail(email)) as any;
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ id: user.id, email, password }, SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const register = async (data: User) => {
  const hashedPassword = await hashPassword(data.password);
  const user = (await createUser({ ...data, password: hashedPassword })) as any;
  return login(data.email, user.password);
};
