type element = {
    weight: number;
    defaultOxide: string;
}

const pTable: Map<string, element> = new Map([
    ["H", {weight: 1, defaultOxide: "H2O"}],
])