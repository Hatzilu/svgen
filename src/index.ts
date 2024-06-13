import { readFile, readFileSync, readdirSync, writeFile, writeFileSync } from "node:fs";
import path from 'node:path';

function main(): void {
    console.log(process.argv);
    const svgPath = process.argv[process.argv.findIndex(a => a === '-p')+1];
    
    console.log({svgPath});
    const p = path.resolve(svgPath);
    console.log({p});

    const files = readdirSync(p)
    console.log(files);
    
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
        console.log(`case "${name}": return (...);`);
        
    });
    typesBuf += "\n};\n\n"
    componentBuf += "\r\n\t\tdefault: return null;\r\n\t};\r\n};";
    // console.log({typesBuf});
    
    writeFileSync('./output.tsx', Buffer.from(typesBuf+componentBuf, 'utf-8'));
}

main();