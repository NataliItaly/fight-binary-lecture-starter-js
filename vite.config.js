import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        base: '/fight-binary-lecture-starter-js/',
        server: {
            host: 'localhost',
            port: 7800
        }
    });
};

export default config();
