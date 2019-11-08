'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Random = require("bs-platform/lib/js/random.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Board$SisisinSweeper = require("../Board/Board.bs.js");
var MineSweeper$SisisinSweeper = require("../MineSweeper.bs.js");

function replaceCell(rowIndex, colIndex, board, replacer) {
  return List.mapi((function (ri, row) {
                if (ri === rowIndex) {
                  return List.mapi((function (ci, g) {
                                if (ci === colIndex) {
                                  return Curry._1(replacer, g);
                                } else {
                                  return g;
                                }
                              }), row);
                } else {
                  return row;
                }
              }), board);
}

function digGround(g) {
  switch (g.tag | 0) {
    case /* Undigged */1 :
        return /* Digged */Block.__(0, [g[0]]);
    case /* Digged */0 :
    case /* Flag */2 :
        return g;
    
  }
}

function toggleFlag(g) {
  switch (g.tag | 0) {
    case /* Digged */0 :
        return g;
    case /* Undigged */1 :
        return /* Flag */Block.__(2, [g[0]]);
    case /* Flag */2 :
        return /* Undigged */Block.__(1, [g[0]]);
    
  }
}

function digArroundCell(ri, ci, board, level) {
  var match = MineSweeper$SisisinSweeper.MineSweeper.getBoardParams(level);
  var height = match[1];
  var width = match[0];
  var _stack = /* :: */[
    /* tuple */[
      ri,
      ci
    ],
    /* [] */0
  ];
  var _board = board;
  while(true) {
    var board$1 = _board;
    var stack = _stack;
    if (stack) {
      var hd = stack[0];
      var ci$1 = hd[1];
      var ri$1 = hd[0];
      var tl = stack[1];
      if (0 <= ri$1 && ri$1 <= (height - 1 | 0) && 0 <= ci$1 && ci$1 <= (width - 1 | 0)) {
        var match$1 = List.nth(List.nth(board$1, ri$1), ci$1);
        switch (match$1.tag | 0) {
          case /* Undigged */1 :
              var match$2 = match$1[0];
              if (match$2 && match$2[0] === 0) {
                _board = replaceCell(ri$1, ci$1, board$1, digGround);
                _stack = /* :: */[
                  /* tuple */[
                    ri$1 - 1 | 0,
                    ci$1 - 1 | 0
                  ],
                  /* :: */[
                    /* tuple */[
                      ri$1 - 1 | 0,
                      ci$1
                    ],
                    /* :: */[
                      /* tuple */[
                        ri$1 - 1 | 0,
                        ci$1 + 1 | 0
                      ],
                      /* :: */[
                        /* tuple */[
                          ri$1,
                          ci$1 - 1 | 0
                        ],
                        /* :: */[
                          /* tuple */[
                            ri$1,
                            ci$1 + 1 | 0
                          ],
                          /* :: */[
                            /* tuple */[
                              ri$1 + 1 | 0,
                              ci$1 - 1 | 0
                            ],
                            /* :: */[
                              /* tuple */[
                                ri$1 + 1 | 0,
                                ci$1
                              ],
                              /* :: */[
                                /* tuple */[
                                  ri$1 + 1 | 0,
                                  ci$1 + 1 | 0
                                ],
                                tl
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ];
                continue ;
              }
              break;
          case /* Digged */0 :
          case /* Flag */2 :
              break;
          
        }
        _board = replaceCell(ri$1, ci$1, board$1, digGround);
        _stack = tl;
        continue ;
      } else {
        _board = replaceCell(ri$1, ci$1, board$1, digGround);
        _stack = tl;
        continue ;
      }
    } else {
      return board$1;
    }
  };
}

function initializeBoard(ri, ci, board, level) {
  var match = MineSweeper$SisisinSweeper.MineSweeper.getBoardParams(level);
  var height = match[1];
  var width = match[0];
  var generateRandomCoordinates = function (_list, _mineNum) {
    while(true) {
      var mineNum = _mineNum;
      var list = _list;
      if (mineNum !== 0) {
        Random.self_init(/* () */0);
        var item_000 = Random.$$int(height);
        var item_001 = Random.$$int(width);
        var item = /* tuple */[
          item_000,
          item_001
        ];
        if (List.mem(item, list) || Caml_obj.caml_equal(item, /* tuple */[
                ri,
                ci
              ])) {
          continue ;
        } else {
          _mineNum = mineNum - 1 | 0;
          _list = /* :: */[
            item,
            list
          ];
          continue ;
        }
      } else {
        return list;
      }
    };
  };
  var countBombNum = function (l) {
    return List.fold_left((function (dl, g) {
                  switch (g.tag | 0) {
                    case /* Undigged */1 :
                        if (g[0]) {
                          return dl;
                        } else {
                          return dl + 1 | 0;
                        }
                    case /* Digged */0 :
                    case /* Flag */2 :
                        return dl;
                    
                  }
                }), 0, l);
  };
  var getThreeCells = function (i, l) {
    if ((i - 1 | 0) < 0) {
      return /* :: */[
              List.nth(l, i),
              /* :: */[
                List.nth(l, i + 1 | 0),
                /* [] */0
              ]
            ];
    } else if ((width - 1 | 0) < (i + 1 | 0)) {
      return /* :: */[
              List.nth(l, i - 1 | 0),
              /* :: */[
                List.nth(l, i),
                /* [] */0
              ]
            ];
    } else {
      return /* :: */[
              List.nth(l, i - 1 | 0),
              /* :: */[
                List.nth(l, i),
                /* :: */[
                  List.nth(l, i + 1 | 0),
                  /* [] */0
                ]
              ]
            ];
    }
  };
  var bombPlacedBoard = List.fold_left((function (b, c) {
          return replaceCell(c[0], c[1], b, (function (param) {
                        return /* Undigged */Block.__(1, [/* Bomb */0]);
                      }));
        }), board, generateRandomCoordinates(/* [] */0, match[2]));
  var subBoard = List.map((function (row) {
          return List.mapi((function (ci, g) {
                        switch (g.tag | 0) {
                          case /* Undigged */1 :
                              if (g[0]) {
                                if (ci === 0) {
                                  var dl = countBombNum(/* :: */[
                                        List.nth(row, ci + 1 | 0),
                                        /* [] */0
                                      ]);
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[dl]]);
                                } else if (ci === (width - 1 | 0)) {
                                  var dl$1 = countBombNum(/* :: */[
                                        List.nth(row, ci - 1 | 0),
                                        /* [] */0
                                      ]);
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[dl$1]]);
                                } else {
                                  var dl$2 = countBombNum(/* :: */[
                                        List.nth(row, ci + 1 | 0),
                                        /* :: */[
                                          List.nth(row, ci - 1 | 0),
                                          /* [] */0
                                        ]
                                      ]);
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[dl$2]]);
                                }
                              } else {
                                return g;
                              }
                          case /* Digged */0 :
                          case /* Flag */2 :
                              return g;
                          
                        }
                      }), row);
        }), bombPlacedBoard);
  var dangerLevelPlacedBoard = List.mapi((function (ri, row) {
          return List.mapi((function (ci, g) {
                        switch (g.tag | 0) {
                          case /* Undigged */1 :
                              var match = g[0];
                              if (match) {
                                var i = match[0];
                                if (ri === 0) {
                                  var dl = countBombNum(getThreeCells(ci, List.nth(subBoard, ri + 1 | 0)));
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[i + dl | 0]]);
                                } else if (ri === (height - 1 | 0)) {
                                  var dl$1 = countBombNum(getThreeCells(ci, List.nth(subBoard, ri - 1 | 0)));
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[i + dl$1 | 0]]);
                                } else {
                                  var dl$2 = countBombNum(List.append(getThreeCells(ci, List.nth(subBoard, ri - 1 | 0)), getThreeCells(ci, List.nth(subBoard, ri + 1 | 0))));
                                  return /* Undigged */Block.__(1, [/* DangerLevel */[i + dl$2 | 0]]);
                                }
                              } else {
                                return g;
                              }
                          case /* Digged */0 :
                          case /* Flag */2 :
                              return g;
                          
                        }
                      }), row);
        }), subBoard);
  return digArroundCell(ri, ci, dangerLevelPlacedBoard, level);
}

