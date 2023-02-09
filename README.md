# viridium-lab

## Setup
1. create a brand new git repostory
2. Install libraries needed
   1. npm install react typescript @types/react --save-dev
   2. npx tsc --init 
3. edit tsconfig.js
    "jsx" : "react",
    "module": "ESNext",
    "declaration": true,
    "declarationDir": "types",
    "sourceMap": true,
    "outDir": "dist",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "emitDeclarationOnly": true
4. instlal rollup
   1. npm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-dts --save-dev
5. create rollup.config.js 
6. update package.json
  "name": "viridium-lib",
  "version": "0.0.1",
  "description": "Common lib for viridium design",
  "scripts": {
    "rollup": "rollup -c"
  },
  "author": "Sarah Wang",
  "license": "ISC",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "files": [
    "dist"
  ],
  "types": "dist/index.d.ts",
7. create ~/.npmrc

----
registry-https://registry.npmjs.org/
@viridiumdesign:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=token_generated_from_github
---

for write and read package

8. update package.json change name and publishConfig

9. npm publish


------ to use the package from a different app
10. npm install @viridiumdesign/viridium-lab


11. handle css
    1.  add Button.css and import it into tsx
    2.  add plugin to rollup.config.mjs 
        1.  import postcss from "rollup-plugin-postcss";
        2. npm install rollup-plugin-postcss --save-dev
        3. add following line to rollup.config.mjs tds plugin       
           1. external:[/\.css$/] to 

12. update version