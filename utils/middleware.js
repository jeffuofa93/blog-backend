const logger = require("./logger");
const { request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  // if (authorization && !authorization.toLowerCase().startsWith("bearer ")) {
  //   return response
  //     .status(401)
  //     .send({ error: "middleware tokenExtractor bad token" });
  // }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

// const userExtractor = (request, response, next) => {
//   // if (request.token) {
//   //   const decodedToken = jwt.verify(request.token, process.env.SECRET);
//   //   if (!decodedToken.id) {
//   //     return response.status(401).json({ error: "token error or user error" });
//   //   }
//   //   const user = User.findById(decodedToken.id);
//   //   if (!user) {
//   //     return response.status(401).json({ error: "invalid user" });
//   //   }
//   //   request.user = user;
//   // }
//   logger.info(request.body);
//
//   next();
// };

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  // userExtractor,
};
