"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BoltSlider = /*#__PURE__*/function () {
  function BoltSlider(slider) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, BoltSlider);

    this.slider = slider;

    if (options === null) {
      options = {};
    }

    this.speed = options.speed || 300;
    this.animationTimingFunction = options.animationTimingFunction || 'linear';
    this.currentSlideNumber = options.currentSlideNumber || 0;
    this.slides = this.slider.querySelectorAll('.bolt-slider__item');
    this.countSlide = this.slides.length;
    this.countSlideWiev = options.countSlideWiev || 1;
    this.responze = options.responze || false;
    this.parentBlock = this.slider.parentNode;
    this.width = this.parentBlock.offsetWidth / this.countSlideWiev;
    this.controllOff = options.controllOff || false;
    this.controllList = false;
    this.controllListClass = options.controllListClass || false;
    this.controllListAria = options.controllListAria || 'Gallery controls';
    this.nextClass = options.nextClass || false;
    this.nextText = options.nextText || false;
    this.nextAria = options.nextAria || 'Next';
    this.prevClass = options.prevClass || false;
    this.prevText = options.prevText || false;
    this.prevAria = options.prevAria || 'Previous';
    this.lazyLoadImg = options.lazyLoadImg || false;
    this.adaptiveHeight = options.adaptiveHeight || false;
    this.sliderLeft = 0;
    this.startX = 0;
    this.touchAction = 0; // css селектор интерактивных окон

    this.interactiveCSS = "a[href]:not([tabindex='-1']), area[href]:not([tabindex='-1']), input:not([disabled]):not([tabindex='-1']), select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']), iframe:not([tabindex='-1']), [tabindex]:not([tabindex='-1']), [contentEditable=true]:not([tabindex='-1'])";

    if (this.responze) {
      this.getCountSlideWiev();
    }

    this.sliderInint();

    if (this.countSlideWiev >= this.countSlide && !this.controllOff || this.countSlideWiev == 0) {
      this.controllHide();
    } else {
      if (this.currentSlideNumber + this.countSlideWiev > this.countSlide - this.countSlideWiev) {
        this.currentSlideNumber = this.countSlide - this.countSlideWiev;
      }

      this.sliderStep(this);
    }

    this.touchDraw();
  }

  _createClass(BoltSlider, [{
    key: "sliderInint",
    value: function sliderInint() {
      this.slider.classList.add('bolt-slider--init');
      this.width = this.parentBlock.offsetWidth / this.countSlideWiev;
      this.slider.style.width = this.width * this.countSlide + 'px';
      var boltWrap = document.createElement('div');
      boltWrap.classList.add('bolt-slider-wrap');
      this.parentBlock.insertBefore(boltWrap, this.slider);
      boltWrap.appendChild(this.slider);
      if (!this.controllOff) this.controllDraw();
      this.resizeWindow();

      for (var i = 0; i < this.slides.length; i++) {
        this.inteactiveOff(this.slides[i]);
      }
    }
  }]);

  return BoltSlider;
}(); // controll


BoltSlider.prototype.controllHide = function () {
  this.slider.removeAttribute('style');
  this.slider.classList.remove('bolt-slider--init');
  this.slider.classList.add('bolt-slider--contholl-hide');
  this.controllList.hidden = true;

  if (this.slider.querySelector('[tabindex="0"]')) {
    var removeWiev = this.slider.querySelectorAll('[tabindex="0"]');

    for (var i = 0; i < removeWiev.length; i++) {
      removeWiev[i].removeAttribute('tabindex');
      removeWiev[i].classList.remove('bolt-slider__item--view');
    }
  }

  if (this.lazyLoadImg) {
    for (var _i = 0; _i < this.slides.length; _i++) {
      this.imgDraw(this.slides[_i]);
    }
  }

  for (var _i2 = 0; _i2 < this.slides.length; _i2++) {
    this.inteactiveOn(this.slides[_i2]);
  }
};

BoltSlider.prototype.controllVisible = function () {
  for (var i = 0; i < this.slides.length; i++) {
    this.inteactiveOff(this.slides[i]);
  }

  this.slider.classList.add('bolt-slider--init');
  this.slider.classList.remove('bolt-slider--contholl-hide');
  this.width = this.parentBlock.offsetWidth / this.countSlideWiev;
  this.setAnimation(1, 0);
  this.slider.style.width = this.width * this.countSlide + 'px';
  this.sliderStep();
  this.controllList.hidden = false;
  this.setAnimation();
};

