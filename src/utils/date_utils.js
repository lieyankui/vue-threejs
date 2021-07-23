// const dateRela = {
//   //清除参数Date对象的时分秒
//   clearTime: function(a) {
//       if (!a) {
//           return null;
//       }
//       return new Date(a.getFullYear(), a.getMonth(), a.getDate());
//   },
//   //获取参数日期的最大时间
//   maxTime: function(a) {
//       if (!a) {
//           return null;
//       }
//       return new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59, 59);
//   },
//   //复制参数Date对象
//   cloneDate: function(a) {
//       if (!a) {
//           return null;
//       }
//       return new Date(a.getTime());
//   },
//   //修改参数日期的年月日 时分秒 毫秒
//   addDate: function(b, a, c) {
//       if (!c) {
//           c = "D";
//       }
//       b = new Date(b.getTime());
//       switch (c.toUpperCase()) {
//           case "Y":
//               b.setFullYear(b.getFullYear() + a);
//               break;
//           case "MO":
//               b.setMonth(b.getMonth() + a);
//               break;
//           case "D":
//               b.setDate(b.getDate() + a);
//               break;
//           case "H":
//               b.setHours(b.getHours() + a);
//               break;
//           case "M":
//               b.setMinutes(b.getMinutes() + a);
//               break;
//           case "S":
//               b.setSeconds(b.getSeconds() + a);
//               break;
//           case "MS":
//               b.setMilliseconds(b.getMilliseconds() + a);
//               break;
//       }
//       return b;
//   },
//   getWeek: function(f, d, h) {
//       var i = Math.floor((14 - d) / 12);
//       var g = f + 4800 - i;
//       var c = d + 12 * i - 3;
//       var j =
//           h +
//           Math.floor((153 * c + 2) / 5) +
//           365 * g +
//           Math.floor(g / 4) -
//           Math.floor(g / 100) +
//           Math.floor(g / 400) -
//           32045;
//       var k = (((j + 31741 - (j % 7)) % 146097) % 36524) % 1461;
//       var e = Math.floor(k / 1460);
//       var b = ((k - e) % 365) + e;
//       var NumberOfWeek = Math.floor(b / 7) + 1;
//       return NumberOfWeek;
//   },
//   getWeekStartDate: function(c, e) {
//       if (!e) {
//           e = 0;
//       }
//       if (e > 6 || e < 0) {
//           throw new Error("out of weekday");
//       }
//       var a = c.getDay();
//       var b = e - a;
//       if (a < e) {
//           b -= 7;
//       }
//       var f = new Date(c.getFullYear(), c.getMonth(), c.getDate() + b);
//       return f;
//   },
//   getShortWeek: function(a) {
//       var b = this.dateInfo.daysShort;
//       return b[a];
//   },
//   getLongWeek: function(a) {
//       var b = this.dateInfo.daysLong;
//       return b[a];
//   },
//   getShortMonth: function(b) {
//       var a = this.dateInfo.monthsShort;
//       return a[b];
//   },
//   getLongMonth: function(b) {
//       var a = this.dateInfo.monthsLong;
//       return a[b];
//   },
//   dateInfo: {
//       monthsLong: [
//           "January",
//           "Febraury",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December"
//       ],
//       monthsShort: [
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec"
//       ],
//       daysLong: [
//           "Sunday",
//           "Monday",
//           "Tuesday",
//           "Wednesday",
//           "Thursday",
//           "Friday",
//           "Saturday"
//       ],
//       daysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
//       quarterLong: ["Q1", "Q2", "Q3", "Q4"],
//       quarterShort: ["Q1", "Q2", "Q3", "Q4"],
//       halfYearLong: ["first half", "second half"],
//       patterns: {
//           d: "M/d/yyyy",
//           D: "dddd, MMMM dd, yyyy",
//           f: "dddd, MMMM dd, yyyy H:mm tt",
//           F: "dddd, MMMM dd, yyyy H:mm:ss tt",
//           g: "M/d/yyyy H:mm tt",
//           G: "M/d/yyyy H:mm:ss tt",
//           m: "MMMM dd",
//           o: "yyyy-MM-ddTHH:mm:ss.fff",
//           s: "yyyy-MM-ddTHH:mm:ss",
//           t: "H:mm tt",
//           T: "H:mm:ss tt",
//           U: "dddd, MMMM dd, yyyy HH:mm:ss tt",
//           y: "MMM, yyyy"
//       },
//       tt: { AM: "AM", PM: "PM" },
//       ten: { Early: "Early", Mid: "Mid", Late: "Late" },
//       today: "Today",
//       clockType: 24
//   }
// };

