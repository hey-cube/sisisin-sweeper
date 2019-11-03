open MineSweeper;

[@react.component]
let make = (~board, ~digGround, ~toggleFlag) => {
  let rows =
    List.mapi(
      (row_i, row) => {
        let cells =
          List.mapi(
            (col_i, ground) =>
              <Cell
                key={
                  "cell"
                  ++ string_of_int(row_i)
                  ++ "-"
                  ++ string_of_int(col_i)
                }
                ground
                digGround={() => digGround(row_i, col_i)}
                toggleFlag={() => toggleFlag(row_i, col_i)}
              />,
            row,
          );
        <div key={"row" ++ string_of_int(row_i)} className="row">
          {React.array(Array.of_list(cells))}
        </div>;
      },
      board,
    );

  <div className="board"> {React.array(Array.of_list(rows))} </div>;
};
