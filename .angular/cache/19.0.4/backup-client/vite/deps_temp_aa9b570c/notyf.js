import "./chunk-WDMUDEB6.js";

// node_modules/notyf/notyf.es.js
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var NotyfNotification = (
  /** @class */
  function() {
    function NotyfNotification2(options) {
      this.options = options;
      this.listeners = {};
    }
    NotyfNotification2.prototype.on = function(eventType, cb) {
      var callbacks = this.listeners[eventType] || [];
      this.listeners[eventType] = callbacks.concat([cb]);
    };
    NotyfNotification2.prototype.triggerEvent = function(eventType, event) {
      var _this = this;
      var callbacks = this.listeners[eventType] || [];
      callbacks.forEach(function(cb) {
        return cb({
          target: _this,
          event
        });
      });
    };
    return NotyfNotification2;
  }()
);
var NotyfArrayEvent;
(function(NotyfArrayEvent2) {
  NotyfArrayEvent2[NotyfArrayEvent2["Add"] = 0] = "Add";
  NotyfArrayEvent2[NotyfArrayEvent2["Remove"] = 1] = "Remove";
})(NotyfArrayEvent || (NotyfArrayEvent = {}));
var NotyfArray = (
  /** @class */
  function() {
    function NotyfArray2() {
      this.notifications = [];
    }
    NotyfArray2.prototype.push = function(elem) {
      this.notifications.push(elem);
      this.updateFn(elem, NotyfArrayEvent.Add, this.notifications);
    };
    NotyfArray2.prototype.splice = function(index, num) {
      var elem = this.notifications.splice(index, num)[0];
      this.updateFn(elem, NotyfArrayEvent.Remove, this.notifications);
      return elem;
    };
    NotyfArray2.prototype.indexOf = function(elem) {
      return this.notifications.indexOf(elem);
    };
    NotyfArray2.prototype.onUpdate = function(fn) {
      this.updateFn = fn;
    };
    return NotyfArray2;
  }()
);
var NotyfEvent;
(function(NotyfEvent2) {
  NotyfEvent2["Dismiss"] = "dismiss";
  NotyfEvent2["Click"] = "click";
})(NotyfEvent || (NotyfEvent = {}));
var DEFAULT_OPTIONS = {
  types: [{
    type: "success",
    className: "notyf__toast--success",
    backgroundColor: "#3dc763",
    icon: {
      className: "notyf__icon--success",
      tagName: "i"
    }
  }, {
    type: "error",
    className: "notyf__toast--error",
    backgroundColor: "#ed3d3d",
    icon: {
      className: "notyf__icon--error",
      tagName: "i"
    }
  }],
  duration: 2e3,
  ripple: true,
  position: {
    x: "right",
    y: "bottom"
  },
  dismissible: false
};
var NotyfView = (
  /** @class */
  function() {
    function NotyfView2() {
      this.notifications = [];
      this.events = {};
      this.X_POSITION_FLEX_MAP = {
        left: "flex-start",
        center: "center",
        right: "flex-end"
      };
      this.Y_POSITION_FLEX_MAP = {
        top: "flex-start",
        center: "center",
        bottom: "flex-end"
      };
      var docFrag = document.createDocumentFragment();
      var notyfContainer = this._createHTMLElement({
        tagName: "div",
        className: "notyf"
      });
      docFrag.appendChild(notyfContainer);
      document.body.appendChild(docFrag);
      this.container = notyfContainer;
      this.animationEndEventName = this._getAnimationEndEventName();
      this._createA11yContainer();
    }
    NotyfView2.prototype.on = function(event, cb) {
      var _a;
      this.events = __assign(__assign({}, this.events), (_a = {}, _a[event] = cb, _a));
    };
    NotyfView2.prototype.update = function(notification, type) {
      if (type === NotyfArrayEvent.Add) {
        this.addNotification(notification);
      } else if (type === NotyfArrayEvent.Remove) {
        this.removeNotification(notification);
      }
    };
    NotyfView2.prototype.removeNotification = function(notification) {
      var _this = this;
      var renderedNotification = this._popRenderedNotification(notification);
      var node;
      if (!renderedNotification) {
        return;
      }
      node = renderedNotification.node;
      node.classList.add("notyf__toast--disappear");
      var handleEvent;
      node.addEventListener(this.animationEndEventName, handleEvent = function(event) {
        if (event.target === node) {
          node.removeEventListener(_this.animationEndEventName, handleEvent);
          _this.container.removeChild(node);
        }
      });
    };
    NotyfView2.prototype.addNotification = function(notification) {
      var node = this._renderNotification(notification);
      this.notifications.push({
        notification,
        node
      });
      this._announce(notification.options.message || "Notification");
    };
    NotyfView2.prototype._renderNotification = function(notification) {
      var _a;
      var card = this._buildNotificationCard(notification);
      var className = notification.options.className;
      if (className) {
        (_a = card.classList).add.apply(_a, className.split(" "));
      }
      this.container.appendChild(card);
      return card;
    };
    NotyfView2.prototype._popRenderedNotification = function(notification) {
      var idx = -1;
      for (var i = 0; i < this.notifications.length && idx < 0; i++) {
        if (this.notifications[i].notification === notification) {
          idx = i;
        }
      }
      if (idx !== -1) {
        return this.notifications.splice(idx, 1)[0];
      }
      return;
    };
    NotyfView2.prototype.getXPosition = function(options) {
      var _a;
      return ((_a = options === null || options === void 0 ? void 0 : options.position) === null || _a === void 0 ? void 0 : _a.x) || "right";
    };
    NotyfView2.prototype.getYPosition = function(options) {
      var _a;
      return ((_a = options === null || options === void 0 ? void 0 : options.position) === null || _a === void 0 ? void 0 : _a.y) || "bottom";
    };
    NotyfView2.prototype.adjustContainerAlignment = function(options) {
      var align = this.X_POSITION_FLEX_MAP[this.getXPosition(options)];
      var justify = this.Y_POSITION_FLEX_MAP[this.getYPosition(options)];
      var style = this.container.style;
      style.setProperty("justify-content", justify);
      style.setProperty("align-items", align);
    };
    NotyfView2.prototype._buildNotificationCard = function(notification) {
      var _this = this;
      var options = notification.options;
      var iconOpts = options.icon;
      this.adjustContainerAlignment(options);
      var notificationElem = this._createHTMLElement({
        tagName: "div",
        className: "notyf__toast"
      });
      var ripple = this._createHTMLElement({
        tagName: "div",
        className: "notyf__ripple"
      });
      var wrapper = this._createHTMLElement({
        tagName: "div",
        className: "notyf__wrapper"
      });
      var message = this._createHTMLElement({
        tagName: "div",
        className: "notyf__message"
      });
      message.innerHTML = options.message || "";
      var mainColor = options.background || options.backgroundColor;
      if (iconOpts) {
        var iconContainer = this._createHTMLElement({
          tagName: "div",
          className: "notyf__icon"
        });
        if (typeof iconOpts === "string" || iconOpts instanceof String) iconContainer.innerHTML = new String(iconOpts).valueOf();
        if (typeof iconOpts === "object") {
          var _a = iconOpts.tagName, tagName = _a === void 0 ? "i" : _a, className_1 = iconOpts.className, text = iconOpts.text, _b = iconOpts.color, color = _b === void 0 ? mainColor : _b;
          var iconElement = this._createHTMLElement({
            tagName,
            className: className_1,
            text
          });
          if (color) iconElement.style.color = color;
          iconContainer.appendChild(iconElement);
        }
        wrapper.appendChild(iconContainer);
      }
      wrapper.appendChild(message);
      notificationElem.appendChild(wrapper);
      if (mainColor) {
        if (options.ripple) {
          ripple.style.background = mainColor;
          notificationElem.appendChild(ripple);
        } else {
          notificationElem.style.background = mainColor;
        }
      }
      if (options.dismissible) {
        var dismissWrapper = this._createHTMLElement({
          tagName: "div",
          className: "notyf__dismiss"
        });
        var dismissButton = this._createHTMLElement({
          tagName: "button",
          className: "notyf__dismiss-btn"
        });
        dismissWrapper.appendChild(dismissButton);
        wrapper.appendChild(dismissWrapper);
        notificationElem.classList.add("notyf__toast--dismissible");
        dismissButton.addEventListener("click", function(event) {
          var _a2, _b2;
          (_b2 = (_a2 = _this.events)[NotyfEvent.Dismiss]) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, {
            target: notification,
            event
          });
          event.stopPropagation();
        });
      }
      notificationElem.addEventListener("click", function(event) {
        var _a2, _b2;
        return (_b2 = (_a2 = _this.events)[NotyfEvent.Click]) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, {
          target: notification,
          event
        });
      });
      var className = this.getYPosition(options) === "top" ? "upper" : "lower";
      notificationElem.classList.add("notyf__toast--" + className);
      return notificationElem;
    };
    NotyfView2.prototype._createHTMLElement = function(_a) {
      var tagName = _a.tagName, className = _a.className, text = _a.text;
      var elem = document.createElement(tagName);
      if (className) {
        elem.className = className;
      }
      elem.textContent = text || null;
      return elem;
    };
    NotyfView2.prototype._createA11yContainer = function() {
      var a11yContainer = this._createHTMLElement({
        tagName: "div",
        className: "notyf-announcer"
      });
      a11yContainer.setAttribute("aria-atomic", "true");
      a11yContainer.setAttribute("aria-live", "polite");
      a11yContainer.style.border = "0";
      a11yContainer.style.clip = "rect(0 0 0 0)";
      a11yContainer.style.height = "1px";
      a11yContainer.style.margin = "-1px";
      a11yContainer.style.overflow = "hidden";
      a11yContainer.style.padding = "0";
      a11yContainer.style.position = "absolute";
      a11yContainer.style.width = "1px";
      a11yContainer.style.outline = "0";
      document.body.appendChild(a11yContainer);
      this.a11yContainer = a11yContainer;
    };
    NotyfView2.prototype._announce = function(message) {
      var _this = this;
      this.a11yContainer.textContent = "";
      setTimeout(function() {
        _this.a11yContainer.textContent = message;
      }, 100);
    };
    NotyfView2.prototype._getAnimationEndEventName = function() {
      var el = document.createElement("_fake");
      var transitions = {
        MozTransition: "animationend",
        OTransition: "oAnimationEnd",
        WebkitTransition: "webkitAnimationEnd",
        transition: "animationend"
      };
      var t;
      for (t in transitions) {
        if (el.style[t] !== void 0) {
          return transitions[t];
        }
      }
      return "animationend";
    };
    return NotyfView2;
  }()
);
var Notyf = (
  /** @class */
  function() {
    function Notyf2(opts) {
      var _this = this;
      this.dismiss = this._removeNotification;
      this.notifications = new NotyfArray();
      this.view = new NotyfView();
      var types = this.registerTypes(opts);
      this.options = __assign(__assign({}, DEFAULT_OPTIONS), opts);
      this.options.types = types;
      this.notifications.onUpdate(function(elem, type) {
        return _this.view.update(elem, type);
      });
      this.view.on(NotyfEvent.Dismiss, function(_a) {
        var target = _a.target, event = _a.event;
        _this._removeNotification(target);
        target["triggerEvent"](NotyfEvent.Dismiss, event);
      });
      this.view.on(NotyfEvent.Click, function(_a) {
        var target = _a.target, event = _a.event;
        return target["triggerEvent"](NotyfEvent.Click, event);
      });
    }
    Notyf2.prototype.error = function(payload) {
      var options = this.normalizeOptions("error", payload);
      return this.open(options);
    };
    Notyf2.prototype.success = function(payload) {
      var options = this.normalizeOptions("success", payload);
      return this.open(options);
    };
    Notyf2.prototype.open = function(options) {
      var defaultOpts = this.options.types.find(function(_a) {
        var type = _a.type;
        return type === options.type;
      }) || {};
      var config = __assign(__assign({}, defaultOpts), options);
      this.assignProps(["ripple", "position", "dismissible"], config);
      var notification = new NotyfNotification(config);
      this._pushNotification(notification);
      return notification;
    };
    Notyf2.prototype.dismissAll = function() {
      while (this.notifications.splice(0, 1)) ;
    };
    Notyf2.prototype.assignProps = function(props, config) {
      var _this = this;
      props.forEach(function(prop) {
        config[prop] = config[prop] == null ? _this.options[prop] : config[prop];
      });
    };
    Notyf2.prototype._pushNotification = function(notification) {
      var _this = this;
      this.notifications.push(notification);
      var duration = notification.options.duration !== void 0 ? notification.options.duration : this.options.duration;
      if (duration) {
        setTimeout(function() {
          return _this._removeNotification(notification);
        }, duration);
      }
    };
    Notyf2.prototype._removeNotification = function(notification) {
      var index = this.notifications.indexOf(notification);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    };
    Notyf2.prototype.normalizeOptions = function(type, payload) {
      var options = {
        type
      };
      if (typeof payload === "string") {
        options.message = payload;
      } else if (typeof payload === "object") {
        options = __assign(__assign({}, options), payload);
      }
      return options;
    };
    Notyf2.prototype.registerTypes = function(opts) {
      var incomingTypes = (opts && opts.types || []).slice();
      var finalDefaultTypes = DEFAULT_OPTIONS.types.map(function(defaultType) {
        var userTypeIdx = -1;
        incomingTypes.forEach(function(t, idx) {
          if (t.type === defaultType.type) userTypeIdx = idx;
        });
        var userType = userTypeIdx !== -1 ? incomingTypes.splice(userTypeIdx, 1)[0] : {};
        return __assign(__assign({}, defaultType), userType);
      });
      return finalDefaultTypes.concat(incomingTypes);
    };
    return Notyf2;
  }()
);
export {
  DEFAULT_OPTIONS,
  Notyf,
  NotyfArray,
  NotyfArrayEvent,
  NotyfEvent,
  NotyfNotification,
  NotyfView
};
/*! Bundled license information:

notyf/notyf.es.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=notyf.js.map
