var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// lib/types.js
var require_types = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.HandyFirmwareStatus = exports.HsspState = exports.HsspSetupResult = exports.SetHdspResult = exports.HampState = exports.SetHampStateResult = exports.SetModeResult = exports.GenericResult = exports.HandyMode = undefined;
  var HandyMode;
  (function(HandyMode2) {
    HandyMode2[HandyMode2["unknown"] = -1] = "unknown";
    HandyMode2[HandyMode2["hamp"] = 0] = "hamp";
    HandyMode2[HandyMode2["hssp"] = 1] = "hssp";
    HandyMode2[HandyMode2["hdsp"] = 2] = "hdsp";
  })(HandyMode = exports.HandyMode || (exports.HandyMode = {}));
  var GenericResult;
  (function(GenericResult2) {
    GenericResult2[GenericResult2["error"] = -1] = "error";
    GenericResult2[GenericResult2["success"] = 0] = "success";
  })(GenericResult = exports.GenericResult || (exports.GenericResult = {}));
  var SetModeResult;
  (function(SetModeResult2) {
    SetModeResult2[SetModeResult2["error"] = -1] = "error";
    SetModeResult2[SetModeResult2["successNewMode"] = 0] = "successNewMode";
    SetModeResult2[SetModeResult2["successSameMode"] = 1] = "successSameMode";
  })(SetModeResult = exports.SetModeResult || (exports.SetModeResult = {}));
  var SetHampStateResult;
  (function(SetHampStateResult2) {
    SetHampStateResult2[SetHampStateResult2["error"] = -1] = "error";
    SetHampStateResult2[SetHampStateResult2["successNewState"] = 0] = "successNewState";
    SetHampStateResult2[SetHampStateResult2["successSameState"] = 1] = "successSameState";
  })(SetHampStateResult = exports.SetHampStateResult || (exports.SetHampStateResult = {}));
  var HampState;
  (function(HampState2) {
    HampState2[HampState2["stopped"] = 1] = "stopped";
    HampState2[HampState2["moving"] = 2] = "moving";
  })(HampState = exports.HampState || (exports.HampState = {}));
  var SetHdspResult;
  (function(SetHdspResult2) {
    SetHdspResult2[SetHdspResult2["error"] = -3] = "error";
    SetHdspResult2[SetHdspResult2["successPositionReached"] = 0] = "successPositionReached";
    SetHdspResult2[SetHdspResult2["successPositionNotReached"] = 1] = "successPositionNotReached";
    SetHdspResult2[SetHdspResult2["successAlreadyAtPosition"] = 2] = "successAlreadyAtPosition";
    SetHdspResult2[SetHdspResult2["successInterrupted"] = 3] = "successInterrupted";
  })(SetHdspResult = exports.SetHdspResult || (exports.SetHdspResult = {}));
  var HsspSetupResult;
  (function(HsspSetupResult2) {
    HsspSetupResult2[HsspSetupResult2["usingCached"] = 0] = "usingCached";
    HsspSetupResult2[HsspSetupResult2["downloaded"] = 1] = "downloaded";
  })(HsspSetupResult = exports.HsspSetupResult || (exports.HsspSetupResult = {}));
  var HsspState;
  (function(HsspState2) {
    HsspState2[HsspState2["needSetup"] = 2] = "needSetup";
    HsspState2[HsspState2["stopped"] = 3] = "stopped";
    HsspState2[HsspState2["playing"] = 4] = "playing";
  })(HsspState = exports.HsspState || (exports.HsspState = {}));
  var HandyFirmwareStatus;
  (function(HandyFirmwareStatus2) {
    HandyFirmwareStatus2[HandyFirmwareStatus2["upToDate"] = 0] = "upToDate";
    HandyFirmwareStatus2[HandyFirmwareStatus2["updateRequired"] = 1] = "updateRequired";
    HandyFirmwareStatus2[HandyFirmwareStatus2["updateAvailable"] = 2] = "updateAvailable";
  })(HandyFirmwareStatus = exports.HandyFirmwareStatus || (exports.HandyFirmwareStatus = {}));
});

