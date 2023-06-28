import fs from "fs";
import { tokanize, ASTgen } from "./compiler.js";
import browserSync from "browser-sync";
import chokidar from 'chokidar'

const tailwind = fs.readFileSync("./tailwind.min.css").toString();

const getStyles = (className) => {
  const index = tailwind.indexOf(`.${className}`);
  if (index === -1) {
    console.error("cannot find ", className);
    return []
  };
  let current = index;
  let styles = "";
  while (tailwind[++current] !== "{");
  while (tailwind[++current] !== "}") {
    styles += tailwind[current];
  }
  return styles.split(";");
};

function compileTcss() {
  const tcss = fs.readFileSync("./styles.tcss").toString();

  const ast = ASTgen(tokanize(tcss));
  const keys = Object.keys(ast);

  const css = {};
  for (const key of keys) {
    css[key] = [];
    for (const tcss of ast[key].tcss) {
      css[key] = css[key].concat(getStyles(tcss));
    }

    for (const rawcss of ast[key].css) {
      css[key] = css[key].concat(rawcss.replace(';', ''));
    }
  }

  let cssCode = fs.readFileSync("./base.css").toString();

  for (const className of Object.keys(css)) {
    cssCode += `\n${className} { ${css[className].join(";")} }`;
  }

  fs.writeFileSync("./index.css", cssCode, (err) => {
    if (err) console.error(err);
  });
}

browserSync.init({
  server: "./",
  port: 3000,
  open: false,
  files: ["./index.html"],
});

compileTcss();
const watcher = chokidar.watch(['./*.tcss']);

watcher.on('change', (path) => {
  console.log(`[tcss compiler] reloading change on ${path}`);
  compileTcss();
  browserSync.reload();
});

browserSync.reload();
