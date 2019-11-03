'use strict';


var reasonReactBlue = "#48a9dc";

var style = "\n  body {\n    background-color: rgb(224, 226, 229);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n    button {\n    background-color: white;\n    color: " + (String(reasonReactBlue) + (";\n    box-shadow: 0 0 0 1px " + (String(reasonReactBlue) + (";\n    border: none;\n    padding: 8px;\n    margin-bottom: 12px;\n    font-size: 16px;\n  }\n  button:focus {\n    background-color: " + (String(reasonReactBlue) + ";\n    color: white;\n    outline: none;\n  }\n  .container {\n    margin: 12px 0px;\n    box-shadow: 0px 4px 16px rgb(200, 200, 200);\n    width: 1200px;\n    border-radius: 12px;\n    font-family: sans-serif;\n  }\n  .containerTitle {\n    background-color: rgb(242, 243, 245);\n    border-radius: 12px 12px 0px 0px;\n    padding: 12px;\n    font-weight: bold;\n  }\n  .containerContent {\n    background-color: white;\n    padding: 16px;\n    border-radius: 0px 0px 12px 12px;\n  }\n  .information {\n    margin-bottom: 10px;\n  }\n  .row {\n    display: flex;\n    justify-content: center;\n    height: 36px;\n  }\n  .cell {\n    height: 30px;\n    width: 30px;\n    margin: 3px;\n    line-height: 30px;\n    text-align:center;\n  }\n  .undigged {\n    background-image: url(\"https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_sisisin.png?v=1572711626869\");\n  }\n  .flag {\n    background-image: url(\"https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_gsisisin.png?v=1572712040115\");\n  }\n  .bomb {\n    background-image: url(\"https://cdn.glitch.com/90f68e8a-d196-47ba-b1c8-458de201f3e7%2Fmini_rsisisin.png?v=1572711905906\");\n  }\n")))));

exports.reasonReactBlue = reasonReactBlue;
exports.style = style;
/* style Not a pure module */