const DAY_MS = 86400000, //一天的毫秒数
    HOUR_MS = 3600000, //一小时的毫秒数
    MINUTE_MS = 60000; //一分钟的毫秒数

// 给Date的原型新增方法
Date.prototype.getHalfYear = function() {
    if (!this.getMonth) {
        return null;
    }
    var a = this.getMonth();
    if (a < 6) {
        return 0;
    }
    return 1;
};
Date.prototype.getQuarter = function() {
    if (!this.getMonth) {
        return null;
    }
    var a = this.getMonth();
    if (a < 3) {
        return 0;
    }
    if (a < 6) {
        return 1;
    }
    if (a < 9) {
        return 2;
    }
    return 3;
};
//给String的原型新增方法
String.prototype.escapeDateTimeTokens = function() {
    // console.log(this, this.replace(/([dMyHmsft])/g, "\\$1"));
    return this.replace(/([dMyHmsft])/g, "\\$1");
};
//定义日期相关参数
const dateInfo = {
    monthsLong: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
    ],
    monthsShort: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
    ],
    daysLong: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
    ],
    daysShort: ["日", "一", "二", "三", "四", "五", "六"],
    quarterLong: ["一季度", "二季度", "三季度", "四季度"],
    quarterShort: ["Q1", "Q2", "Q2", "Q4"],
    halfYearLong: ["上半年", "下半年"],
    patterns: {
        d: "yyyy-M-d",
        D: "yyyy年M月d日",
        f: "yyyy年M月d日 H:mm",
        F: "yyyy年M月d日 H:mm:ss",
        g: "yyyy-M-d H:mm",
        G: "yyyy-M-d H:mm:ss",
        m: "MMMd日",
        o: "yyyy-MM-ddTHH:mm:ss.fff",
        s: "yyyy-MM-ddTHH:mm:ss",
        t: "H:mm",
        T: "H:mm:ss",
        U: "yyyy年M月d日 HH:mm:ss",
        y: "yyyy年MM月"
    },
    tt: { AM: "上午", PM: "下午" },
    ten: { Early: "上旬", Mid: "中旬", Late: "下旬" },
    today: "今天",
    clockType: 24
};
//定义日期相关参数英文
const dateInfoEN = {
    monthsLong: [
        "January",
        "Febraury",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    daysLong: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    daysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    quarterLong: ["Q1", "Q2", "Q3", "Q4"],
    quarterShort: ["Q1", "Q2", "Q3", "Q4"],
    halfYearLong: ["first half", "second half"],
    patterns: {
        d: "M/d/yyyy",
        D: "dddd, MMMM dd, yyyy",
        f: "dddd, MMMM dd, yyyy H:mm tt",
        F: "dddd, MMMM dd, yyyy H:mm:ss tt",
        g: "M/d/yyyy H:mm tt",
        G: "M/d/yyyy H:mm:ss tt",
        m: "MMMM dd",
        o: "yyyy-MM-ddTHH:mm:ss.fff",
        s: "yyyy-MM-ddTHH:mm:ss",
        t: "H:mm tt",
        T: "H:mm:ss tt",
        U: "dddd, MMMM dd, yyyy HH:mm:ss tt",
        y: "MMM, yyyy"
    },
    tt: { AM: "AM", PM: "PM" },
    ten: { Early: "Early", Mid: "Mid", Late: "Late" },
    today: "Today",
    clockType: 24
};

/**
 * 格式化日期函数
 * 参数：1  类型 Date   要格式化的日期对象
 *      2  类型String   格式化模板
 */
// hy 获取上半年/下半年
// Q 获取 一季度/二季度/三季度/四季度 ，
// q 获取 Q1/Q2/Q3/Q4 ，
// fff  毫秒
// tt 上午/下午
// d	月中的某一天。一位数的日期没有前导零。
// dd	月中的某一天。一位数的日期有一个前导零。
// ddd	周中某天的缩写名称
// dddd	周中某天的完整名称
// M	月份数字。一位数的月份没有前导零。
// MM	月份数字。一位数的月份有一个前导零。
// MMM	月份的缩写名称。
// MMMM	月份的完整名称。
// y	不包含纪元的年份。如果不包含纪元的年份小于 10，则显示不具有前导零的年份。
// yy	不包含纪元的年份。如果不包含纪元的年份小于 10，则显示具有前导零的年份。
// yyyy	包括纪元的四位数的年份。
// h	12 小时制的小时。一位数的小时数没有前导零。
// hh	12 小时制的小时。一位数的小时数有前导零。
// H	24 小时制的小时。一位数的小时数没有前导零。
// HH	24 小时制的小时。一位数的小时数有前导零。
// m	分钟。一位数的分钟数没有前导零。
// mm	分钟。一位数的分钟数有一个前导零。
// s	秒。一位数的秒数没有前导零。
// ss	秒。一位数的秒数有一个前导零。
const formatDate = function(e, r) {
    //e 日期对象    r 格式化字符串   p
    if (!e || !e.getFullYear || isNaN(e)) {
        //如果没有意义直接返回
        return "";
    }
    var b = e.toString(); //Fri Dec 06 2019 10:01:31 GMT+0800 (中国标准时间)
    var a = dateInfo;
    if (!a) {
        a = dateInfo;
    }
    if (typeof a !== "undefined") {
        var j = typeof a.patterns[r] !== "undefined" ? a.patterns[r] : r; //把j赋值为格式化字符串
        var k = e.getFullYear() + ""; //年
        var i = e.getMonth(); //月
        var l = e.getDate(); //日
        if (r == "yyyy-MM-dd") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return k + "-" + i + "-" + l;
        }
        if (r == "MM/dd/yyyy") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return i + "/" + l + "/" + k;
        }
        // b = j.replace(/yyyy/g, k); //j为格式化字符串   此处把yyyy替换为年
        // b = b.replace(/yy/g, (k + "").substring(2));
        //对前两行代码进行优化
        if (/(y+)/.test(r)) {
            //如果为  yyyy 返回 2019  yyy 返回 019  yy 返回 19
            var str = RegExp.$1;
            if (str.length > 4) {
                str = "yyyy";
            }
            b = j.replace(str, k.substr(4 - str.length));
        }
        var o = e.getHalfYear(); //miniui  在Date原型上添加的方法  是否已经过了半年  返回值 0/1
        b = b.replace(/hy/g, a.halfYearLong[o]); //halfYearLong: ["上半年", "下半年"],   o=0 上半年  o=1 下半年
        var c = e.getQuarter(); // 获取季度  返回值 0/1/2/3
        b = b.replace(/Q/g, a.quarterLong[c]); //quarterLong: ["一季度", "二季度", "三季度", "四季度"],
        b = b.replace(/q/g, a.quarterShort[c]); //quarterShort: ["Q1", "Q2", "Q2", "Q4"],
        b = b.replace(/MMMM/g, a.monthsLong[i].escapeDateTimeTokens()); //  格式  一月
        b = b.replace(/MMM/g, a.monthsShort[i].escapeDateTimeTokens()); //  格式 1月
        b = b.replace(/MM/g, i + 1 < 10 ? "0" + (i + 1) : i + 1); //   格式 01
        b = b.replace(/(\\)?M/g, function(t, s) {
            //如果月份的格式化字符串为 \\M 则t为 \M  s为 \   返回值为  \M    此处可能为bug  替换完后  月份为\M
            // console.log("s ? t : i + 1=", s ? t : i + 1);
            return s ? t : i + 1;
        });
        var d = e.getDay(); //获取星期几
        b = b.replace(/dddd/g, a.daysLong[d].escapeDateTimeTokens()); //daysLong: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        b = b.replace(/ddd/g, a.daysShort[d].escapeDateTimeTokens()); //daysShort: ["日", "一", "二", "三", "四", "五", "六"],
        b = b.replace(/dd/g, l < 10 ? "0" + l : l); //替换  日
        b = b.replace(/(\\)?d/g, function(t, s) {
            return s ? t : l;
        });
        var g = e.getHours();
        var n = g > 12 ? g - 12 : g;
        //如果是12 小时制
        if (a.clockType == 12) {
            if (g > 12) {
                g -= 12;
            }
        }
        b = b.replace(/HH/g, g < 10 ? "0" + g : g);
        b = b.replace(/(\\)?H/g, function(t, s) {
            return s ? t : g;
        });
        b = b.replace(/hh/g, n < 10 ? "0" + n : n);
        b = b.replace(/(\\)?h/g, function(t, s) {
            return s ? t : n;
        });
        var f = e.getMinutes();
        b = b.replace(/mm/g, f < 10 ? "0" + f : f);
        b = b.replace(/(\\)?m/g, function(t, s) {
            return s ? t : f;
        });
        var q = e.getSeconds();
        b = b.replace(/ss/g, q < 10 ? "0" + q : q);
        b = b.replace(/(\\)?s/g, function(t, s) {
            return s ? t : q;
        });
        b = b.replace(/fff/g, e.getMilliseconds());
        b = b.replace(
            /tt/g,
            e.getHours() > 12 || e.getHours() == 0 ? a.tt.PM : a.tt.AM
        );
        var e = e.getDate();
        var h = "";
        if (e <= 10) {
            h = a.ten.Early;
        } else {
            if (e <= 20) {
                h = a.ten.Mid;
            } else {
                h = a.ten.Late;
            }
        }
        b = b.replace(/ten/g, h);
    }
    //console.log(b.replace(/\\/g, ""));
    return b.replace(/\\/g, "");
};
//解析日期  参数：1  要解析为日期的对象
//              2   暂不启用
const parseDate = function(s, ignoreTimezone) {
    try {
        var d = eval(s);
        if (d && d.getFullYear) {
            return d;
        }
    } catch (ex) {}
    if (typeof s == "object") {
        return isNaN(s) ? null : s;
    }
    if (typeof s == "number") {
        var d = new Date(s * 1000);
        if (d.getTime() != s) {
            return null;
        }
        return isNaN(d) ? null : d;
    }
    if (typeof s == "string") {
        var m = s.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1, m[3]);
            return date;
        }
        m = s.match(/^([0-9]{4}).([0-9]*)$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1);
            return date;
        }
        if (s.match(/^\d+(\.\d+)?$/)) {
            var d = new Date(parseFloat(s) * 1000);
            if (d.getTime() != s) {
                return null;
            } else {
                return d;
            }
        }
        if (ignoreTimezone === undefined) {
            ignoreTimezone = true;
        }
        var d = parseISO8601(s, ignoreTimezone) || (s ? new Date(s) : null);
        return isNaN(d) ? null : d;
    }
    return null;
};

