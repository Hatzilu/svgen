#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from 'node:path';

/**
 * Builds the output file and returns it as a buffer.
 * @param files file paths read from an SVG directory
 * @param p - svg directory path
 * @returns {Buffer} concated buffer
 */
export function buildFileString(files: string[], p: string) {
    let typesBuf = `import { ComponentPropsWithRef } from "react"; \r\n\r\ntype Props = ComponentPropsWithRef<'svg'> & {
        kind:`;
    let componentBuf = `export function Icon ({kind, ...props}: Props) {
    switch (kind) {`;
    // writeFile("./output.tsx", )
    files.forEach(f => {
        const name = f.split('.')[0];
        const fullPath = path.join(p,f);
        const contents = readFileSync(fullPath);

        typesBuf += `\r\n\t\t| "${name}"`;
        componentBuf += `\r\n\t\tcase "${name}": return (${contents});`;
    });
    typesBuf += "\n};\n\n"
    componentBuf += "\r\n\t\tdefault: return null;\r\n\t};\r\n};";

    return Buffer.from(typesBuf+componentBuf, 'utf-8');
}

function main(): void {
    const svgDir = process.argv[process.argv.findIndex(a => a === '-p')+1];

    if (!svgDir) {
        throw new Error("No svg directory specified, use -p <path>")
    }
    const outputPath = process.argv[process.argv.findIndex(a => a === '-o')+1];

    if (!outputPath) {
        throw new Error("No output specified, use -o <path>")
    }

    const p = path.resolve(svgDir);

    const files = readdirSync(p)
    

    const buf = buildFileString(files, p);
    
    writeFileSync(outputPath, buf);
}

main();