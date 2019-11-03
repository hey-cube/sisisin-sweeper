open MineSweeper;

type state = {
  progress: MineSweeper.progress,
  level: MineSweeper.level,
  board: MineSweeper.board,
  startTime: float,
};

type action =
  | DigGround(int, int)
  | ToggleFlag(int, int)
  | ChangeLevel(MineSweeper.level);

let replaceCell =
    (
      rowIndex: int,
      colIndex: int,
      board: MineSweeper.board,
      replacer: MineSweeper.ground => MineSweeper.ground,
    )
    : MineSweeper.board => {
  List.mapi(
    (ri, row) =>
      if (ri == rowIndex) {
        List.mapi(
          (ci, g) =>
            if (ci == colIndex) {
              replacer(g);
            } else {
              g;
            },
          row,
        );
      } else {
        row;
      },
    board,
  );
};

let digGround = (g: MineSweeper.ground): MineSweeper.ground =>
  switch (g) {
  | Undigged(ug) => Digged(ug)
  | _ => g
  };

let toggleFlag = (g: MineSweeper.ground): MineSweeper.ground =>
  switch (g) {
  | Undigged(ug) => Flag(ug)
  | Flag(ug) => Undigged(ug)
  | _ => g
  };

// 周囲に爆弾がないマスがクリックされたら、爆弾の側のマスまで勝手に開く
let digArroundCell = (ri, ci, board, level): MineSweeper.board => {
  let (width, height, _) = MineSweeper.getBoardParams(level);

  let rec digArroundCellSub =
          (stack: list((int, int)), board: MineSweeper.board) => {
    switch (stack) {
    | [hd, ...tl] =>
      let (ri, ci) = hd;
      if (0 <= ri && ri <= height - 1 && 0 <= ci && ci <= width - 1) {
        switch (List.nth(List.nth(board, ri), ci)) {
        | Undigged(DangerLevel(0)) =>
          digArroundCellSub(
            [
              (ri - 1, ci - 1),
              (ri - 1, ci),
              (ri - 1, ci + 1),
              (ri, ci - 1),
              (ri, ci + 1),
              (ri + 1, ci - 1),
              (ri + 1, ci),
              (ri + 1, ci + 1),
              ...tl,
            ],
            replaceCell(ri, ci, board, digGround),
          )
        | _ => digArroundCellSub(tl, replaceCell(ri, ci, board, digGround))
        };
      } else {
        digArroundCellSub(tl, replaceCell(ri, ci, board, digGround));
      };
    | _ => board
    };
  };

  digArroundCellSub([(ri, ci)], board);
};

let initialLevel = MineSweeper.Easy;

let initializeBoard = (ri, ci, board, level): MineSweeper.board => {
  let (width, height, mineNum) = MineSweeper.getBoardParams(level);

  let rec generateRandomCoordinates = (list, mineNum) => {
    switch (mineNum) {
    | 0 => list
    | _ =>
      Random.self_init();
      let item = (Random.int(height), Random.int(width));
      if (List.mem(item, list) || item == (ri, ci)) {
        generateRandomCoordinates(list, mineNum);
      } else {
        generateRandomCoordinates([item, ...list], mineNum - 1);
      };
    };
  };

  let countBombNum = l => {
    List.fold_left(
      (dl, g) =>
        switch (g) {
        | MineSweeper.Undigged(Bomb) => dl + 1
        | _ => dl
        },
      0,
      l,
    );
  };

  let getThreeCells = (i, l) =>
    if (i - 1 < 0) {
      [List.nth(l, i), List.nth(l, i + 1)];
    } else if (width - 1 < i + 1) {
      [List.nth(l, i - 1), List.nth(l, i)];
    } else {
      [List.nth(l, i - 1), List.nth(l, i), List.nth(l, i + 1)];
    };

  // まず爆弾を適当に配置
  let bombPlacedBoard =
    List.fold_left(
      (b, c) => {
        let (ri, ci) = c;
        replaceCell(ri, ci, b, _ => MineSweeper.Undigged(MineSweeper.Bomb));
      },
      board,
      generateRandomCoordinates([], mineNum),
    );

  // 横方向にある爆弾だけ考えて DangerLevel を計算・配置
  let subBoard =
    List.map(
      row =>
        List.mapi(
          (ci, g) =>
            switch (g) {
            | MineSweeper.Undigged(MineSweeper.DangerLevel(_)) =>
              if (ci == 0) {
                let dl = countBombNum([List.nth(row, ci + 1)]);
                MineSweeper.Undigged(MineSweeper.DangerLevel(dl));
              } else if (ci == width - 1) {
                let dl = countBombNum([List.nth(row, ci - 1)]);
                MineSweeper.Undigged(MineSweeper.DangerLevel(dl));
              } else {
                let dl =
                  countBombNum([
                    List.nth(row, ci + 1),
                    List.nth(row, ci - 1),
                  ]);
                MineSweeper.Undigged(MineSweeper.DangerLevel(dl));
              }
            | _ => g
            },
          row,
        ),
      bombPlacedBoard,
    );

  // 縦方向にある爆弾も考えて DangerLevel を再計算・再配置し、これを初期 state.board とする
  let dangerLevelPlacedBoard =
    List.mapi(
      (ri, row) =>
        List.mapi(
          (ci, g) =>
            switch (g) {
            | MineSweeper.Undigged(MineSweeper.DangerLevel(i)) =>
              if (ri == 0) {
                let dl =
                  countBombNum(
                    getThreeCells(ci, List.nth(subBoard, ri + 1)),
                  );
                MineSweeper.Undigged(MineSweeper.DangerLevel(i + dl));
              } else if (ri == height - 1) {
                let dl =
                  countBombNum(
                    getThreeCells(ci, List.nth(subBoard, ri - 1)),
                  );
                MineSweeper.Undigged(MineSweeper.DangerLevel(i + dl));
              } else {
                let dl =
                  countBombNum(
                    List.append(
                      getThreeCells(ci, List.nth(subBoard, ri - 1)),
                      getThreeCells(ci, List.nth(subBoard, ri + 1)),
                    ),
                  );
                MineSweeper.Undigged(MineSweeper.DangerLevel(i + dl));
              }
            | _ => g
            },
          row,
        ),
      subBoard,
    );

  // 最後にクリックされた箇所を掘る（そこは爆弾になっていないはず）
  digArroundCell(ri, ci, dangerLevelPlacedBoard, level);
};

