import { UserRegistrationDto } from "./dtos/auth.dto";
import { loginRoute, registerRoute } from "./handlers/auth";
import {
  addProfileView,
  createMessage,
  getAllUsers,
  getDm,
  getProfileViews,
  getUserProfile,
  likeUser,
  searchUsers,
  unlikeUser,
  updateUserProfile,
} from "./handlers/users";
import { authMiddleware } from "./middleware/auth";
import { requestLogger } from "./middleware/requestLogger";
import validateRequest from "./middleware/validatRequest";
import { Route } from "./types";

export const routes: Route[] = [
  {
    method: "post",
    path: "/auth/login",
    middleware: [requestLogger],
    handler: loginRoute,
  },
  {
    method: "post",
    path: "/auth/register",
    middleware: [validateRequest(UserRegistrationDto)],
    handler: registerRoute,
  },
  {
    method: "post",
    path: "/auth/reset-password",
    middleware: [validateRequest(UserRegistrationDto)],
    handler: registerRoute,
  },
  {
    method: "post",
    path: "/auth/forgot-password",
    middleware: [validateRequest(UserRegistrationDto)],
    handler: registerRoute,
  },
  // user routes
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
    method: "get",
    path: "/users/profile-views",
    middleware: [authMiddleware],
    handler: getProfileViews,
  },
  {
    method: "post",
    path: "/users/profile-views",
    middleware: [authMiddleware],
    handler: addProfileView,
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
  {
    method: "get",
    path: "/users/search",
    middleware: [authMiddleware],
    handler: searchUsers,
  },
  {
    method: "get",
    path: "/users/suggestions",
    middleware: [authMiddleware],
    handler: unlikeUser,
  },

  // reports / blocks
  {
    method: "post",
    path: "/users/report",
    middleware: [authMiddleware],
    handler: likeUser,
  },
  {
    method: "post",
    path: "/users/block",
    middleware: [authMiddleware],
    handler: likeUser,
  },
  // chat routes
  {
    method: "get",
    path: "/chat/messages/",
    middleware: [authMiddleware],
    handler: getDm,
  },
  {
    method: "post",
    path: "/chat/messages/:userId",
    middleware: [authMiddleware],
    handler: createMessage,
  },

  // notificaiton routes
  {
    method: "get",
    path: "/notifications/",
    middleware: [authMiddleware],
    handler: likeUser,
  },
  {
    method: "post",
    path: "/notifications/:userId",
    middleware: [authMiddleware],
    handler: likeUser,
  },
  {
    method: "delete",
    path: "/notifications/:userId",
    middleware: [authMiddleware],
    handler: likeUser,
  },

  {
    method: "post",
    path: "/notifications/mark-as-read",
    middleware: [authMiddleware],
    handler: likeUser,
  },
];
