// import jsdom from "jsdom";
// const { JSDOM } = jsdom;

export function tokanize(source) {
  let current = 0;
  const tokens = [];
  while (current < source.length) {
    if (source[current] === ".") {
      let className = "";
      while (source[current] !== "\n" && source[current] !== " ") {
        className += source[current];
        current += 1;
      }
      tokens.push({
        type: "className",
        value: className,
      });
    } else if (source[current].match(/^[a-zA-Z]*$/)) {
      let className = "";
      while (source[current] !== "\n" && source[current] !== " ") {
        className += source[current];
        current += 1;
      }
      tokens.push({
        type: "element",
        value: className,
      });
    } else if (source[current] === "{") {
      tokens.push({
        type: "curlyBracket",
        value: source[current],
      });
      while (source[current] !== "}") {
        current += 1;
        if (source[current].match(/^[a-zA-Z]*$/)) {
          let tStyle = "";
          while (source[current] !== "\n") {
            tStyle += source[current];
            current += 1;
          }
          tokens.push({
            type: "tcss",
            value: tStyle,
          });
        } else if (source[current] === "@") {
          if (source.slice(current + 1, current + 4) === "css") {
            current += 4;
            while (source[current] !== "@") {
              if (source[current].match(/^[a-zA-Z]*$/)) {
                let style = "";
                while (source[current] !== ";") {
                  style += source[current];
                  current += 1;
                }
                tokens.push({
                  type: "css",
                  value: style,
                });
              }
              current += 1;
            }
            if (source.slice(current + 1, current + 7) === "endcss") {
              current += 8;
            }
          }
        }
      }
      tokens.push({
        type: "curlyBracket",
        value: "}",
      });
    }
    current += 1;
  }
  return tokens;
}

export function ASTgen(tokens) {
  const AST = {};
  let current = 0;
  let currentClassNames = [];
  while (current < tokens.length) {
    if (
      tokens[current].type === "className" ||
      tokens[current].type === "element"
    ) {
      currentClassNames.push(tokens[current].value);
    } else if (tokens[current].value === "{") {
      current += 1;
      while (tokens[current].value !== "}") {
        const style = tokens[current];
        for (const className of currentClassNames) {
          if (AST.hasOwnProperty(className)) {
            AST[className][style.type].push(style.value);
          } else {
            if (style.type === "tcss") {
              AST[className] = {
                tcss: [style.value],
                css: [],
              };
            } else {
              AST[className] = {
                tcss: [],
                css: [style.value],
              };
            }
          }
        }
        current += 1;
      }
      currentClassNames = [];
    }
    current += 1;
  }
  return AST;
}

// export function codeGen(source, AST) {
//   source = source.split("className").join("class");
//   const dom = new JSDOM(source);
//   const $ = dom.window.document;
//   Object.keys(AST).forEach((key) => {
//     for (const element of $.querySelectorAll(key)) {
//       element.className += " " + AST[key].tcss.join(" ");
//       if (AST[key].css.length > 1)
//         element.setAttribute("style", AST[key].css.join(";"));
//     }
//   });
//   return $.querySelector("body").innerHTML.split("class").join("className");
// }

export function extractJSX(code) {
  const first_paran = /return\s*\(/;
  let last_paran = 0;
  for (let i in code) {
    if (code[i] === ")") {
      last_paran = i;
    }
  }
  const len = code.match(first_paran)[0].length;
  return code.substring(code.search(first_paran) + len, last_paran);
}

export function replaceJSX(code, jsx) {
  let first_paran_re = /return\s*\(/;
  const first_paran =
    code.search(first_paran_re) + code.match(first_paran_re)[0].length;
  let last_paran = 0;
  for (let i in code) {
    if (code[i] === ")") {
      last_paran = i;
    }
  }
  const prefix = code.substring(0, first_paran) + "\n";
  const suffix = code.substring(last_paran, code.length);
  return prefix + jsx + suffix;
}