// lib/Handy.js
var require_Handy = __commonJS((exports) => {
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var types_1 = require_types();
  var baseUrl = "https://www.handyfeeling.com/api/handy/v2/";

  class Handy {
    constructor(verbose = false) {
      this.connected = false;
      this.info = undefined;
      this.currentMode = types_1.HandyMode.unknown;
      this.hampState = types_1.HampState.stopped;
      this.hampVelocity = 0;
      this.hdspPosition = 0;
      this.hsspState = types_1.HsspState.needSetup;
      this.hsspLoop = false;
      this.hsspPreparedUrl = "";
      this.hstpTime = 0;
      this.hstpOffset = 0;
      this.hstpRtd = 0;
      this.estimatedServerTimeOffset = 0;
      this.slideMin = 0;
      this.slideMax = 0;
      this.slidePositionAbsolute = 0;
      this._connectionKey = "";
      this.verbose = verbose;
    }
    get connectionKey() {
      if (this._connectionKey === "" && typeof window !== "undefined") {
        this._connectionKey = localStorage.getItem("connectionKey") || "";
      }
      return this._connectionKey;
    }
    set connectionKey(connectionKey) {
      this._connectionKey = connectionKey;
      if (typeof window !== "undefined") {
        localStorage.setItem("connectionKey", connectionKey);
      } else
        throw new Error("Can only write connection key to localStorage on client-side!");
    }
    getMode() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("mode");
        this.currentMode = json.mode;
        this.connected = true;
        return json.mode;
      });
    }
    setMode(mode) {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.putJson("mode", { mode });
        this.currentMode = mode;
        this.connected = true;
        return json.result;
      });
    }
    getConnected() {
      return __awaiter(this, undefined, undefined, function* () {
        try {
          const json = yield this.getJson("connected");
          this.connected = !!json.connected;
          return !!json.connected;
        } catch (_a) {
          return false;
        }
      });
    }
    getInfo() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("info");
        this.connected = true;
        return json;
      });
    }
    getSettings() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("settings");
        this.slideMin = json.slideMin;
        this.slideMax = json.slideMax;
        this.connected = true;
        return json;
      });
    }
    getStatus() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("status");
        this.currentMode = json.mode;
        switch (json.mode) {
          case 0:
            this.hampState = json.state;
            break;
          case 1:
            this.hsspState = json.state;
            break;
        }
        this.connected = true;
        return json;
      });
    }
    setHampStart() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hamp)
          yield this.setMode(types_1.HandyMode.hamp);
        const json = yield this.putJson("hamp/start", {});
        this.hampState = types_1.HampState.moving;
        this.connected = true;
        return json.result;
      });
    }
    setHampStop() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hamp)
          yield this.setMode(types_1.HandyMode.hamp);
        const json = yield this.putJson("hamp/stop", {});
        this.hampState = types_1.HampState.stopped;
        this.connected = true;
        return json.result;
      });
    }
    getHampState() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hamp)
          yield this.setMode(types_1.HandyMode.hamp);
        const json = yield this.getJson("hamp/state");
        this.hampState = json.state;
        this.connected = true;
        return json;
      });
    }
    getHampVelocity() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hamp)
          yield this.setMode(types_1.HandyMode.hamp);
        const json = yield this.getJson("hamp/velocity");
        this.hampVelocity = json.velocity;
        this.connected = true;
        return json.velocity;
      });
    }
    setHampVelocity(velocity) {
      return __awaiter(this, undefined, undefined, function* () {
        velocity = Math.min(100, Math.max(0, velocity));
        if (this.currentMode !== types_1.HandyMode.hamp || this.hampState == types_1.HampState.stopped)
          yield this.setHampStart();
        const json = yield this.putJson("hamp/velocity", { velocity });
        this.hampVelocity = velocity;
        this.connected = true;
        return json.result;
      });
    }
    setHdspXaVa(positionAbsolute, velocityAbsolute, stopOnTarget) {
      return __awaiter(this, undefined, undefined, function* () {
        positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
        velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));
        if (this.currentMode !== types_1.HandyMode.hdsp)
          yield this.setMode(types_1.HandyMode.hdsp);
        const json = yield this.putJson("hdsp/xava", {
          position: positionAbsolute,
          velocity: velocityAbsolute,
          stopOnTarget: !!stopOnTarget
        });
        this.hdspPosition = positionAbsolute / 110;
        this.connected = true;
        return json.result;
      });
    }
    setHdspXpVa(positionPercentage, velocityAbsolute, stopOnTarget) {
      return __awaiter(this, undefined, undefined, function* () {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));
        if (this.currentMode !== types_1.HandyMode.hdsp)
          yield this.setMode(types_1.HandyMode.hdsp);
        const json = yield this.putJson("hdsp/xpva", {
          position: positionPercentage,
          velocity: velocityAbsolute,
          stopOnTarget: !!stopOnTarget
        });
        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
      });
    }
    setHdspXpVp(positionPercentage, velocityPercentage, stopOnTarget) {
      return __awaiter(this, undefined, undefined, function* () {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        velocityPercentage = Math.min(100, Math.max(-100, velocityPercentage));
        if (this.currentMode !== types_1.HandyMode.hdsp)
          yield this.setMode(types_1.HandyMode.hdsp);
        const json = yield this.putJson("hdsp/xpvp", {
          position: positionPercentage,
          velocity: velocityPercentage,
          stopOnTarget: !!stopOnTarget
        });
        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
      });
    }
    setHdspXaT(positionAbsolute, durationMilliseconds, stopOnTarget) {
      return __awaiter(this, undefined, undefined, function* () {
        positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
        durationMilliseconds = Math.max(0, durationMilliseconds);
        if (this.currentMode !== types_1.HandyMode.hdsp)
          yield this.setMode(types_1.HandyMode.hdsp);
        const json = yield this.putJson("hdsp/xat", {
          position: positionAbsolute,
          duration: Math.round(durationMilliseconds),
          stopOnTarget: !!stopOnTarget
        });
        this.hdspPosition = positionAbsolute / 110;
        this.connected = true;
        return json.result;
      });
    }
    setHdspXpT(positionPercentage, durationMilliseconds, stopOnTarget) {
      return __awaiter(this, undefined, undefined, function* () {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        durationMilliseconds = Math.max(0, durationMilliseconds);
        if (this.currentMode !== types_1.HandyMode.hdsp)
          yield this.setMode(types_1.HandyMode.hdsp);
        const json = yield this.putJson("hdsp/xpt", {
          position: positionPercentage,
          duration: Math.round(durationMilliseconds),
          stopOnTarget: !!stopOnTarget
        });
        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
      });
    }
    setHsspPlay(playbackPosition, serverTime) {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        if (this.hsspState == types_1.HsspState.needSetup)
          throw new Error("Need to setup the Handy with a script before calling HSSP Play!");
        const json = yield this.putJson("hssp/play", {
          estimatedServerTime: Math.round(serverTime || new Date().valueOf() + this.hstpOffset),
          startTime: Math.round(playbackPosition || 0)
        });
        this.hsspState = types_1.HsspState.playing;
        this.connected = true;
        return json.result;
      });
    }
    setHsspStop() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        if (this.hsspState == types_1.HsspState.needSetup)
          throw new Error("Need to setup the Handy with a script before calling HSSP Stop!");
        const json = yield this.putJson("hssp/stop", {});
        this.hsspState = types_1.HsspState.stopped;
        this.connected = true;
        return json.result;
      });
    }
    setHsspSetup(url, sha256) {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        const data = {
          url: encodeURI(url)
        };
        if (sha256)
          data.sha256 = sha256;
        const json = yield this.putJson("hssp/setup", data);
        this.hsspPreparedUrl = url;
        this.connected = true;
        return json.result;
      });
    }
    getHsspLoop() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        const json = yield this.getJson("hssp/loop");
        this.hsspLoop = json.activated;
        this.connected = true;
        return json.activated;
      });
    }
    setHsspLoop(loop) {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        const json = yield this.putJson("hssp/loop", {
          activated: loop
        });
        this.hsspLoop = loop;
        this.connected = true;
        return json.result;
      });
    }
    getHsspState() {
      return __awaiter(this, undefined, undefined, function* () {
        if (this.currentMode !== types_1.HandyMode.hssp)
          yield this.setMode(types_1.HandyMode.hssp);
        const json = yield this.getJson("hssp/state");
        this.hsspState = json.state;
        this.connected = true;
        return json.state;
      });
    }
    getHstpTime() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("hstp/time");
        this.hstpTime = json.time;
        this.connected = true;
        return json.time;
      });
    }
    getHstpOffset() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("hstp/offset");
        this.hstpOffset = json.offset;
        this.connected = true;
        return json.offset;
      });
    }
    setHstpoffset(offset) {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.putJson("hstp/offset", {
          offset: Math.round(offset)
        });
        this.hstpOffset = offset;
        this.connected = true;
        return json.result;
      });
    }
    getHstpRtd() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("hstp/rtd");
        this.hstpRtd = json.rtd;
        this.connected = true;
        return json.rtd;
      });
    }
    getHstpSync(syncCount = 30, outliers = 6) {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("hstp/sync", {
          syncCount: Math.round(syncCount).toString(),
          outliers: Math.round(outliers).toString()
        });
        this.hstpRtd = json.rtd;
        this.connected = true;
        return json;
      });
    }
    getSlideSettings() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("slide");
        this.slideMin = json.min;
        this.slideMax = json.max;
        this.connected = true;
        return json;
      });
    }
    getSlidePositionAbsolute() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("slide/position/absolute");
        this.slidePositionAbsolute = json.position;
        this.connected = true;
        return json.position;
      });
    }
    setSlideSettings(min, max) {
      return __awaiter(this, undefined, undefined, function* () {
        if (min > max) {
          const temp = max;
          max = min;
          min = temp;
        }
        const json = yield this.putJson("slide", { min, max });
        this.slideMin = min;
        this.slideMax = max;
        this.connected = true;
        return json.result;
      });
    }
    setSlideMin(min, fixed = false) {
      return __awaiter(this, undefined, undefined, function* () {
        min = Math.max(0, Math.min(100, min));
        const json = yield this.putJson("slide", {
          min,
          fixed: fixed || false
        });
        const offset = min - this.slideMin;
        this.slideMin = min;
        if (fixed) {
          this.slideMax += offset;
          this.slideMax = Math.max(0, Math.min(100, this.slideMax));
        }
        this.connected = true;
        return json.result;
      });
    }
    setSlideMax(max, fixed = false) {
      return __awaiter(this, undefined, undefined, function* () {
        max = Math.max(0, Math.min(100, max));
        const json = yield this.putJson("slide", {
          max,
          fixed: fixed || false
        });
        const offset = max - this.slideMax;
        this.slideMax = max;
        if (fixed) {
          this.slideMin += offset;
          this.slideMin = Math.max(0, Math.min(100, this.slideMin));
        }
        this.connected = true;
        return json.result;
      });
    }
    getServerTime() {
      return __awaiter(this, undefined, undefined, function* () {
        const json = yield this.getJson("servertime");
        return json.serverTime;
      });
    }
    getServerTimeOffset(trips = 30, onProgress) {
      return __awaiter(this, undefined, undefined, function* () {
        yield this.getServerTime();
        let offsets = [];
        for (let i = 0;i < trips; i++) {
          const startTime = new Date().valueOf();
          const serverTime = yield this.getServerTime();
          const endTime = new Date().valueOf();
          const rtd = endTime - startTime;
          const estimatedServerTime = serverTime + rtd / 2;
          const offset = estimatedServerTime - endTime;
          offsets.push(offset);
          if (onProgress)
            onProgress(i / trips);
        }
        const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
        const errors = offsets.map((offset) => Math.pow(offset - mean, 2));
        const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
        offsets = offsets.filter((offset) => Math.abs(offset - mean) < sd);
        const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
        this.estimatedServerTimeOffset = offsetAggregate;
        return this.estimatedServerTimeOffset;
      });
    }
    enforceConnectionKey() {
      if (!this.connectionKey) {
        this.connected = false;
        throw new Error("connection key not set");
      }
    }
    getUrl(cmd) {
      return baseUrl + cmd;
    }
    catchHttpErrors(response) {
      return __awaiter(this, undefined, undefined, function* () {
        if (response.status === 400)
          throw new Error("Bad request");
        if (response.status === 502) {
          this.connected = false;
          throw new Error("Machine not connected");
        }
        if (response.status === 504) {
          this.connected = false;
          throw new Error("Machine timeout");
        }
        const json = yield response.json();
        if (json.result === -1)
          throw new Error("Unknown response error");
        if (json.error) {
          if (json.error.code == 1000 || json.error.code == 1001 || json.error.code == 1002) {
            this.connected = false;
          } else if (json.error.code) {
            this.connected = true;
          }
          throw new Error(json.error.message);
        }
        return json;
      });
    }
    getJson(path, params) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        let url = this.getUrl(path);
        if (params) {
          url += "?" + Object.keys(params).map((key) => key + "=" + params[key]).join("&");
        }
        if (this.verbose)
          console.group("GET " + url);
        const response = yield fetch(url, {
          method: "GET",
          headers: {
            "X-Connection-Key": this.connectionKey
          }
        });
        const json = yield this.catchHttpErrors(response);
        if (this.verbose) {
          console.log("Response for GET " + url + ": ", json);
          console.groupEnd();
        }
        return json;
      });
    }
    putJson(path, data) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl(path);
        if (this.verbose)
          console.group("PUT " + url, data);
        const response = yield fetch(url, {
          method: "PUT",
          headers: {
            "X-Connection-Key": this.connectionKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const json = yield this.catchHttpErrors(response);
        if (this.verbose) {
          console.log("Response for PUT " + url + ": ", json);
          console.groupEnd();
        }
        return json;
      });
    }
  }
  exports.default = Handy;
});

