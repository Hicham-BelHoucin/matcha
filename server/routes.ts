import { UserRegistrationDto } from "./dtos/auth.dto";
import { loginRoute, registerRoute } from "./handlers/auth";
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} from "./handlers/users";
import { authMiddleware } from "./middleware/auth";
import { requestLogger } from "./middleware/requestLogger";
import validateRequest from "./middleware/validatRequest";
import { Route } from "./types";

export const routes: Route[] = [
  {
    method: "post",
    path: "/login",
    middleware: [requestLogger],
    handler: loginRoute,
  },
  {
    method: "post",
    path: "/register",
    middleware: [validateRequest(UserRegistrationDto)],
    handler: registerRoute,
  },
  {
    method: "get",
    path: "/users/",
    middleware: [authMiddleware],
    handler: getAllUsers,
  },
  {
    method: "get",
    path: "/users/profile",
    middleware: [authMiddleware],
    handler: getUserProfile,
  },
  {
    method: "put",
    path: "/users/profile",
    middleware: [authMiddleware],
    handler: updateUserProfile,
  },
];
