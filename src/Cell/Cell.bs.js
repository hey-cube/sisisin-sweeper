'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function toClassName(ground) {
  switch (ground.tag | 0) {
    case /* Digged */0 :
        var match = ground[0];
        if (match) {
          return "danger-level-" + String(match[0]);
        } else {
          return "bomb";
        }
    case /* Undigged */1 :
        return "undigged";
    case /* Flag */2 :
        return "flag";
    
  }
}

function toText(ground) {
  switch (ground.tag | 0) {
    case /* Digged */0 :
        var match = ground[0];
        if (match) {
          return String(match[0]);
        } else {
          return "";
        }
    case /* Undigged */1 :
    case /* Flag */2 :
        return "";
    
  }
}

function Cell(Props) {
  var ground = Props.ground;
  var digGround = Props.digGround;
  var toggleFlag = Props.toggleFlag;
  return React.createElement("div", {
              className: "cell " + toClassName(ground),
              onClick: (function (param) {
                  return Curry._1(digGround, /* () */0);
                }),
              onContextMenu: (function (param) {
                  return Curry._1(toggleFlag, /* () */0);
                })
            }, toText(ground));
}

var make = Cell;

exports.toClassName = toClassName;
exports.toText = toText;
exports.make = make;
/* react Not a pure module */