// lib/HandyLegacy.js
var require_HandyLegacy = __commonJS((exports) => {
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var baseUrl = "https://www.handyfeeling.com/api/v1/";

  class Handy {
    constructor(connectionKey) {
      if (connectionKey) {
        this._connectionKey = connectionKey;
        localStorage.setItem("connectionKey", connectionKey);
      } else {
        const storedConnectionKey = localStorage.getItem("connectionKey");
        if (storedConnectionKey)
          this._connectionKey = storedConnectionKey;
        else
          this._connectionKey = "";
      }
      this.serverTimeOffset = 0;
    }
    get connectionKey() {
      return this._connectionKey;
    }
    set connectionKey(connectionKey) {
      this._connectionKey = connectionKey;
      localStorage.setItem("connectionKey", connectionKey);
    }
    setMode(mode) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("setMode") + "?mode=" + mode;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    toggleMode(mode) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("toggleMode") + "?mode=" + mode;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    setSpeed(speed, absolute) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const type = absolute ? "mm/s" : "%";
        const url = this.getUrl("setSpeed") + "?speed=" + speed + "&type=" + type;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    setStroke(speed, absolute) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const type = absolute ? "mm" : "%";
        const url = this.getUrl("setStroke") + "?stroke=" + speed + "&type=" + type;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    setStrokeZone(min, max) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("setStrokeZone") + "?min=" + min + "&max=" + max;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    stepSpeed(directionUp) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("stepSpeed") + "?step=" + directionUp;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    stepStroke(directionUp) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("stepStroke") + "?step=" + directionUp;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    getVersion() {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("getVersion");
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    getSettings() {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("getSettings");
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    getStatus() {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("getStatus");
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    getServerTimeOffset(trips = 30, onProgress) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("getServerTime");
        yield (yield fetch(url)).json();
        let offsets = [];
        for (let i = 0;i < trips; i++) {
          const startTime = new Date().valueOf();
          const response = yield fetch(url);
          const json = yield response.json();
          const endTime = new Date().valueOf();
          const rtd = endTime - startTime;
          const estimatedServerTime = Number(json.serverTime) + rtd / 2;
          const offset = estimatedServerTime - endTime;
          offsets.push(offset);
          if (onProgress)
            onProgress(i / trips);
        }
        const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
        const errors = offsets.map((offset) => Math.pow(offset - mean, 2));
        const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
        offsets = offsets.filter((offset) => Math.abs(offset - mean) < sd);
        const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
        this.serverTimeOffset = offsetAggregate;
        return this.serverTimeOffset;
      });
    }
    syncPrepare(scriptUrl, name, size) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        let url = this.getUrl("syncPrepare") + "?url=" + scriptUrl + "&timeout=30000";
        if (name)
          url += "&name=" + name;
        if (size)
          url += "&size=" + size;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    syncPlay(play = true, time = 0) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const serverTime = Math.round(new Date().valueOf() + this.serverTimeOffset);
        const url = this.getUrl("syncPlay") + "?play=" + play + "&serverTime=" + serverTime + "&time=" + time;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    syncOffset(offset) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("syncOffset") + "?offset=" + offset;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    syncAdjustTimestamp(videoTimeSeconds, filter = 0.5) {
      return __awaiter(this, undefined, undefined, function* () {
        this.enforceConnectionKey();
        const url = this.getUrl("syncAdjustTimestamp") + "?currentTime=" + videoTimeSeconds * 1000 + "&serverTime=" + Math.round(new Date().valueOf() + this.serverTimeOffset) + "&filter=" + filter;
        const response = yield fetch(url);
        const json = yield response.json();
        if (json.error)
          throw json;
        return json;
      });
    }
    uploadCsv(csv, filename) {
      return __awaiter(this, undefined, undefined, function* () {
        const url = "https://www.handyfeeling.com/api/sync/upload";
        if (!filename)
          filename = "script_" + new Date().valueOf() + ".csv";
        const formData = new FormData;
        formData.append("syncFile", csv, filename);
        const response = yield fetch(url, {
          method: "post",
          body: formData
        });
        const newUrl = yield response.json();
        return newUrl;
      });
    }
    enforceConnectionKey() {
      if (!this.connectionKey)
        throw new Error("connection key not set");
    }
    getUrl(cmd) {
      return baseUrl + this.connectionKey + "/" + cmd;
    }
  }
  exports.default = Handy;
});

