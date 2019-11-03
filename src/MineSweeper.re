module MineSweeper = {
  type underground =
    | Bomb
    | DangerLevel(int);

  type ground =
    | Digged(underground)
    | Undigged(underground)
    | Flag(underground);

  type board = list(list(ground));

  type level =
    | Easy
    | Normal
    | Hard;

  type progress =
    | Waiting
    | Playing
    | Over
    | Clear;

  let getBoardParams = (level: level): (int, int, int) => {
    // windows のマインスイーパ準拠
    // 初級：9×9のマスに10個の地雷
    // 中級：16×16のマスに40個の地雷
    // 上級：30×16のマスに99個の地雷
    switch (level) {
    | Easy => (9, 9, 10)
    | Normal => (16, 16, 40)
    | Hard => (30, 16, 99)
    };
  };
};
