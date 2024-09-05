import { Handler } from "../types";
import { register, login } from "../services/auth.service";

export const loginRoute: Handler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

export const logout: Handler = (req, res) => {
  res.status(200).send("Success");
};

export const registerRoute: Handler = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

export const forgotPassword: Handler = (req, res) => {
  res.status(200).send("Success");
};

export const resetPassword: Handler = (req, res) => {
  res.status(200).send("Success");
};

export const changePassword: Handler = (req, res) => {
  res.status(200).send("Success");
};
