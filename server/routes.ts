import { UserRegistrationDto } from "./dtos/auth.dto";
import { loginRoute, registerRoute } from "./handlers/auth";
import {
  getAllUsers,
  getUserProfile,
  likeUser,
  unlikeUser,
  updateUserProfile,
} from "./handlers/users";
import { authMiddleware } from "./middleware/auth";
import { requestLogger } from "./middleware/requestLogger";
import validateRequest from "./middleware/validatRequest";
import { unlikeUserProfile } from "./services/users.service";
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
  {
    method: "post",
    path: "/users/like",
    middleware: [authMiddleware],
    handler: likeUser,
  },
  {
    method: "post",
    path: "/users/unlike",
    middleware: [authMiddleware],
    handler: unlikeUser,
  },
];