BoltSlider.prototype.controllDraw = function () {
  this.controllList = document.createElement('ul');
  if (this.controllListClass) this.controllList.classList.add(this.controllListClass);
  this.controllList.setAttribute('aria-label', this.controllListAria);
  var li = document.createElement('li');
  var btnNext = document.createElement('button');
  if (this.nextClass) btnNext.classList.add(this.nextClass);
  if (this.nextText) btnNext.innerHTML = this.nextText;else btnNext.setAttribute('aria-label', this.nextAria);
  li.appendChild(btnNext);
  this.controllList.appendChild(li);
  var li1 = document.createElement('li');
  var btnPrev = document.createElement('button');
  if (this.prevClass) btnPrev.classList.add(this.prevClass);
  if (this.prevText) btnPrev.innerHTML = this.prevText;else btnPrev.setAttribute('aria-label', this.prevAria);
  li1.appendChild(btnPrev);
  this.controllList.appendChild(li1);
  this.parentBlock.appendChild(this.controllList);
  btnNext.addEventListener('click', callingSliderNext.bind(null, this), false);
  btnPrev.addEventListener('click', callingSliderPrev.bind(null, this), false);

  function callingSliderNext(obj) {
    obj.sliderNext();
  }

  function callingSliderPrev(obj) {
    obj.sliderPrev();
  }
}; // \controll
// resize


BoltSlider.prototype.resizeWindow = function () {
  window.addEventListener("resize", windowResize.bind(null, this), false);
  var check;

  function windowResize(obj) {
    clearTimeout(check);
    check = setTimeout(callingResizeInit.bind(null, obj), 100);
  }

  function callingResizeInit(obj) {
    obj.resizeInit();
  }
};

BoltSlider.prototype.resizeInit = function () {
  this.getCountSlideWiev();

  if (this.countSlideWiev >= this.countSlide && !this.controllOff || this.countSlideWiev == 0) {
    this.controllHide();
  } else {
    this.controllVisible();

    if (this.currentSlideNumber + this.countSlideWiev > this.countSlide - this.countSlideWiev) {
      this.currentSlideNumber = this.countSlide - this.countSlideWiev;
    }

    this.sliderStep(this);
  }
};

BoltSlider.prototype.getCountSlideWiev = function () {
  for (var responzeWidth in this.responze) {
    if (responzeWidth < window.innerWidth) {
      this.countSlideWiev = this.responze[responzeWidth];
    }
  }
}; // \resize
// draw


BoltSlider.prototype.sliderNext = function () {
  if (this.currentSlideNumber + this.countSlideWiev == this.countSlide) {
    this.currentSlideNumber = 0;
  } else if (this.currentSlideNumber + this.countSlideWiev > this.countSlide - this.countSlideWiev) {
    this.currentSlideNumber = this.countSlide - this.countSlideWiev;
  } else {
    this.currentSlideNumber += this.countSlideWiev;
  }

  this.setAnimation(1);
  this.sliderStep();
};

BoltSlider.prototype.sliderPrev = function () {
  if (this.currentSlideNumber == 0) {
    this.currentSlideNumber = this.countSlide - this.countSlideWiev;
  } else if (this.currentSlideNumber - this.countSlideWiev < 0) {
    this.currentSlideNumber = 0;
  } else {
    this.currentSlideNumber -= this.countSlideWiev;
  }

  this.setAnimation(1);
  this.sliderStep();
};

BoltSlider.prototype.sliderStep = function () {
  this.sliderLeft = -this.currentSlideNumber * this.width;
  this.slider.style.transform = "translateX(".concat(this.sliderLeft, "px)");
  this.slideDraw();
};

BoltSlider.prototype.slideDraw = function () {
  if (this.slider.querySelector('[tabindex="0"]')) {
    var removeWiev = this.slider.querySelectorAll('[tabindex="0"]');

    for (var i = 0; i < removeWiev.length; i++) {
      removeWiev[i].removeAttribute('tabindex');
      this.inteactiveOff(removeWiev[i]);
      removeWiev[i].classList.remove('bolt-slider__item--view');
    }
  }

  for (var _i3 = 0; _i3 < this.countSlideWiev; _i3++) {
    if (this.slides[this.currentSlideNumber + _i3]) {
      this.slides[this.currentSlideNumber + _i3].setAttribute('tabindex', 0);

      this.slides[this.currentSlideNumber + _i3].classList.add('bolt-slider__item--view');

      if (this.lazyLoadImg) this.imgDraw(this.slides[this.currentSlideNumber + _i3]);
      this.inteactiveOn(this.slides[this.currentSlideNumber + _i3]);
    }
  }

  if (this.adaptiveHeight && this.countSlideWiev == 1) {
    this.slider.style.height = this.slides[this.currentSlideNumber].offsetHeight + 'px';
  } else {
    this.slider.style.height = '';
  }
};

