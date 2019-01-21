'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
  var l = 30, 	// 滑块边长
  r = 8,  		// 滑块半径
  w = 300, 		// canvas宽度
  h = 150, 		// canvas高度
  PI = Math.PI;
  var L = l + r * 2; // 滑块实际边长

  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start);
  }

  function createCanvas(width, height) {
    var canvas = createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function createImg(onload) {
    var img = createElement('img');
    img.crossOrigin = "Anonymous";
    img.onload = onload;
    img.onerror = function () {
      img.src = getRandomImg();
    };
    img.src = getRandomImg();
    return img;
  }

  function createElement(tagName) {
    return document.createElement(tagName);
  }

  function addClass(tag, className) {
    tag.classList.add(className);
  }

  function removeClass(tag, className) {
    tag.classList.remove(className);
  }

  function getRandomImg() {
    return "/static/js/libs/jigsaw/img/" + getRandomNumberByRange(1, 30) + ".jpg";
  }

  function _draw(ctx, operation, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + l / 2, y);
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI);
    ctx.lineTo(x + l / 2, y);
    ctx.lineTo(x + l, y);
    ctx.lineTo(x + l, y + l / 2);
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI);
    ctx.lineTo(x + l, y + l / 2);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y);
    ctx.fillStyle = '#fff';
    ctx[operation]();
    ctx.beginPath();
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI);
    ctx.globalCompositeOperation = "xor";
    ctx.fill();
  }

  function sum(x, y) {
    return x + y;
  }

  function square(x) {
    return x * x;
  }

  var jigsaw = function () {
    function jigsaw(el, success, fail) {
      _classCallCheck(this, jigsaw);

      this.el = el;
      this.success = success;
      this.fail = fail;
    }

    jigsaw.prototype.init = function init() {
      this.initDOM();
      this.initImg();
      this.draw();
      this.bindEvents();
    };

    jigsaw.prototype.initDOM = function initDOM() {
      var canvas = createCanvas(w, h); // 画布
      var block = canvas.cloneNode(true); // 滑块
      var sliderContainer = createElement('div');
      var refreshIcon = createElement('div');
      var sliderMask = createElement('div');
      var slider = createElement('div');
      var sliderIcon = createElement('span');
      var text = createElement('span');

      block.className = 'block';
      sliderContainer.className = 'sliderContainer';
      refreshIcon.className = 'refreshIcon';
      sliderMask.className = 'sliderMask';
      slider.className = 'slider';
      sliderIcon.className = 'sliderIcon';
      text.innerHTML = '向右滑动滑块填充拼图';
      text.className = 'sliderText';

      var el = this.el;
      el.appendChild(canvas);
      el.appendChild(refreshIcon);
      el.appendChild(block);
      slider.appendChild(sliderIcon);
      sliderMask.appendChild(slider);
      sliderContainer.appendChild(sliderMask);
      sliderContainer.appendChild(text);
      el.appendChild(sliderContainer);

      Object.assign(this, {
        canvas: canvas,
        block: block,
        sliderContainer: sliderContainer,
        refreshIcon: refreshIcon,
        slider: slider,
        sliderMask: sliderMask,
        sliderIcon: sliderIcon,
        text: text,
        canvasCtx: canvas.getContext('2d'),
        blockCtx: block.getContext('2d')
      });
    };

    jigsaw.prototype.initImg = function initImg() {
      var _this = this;

      var img = createImg(function () {
        _this.canvasCtx.drawImage(img, 0, 0, w, h);
        _this.blockCtx.drawImage(img, 0, 0, w, h);
        var y = _this.y - r * 2 + 2;
        var ImageData = _this.blockCtx.getImageData(_this.x, y, L, L);
        _this.block.width = L;
        _this.blockCtx.putImageData(ImageData, 0, y);
      });
      this.img = img;
    };

    jigsaw.prototype.draw = function draw() {
      // 随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 10, w - (L + 10));
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
      _draw(this.canvasCtx, 'fill', this.x, this.y);
      _draw(this.blockCtx, 'clip', this.x, this.y);
    };

    jigsaw.prototype.clean = function clean() {
      this.canvasCtx.clearRect(0, 0, w, h);
      this.blockCtx.clearRect(0, 0, w, h);
      this.block.width = w;
    };

    jigsaw.prototype.bindEvents = function bindEvents() {
      var _this2 = this;

      this.el.onselectstart = function () {
        return false;
      };
      this.refreshIcon.onclick = function () {
        _this2.reset();
      };

      var originX = void 0,
          originY = void 0,
          trail = [],
          isMouseDown = false;
      this.slider.addEventListener('mousedown', function (e) {
        originX = e.x, originY = e.y;
        isMouseDown = true;
      });
      document.addEventListener('mousemove', function (e) {
        if (!isMouseDown) return false;
        var moveX = e.x - originX;
        var moveY = e.y - originY;
        if (moveX < 0 || moveX + 38 >= w) return false;
        _this2.slider.style.left = moveX + 'px';
        var blockLeft = (w - 40 - 20) / (w - 40) * moveX;
        _this2.block.style.left = blockLeft + 'px';

        addClass(_this2.sliderContainer, 'sliderContainer_active');
        _this2.sliderMask.style.width = moveX + 'px';
        trail.push(moveY);
      });
      document.addEventListener('mouseup', function (e) {
        if (!isMouseDown) return false;
        isMouseDown = false;
        if (e.x == originX) return false;
        removeClass(_this2.sliderContainer, 'sliderContainer_active');
        _this2.trail = trail;

        var _verify = _this2.verify(),
            spliced = _verify.spliced,
            TuringTest = _verify.TuringTest;

        if (spliced) {
          if (TuringTest) {
            addClass(_this2.sliderContainer, 'sliderContainer_success');
            _this2.success && _this2.success();
          } else {
            addClass(_this2.sliderContainer, 'sliderContainer_fail');
            _this2.text.innerHTML = '再试一次';
            _this2.reset();
          }
        } else {
          addClass(_this2.sliderContainer, 'sliderContainer_fail');
          _this2.fail && _this2.fail();
          setTimeout(function () {
            _this2.reset();
          }, 1000);
        }
      });
    };

    jigsaw.prototype.verify = function verify() {
      var arr = this.trail; // 拖动时y轴的移动距离
      var average = arr.reduce(sum) / arr.length; // 平均值
      var deviations = arr.map(function (x) {
        return x - average;
      }); // 偏差数组
      var stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length); // 标准差
      var left = parseInt(this.block.style.left);
      return {
        spliced: Math.abs(left - this.x) < 10,
        TuringTest: average !== stddev // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
      };
    };

    jigsaw.prototype.reset = function reset() {
      this.sliderContainer.className = 'sliderContainer';
      this.slider.style.left = 0;
      this.block.style.left = 0;
      this.sliderMask.style.width = 0;
      this.clean();
      this.img.src = getRandomImg();
      this.draw();
    };

    return jigsaw;
  }();

  window.jigsaw = {
    init: function init(element, success, fail) {
      new jigsaw(element, success, fail).init();
    }
  };
  if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
})(window);