// lib/index.js
var require_lib = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.SetModeResult = exports.SetHdspResult = exports.SetHampStateResult = exports.HsspState = exports.HsspSetupResult = exports.HandyMode = exports.HandyFirmwareStatus = exports.HampState = exports.GenericResult = exports.HandyLegacy = undefined;
  var Handy_1 = __importDefault(require_Handy());
  var HandyLegacy_1 = __importDefault(require_HandyLegacy());
  exports.HandyLegacy = HandyLegacy_1.default;
  var types_1 = require_types();
  Object.defineProperty(exports, "GenericResult", { enumerable: true, get: function() {
    return types_1.GenericResult;
  } });
  Object.defineProperty(exports, "HampState", { enumerable: true, get: function() {
    return types_1.HampState;
  } });
  Object.defineProperty(exports, "HandyFirmwareStatus", { enumerable: true, get: function() {
    return types_1.HandyFirmwareStatus;
  } });
  Object.defineProperty(exports, "HandyMode", { enumerable: true, get: function() {
    return types_1.HandyMode;
  } });
  Object.defineProperty(exports, "HsspSetupResult", { enumerable: true, get: function() {
    return types_1.HsspSetupResult;
  } });
  Object.defineProperty(exports, "HsspState", { enumerable: true, get: function() {
    return types_1.HsspState;
  } });
  Object.defineProperty(exports, "SetHampStateResult", { enumerable: true, get: function() {
    return types_1.SetHampStateResult;
  } });
  Object.defineProperty(exports, "SetHdspResult", { enumerable: true, get: function() {
    return types_1.SetHdspResult;
  } });
  Object.defineProperty(exports, "SetModeResult", { enumerable: true, get: function() {
    return types_1.SetModeResult;
  } });
  exports.default = Handy_1.default;
});
export default require_lib();
