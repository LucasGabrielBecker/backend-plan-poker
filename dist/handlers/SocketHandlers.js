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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
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
var SocketHandlers_exports = {};
__export(SocketHandlers_exports, {
  getCards: () => getCards,
  getConnectedClients: () => getConnectedClients,
  handleVote: () => handleVote,
  notifyUserDisconnect: () => notifyUserDisconnect,
  parseConnectedClients: () => parseConnectedClients,
  register: () => register,
  setVotingCard: () => setVotingCard
});
var import_eventsEnum = __toESM(require("../eventsEnum"));
var import_uuid = require("uuid");
var import_Schemas = require("../Schemas");
const connectedClients = /* @__PURE__ */ new Map();
let cards = [
  {
    id: (0, import_uuid.v4)(),
    title: "Primeiro Card",
    description: "Some description would go here",
    voting: false,
    votes: []
  },
  {
    id: (0, import_uuid.v4)(),
    title: "Segundo Card",
    description: "Some description would go here",
    voting: true,
    votes: []
  }
];
let voted = [];
const getCards = (socket) => {
  socket.emit(import_eventsEnum.default.UPDATE_CARDS, {
    cards,
    connectedClients: parseConnectedClients()
  });
};
const register = (socket, payload) => {
  connectedClients.set(payload.id, payload);
  socket.emit(import_eventsEnum.default.NEW_CLIENT, {
    newUser: payload.username,
    connectedClients: parseConnectedClients()
  });
};
const getConnectedClients = () => {
  return parseConnectedClients();
};
const setVotingCard = (socket, payload) => __async(void 0, null, function* () {
  const { cardId, room } = payload;
  const dbRoom = yield import_Schemas.Room.findOne({ name: room }).populate("cards");
  socket.emit(import_eventsEnum.default.NEW_VOTING_CARD, dbRoom.cards.find((card) => card._id.toString() === cardId));
});
const notifyUserDisconnect = (socketId) => {
  if (!socketId)
    return;
  const users = parseConnectedClients();
  const disconnectedUser = users.find((u) => u.socketId === socketId);
  if (!disconnectedUser)
    return;
  connectedClients.delete(disconnectedUser.id);
  return disconnectedUser;
};
const handleVote = (socket, payload) => __async(void 0, null, function* () {
  console.log(payload);
  const { userId, points, cardId } = payload;
  voted.push({ id: userId, cardId, points });
  const user = connectedClients.get(userId);
  connectedClients.set(userId, __spreadProps(__spreadValues({}, user), { points }));
  socket.emit(import_eventsEnum.default.UPDATE_USERS, {
    users: parseConnectedClients(),
    usersAlreadyVoted: voted.map((u) => u.id)
  });
});
const parseConnectedClients = () => Array.from(connectedClients, ([item, value]) => __spreadValues({}, value));
module.exports = __toCommonJS(SocketHandlers_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCards,
  getConnectedClients,
  handleVote,
  notifyUserDisconnect,
  parseConnectedClients,
  register,
  setVotingCard
});
//# sourceMappingURL=SocketHandlers.js.map
