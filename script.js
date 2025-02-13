if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}








const offMenu = (event) => {
  if (event.target.closest(".navbar__menu")) return;
  document.querySelectorAll(".menu").forEach((item) => {
    item.classList.add("hidden");
    item.setAttribute("aria-hidden", "true");
  });
};

const toggleMenu = (id) => {
  const el = document.getElementById(id);
  if (el.classList.contains("hidden")) {
    document.querySelectorAll(".inner-menu").forEach((item) => {
      item.classList.add("hidden");
      item.setAttribute("aria-hidden", "true");
    });
    el.classList.remove("hidden");
    el.setAttribute("aria-hidden", "false");
  } else {
    el.classList.add("hidden");
    el.setAttribute("aria-hidden", "true");
  }
  !el.classList.contains("hidden") && el.focus();
};

// toggle open class for v2 preview bar dropdown menu
const v2Dropdown = document.getElementsByClassName("v2-dropdown")[0];
const v2DropdownTrigger = document.querySelector(".v2-dropdown .menu-trigger");
// if the preview bar dropdown exists, add event listener to toggle preview menu
if (!!v2Dropdown) {
  v2DropdownTrigger.addEventListener("click", () => {
    v2Dropdown.classList.toggle("open");
  });
}

const domBody = document.body;
const usingMouse = "using-mouse";
domBody.addEventListener("mousedown", () => {
  domBody.classList.add(usingMouse);
});
domBody.addEventListener("keydown", () => {
  domBody.classList.remove(usingMouse);
});