function initializeCleanBoard(level) {
  var match = MineSweeper$SisisinSweeper.MineSweeper.getBoardParams(level);
  return $$Array.to_list(Caml_array.caml_make_vect(match[1], $$Array.to_list(Caml_array.caml_make_vect(match[0], /* Undigged */Block.__(1, [/* DangerLevel */[0]])))));
}

function checkProgress(board) {
  var isGameOver = List.exists((function (g) {
          return Caml_obj.caml_equal(g, /* Digged */Block.__(0, [/* Bomb */0]));
        }), List.flatten(board));
  var isGameClear = List.for_all((function (g) {
          switch (g.tag | 0) {
            case /* Digged */0 :
                if (g[0]) {
                  return true;
                } else {
                  return false;
                }
            case /* Undigged */1 :
            case /* Flag */2 :
                if (g[0]) {
                  return false;
                } else {
                  return true;
                }
            
          }
        }), List.flatten(board));
  if (isGameOver) {
    return /* Over */2;
  } else if (isGameClear) {
    return /* Clear */3;
  } else {
    return /* Playing */1;
  }
}

var initialState_002 = /* board */initializeCleanBoard(/* Easy */0);

var initialState = /* record */[
  /* progress : Waiting */0,
  /* level : Easy */0,
  initialState_002,
  /* startTime */0.0
];

