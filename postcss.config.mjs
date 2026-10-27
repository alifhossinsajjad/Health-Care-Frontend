import { createRequire } from 'module';


var module = { exports: {} };

const require = createRequire(import.meta.url);

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;	
