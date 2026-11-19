const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const testFile = process.argv[2] || "scripts/test-part2-features.ts";
const fullPath = path.resolve(testFile);
const source = fs.readFileSync(fullPath, "utf-8");

// Set up ts transpilation hook for local imports
const originalRequire = require.extensions[".ts"];
require.extensions[".ts"] = function (module, filename) {
  const fileContent = fs.readFileSync(filename, "utf-8");
  const transpiled = ts.transpileModule(fileContent, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: filename,
  });
  module._compile(transpiled.outputText, filename);
};

// Also handle @/ aliases
const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain) {
  if (request.startsWith("@/")) {
    const aliased = path.resolve(__dirname, "..", request.replace("@/", ""));
    return originalResolveFilename.call(this, aliased, parent, isMain);
  }
  return originalResolveFilename.call(this, request, parent, isMain);
};

const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
  fileName: fullPath,
});

const m = new Module(fullPath, module.parent);
m.filename = fullPath;
m.paths = Module._nodeModulePaths(path.dirname(fullPath));
m._compile(output.outputText, fullPath);
