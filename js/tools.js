(function() {
  'use strict';
  window.lv = window.lv || {};
  lv.tools = lv.tools || {};

  // DATE MANAGEMENT:
  var _dateMasks = [
        {
          regex: /([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+):([0-9]+)/,
          callback: function(match){
            return new Date(+match[1], +match[2]-1, +match[3], +match[4], +match[5], +match[6]);
          }
        },
        {
          regex: /([0-9]+)-([0-9]+)-([0-9]+)/,
          callback: function(match){
            return new Date(+match[1], +match[2]-1, +match[3]);
          }
        },
        {
          regex: /([0-9]{4})([0-9]{2})([0-9]{2})/,
          callback: function(match){
            return new Date(+match[1], +match[2]-1, +match[3]);
          }
        }
      ],
      _monthsNames = ('January February March ' +
                      'April May June ' +
                      'July August September ' +
                      'October November December').split(' ');

  lv.tools.parseDate = function(string) {
    var d;
    
    if (typeof string === 'number')
      return new Date(string);

    string = string.toString();

    if (_dateMasks.some(function(obj) {
      var match = string.match(obj.regex);
      if (match) {
        d = obj.callback(match);
        return true;
      } else
        return false;
    })) {
      if (isNaN(d.valueOf()))
        throw new Error('Unvalid date: ' + string);
      else
        return d;
    } else
      throw new Error('Unrecognized date: ' + string);
  };

  lv.tools.getMonthsDiff = function(dMin, dMax) {
    return 12 * (dMax.getFullYear() - dMin.getFullYear()) + dMax.getMonth() - dMin.getMonth();
  };

  lv.tools.getDaysDiff = function(dMin, dMax) {
    return Math.ceil((dMax.getTime() - dMin.getTime()) / 86400000);
  };

  lv.tools.getNewDate = function(d, o) {
    d = (typeof d === 'string' || typeof d === 'number') ? lv.tools.parseDate(d) : d;
    o = o || {};

    var res = new Date(d.getTime());

    // Add years:
    res.setFullYear(d.getFullYear() + (o.years || o.y || 0));

    // Add months:
    res.setFullYear(d.getFullYear() + Math.floor((o.months || o.m || 0) / 12));
    res.setMonth(d.getMonth() + ((o.months || o.m || 0) % 12));

    // Add days:
    if (o.days || o.d)
      res = new Date(res.getTime() + 86400000 * (o.days || o.d));

    return res;
  };

  lv.tools.prettyDate = function(d) {
    d = typeof d === 'string' ? lv.tools.parseDate(d) : d;
    return d.getFullYear() + ' ' + _monthsNames[d.getMonth()] + ' ' + d.getDate();
  };

  lv.tools.numDate = function(d) {
    d = typeof d === 'string' ? lv.tools.parseDate(d) : d;

    var y = d.getFullYear(),
        m = d.getMonth() + 1,
        d = d.getDate();

    m = m < 10 ? '0' + m.toString() : m;
    d = d < 10 ? '0' + d.toString() : d;

    return y + '-' + m + '-' + d;
  };
})();
