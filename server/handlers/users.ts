import { Request } from "express";
import {
  findUserByEmail,
  getUsers,
  likeUserProfile,
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

    res.status(200).json(user).end();
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
      .end();
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
      .end();
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
      .end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
