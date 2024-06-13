#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from 'node:path';

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
    
    writeFileSync(outputPath, Buffer.from(typesBuf+componentBuf, 'utf-8'));
}

main();