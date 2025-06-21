import {
  invokeTauriCommand
} from "./chunk-KKSA2PV6.js";
import {
  transformCallback
} from "./chunk-Q4VBDLF2.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// node_modules/@tauri-apps/api/helpers/event.js
function _unlisten(event, eventId) {
  return __async(this, null, function* () {
    return invokeTauriCommand({
      __tauriModule: "Event",
      message: {
        cmd: "unlisten",
        event,
        eventId
      }
    });
  });
}
function emit(event, windowLabel, payload) {
  return __async(this, null, function* () {
    yield invokeTauriCommand({
      __tauriModule: "Event",
      message: {
        cmd: "emit",
        event,
        windowLabel,
        payload
      }
    });
  });
}
function listen(event, windowLabel, handler) {
  return __async(this, null, function* () {
    return invokeTauriCommand({
      __tauriModule: "Event",
      message: {
        cmd: "listen",
        event,
        windowLabel,
        handler: transformCallback(handler)
      }
    }).then((eventId) => {
      return () => __async(this, null, function* () {
        return _unlisten(event, eventId);
      });
    });
  });
}
function once(event, windowLabel, handler) {
  return __async(this, null, function* () {
    return listen(event, windowLabel, (eventData) => {
      handler(eventData);
      _unlisten(event, eventData.id).catch(() => {
      });
    });
  });
}

// node_modules/@tauri-apps/api/event.js
var TauriEvent;
(function(TauriEvent2) {
  TauriEvent2["WINDOW_RESIZED"] = "tauri://resize";
  TauriEvent2["WINDOW_MOVED"] = "tauri://move";
  TauriEvent2["WINDOW_CLOSE_REQUESTED"] = "tauri://close-requested";
  TauriEvent2["WINDOW_CREATED"] = "tauri://window-created";
  TauriEvent2["WINDOW_DESTROYED"] = "tauri://destroyed";
  TauriEvent2["WINDOW_FOCUS"] = "tauri://focus";
  TauriEvent2["WINDOW_BLUR"] = "tauri://blur";
  TauriEvent2["WINDOW_SCALE_FACTOR_CHANGED"] = "tauri://scale-change";
  TauriEvent2["WINDOW_THEME_CHANGED"] = "tauri://theme-changed";
  TauriEvent2["WINDOW_FILE_DROP"] = "tauri://file-drop";
  TauriEvent2["WINDOW_FILE_DROP_HOVER"] = "tauri://file-drop-hover";
  TauriEvent2["WINDOW_FILE_DROP_CANCELLED"] = "tauri://file-drop-cancelled";
  TauriEvent2["MENU"] = "tauri://menu";
  TauriEvent2["CHECK_UPDATE"] = "tauri://update";
  TauriEvent2["UPDATE_AVAILABLE"] = "tauri://update-available";
  TauriEvent2["INSTALL_UPDATE"] = "tauri://update-install";
  TauriEvent2["STATUS_UPDATE"] = "tauri://update-status";
  TauriEvent2["DOWNLOAD_PROGRESS"] = "tauri://update-download-progress";
})(TauriEvent || (TauriEvent = {}));
function listen2(event, handler) {
  return __async(this, null, function* () {
    return listen(event, null, handler);
  });
}
function once2(event, handler) {
  return __async(this, null, function* () {
    return once(event, null, handler);
  });
}
function emit2(event, payload) {
  return __async(this, null, function* () {
    return emit(event, void 0, payload);
  });
}
export {
  TauriEvent,
  emit2 as emit,
  listen2 as listen,
  once2 as once
};
//# sourceMappingURL=@tauri-apps_api_event.js.map
