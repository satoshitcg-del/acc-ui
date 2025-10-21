import {
  require_customParseFormat
} from "./chunk-FD3VYD6X.js";
import {
  buildWarning
} from "./chunk-75KQ2KEM.js";
import {
  require_dayjs_min
} from "./chunk-4VYM6LYS.js";
import {
  _extends,
  init_extends
} from "./chunk-QGIODDH4.js";
import {
  __commonJS,
  __toESM
} from "./chunk-7REXU52E.js";

// ../node_modules/dayjs/plugin/weekOfYear.js
var require_weekOfYear = __commonJS({
  "../node_modules/dayjs/plugin/weekOfYear.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekOfYear = t();
    }(exports, function() {
      "use strict";
      var e = "week", t = "year";
      return function(i, n, r) {
        var f = n.prototype;
        f.week = function(i2) {
          if (void 0 === i2 && (i2 = null), null !== i2)
            return this.add(7 * (i2 - this.week()), "day");
          var n2 = this.$locale().yearStart || 1;
          if (11 === this.month() && this.date() > 25) {
            var f2 = r(this).startOf(t).add(1, t).date(n2), s = r(this).endOf(e);
            if (f2.isBefore(s))
              return 1;
          }
          var a = r(this).startOf(t).date(n2).startOf(e).subtract(1, "millisecond"), o = this.diff(a, e, true);
          return o < 0 ? r(this).startOf("week").week() : Math.ceil(o);
        }, f.weeks = function(e2) {
          return void 0 === e2 && (e2 = null), this.week(e2);
        };
      };
    });
  }
});

// ../node_modules/dayjs/plugin/localizedFormat.js
var require_localizedFormat = __commonJS({
  "../node_modules/dayjs/plugin/localizedFormat.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_localizedFormat = t();
    }(exports, function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
      return function(t, o, n) {
        var r = o.prototype, i = r.format;
        n.en.formats = e, r.format = function(t2) {
          void 0 === t2 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
          var o2 = this.$locale().formats, n2 = function(t3, o3) {
            return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t4, n3, r2) {
              var i2 = r2 && r2.toUpperCase();
              return n3 || o3[r2] || e[r2] || o3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t5, o4) {
                return t5 || o4.slice(1);
              });
            });
          }(t2, void 0 === o2 ? {} : o2);
          return i.call(this, n2);
        };
      };
    });
  }
});

// ../node_modules/dayjs/plugin/isBetween.js
var require_isBetween = __commonJS({
  "../node_modules/dayjs/plugin/isBetween.js"(exports, module) {
    !function(e, i) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isBetween = i();
    }(exports, function() {
      "use strict";
      return function(e, i, t) {
        i.prototype.isBetween = function(e2, i2, s, f) {
          var n = t(e2), o = t(i2), r = "(" === (f = f || "()")[0], u = ")" === f[1];
          return (r ? this.isAfter(n, s) : !this.isBefore(n, s)) && (u ? this.isBefore(o, s) : !this.isAfter(o, s)) || (r ? this.isBefore(n, s) : !this.isAfter(n, s)) && (u ? this.isAfter(o, s) : !this.isBefore(o, s));
        };
      };
    });
  }
});

