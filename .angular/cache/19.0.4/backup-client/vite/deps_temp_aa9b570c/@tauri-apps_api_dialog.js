import {
  invokeTauriCommand
} from "./chunk-KKSA2PV6.js";
import "./chunk-Q4VBDLF2.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// node_modules/@tauri-apps/api/dialog.js
function open() {
  return __async(this, arguments, function* (options = {}) {
    if (typeof options === "object") {
      Object.freeze(options);
    }
    return invokeTauriCommand({
      __tauriModule: "Dialog",
      message: {
        cmd: "openDialog",
        options
      }
    });
  });
}
function save() {
  return __async(this, arguments, function* (options = {}) {
    if (typeof options === "object") {
      Object.freeze(options);
    }
    return invokeTauriCommand({
      __tauriModule: "Dialog",
      message: {
        cmd: "saveDialog",
        options
      }
    });
  });
}
function message(message2, options) {
  return __async(this, null, function* () {
    var _a, _b;
    const opts = typeof options === "string" ? {
      title: options
    } : options;
    return invokeTauriCommand({
      __tauriModule: "Dialog",
      message: {
        cmd: "messageDialog",
        message: message2.toString(),
        title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
        type: opts === null || opts === void 0 ? void 0 : opts.type,
        buttonLabel: (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()
      }
    });
  });
}
function ask(message2, options) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    const opts = typeof options === "string" ? {
      title: options
    } : options;
    return invokeTauriCommand({
      __tauriModule: "Dialog",
      message: {
        cmd: "askDialog",
        message: message2.toString(),
        title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
        type: opts === null || opts === void 0 ? void 0 : opts.type,
        buttonLabels: [(_c = (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "Yes", (_e = (_d = opts === null || opts === void 0 ? void 0 : opts.cancelLabel) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "No"]
      }
    });
  });
}
function confirm(message2, options) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    const opts = typeof options === "string" ? {
      title: options
    } : options;
    return invokeTauriCommand({
      __tauriModule: "Dialog",
      message: {
        cmd: "confirmDialog",
        message: message2.toString(),
        title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
        type: opts === null || opts === void 0 ? void 0 : opts.type,
        buttonLabels: [(_c = (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "Ok", (_e = (_d = opts === null || opts === void 0 ? void 0 : opts.cancelLabel) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "Cancel"]
      }
    });
  });
}
export {
  ask,
  confirm,
  message,
  open,
  save
};
//# sourceMappingURL=@tauri-apps_api_dialog.js.map