function reducer(state, action) {
  switch (action.tag | 0) {
    case /* DigGround */0 :
        if (state[/* progress */0] === /* Over */2 || state[/* progress */0] === /* Clear */3) {
          return state;
        } else {
          var ci = action[1];
          var ri = action[0];
          if (state[/* progress */0] === /* Waiting */0) {
            var startTime = Date.now();
            var board = initializeBoard(ri, ci, state[/* board */2], state[/* level */1]);
            var progress = checkProgress(board);
            return /* record */[
                    /* progress */progress,
                    /* level */state[/* level */1],
                    /* board */board,
                    /* startTime */startTime
                  ];
          } else {
            var board$1 = digArroundCell(ri, ci, state[/* board */2], state[/* level */1]);
            var progress$1 = checkProgress(board$1);
            return /* record */[
                    /* progress */progress$1,
                    /* level */state[/* level */1],
                    /* board */board$1,
                    /* startTime */state[/* startTime */3]
                  ];
          }
        }
    case /* ToggleFlag */1 :
        if (state[/* progress */0] === /* Over */2 || state[/* progress */0] === /* Clear */3) {
          return state;
        } else {
          var board$2 = replaceCell(action[0], action[1], state[/* board */2], toggleFlag);
          return /* record */[
                  /* progress */state[/* progress */0],
                  /* level */state[/* level */1],
                  /* board */board$2,
                  /* startTime */state[/* startTime */3]
                ];
        }
    case /* ChangeLevel */2 :
        var level = action[0];
        return /* record */[
                /* progress : Waiting */0,
                /* level */level,
                /* board */initializeCleanBoard(level),
                /* startTime */0.0
              ];
    
  }
}

function Game(Props) {
  var match = React.useReducer(reducer, initialState);
  var dispatch = match[1];
  var state = match[0];
  var digGround = function (ri, ci) {
    return Curry._1(dispatch, /* DigGround */Block.__(0, [
                  ri,
                  ci
                ]));
  };
  var toggleFlag = function (ri, ci) {
    return Curry._1(dispatch, /* ToggleFlag */Block.__(1, [
                  ri,
                  ci
                ]));
  };
  var toText = function (progress, level, startTime) {
    var levelText;
    switch (level) {
      case /* Easy */0 :
          levelText = "Easy";
          break;
      case /* Normal */1 :
          levelText = "Normal";
          break;
      case /* Hard */2 :
          levelText = "Hard";
          break;
      
    }
    switch (progress) {
      case /* Waiting */0 :
          return "Let's Try: " + levelText;
      case /* Playing */1 :
          return "Now Playing: " + levelText;
      case /* Over */2 :
          return "Game Over...";
      case /* Clear */3 :
          return "Game Clear! time: " + ((Date.now() - startTime).toString() + "ms");
      
    }
  };
  return React.createElement("div", undefined, React.createElement("div", {
                  className: "information"
                }, toText(state[/* progress */0], state[/* level */1], state[/* startTime */3])), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* ChangeLevel */Block.__(2, [/* Easy */0]));
                    })
                }, "Easy"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* ChangeLevel */Block.__(2, [/* Normal */1]));
                    })
                }, "Normal"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* ChangeLevel */Block.__(2, [/* Hard */2]));
                    })
                }, "Hard"), React.createElement(Board$SisisinSweeper.make, {
                  board: state[/* board */2],
                  digGround: digGround,
                  toggleFlag: toggleFlag
                }));
}

var initialLevel = /* Easy */0;

var make = Game;

exports.replaceCell = replaceCell;
exports.digGround = digGround;
exports.toggleFlag = toggleFlag;
exports.digArroundCell = digArroundCell;
exports.initialLevel = initialLevel;
exports.initializeBoard = initializeBoard;
exports.initializeCleanBoard = initializeCleanBoard;
exports.checkProgress = checkProgress;
exports.initialState = initialState;
exports.reducer = reducer;
exports.make = make;
/* initialState Not a pure module */
