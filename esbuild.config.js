const { vanillaExtractPlugin } = require("@vanilla-extract/esbuild-plugin");
const { build } = require("esbuild");

const base = ({ entryPoints = ["./src/index.ts"], outdir = "dist" }) => ({
  entryPoints,
  outdir,
  target: "es2015",
  bundle: true,
  minify: false,
  external: ["react"],
  plugins: [vanillaExtractPlugin()],
  sourcemap: true,
});

Promise.all([
  build({
    ...base({}),
    format: "cjs",
  }),
  build({
    ...base({}),
    format: "esm",
    outExtension: {
      ".js": ".mjs",
    },
  }),
]).catch(() => process.exit(1));
