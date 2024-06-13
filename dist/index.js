#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from 'node:path';
/**
 * Builds the output file and returns it as a buffer.
 * @param files file paths read from an SVG directory
 * @param p - svg directory path
 * @returns {Buffer} concated buffer
 */
export function buildFileString(files, p) {
    var typesBuf = "import { ComponentPropsWithRef } from \"react\"; \r\n\r\ntype Props = ComponentPropsWithRef<'svg'> & {\n        kind:";
    var componentBuf = "export function Icon ({kind, ...props}: Props) {\n    switch (kind) {";

    files.forEach(function (f) {
        var name = f.split('.')[0];
        var fullPath = path.join(p, f);
        var contents = readFileSync(fullPath);
        typesBuf += "\r\n\t\t| \"".concat(name, "\"");
        componentBuf += "\r\n\t\tcase \"".concat(name, "\": return (").concat(contents, ");");
    });
    typesBuf += "\n};\n\n";
    componentBuf += "\r\n\t\tdefault: return null;\r\n\t};\r\n};";
    return Buffer.from(typesBuf + componentBuf, 'utf-8');
}
function main() {
    var svgDir = process.argv[process.argv.findIndex(function (a) { return a === '-p'; }) + 1];
    if (!svgDir) {
        throw new Error("No svg directory specified, use -p <path>");
    }
    var outputPath = process.argv[process.argv.findIndex(function (a) { return a === '-o'; }) + 1];
    if (!outputPath) {
        throw new Error("No output specified, use -o <path>");
    }
    var p = path.resolve(svgDir);
    var files = readdirSync(p);
    var buf = buildFileString(files, p);
    writeFileSync(outputPath, buf);
}
main();
