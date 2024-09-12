import { Request } from "express";
import {
  addVisit,
  findUserByEmail,
  getMessages,
  getUsers,
  getVisitedUsers,
  likeUserProfile,
  search,
  sendMessage,
  unlikeUserProfile,
  updateUserById,
} from "../services/users.service";
import { Handler } from "../types";
const jwt = require("jsonwebtoken");

export const getAllUsers: Handler = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserProfile: Handler = async (req: any, res) => {
  try {
    const data = req.user;

    const user = await findUserByEmail(data.email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateUserProfile: Handler = async (req: any, res) => {
  try {
    const { email } = req.user;
    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const updatedUser = await updateUserById(user.id, data);

    res
      .status(200)
      .json({
        message: "User updated successfully",
      })
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const likeUser: Handler = async (req: any, res) => {
  try {
    const { email } = req.user;
    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("user", user);

    await likeUserProfile(user.id, data.likedUserId);

    res
      .status(200)
      .json({
        message: "User liked successfully",
      })
      .send();
  } catch (error) {
    // console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const unlikeUser: Handler = async (req: any, res) => {
  try {
    const { email } = req.user;
    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    await unlikeUserProfile(user.id, data.likedUserId);

    res
      .status(200)
      .json({
        message: "User unliked successfully",
      })
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getProfileViews: Handler = async (req: any, res) => {
  try {
    const { email } = req.user;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const profileViews = await getVisitedUsers(user.id);

    res.status(200).json(profileViews).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const addProfileView: Handler = async (req: any, res) => {
  try {
    const { email } = req.user;

    console.log("email", email);
    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user || !data) {
      return res.status(404).send("User not found");
    }

    await addVisit(user.id, data.visitedBy);

    res
      .status(200)
      .json({
        message: "Profile view added successfully",
      })
      .send();
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const searchUsers: Handler = async (req: any, res) => {
  try {
    // extract the search query and skip and limit values from the request query
    const { query, skip, limit } = req.query;

    const profileViews = await search(query);

    res.status(200).json(profileViews).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export async function createMessage(req: any, res: any) {
  try {
    const { email } = req.user;

    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("user", user);

    await sendMessage(user.id, data.receiverId, data.content);

    res
      .status(200)
      .json({
        message: "Message sent successfully",
      })
      .send();
  } catch (error) {
    // console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getDm(req: any, res: any) {
  try {
    const { email } = req.user;

    const data = req.body;
    const user: any = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const messages: any = await getMessages(user.id, 3);

    res.status(200).json(messages).send();
  } catch (error) {
    console.error(error);
  }
}
