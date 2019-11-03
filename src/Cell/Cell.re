open MineSweeper;

let toClassName = (ground: MineSweeper.ground) => {
  switch (ground) {
  | Digged(Bomb) => "bomb"
  | Digged(DangerLevel(n)) => "danger-level-" ++ string_of_int(n)
  | Undigged(_) => "undigged"
  | Flag(_) => "flag"
  };
};

let toText = (ground: MineSweeper.ground) => {
  switch (ground) {
  | Digged(DangerLevel(n)) => ReasonReact.string(string_of_int(n))
  | _ => ReasonReact.string("")
  };
};

[@react.component]
let make = (~ground, ~digGround, ~toggleFlag) => {
  <div
    className={"cell " ++ toClassName(ground)}
    onClick={_ => digGround()}
    onContextMenu={_ => toggleFlag()}>
    {toText(ground)}
  </div>;
};
