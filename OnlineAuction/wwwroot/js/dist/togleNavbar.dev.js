"use strict";

function togleNavbar(className, togleClass) {
  var element = document.getElementsByClassName(className)[0];
  element.classList.toggle(togleClass);
}