// ../node_modules/@mui/x-date-pickers/AdapterDayjs/AdapterDayjs.js
init_extends();
var import_dayjs = __toESM(require_dayjs_min());
var import_weekOfYear = __toESM(require_weekOfYear());
var import_customParseFormat = __toESM(require_customParseFormat());
var import_localizedFormat = __toESM(require_localizedFormat());
var import_isBetween = __toESM(require_isBetween());
import_dayjs.default.extend(import_customParseFormat.default);
import_dayjs.default.extend(import_localizedFormat.default);
import_dayjs.default.extend(import_isBetween.default);
var localeNotFoundWarning = buildWarning(["Your locale has not been found.", "Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale", "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'", "fallback on English locale"]);
var formatTokenMap = {
  // Year
  YY: "year",
  YYYY: {
    sectionType: "year",
    contentType: "digit",
    maxLength: 4
  },
  // Month
  M: {
    sectionType: "month",
    contentType: "digit",
    maxLength: 2
  },
  MM: "month",
  MMM: {
    sectionType: "month",
    contentType: "letter"
  },
  MMMM: {
    sectionType: "month",
    contentType: "letter"
  },
  // Day of the month
  D: {
    sectionType: "day",
    contentType: "digit",
    maxLength: 2
  },
  DD: "day",
  Do: {
    sectionType: "day",
    contentType: "digit-with-letter"
  },
  // Day of the week
  d: {
    sectionType: "weekDay",
    contentType: "digit",
    maxLength: 2
  },
  dd: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  ddd: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  dddd: {
    sectionType: "weekDay",
    contentType: "letter"
  },
  // Meridiem
  A: "meridiem",
  a: "meridiem",
  // Hours
  H: {
    sectionType: "hours",
    contentType: "digit",
    maxLength: 2
  },
  HH: "hours",
  h: {
    sectionType: "hours",
    contentType: "digit",
    maxLength: 2
  },
  hh: "hours",
  // Minutes
  m: {
    sectionType: "minutes",
    contentType: "digit",
    maxLength: 2
  },
  mm: "minutes",
  // Seconds
  s: {
    sectionType: "seconds",
    contentType: "digit",
    maxLength: 2
  },
  ss: "seconds"
};
var defaultFormats = {
  year: "YYYY",
  month: "MMMM",
  monthShort: "MMM",
  dayOfMonth: "D",
  weekday: "dddd",
  weekdayShort: "dd",
  hours24h: "HH",
  hours12h: "hh",
  meridiem: "A",
  minutes: "mm",
  seconds: "ss",
  fullDate: "ll",
  fullDateWithWeekday: "dddd, LL",
  keyboardDate: "L",
  shortDate: "MMM D",
  normalDate: "D MMMM",
  normalDateWithWeekday: "ddd, MMM D",
  monthAndYear: "MMMM YYYY",
  monthAndDate: "MMMM D",
  fullTime: "LT",
  fullTime12h: "hh:mm A",
  fullTime24h: "HH:mm",
  fullDateTime: "lll",
  fullDateTime12h: "ll hh:mm A",
  fullDateTime24h: "ll HH:mm",
  keyboardDateTime: "L LT",
  keyboardDateTime12h: "L hh:mm A",
  keyboardDateTime24h: "L HH:mm"
};
var MISSING_UTC_PLUGIN = ["Missing UTC plugin", "To be able to use UTC or timezones, you have to enable the `utc` plugin", "Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-utc"].join("\n");
var MISSING_TIMEZONE_PLUGIN = ["Missing timezone plugin", "To be able to use timezones, you have to enable both the `utc` and the `timezone` plugin", "Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-timezone"].join("\n");
var withLocale = (dayjs, locale) => !locale ? dayjs : (...args) => dayjs(...args).locale(locale);
var AdapterDayjs = class {
  constructor({
    locale: _locale,
    formats,
    instance
  } = {}) {
    var _this$rawDayJsInstanc;
    this.isMUIAdapter = true;
    this.isTimezoneCompatible = true;
    this.lib = "dayjs";
    this.rawDayJsInstance = void 0;
    this.dayjs = void 0;
    this.locale = void 0;
    this.formats = void 0;
    this.escapedCharacters = {
      start: "[",
      end: "]"
    };
    this.formatTokenMap = formatTokenMap;
    this.setLocaleToValue = (value) => {
      const expectedLocale = this.getCurrentLocaleCode();
      if (expectedLocale === value.locale()) {
        return value;
      }
      return value.locale(expectedLocale);
    };
    this.hasUTCPlugin = () => typeof import_dayjs.default.utc !== "undefined";
    this.hasTimezonePlugin = () => typeof import_dayjs.default.tz !== "undefined";
    this.isSame = (value, comparing, comparisonTemplate) => {
      const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
      return value.format(comparisonTemplate) === comparingInValueTimezone.format(comparisonTemplate);
    };
    this.cleanTimezone = (timezone) => {
      switch (timezone) {
        case "default": {
          return void 0;
        }
        case "system": {
          return import_dayjs.default.tz.guess();
        }
        default: {
          return timezone;
        }
      }
    };
    this.createSystemDate = (value) => {
      if (this.rawDayJsInstance) {
        return this.rawDayJsInstance(value);
      }
      if (this.hasUTCPlugin() && this.hasTimezonePlugin()) {
        const timezone = import_dayjs.default.tz.guess();
        if (timezone !== "UTC") {
          return import_dayjs.default.tz(value, timezone);
        }
        return (0, import_dayjs.default)(value);
      }
      return (0, import_dayjs.default)(value);
    };
    this.createUTCDate = (value) => {
      if (!this.hasUTCPlugin()) {
        throw new Error(MISSING_UTC_PLUGIN);
      }
      return import_dayjs.default.utc(value);
    };
    this.createTZDate = (value, timezone) => {
      if (!this.hasUTCPlugin()) {
        throw new Error(MISSING_UTC_PLUGIN);
      }
      if (!this.hasTimezonePlugin()) {
        throw new Error(MISSING_TIMEZONE_PLUGIN);
      }
      const keepLocalTime = value !== void 0 && !value.endsWith("Z");
      return (0, import_dayjs.default)(value).tz(this.cleanTimezone(timezone), keepLocalTime);
    };
    this.getLocaleFormats = () => {
      const locales = import_dayjs.default.Ls;
      const locale = this.locale || "en";
      let localeObject = locales[locale];
      if (localeObject === void 0) {
        localeNotFoundWarning();
        localeObject = locales.en;
      }
      return localeObject.formats;
    };
    this.adjustOffset = (value) => {
      if (!this.hasTimezonePlugin()) {
        return value;
      }
      const timezone = this.getTimezone(value);
      if (timezone !== "UTC") {
        var _fixedValue$$offset, _value$$offset;
        const fixedValue = value.tz(this.cleanTimezone(timezone), true);
        if (((_fixedValue$$offset = fixedValue.$offset) != null ? _fixedValue$$offset : 0) === ((_value$$offset = value.$offset) != null ? _value$$offset : 0)) {
          return value;
        }
        value.$offset = fixedValue.$offset;
      }
      return value;
    };
    this.date = (value) => {
      if (value === null) {
        return null;
      }
      return this.dayjs(value);
    };
    this.dateWithTimezone = (value, timezone) => {
      if (value === null) {
        return null;
      }
      let parsedValue;
      if (timezone === "UTC") {
        parsedValue = this.createUTCDate(value);
      } else if (timezone === "system" || timezone === "default" && !this.hasTimezonePlugin()) {
        parsedValue = this.createSystemDate(value);
      } else {
        parsedValue = this.createTZDate(value, timezone);
      }
      if (this.locale === void 0) {
        return parsedValue;
      }
      return parsedValue.locale(this.locale);
    };
    this.getTimezone = (value) => {
      if (this.hasTimezonePlugin()) {
        var _value$$x;
        const zone = (_value$$x = value.$x) == null ? void 0 : _value$$x.$timezone;
        if (zone) {
          return zone;
        }
      }
      if (this.hasUTCPlugin() && value.isUTC()) {
        return "UTC";
      }
      return "system";
    };
    this.setTimezone = (value, timezone) => {
      if (this.getTimezone(value) === timezone) {
        return value;
      }
      if (timezone === "UTC") {
        if (!this.hasUTCPlugin()) {
          throw new Error(MISSING_UTC_PLUGIN);
        }
        return value.utc();
      }
      if (timezone === "system") {
        return value.local();
      }
      if (!this.hasTimezonePlugin()) {
        if (timezone === "default") {
          return value;
        }
        throw new Error(MISSING_TIMEZONE_PLUGIN);
      }
      return import_dayjs.default.tz(value, this.cleanTimezone(timezone));
    };
    this.toJsDate = (value) => {
      return value.toDate();
    };
    this.parseISO = (isoString) => {
      return this.dayjs(isoString);
    };
    this.toISO = (value) => {
      return value.toISOString();
    };
    this.parse = (value, format) => {
      if (value === "") {
        return null;
      }
      return this.dayjs(value, format, this.locale, true);
    };
    this.getCurrentLocaleCode = () => {
      return this.locale || "en";
    };
    this.is12HourCycleInCurrentLocale = () => {
      return /A|a/.test(this.getLocaleFormats().LT || "");
    };
    this.expandFormat = (format) => {
      const localeFormats = this.getLocaleFormats();
      const t = (formatBis) => formatBis.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_, a, b) => a || b.slice(1));
      return format.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
        const B = b && b.toUpperCase();
        return a || localeFormats[b] || t(localeFormats[B]);
      });
    };
    this.getFormatHelperText = (format) => {
      return this.expandFormat(format).replace(/a/gi, "(a|p)m").toLocaleLowerCase();
    };
    this.isNull = (value) => {
      return value === null;
    };
    this.isValid = (value) => {
      return this.dayjs(value).isValid();
    };
    this.format = (value, formatKey) => {
      return this.formatByString(value, this.formats[formatKey]);
    };
    this.formatByString = (value, formatString) => {
      return this.dayjs(value).format(formatString);
    };
    this.formatNumber = (numberToFormat) => {
      return numberToFormat;
    };
    this.getDiff = (value, comparing, unit) => {
      return value.diff(comparing, unit);
    };
    this.isEqual = (value, comparing) => {
      if (value === null && comparing === null) {
        return true;
      }
      return this.dayjs(value).toDate().getTime() === this.dayjs(comparing).toDate().getTime();
    };
    this.isSameYear = (value, comparing) => {
      return this.isSame(value, comparing, "YYYY");
    };
    this.isSameMonth = (value, comparing) => {
      return this.isSame(value, comparing, "YYYY-MM");
    };
    this.isSameDay = (value, comparing) => {
      return this.isSame(value, comparing, "YYYY-MM-DD");
    };
    this.isSameHour = (value, comparing) => {
      return value.isSame(comparing, "hour");
    };
    this.isAfter = (value, comparing) => {
      return value > comparing;
    };
    this.isAfterYear = (value, comparing) => {
      if (!this.hasUTCPlugin()) {
        return value.isAfter(comparing, "year");
      }
      return !this.isSameYear(value, comparing) && value.utc() > comparing.utc();
    };
    this.isAfterDay = (value, comparing) => {
      if (!this.hasUTCPlugin()) {
        return value.isAfter(comparing, "day");
      }
      return !this.isSameDay(value, comparing) && value.utc() > comparing.utc();
    };
    this.isBefore = (value, comparing) => {
      return value < comparing;
    };
    this.isBeforeYear = (value, comparing) => {
      if (!this.hasUTCPlugin()) {
        return value.isBefore(comparing, "year");
      }
      return !this.isSameYear(value, comparing) && value.utc() < comparing.utc();
    };
    this.isBeforeDay = (value, comparing) => {
      if (!this.hasUTCPlugin()) {
        return value.isBefore(comparing, "day");
      }
      return !this.isSameDay(value, comparing) && value.utc() < comparing.utc();
    };
    this.isWithinRange = (value, [start, end]) => {
      return value >= start && value <= end;
    };
    this.startOfYear = (value) => {
      return this.adjustOffset(value.startOf("year"));
    };
    this.startOfMonth = (value) => {
      return this.adjustOffset(value.startOf("month"));
    };
    this.startOfWeek = (value) => {
      return this.adjustOffset(value.startOf("week"));
    };
    this.startOfDay = (value) => {
      return this.adjustOffset(value.startOf("day"));
    };
    this.endOfYear = (value) => {
      return this.adjustOffset(value.endOf("year"));
    };
    this.endOfMonth = (value) => {
      return this.adjustOffset(value.endOf("month"));
    };
    this.endOfWeek = (value) => {
      return this.adjustOffset(value.endOf("week"));
    };
    this.endOfDay = (value) => {
      return this.adjustOffset(value.endOf("day"));
    };
    this.addYears = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "year") : value.add(amount, "year"));
    };
    this.addMonths = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "month") : value.add(amount, "month"));
    };
    this.addWeeks = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "week") : value.add(amount, "week"));
    };
    this.addDays = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "day") : value.add(amount, "day"));
    };
    this.addHours = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "hour") : value.add(amount, "hour"));
    };
    this.addMinutes = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "minute") : value.add(amount, "minute"));
    };
    this.addSeconds = (value, amount) => {
      return this.adjustOffset(amount < 0 ? value.subtract(Math.abs(amount), "second") : value.add(amount, "second"));
    };
    this.getYear = (value) => {
      return value.year();
    };
    this.getMonth = (value) => {
      return value.month();
    };
    this.getDate = (value) => {
      return value.date();
    };
    this.getHours = (value) => {
      return value.hour();
    };
    this.getMinutes = (value) => {
      return value.minute();
    };
    this.getSeconds = (value) => {
      return value.second();
    };
    this.getMilliseconds = (value) => {
      return value.millisecond();
    };
    this.setYear = (value, year) => {
      return this.adjustOffset(value.set("year", year));
    };
    this.setMonth = (value, month) => {
      return this.adjustOffset(value.set("month", month));
    };
    this.setDate = (value, date) => {
      return this.adjustOffset(value.set("date", date));
    };
    this.setHours = (value, hours) => {
      return this.adjustOffset(value.set("hour", hours));
    };
    this.setMinutes = (value, minutes) => {
      return this.adjustOffset(value.set("minute", minutes));
    };
    this.setSeconds = (value, seconds) => {
      return this.adjustOffset(value.set("second", seconds));
    };
    this.setMilliseconds = (value, milliseconds) => {
      return this.adjustOffset(value.set("millisecond", milliseconds));
    };
    this.getDaysInMonth = (value) => {
      return value.daysInMonth();
    };
    this.getNextMonth = (value) => {
      return this.addMonths(value, 1);
    };
    this.getPreviousMonth = (value) => {
      return this.addMonths(value, -1);
    };
    this.getMonthArray = (value) => {
      const firstMonth = value.startOf("year");
      const monthArray = [firstMonth];
      while (monthArray.length < 12) {
        const prevMonth = monthArray[monthArray.length - 1];
        monthArray.push(this.addMonths(prevMonth, 1));
      }
      return monthArray;
    };
    this.mergeDateAndTime = (dateParam, timeParam) => {
      return dateParam.hour(timeParam.hour()).minute(timeParam.minute()).second(timeParam.second());
    };
    this.getWeekdays = () => {
      const start = this.dayjs().startOf("week");
      return [0, 1, 2, 3, 4, 5, 6].map((diff) => this.formatByString(this.addDays(start, diff), "dd"));
    };
    this.getWeekArray = (value) => {
      const cleanValue = this.setLocaleToValue(value);
      const start = cleanValue.startOf("month").startOf("week");
      const end = cleanValue.endOf("month").endOf("week");
      let count = 0;
      let current = start;
      const nestedWeeks = [];
      while (current < end) {
        const weekNumber = Math.floor(count / 7);
        nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
        nestedWeeks[weekNumber].push(current);
        current = this.addDays(current, 1);
        count += 1;
      }
      return nestedWeeks;
    };
    this.getWeekNumber = (value) => {
      return value.week();
    };
    this.getYearRange = (start, end) => {
      const startDate = start.startOf("year");
      const endDate = end.endOf("year");
      const years = [];
      let current = startDate;
      while (current < endDate) {
        years.push(current);
        current = this.addYears(current, 1);
      }
      return years;
    };
    this.getMeridiemText = (ampm) => {
      return ampm === "am" ? "AM" : "PM";
    };
    this.rawDayJsInstance = instance;
    this.dayjs = withLocale((_this$rawDayJsInstanc = this.rawDayJsInstance) != null ? _this$rawDayJsInstanc : import_dayjs.default, _locale);
    this.locale = _locale;
    this.formats = _extends({}, defaultFormats, formats);
    import_dayjs.default.extend(import_weekOfYear.default);
  }
};
export {
  AdapterDayjs
};
//# sourceMappingURL=@mui_x-date-pickers_AdapterDayjs.js.map
