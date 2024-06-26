"use strict";

const STATUSCODE = {
  OK: 200,
  CREATED: 201,
};
const STATUSREASON = {
  OK: "success",
  CREATED: "created",
};

class SuccessResponse {
  constructor({ statusCode, message, data = null, metadata = {} }) {
    this.statusCode = statusCode;
    this.status = statusCode === 200 ? STATUSREASON.OK : STATUSREASON.CREATED;
    this.message = message;
    this.data = data;
    this.metadata = metadata;
  }
  send(res, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ statusCode = STATUSCODE.OK, message = STATUSREASON.OK, data, metadata }) {
    super({ statusCode, message, data, metadata });
  }
}
class CreatedResponse extends SuccessResponse {
  constructor({ statusCode = STATUSCODE.CREATED, message = STATUSREASON.CREATED, data, metadata }) {
    super({ statusCode, message, data, metadata });
  }
}
export { CreatedResponse, OkResponse };
