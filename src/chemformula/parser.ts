import { futimesSync } from "fs";

export const formRegexes = {
    atomRegex: RegExp(`([A-Z][a-z]*)`),
    coefRegex: RegExp(`((\d+(\.\d+)?)*)`),
    atomAndCoefRegex: RegExp(`([A-Z][a-z]*)((\d+(\.\d+)?)*)`),
    letterRegex: RegExp(`[a-z]`),
    noLetterRegex: RegExp(`[A-Za-z]`),
    allowedSymbols: RegExp(`[^A-Za-z0-9.({[)}\]*·•]`),
    openerBrackets: ['(', '[', '{'],
    closerBrackets: [')', ']', '}'],
    adductSymbols: ['*', '·', '•'],
}

type atom = {
    label: string;
    amount: number;
}

export function parseToMap(formula: string) {
    let tokens: string[] = []
    let mol: Map<string, number> = new Map()
    let i: number = 0

    while (i < formula.length) {
        let token = formula[i];

        if (formRegexes.adductSymbols.includes(token)) {
            let matches = formRegexes.coefRegex.exec(formula.slice(i+1))
            let weight = 1.0

            if (matches !== null && matches.length > 0 && matches[0] !== "") {
                weight = parseFloat(matches[0])
                i += matches[0].length
            }

            let submol, length = parseToMap("(" + formula.slice(i+1) + ")" + weight.toString)
            mol = fuse(mol, submol, 1.0)
            i += length + 1
        }

        else if (formRegexes.closerBrackets.includes(token)) {
            let matches = formRegexes.coefRegex.exec(formula.slice(i+1))
            let weight = 1.0

            if (matches !== null && matches.length > 0 && matches[0] !== "") {
                weight = parseFloat(matches[0])
                i += matches[0].length
            }

            let tokenStr = tokens.join()
            let submol = toMap(tokenStr.matchAll(formRegexes.atomAndCoefRegex))
            return fuse(mol, submol, weight), i
        }

        else if (formRegexes.openerBrackets.includes(token)) {
            let submol, length = parseToMap(formula.slice(i+1))
            mol = fuse(mol, submol, 1.0)
            i += length + 1
        }

        else {
            tokens.push(token)
        }

        i++
    }
    return
}

function fuse(mol1: Map<string, number>, mol2: Map<string, number>, weight: number): Map<string, number> {
    const fused = new Map<string, number>();
  
    for (const [atom, count] of mol1) {
        fused.set(atom, (fused.get(atom) || 0) + count * weight);
    }
  
    for (const [atom, count] of mol2) {
        fused.set(atom, (fused.get(atom) || 0) + count * weight);
    }
  
    return fused;
}

function toMap(matches: string[][]): Map<string, number> {
    return
}