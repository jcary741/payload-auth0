// Not used as actually increases the bundle size

// import esbuild from "esbuild";
// import glob from "fast-glob";
//
// (async () => {
//   const entryPoints = await glob("dist/**/*.js"); // Match only .js files
//
//   esbuild.build({
//     entryPoints,
//     outdir: "dist",
//     bundle: false,
//     minify: true,
//     sourcemap: true,
//     platform: "node",
//     target: "es2020",
//     allowOverwrite: true
//   }).catch(() => process.exit(1));
// })();
