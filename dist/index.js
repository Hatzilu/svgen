#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from 'node:path';
function main() {
    var svgPath = process.argv[process.argv.findIndex(function (a) { return a === '-p'; }) + 1];
    var outputPath = process.argv[process.argv.findIndex(function (a) { return a === '-o'; }) + 1];
    var p = path.resolve(svgPath);
    var files = readdirSync(p);
    var typesBuf = "import { ComponentPropsWithRef } from \"react\"; \r\n\r\ntype Props = ComponentPropsWithRef<'svg'> & {\n        kind:";
    var componentBuf = "export function Icon ({kind, ...props}: Props) {\n    switch (kind) {";
    // writeFile("./output.tsx", )
    files.forEach(function (f) {
        var name = f.split('.')[0];
        var fullPath = path.join(p, f);
        var contents = readFileSync(fullPath);
        typesBuf += "\r\n\t\t| \"".concat(name, "\"");
        componentBuf += "\r\n\t\tcase \"".concat(name, "\": return (").concat(contents, ");");
    });
    typesBuf += "\n};\n\n";
    componentBuf += "\r\n\t\tdefault: return null;\r\n\t};\r\n};";
    writeFileSync(outputPath, Buffer.from(typesBuf + componentBuf, 'utf-8'));
}
main();
