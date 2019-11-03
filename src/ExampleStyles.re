let reasonReactBlue = "#48a9dc";

// The {j|...|j} feature is just string interpolation, from
// bucklescript.github.io/docs/en/interop-cheatsheet#string-unicode-interpolation
// This allows us to conveniently write CSS, together with variables, by
// constructing a string
let style = {j|
  body {
    background-color: rgb(224, 226, 229);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
    button {
    background-color: white;
    color: $reasonReactBlue;
    box-shadow: 0 0 0 1px $reasonReactBlue;
    border: none;
    padding: 8px;
    margin-bottom: 12px;
    font-size: 16px;
  }
  button:focus {
    background-color: $reasonReactBlue;
    color: white;
    outline: none;
  }
  .container {
    margin: 12px 0px;
    box-shadow: 0px 4px 16px rgb(200, 200, 200);
    width: 1200px;
    border-radius: 12px;
    font-family: sans-serif;
  }
  .containerTitle {
    background-color: rgb(242, 243, 245);
    border-radius: 12px 12px 0px 0px;
    padding: 12px;
    font-weight: bold;
  }
  .containerContent {
    background-color: white;
    padding: 16px;
    border-radius: 0px 0px 12px 12px;
  }
  .information {
    margin-bottom: 10px;
  }
  .row {
    display: flex;
    justify-content: center;
    height: 36px;
  }
  .cell {
    height: 30px;
    width: 30px;
    margin: 3px;
    line-height: 30px;
    text-align:center;
  }
  .undigged {
    background-image: url("https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_sisisin.png?v=1572711626869");
  }
  .flag {
    background-image: url("https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_gsisisin.png?v=1572712040115");
  }
  .bomb {
    background-image: url("https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_rsisisin.png?v=1572711905906");
  }
|j};
