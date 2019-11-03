'use strict';


function getBoardParams(level) {
  switch (level) {
    case /* Easy */0 :
        return /* tuple */[
                9,
                9,
                10
              ];
    case /* Normal */1 :
        return /* tuple */[
                16,
                16,
                40
              ];
    case /* Hard */2 :
        return /* tuple */[
                30,
                16,
                99
              ];
    
  }
}

var MineSweeper = {
  getBoardParams: getBoardParams
};

exports.MineSweeper = MineSweeper;
/* No side effect */
