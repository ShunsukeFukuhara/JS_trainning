import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: './ch17/ex05/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './ch17/ex05/dist'),
  },
};
