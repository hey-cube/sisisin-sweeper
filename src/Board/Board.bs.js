'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Cell$SisisinSweeper = require("../Cell/Cell.bs.js");

function Board(Props) {
  var board = Props.board;
  var digGround = Props.digGround;
  var toggleFlag = Props.toggleFlag;
  var rows = List.mapi((function (row_i, row) {
          var cells = List.mapi((function (col_i, ground) {
                  return React.createElement(Cell$SisisinSweeper.make, {
                              ground: ground,
                              digGround: (function (param) {
                                  return Curry._2(digGround, row_i, col_i);
                                }),
                              toggleFlag: (function (param) {
                                  return Curry._2(toggleFlag, row_i, col_i);
                                }),
                              key: "cell" + (String(row_i) + ("-" + String(col_i)))
                            });
                }), row);
          return React.createElement("div", {
                      key: "row" + String(row_i),
                      className: "row"
                    }, $$Array.of_list(cells));
        }), board);
  return React.createElement("div", {
              className: "board"
            }, $$Array.of_list(rows));
}

var make = Board;

exports.make = make;
/* react Not a pure module */
