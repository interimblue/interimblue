(() => {
  // src/scripts/utilities.js
  var hideElement = function(targets = void 0) {
    targets = targets === void 0 ? this.targets() : targets.targets();
    for (let item of targets) {
      item.classList.add("is-inactive");
      item.classList.remove("is-active");
      item.style.opacity = "";
      item.style.display = "";
    }
  };
  var setupShowElement = function(targets = void 0) {
    targets = targets === void 0 ? this.targets() : targets.targets();
    for (let item of targets) {
      item.classList.remove("is-inactive");
    }
  };
  var showElement = function(targets = void 0) {
    targets = targets === void 0 ? this.targets() : targets.targets();
    for (let item of targets) {
      item.classList.remove("is-inactive", "is-invisible");
      item.classList.add("is-active");
      item.style.opacity = "";
    }
  };
  var elementExists = function(element) {
    return element !== void 0 && element !== null;
  };
  var animationPlay = function(element, timeout = 0) {
    if (!elementExists(element))
      return;
    element.classList.remove("is-paused");
    element.classList.add("is-playing");
    if (timeout > 0) {
      setTimeout(() => {
        animationPause(element);
      }, timeout);
    }
  };
  var animationPause = function(element, timeout = 0) {
    if (!elementExists(element))
      return;
    element.classList.remove("is-playing");
    element.classList.add("is-paused");
    if (timeout > 0) {
      setTimeout(() => {
        animationPlay(element);
      }, timeout);
    }
  };
  var timelineLabelExists = function(timeline, frame) {
    return timeline.labels[frame] !== void 0;
  };
  var timelinePlay = function(timeline, frame) {
    if (!timelineLabelExists(timeline, frame))
      return;
    timeline.seek(`${frame}-=.1`, false);
  };
  var timelinePause = function(timeline, frame) {
    if (!timelineLabelExists(timeline, frame))
      return;
    timeline.addPause(`${frame}`);
  };
  var timelinePlayPause = function(timeline, frameFrom, frameTo) {
    timelinePlay(timeline, frameFrom);
    timelinePause(timeline, frameTo);
  };
  var timelinePausePlay = function(timeline, frame, pause) {
    timelinePause(timeline, frame);
    setTimeout(() => {
      timeline.resume();
    }, pause);
  };
  var timelineSeek = function(timeline, frame) {
    timelinePlayPause(timeline, frame, frame);
  };
  var timelineElementExists = function(selector, checkContent = true) {
    let exists = false;
    let element = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (elementExists(element)) {
      if (checkContent) {
        let elementContent;
        if (element.tagName === "IMG") {
          elementContent = element.getAttribute("src");
        } else {
          elementContent = element.textContent;
        }
        if (elementContent !== "" && !elementContent.includes("empty.png"))
          exists = true;
      } else {
        exists = true;
      }
    }
    return exists;
  };
  var timelinePauseOnTextLength = function(timeline, frame, selector, threshold, pause) {
    let element = document.querySelector(selector);
    if (element === null)
      return;
    if (element.textContent.length > threshold) {
      if (element.classList.contains("font-size-2")) {
        element.classList.remove("font-size-2");
        element.classList.add("font-size-3");
      }
      if (element.classList.contains("font-size-1")) {
        element.classList.remove("font-size-1");
        element.classList.add("font-size-2");
      }
      timelinePausePlay(timeline, frame, pause);
    }
  };

  // src/banners/medium-ease/scripts/main.js
  var advert = function() {
    const options = {
      version: "medium-ease",
      size: "300x250",
      width: 300,
      height: 250,
      animTransition: 0.75,
      animTransitionFirst: 0.25,
      animPause: 4,
      animEase: Power1.easeOut
    };
    const timeline = gsap.timeline({ ease: options.animEase });
    const timelineEnd = gsap.timeline({ ease: options.animEase, paused: true });
    const bannerSizeMobile = options.size === "320x50" || options.size === "320x100";
    let frameEndOverlap = options.animTransition;
    const init = function() {
      animate();
    };
    const animateEnd = function() {
      if (!bannerSizeMobile) {
        timelineEnd.to(".btn", { x: 0, opacity: 1, duration: options.animTransition, ease: "none" });
      } else {
        timelineEnd.to(".arrow", { x: 6, duration: 0.2, delay: 0.25, repeat: 1, yoyo: true });
      }
      timeline.add(timelineEnd.play(), ">");
    };
    const animate = function() {
      let spriteSheet1 = document.querySelector(".sprite-sheet-1");
      let spriteSheet2 = document.querySelector(".sprite-sheet-2");
      gsap.set(".frame", { y: options.height * -1 });
      gsap.set(".frame-1", { x: 0, y: 0 });
      gsap.set(spriteSheet2, { opacity: 0 });
      if (timelineElementExists(spriteSheet1, false)) {
        timeline.to(".frame-1", {
          opacity: 1,
          duration: options.animTransitionFirst,
          onStart: setupShowElement,
          onComplete: function() {
            showElement(this);
            animationPlay(spriteSheet1, 4500);
          }
        });
        timeline.addLabel("frame-1");
        timeline.to(".sprite-sheet-bg, .frame-1 .frame-content", {
          opacity: 0,
          duration: options.animTransition,
          delay: 4.5,
          onStart: function() {
            gsap.set(spriteSheet1, { opacity: 0 });
            gsap.set(spriteSheet2, { opacity: 1 });
            animationPlay(spriteSheet2);
          },
          onComplete: hideElement
        });
        timeline.to(".sprite-sheet-bg", { y: options.height / 8, duration: options.animTransition }, `-=${options.animTransition}`);
        timeline.to(".frame-1", { y: options.height, duration: options.animTransition, delay: 2, onComplete: hideElement });
        timeline.to(spriteSheet2, {
          opacity: 0,
          duration: options.animTransition,
          onComplete: function() {
            gsap.set(".sprite-sheet-outer", { display: "none" });
          }
        }, `-=${options.animTransition}`);
      } else {
        timeline.to(".frame-1", { opacity: 1, duration: options.animTransitionFirst, onStart: setupShowElement, onComplete: showElement });
        timeline.addLabel("frame-1");
        timeline.to(".frame-1", { y: options.height, duration: options.animTransition, delay: options.animPause, onComplete: hideElement });
      }
      if (timelineElementExists(".text-2")) {
        timeline.to(".frame-2", { y: 0, duration: options.animTransition, onStart: setupShowElement, onComplete: showElement }, `-=${options.animTransition}`);
        timeline.addLabel("frame-2");
        timeline.addLabel("frame-2");
        timeline.to(".frame-2", { y: options.height, duration: options.animTransition, delay: options.animPause, onComplete: hideElement });
      }
      if (timelineElementExists(".text-3")) {
        timeline.to(".frame-3", { y: 0, duration: options.animTransition, onStart: setupShowElement, onComplete: showElement }, `-=${options.animTransition}`);
        timeline.addLabel("frame-3");
        timeline.to(".frame-3", { y: options.height, duration: options.animTransition, delay: options.animPause, onComplete: hideElement });
      }
      if (timelineElementExists(".text-4")) {
        timeline.to(".frame-4", { y: 0, duration: options.animTransition, onStart: setupShowElement, onComplete: showElement }, `-=${options.animTransition}`);
        timeline.addLabel("frame-4");
        timeline.to(".frame-4", { y: options.height, duration: options.animTransition, delay: options.animPause, onComplete: hideElement });
      }
      timeline.to(".frame-end", { y: 0, duration: options.animTransition, onStart: setupShowElement, onComplete: showElement }, `-=${frameEndOverlap}`);
      animateEnd();
      timeline.to(".logo", { opacity: 1, duration: options.animTransition, onStart: setupShowElement, onComplete: showElement });
      timeline.addLabel("frame-end");
      timelinePauseOnTextLength(timeline, "frame-1", ".text-1", 60, 1e3);
      timelinePauseOnTextLength(timeline, "frame-end", ".text-1", 180, 1e3);
      if (!true) {
        timelineSeek(timeline, "frame-end");
      }
    };
    return {
      init
    };
  }();
  window.advert = advert;
})();
