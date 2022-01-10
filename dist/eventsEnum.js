var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var eventsEnum_exports = {};
__export(eventsEnum_exports, {
  default: () => eventsEnum_default
});
var eventsEnum_default = {
  CONNECTION: "connection",
  GET_CARDS: "get_cards",
  GET_VOTING_CARD: "get_voting_card",
  DISCONNECT: "disconnect",
  USER_DISCONNECTED: "user_disconnected",
  MESSAGE: "message",
  NEW_CLIENT: "new_client",
  REGISTER: "register",
  GET_CONNECTED_CLIENTS: "get_connected_clients",
  CONNECTED_CLIENTS: "connected_clients",
  SET_VOTING_CARD: "set_voting_card",
  NEW_VOTING_CARD: "new_voting_card",
  VOTE: "vote",
  UPDATE_CARDS: "update_cards",
  USER_VOTED: "user_voted",
  UPDATE_USERS: "update_users",
  ALL_USERS_VOTED: "all_users_voted",
  SHOW_VOTES: "show_votes",
  NOTIFY_SHOW_VOTES: "notify_show_votes"
};
module.exports = __toCommonJS(eventsEnum_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=eventsEnum.js.map
