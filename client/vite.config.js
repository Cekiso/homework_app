import { resolve } from 'path'
import { defineConfig }
from 'vite'

const root = resolve('client')
const outDir = resolve('dist')

export default defineConfig({
    base: 'homework_app',
    build: {
        input: {
            main: resolve(roo)
        }

    }
})