const secretKey = process.env.SECRET_KEY;
// const jsonWebToken = require("jsonwebtoken");

function sendResponse(response, message, data, success, statusCode = 200) {
  response.status(statusCode).send({
    success,
    message,
    data,
  });
}

module.exports.sendResponse = sendResponse;

module.exports.sendSuccess = function (
  response,
  message,
  data = {},
  statusCode = 200
) {
  sendResponse(response, message, data, true, statusCode);
};

module.exports.sendError = function (
  response,
  message,
  data = {},
  statusCode = 400
) {
  sendResponse(response, message, data, false, statusCode);
};

// module.exports.createJWT = (data) => {
//   const token = jsonWebToken.sign(data, secretKey);
//   return token;
// };

// module.exports.decodeJWT = (req) => {
//   const token = req.headers.authorization.split(" ")[1];
//   const data = jsonWebToken.verify(token, process.env.SECRET_KEY);
//   return data;
// };
