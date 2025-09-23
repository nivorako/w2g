declare module "parse/node" {
    // Ensure TypeScript consumers of "parse/node" get the full typings from "parse".
    // The Node entry simply re-exports the browser bundle at runtime, so we mirror
    // that behavior for types by re-exporting everything from "parse" and its default.
    export * from "parse";
    import Parse from "parse";
    export default Parse;
}
