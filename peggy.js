export default {
    input: "src/parser.peggy",
    output: "lib/parser.js",
    format: "es",
    dts: true,
    returnTypes: {
        functions: "Ast",
    },
};