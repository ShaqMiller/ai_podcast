import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, '/app/styles')],
    prependData: `@use "variables" as *;`, // use the partial file without extension
  },
};

export default nextConfig;