const fixDate = function(b, a) {
    if (+b) {
        while (b.getDate() != a.getDate()) {
            b.setTime(+b + (b < a ? 1 : -1) * HOUR_MS);
        }
    }
};

function parseISO8601(e, b) {
    var a = e.match(
        /^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/
    );
    if (!a) {
        a = e.match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3], a[4]);
            return d;
        }
        a = e.match(/^([0-9]{4}).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1);
            return d;
        }
        a = e.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3]);
            return d;
        }
        a = e.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
        if (!a) {
            return null;
        } else {
            var d = new Date(a[3], a[1] - 1, a[2]);
            return d;
        }
    }
    var d = new Date(a[1], 0, 1);
    if (b || !a[14]) {
        var c = new Date(a[1], 0, 1, 9, 0);
        if (a[3]) {
            d.setMonth(a[3] - 1);
            c.setMonth(a[3] - 1);
        }
        if (a[5]) {
            d.setDate(a[5]);
            c.setDate(a[5]);
        }
        fixDate(d, c);
        if (a[7]) {
            d.setHours(a[7]);
        }
        if (a[8]) {
            d.setMinutes(a[8]);
        }
        if (a[10]) {
            d.setSeconds(a[10]);
        }
        if (a[12]) {
            d.setMilliseconds(Number("0." + a[12]) * 1000);
        }
        fixDate(d, c);
    } else {
        d.setUTCFullYear(a[1], a[3] ? a[3] - 1 : 0, a[5] || 1);
        d.setUTCHours(
            a[7] || 0,
            a[8] || 0,
            a[10] || 0,
            a[12] ? Number("0." + a[12]) * 1000 : 0
        );
        var f = Number(a[16]) * 60 + (a[18] ? Number(a[18]) : 0);
        f *= a[15] == "-" ? 1 : -1;
        d = new Date(+d + f * 60 * 1000);
    }
    return d;
}
const parseTime = function(e, g) {
    if (!e) {
        return null;
    }
    var i = parseInt(e);
    if (i == e && g) {
        h = new Date(0);
        if (g[0] == "H") {
            h.setHours(i);
        } else {
            if (g[0] == "m") {
                h.setMinutes(i);
            } else {
                if (g[0] == "s") {
                    h.setSeconds(i);
                }
            }
        }
        if (isNaN(h)) {
            h = null;
        }
        return h;
    }
    var h = parseDate(e);
    if (!h) {
        var b = e.split(":");
        var f = parseInt(parseFloat(b[0]));
        var c = parseInt(parseFloat(b[1]));
        var a = parseInt(parseFloat(b[2]));
        if (!isNaN(f) && !isNaN(c) && !isNaN(a)) {
            h = new Date(0);
            h.setHours(f);
            h.setMinutes(c);
            h.setSeconds(a);
        }
        if (!isNaN(f) && (g == "H" || g == "HH")) {
            h = new Date(0);
            h.setHours(f);
        } else {
            if (!isNaN(f) && !isNaN(c) && (g == "H:mm" || g == "HH:mm")) {
                h = new Date(0);
                h.setHours(f);
                h.setMinutes(c);
            } else {
                if (!isNaN(f) && !isNaN(c) && g == "mm:ss") {
                    h = new Date(0);
                    h.setMinutes(f);
                    h.setSeconds(c);
                }
            }
        }
    }
    return h;
};
export default {
    formatDate,
    parseDate,
    parseTime
};