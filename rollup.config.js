import commonjs from 'rollup-plugin-commonjs';
import htmlBundle from 'rollup-plugin-html-bundle';
import kontra from 'rollup-plugin-kontra';
import livereload from 'rollup-plugin-livereload';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;
const outputDir = production ? 'dist' : 'out';

export default {
  input: 'src/index.js',
  output: {
    file: `${outputDir}/space-cat.js`,
    name: 'SpaceCat',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    kontra({
      gameObject: {
        anchor: true,
        group: true,
        opacity: true,
        rotation: true,
        scale: true,
        velocity: true,
      },
    }),
    styles(),
    production &&
      terser({
        mangle: {
          properties: {
            keep_quoted: true,
          },
        },
        compress: {
          booleans_as_integers: true,
          drop_console: true,
        },
      }),
    htmlBundle({
      template: 'src/index.html',
      target: `${outputDir}/index.html`,
    }),
    !production && serve({ contentBase: outputDir, open: true }),
    !production && livereload(outputDir),
  ],
  watch: {
    exclude: ['node_modules/**'],
  },
};
