// Build mdi.svg
// <svg>
//   <defs>
//     <g id="name">
//       <path d="..."/>
//     </g>
//     ...
//   </defs>
// </svg>
const fs = require('fs');
const svgPackageFolder = "./node_modules/@mdi/svg";
const encoding = "utf8";
const outputFile = "mdi.svg";

function getVersion() {
  const file = fs.readFileSync(`${svgPackageFolder}/package.json`, { encoding });
  return JSON.parse(file).version;
}

function getSvgFiles() {
  return fs.readdirSync(`${svgPackageFolder}/svg`).map(file => {
    return `${svgPackageFolder}/svg/${file}`;
  })
}

function getNameWithPaths(files) {
  // { name: "icon-name", path: "M..." }
  return files.map(file => {
    const name = file.match(/([^\/]+)\.svg$/)[1];
    const path = fs.readFileSync(file, { encoding }).match(/d="([^"]+)"/)[1];
    return { name, path };
  })
}

function writeFile(name, data) {
  fs.writeFileSync(`./${name}`, data, { encoding });
}

function build() {
  const version = getVersion();
  const files = getSvgFiles();
  const icons = getNameWithPaths(files);
  const items = icons.map(({name, path}) => {
    return `<g id="${name}"><path d="${path}"/></g>`
  });
  const template = `<svg><defs>${items.join('')}</defs></svg>`;
  writeFile(outputFile, template);
  console.log(`Successfully built v${version}!`);
}

build();