(function() {
  'use strict';

  window.lv = window.lv || {};
  lv.modules = lv.modules || {};

  lv.modules.player = function() {
    domino.module.call(this);
    var _self = this,
        _isPlaying = false,
        _interval;

    function startLoop() {
      _interval = window.setInterval(function() {
        _self.dispatchEvent('goNextFrame');
      }, 40);
    }

    this.triggers.events.isPlayingUpdated = function(control) {
      if (_isPlaying = control.get('isPlaying'))
        startLoop();
      else
        window.clearInterval(_interval);
    };
  };

  lv.modules.playButton = function(html) {
    domino.module.call(this);
    var _self = this,
        _html = html,
        _play = $('.play', _html),
        _pause = $('.pause', _html);

    _play.click(function() {
      _self.dispatchEvent('updateIsPlaying', {
        isPlaying: true
      });
    });

    _pause.click(function() {
      _self.dispatchEvent('updateIsPlaying', {
        isPlaying: false
      });
    });

    this.triggers.events.isPlayingUpdated = function(control) {
      if (control.get('isPlaying'))
        _html.addClass('playing');
      else
        _html.removeClass('playing');
    };
  };

  lv.modules.timeline = function(html, dMin, dMax) {
    domino.module.call(this);

    var _self = this,
        _mMin = 0,
        _mMax = lv.tools.getMonthsDiff(dMin, dMax),
        _input = $('<input type="range" ' +
                          'value="' + _mMin + '" ' +
                          'min="' + _mMin + '" ' +
                          'max="' + _mMax + '" />'),
        _html = html.append(_input);

    // Range input polyfill:
    _input.rangeinput();
    _input = $('input', _html);

    // Observe modifications:
    _input.change(function() {
      _input.attr('title', lv.tools.prettyDate(getDate()));
      _self.dispatchEvent('updateDate', {
        date: getDate()
      });
    });

    function getDate() {
      return lv.tools.getNewDate(dMin, {
        m: _input.val()
      });
    };

    function setDate(d) {
      _input.val(lv.tools.getMonthsDiff(dMin, d));
    };

    function drawCaption() {
      // TODO
    }

    this.html = _html;
    this.triggers.events.resize = function() {
      drawCaption();
    };
    this.triggers.events.dateUpdated = function(control) {
      setDate(control.get('date'));
    };
  };

  lv.modules.renderer = function(html) {
    domino.module.call(this);

    var _self = this,
        _html = html,
        _canvas = $('canvas', _html)[0],
        _ctx = _canvas.getContext('2d');

    function draw(control) {
      // TODO
    }

    function resize() {
      _canvas.width = _html.width();
      _canvas.height = _html.height();
    }

    this.triggers.events.dateUpdated = draw;
  };

  lv.modules.rightPanel = function(html) {
    domino.module.call(this);

    var _self = this,
        _html = html,
        _config = {},
        _rolodex = $('#rolodex', _html),
        _article = $('#article', _html);

    // Bind mouse events:
    _html.click(function(e) {
      var p,
          t = $(e.target);

      if (t.is('.abstract-title')) {
        // No time to code the hack properly, the article
        // will be loaded directly from here:
        // 
        // _self.dispatchEvent('openArticle', {
        //   id: t.parents('li').attr('data-article-id')
        // });
        
        openArticle(t.parents('li').attr('data-article-id'));
      } else if (
        (t.is('.close-article') && (p = t)) ||
        (p = t.parents('.close-article')).length
      ) {
        closeArticle();
      }
    });

    function openArticle(id) {
      $('#content', _html).attr('data-article-id', id);
      $('#article', _html).empty().load('samples/event.html');
    }

    function closeArticle() {
      $('#article', _html).empty();
      $('#content', _html).attr('data-article-id', null);
    }

    this.triggers.events.dateUpdated = closeArticle;

    this.triggers.events.nearestEventsUpdated = function(control) {
      var ul = $('ul', _rolodex).empty();

      _config = ((control.get('config') || {}).categories || []).reduce(function(r, o) {
        r[o.id] = o;
        return r;
      }, {});

      var i,
          l,
          events = control.get('nearestEvents');

      function addAbstract(event) {
        ul.append(
          '<li class="abstract" data-article-id="' + event.i + '">' +
            '<i class="' + _config[event.c].icon + '" ' +
               'style="background:' + _config[event.c].color + ';" />' +
            '<span class="abstract-title">' + event.t + '</span>' +
            '<span class="abstract-date" ' +
                  'style="color:' + _config[event.c].color + ';">' + lv.tools.prettyDate(event.d) + '</span>' +
          '</li>'
        );
      }

      for (i = 0, l = events.length; i < l; i++)
        addAbstract(events[i]);
    };

    this.triggers.events.openArticle = function(_, event) {
      openArticle(event.data.id);
    };
  };
})();