let initializeCleanBoard = level => {
  let (width, height, _) = MineSweeper.getBoardParams(level);

  Array.to_list(
    Array.make(
      height,
      Array.to_list(
        Array.make(width, MineSweeper.Undigged(DangerLevel(0))),
      ),
    ),
  );
};

let checkProgress = (board: MineSweeper.board): MineSweeper.progress => {
  let isGameOver =
    List.exists(g => g == MineSweeper.Digged(Bomb), List.flatten(board));
  let isGameClear =
    List.for_all(
      g =>
        switch (g) {
        | MineSweeper.Undigged(Bomb) => true
        | MineSweeper.Flag(Bomb) => true
        | MineSweeper.Digged(DangerLevel(_)) => true
        | _ => false
        },
      List.flatten(board),
    );
  if (isGameOver) {
    Over;
  } else if (isGameClear) {
    Clear;
  } else {
    Playing;
  };
};

let initialState: state = {
  progress: Waiting,
  level: initialLevel,
  board: initializeCleanBoard(initialLevel),
  startTime: 0.0,
};

let reducer = (state: state, action: action): state => {
  switch (action) {
  | DigGround(ri, ci) =>
    if (state.progress == Over || state.progress == Clear) {
      state;
    } else if (state.progress == Waiting) {
      let startTime = Js.Date.now();
      let board = initializeBoard(ri, ci, state.board, state.level);
      let progress = checkProgress(board);
      {...state, progress, board, startTime};
    } else {
      let board = digArroundCell(ri, ci, state.board, state.level);
      let progress = checkProgress(board);
      {...state, progress, board};
    }

  | ToggleFlag(ri, ci) =>
    if (state.progress == Over || state.progress == Clear) {
      state;
    } else {
      let board = replaceCell(ri, ci, state.board, toggleFlag);
      {...state, board};
    }

  | ChangeLevel(level) => {
      progress: Waiting,
      level,
      board: initializeCleanBoard(level),
      startTime: 0.0,
    }
  };
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);
  let digGround = (ri, ci) => dispatch(DigGround(ri, ci));
  let toggleFlag = (ri, ci) => dispatch(ToggleFlag(ri, ci));
  let changeLevel = level => dispatch(ChangeLevel(level));

  let toText = (progress, level, startTime) => {
    let levelText =
      switch (level) {
      | MineSweeper.Easy => "Easy"
      | MineSweeper.Normal => "Normal"
      | MineSweeper.Hard => "Hard"
      };
    switch (progress) {
    | MineSweeper.Waiting => "Let's try: " ++ levelText
    | MineSweeper.Playing => "Now Playing: " ++ levelText
    | MineSweeper.Over => "Game Over..."
    | MineSweeper.Clear =>
      "Game Clear! score: " ++ Js.Float.toString(Js.Date.now() -. startTime)
    };
  };

  <div>
    <div className="information">
      {ReasonReact.string(
         toText(state.progress, state.level, state.startTime),
       )}
    </div>
    <button onClick={_ => changeLevel(MineSweeper.Easy)}>
      {ReasonReact.string("Easy")}
    </button>
    <button onClick={_ => changeLevel(MineSweeper.Normal)}>
      {ReasonReact.string("Normal")}
    </button>
    <button onClick={_ => changeLevel(MineSweeper.Hard)}>
      {ReasonReact.string("Hard")}
    </button>
    <Board board={state.board} digGround toggleFlag />
  </div>;
};