BoltSlider.prototype.imgDraw = function (slide) {
  for (var i = 0; i < slide.querySelectorAll('img').length; i++) {
    var img = slide.querySelectorAll('img')[i];

    if (img.getAttribute('data-src')) {
      slide.classList.add('onload');
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-src');

      img.onload = function () {
        slide.classList.remove('onload');
      };
    }
  }
};

BoltSlider.prototype.inteactiveOn = function (slide) {
  var interactiveEl = slide.querySelectorAll('[tabindex="-1"]');

  for (var i = 0; i < interactiveEl.length; i++) {
    if (interactiveEl[i].getAttribute('data-tabindex')) {
      interactiveEl[i].setAttribute('tabindex', interactiveEl[i].getAttribute('data-tabindex'));
    } else {
      interactiveEl[i].removeAttribute('tabindex');
    }
  }
};

BoltSlider.prototype.inteactiveOff = function (slide) {
  if (slide.querySelectorAll(this.interactiveCSS)) {
    var interactiveEl = slide.querySelectorAll(this.interactiveCSS);

    for (var i = 0; i < interactiveEl.length; i++) {
      if (interactiveEl[i].getAttribute('tabindex')) {
        interactiveEl[i].setAttribute('data-tabindex', interactiveEl[i].getAttribute('tabindex'));
      }

      interactiveEl[i].setAttribute('tabindex', -1);
    }
  }
}; // \draw
// tachDraw


BoltSlider.prototype.touchDraw = function () {
  this.slider.addEventListener("touchstart", this.touchStart.bind(null, this), false);
  this.slider.addEventListener('touchmove', this.touchMove.bind(null, this), false);
  this.slider.addEventListener('touchend', this.touthcEnd.bind(null, this), false);
};

BoltSlider.prototype.touchStart = function (obj, event) {
  obj.setAnimation(1, 0);
  obj.startX = event.clientX || event.touches[0].clientX;
};

BoltSlider.prototype.touchMove = function (obj, event) {
  obj.touchAction = event.clientX || event.touches[0].clientX;
  obj.actiontouchMove(obj.touchAction - obj.startX);
};

BoltSlider.prototype.actiontouchMove = function (touchAction) {
  this.slider.style.transform = "translateX(".concat(this.sliderLeft + touchAction, "px)");
};

BoltSlider.prototype.touthcEnd = function (obj) {
  if (obj.touchAction - obj.startX > 50 && obj.startX < obj.touchAction && obj.touchAction != 0) {
    if (obj.currentSlideNumber == 0) {
      obj.setAnimation(4);
      obj.sliderStep();
    } else {
      obj.sliderPrev(obj);
    }
  } else if (obj.startX - obj.touchAction > 50 && obj.startX > obj.touchAction && obj.touchAction != 0) {
    if (obj.currentSlideNumber == obj.countSlide - obj.countSlideWiev) {
      obj.setAnimation(4);
      obj.sliderStep();
    } else {
      obj.sliderNext(obj);
    }
  } else {
    obj.setAnimation(4);
    obj.sliderStep();
  }
}; // \tachDraw


BoltSlider.prototype.setAnimation = function () {
  var divider = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var multiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  this.slider.style.transition = "transform ".concat(this.speed / divider * multiplier, "ms ").concat(this.animationTimingFunction, " 0ms, height ").concat(this.speed / divider * multiplier, "ms ").concat(this.animationTimingFunction, " 0ms");
};

$(document).ready(function () {
  var clock = $('.clock-1').FlipClock({
    autoStart: false,
    defaultLanguage: false,
    running: false,
    countdown: true
  }); // set time

  clock.setTime(880);
  clock.start();
  var clock1 = $('.clock-2').FlipClock({
    autoStart: false,
    defaultLanguage: false,
    running: false,
    countdown: true
  }); // set time

  clock1.setTime(880);
  clock1.start();
  var clock2 = $('.clock-3').FlipClock({
    autoStart: false,
    defaultLanguage: false,
    running: false,
    countdown: true
  }); // set time

  clock2.setTime(880);
  clock2.start();
  var slider1 = new BoltSlider(document.querySelector('.bolt-slider--1'), {
    animationTimingFunction: 'ease-in-out',
    responze: {
      0: 1,
      768: 0
    },
    controllListAria: 'controls',
    controllListClass: 'slide__controll',
    lazyLoadImg: true
  });
  var slider2 = new BoltSlider(document.querySelector('.bolt-slider--2'), {
    animationTimingFunction: 'ease-in-out',
    responze: {
      0: 1,
      1001: 0
    },
    controllListAria: 'controls',
    controllListClass: 'slide__controll',
    lazyLoadImg: true
  });
  var slider3 = new BoltSlider(document.querySelector('.bolt-slider--3'), {
    animationTimingFunction: 'ease-in-out',
    controllListAria: 'controls',
    controllListClass: 'slide__controll',
    lazyLoadImg: true
  });
});