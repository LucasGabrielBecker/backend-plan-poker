var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var import_socket = require("socket.io");
var import_express = __toESM(require("express"));
var import_http = require("http");
var import_cors = __toESM(require("cors"));
var import_eventsEnum = __toESM(require("./eventsEnum"));
var import_uuid = require("uuid");
var import_mongoose = __toESM(require("mongoose"));
var import_Schemas = require("./Schemas");
var import_handlers = require("./handlers");
const app = (0, import_express.default)();
const PORT = process.env.PORT || 5e3;
const server = (0, import_http.createServer)(app);
const io = new import_socket.Server(server, {
  cors: {
    origin: "*"
  }
});
let disconnectedList = [];
const RUN_EACH_10_SECONDS = "*/10 * * * * *";
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.get("/", (res) => __async(exports, null, function* () {
  return res.status(200).send({ status: "ok" });
}));
app.post("/rooms/create", (req, res) => __async(exports, null, function* () {
  const { cards } = req.body;
  try {
    let newCards = null;
    if (cards) {
      newCards = yield import_Schemas.Card.create(cards);
    }
    const cardsIds = newCards == null ? void 0 : newCards.map((card) => card._id || "");
    const roomId = (0, import_uuid.v4)();
    const newRoom = yield import_Schemas.Room.create({ name: roomId, cards: cardsIds != null ? cardsIds : [] });
    yield newRoom.populate("cards");
    return res.status(201).send({ ok: true, msg: "Sala criada com sucesso!", room: newRoom });
  } catch (error) {
    const err = error.message || error;
    console.error(err);
    return res.status(409).send({ ok: false, msg: err });
  }
}));
app.get("/rooms", (req, res) => __async(exports, null, function* () {
  try {
    const rooms = yield import_Schemas.Room.find({});
    return res.status(200).send({ ok: true, rooms });
  } catch (error) {
    return res.status(404).send({ ok: false, msg: error.message || error });
  }
}));
app.get("/check_room/:roomid", (req, res) => __async(exports, null, function* () {
  const roomId = req.params.roomid;
  const room = yield import_Schemas.Room.findOne({ name: roomId });
  if (!room) {
    return res.status(404).send({
      ok: false,
      msg: "Esta sala n\xE3o existe, verifique o c\xF3digo inserido."
    });
  }
  return res.status(200).send({ ok: true, msg: "Sala existe" });
}));
app.get("/rooms/:roomid", (req, res) => __async(exports, null, function* () {
  const roomid = req.params.roomid;
  const room = yield import_Schemas.Room.findOne({ name: roomid }).populate("cards", ["title", "description", "createdAt"]).select("-__v");
  const connectedClients = (0, import_handlers.getConnectedClients)();
  if (!room) {
    return res.status(404).send({
      ok: false,
      msg: "Sala nao encontrada"
    });
  }
  return res.status(200).send({ ok: true, room, connectedClients });
}));
io.on("connection", (socket) => {
  socket.on(import_eventsEnum.default.GET_CARDS, (payload) => {
    (0, import_handlers.getCards)(io);
  });
  socket.on(import_eventsEnum.default.REGISTER, (payload) => {
    (0, import_handlers.register)(io, __spreadProps(__spreadValues({}, payload), { socketId: socket.id }));
  });
  socket.on(import_eventsEnum.default.GET_CONNECTED_CLIENTS, () => {
    const clients = (0, import_handlers.getConnectedClients)();
  });
  socket.on(import_eventsEnum.default.SET_VOTING_CARD, (payload) => __async(exports, null, function* () {
    console.log(payload);
    (0, import_handlers.setVotingCard)(io, payload);
  }));
  socket.on(import_eventsEnum.default.VOTE, (payload) => {
    (0, import_handlers.handleVote)(io, payload);
  });
  socket.on(import_eventsEnum.default.SHOW_VOTES, () => {
    io.emit(import_eventsEnum.default.NOTIFY_SHOW_VOTES);
  });
  socket.on("disconnect", () => {
    const disconnectedUser = (0, import_handlers.notifyUserDisconnect)(socket.id);
    if (disconnectedUser)
      disconnectedList.push(disconnectedUser.id);
  });
});
server.listen(PORT, () => __async(exports, null, function* () {
  try {
    yield import_mongoose.default.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.78anz.mongodb.net/plan-poker?retryWrites=true&w=majority`);
    console.log("DB Connected");
    console.log("Server hosted on port: ", PORT);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}));
//# sourceMappingURL=server.js.map
