// explosion animation adapted from https://codepen.io/nicksheffield

var close = document.getElementsByClassName("closeTab");
var tabs = document.getElementsByClassName("tab");
var anchors = document.querySelectorAll("button.btn");

Array.prototype.forEach.call(close, function (close) {
  close.addEventListener("click", explode);
});

Array.prototype.forEach.call(tabs, function (tab) {
  tab.style.width = tab.offsetWidth + "px";
});

Array.prototype.forEach.call(anchors, function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    return false;
  });
});

function getOffset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

export default function explode(e) {
  var targetTab = e.currentTarget.parentElement;
  var tabOffsets = getOffset(targetTab);
  var x = tabOffsets.left;
  var y = tabOffsets.top + 10;
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  var ratio = window.devicePixelRatio;
  var particles = [];

  targetTab.classList.add("tabClosed");

  window.setTimeout(function () {
    document.body.appendChild(c);

    /*c.style.position = 'absolute'
				c.style.left = (x - 100) + 'px'
				c.style.top = (y - 100) + 'px'
				c.style.pointerEvents = 'none'
				c.style.width = 200 + 'px'
				c.style.height = 200 + 'px'
				c.width = 200 * ratio
				c.height = 200 * ratio*/

    c.style.position = "absolute";
    c.style.left = x - 40 + "px";
    c.style.top = y - 150 + "px";
    c.style.pointerEvents = "none";
    c.style.width = 80 + "px";
    c.style.height = 300 + "px";
    c.width = 80 * ratio;
    c.height = 300 * ratio;

    // for (var i = 0; ++i < 25; ) {
    //   particles.push(Particle());
    // }

    function render() {
      ctx.clearRect(0, 0, c.width, c.height);

      particles.forEach(function (p, i) {
        p.opacity -= 0.01;
        p.speed *= p.friction;
        p.radius *= p.friction;

        p.yVel += p.gravity;
        p.y += p.yVel;

        if (p.opacity < 0) return;
        if (p.radius < 0) return;

        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        ctx.fill();
      });
    }

    (function renderLoop() {
      requestAnimationFrame(renderLoop);
      render();
    })();

    setTimeout(function () {
      document.body.removeChild(c);
    }, 3000);
  }, 150);
}



