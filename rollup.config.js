import { promises as fs } from "fs"
import { load } from "cheerio"
import { rollup } from "rollup"
import rollupPluginSvelte from "rollup-plugin-svelte"
import rollupPluginCopy from "rollup-plugin-copy"
import { spawn } from "child_process"
import glob from "glob"

/**
 * @return {import('rollup').Plugin}
 */
function render() {
    let modules

    return {
        async buildStart() {
            const files = await new Promise((res, rej) => {
                glob("./src/pages/**/*.svelte", (err, files) => {
                    err ? rej(err) : res(files)
                })
            })
            await this.resolve("./src/main.html").then((module) =>
                this.addWatchFile(module.id)
            )
            modules = await Promise.all(
                files.map(async (file) => {
                    const module = await this.resolve(file)
                    this.addWatchFile(module.id)
                    return module
                })
            )
        },
        async generateBundle() {
            const templatePromise = fs.readFile("src/main.html", "utf-8")
            await Promise.all(
                modules.map(async (module) => {
                    const { generate } = await rollup({
                        input: module.id,
                        plugins: [
                            rollupPluginSvelte({
                                compilerOptions: {
                                    name: "Page",
                                    generate: "ssr",
                                },
                            }),
                        ],
                    })

                    const { output } = await generate({
                        format: "es",
                    })

                    const { code } = output.find((chunk) => chunk.isEntry)

                    const html = await new Promise((res) => {
                        const cp = spawn("node", ["--input-type", "module"])
                        cp.stdin.write(
                            code + `; console.log(Page.render().html)`
                        )
                        cp.stdin.end()
                        let html = ""
                        cp.stdout.on("data", (data) => {
                            html += data.toString("utf-8")
                        })
                        cp.stderr.pipe(process.stderr)
                        cp.once("close", () => res(html))
                    })

                    const templateHtml = await templatePromise
                    const template = load(templateHtml)

                    template("body").html(html)

                    const [fileName] = module.id.match(
                        /(?<=src\/pages\/)(.*\n?)(?=\.svelte)/
                    )

                    this.emitFile({
                        type: "asset",
                        fileName: fileName + ".html",
                        source: template.html(),
                    })
                })
            )
        },
    }
}

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
    input: "src/main.js",
    output: {
        file: "dist/main.js",
        format: "es",
    },
    plugins: [
        render(),
        rollupPluginCopy({
            copyOnce: true,
            targets: [
                {
                    src: "node_modules/github-markdown-css/github-markdown.css",
                    dest: "dist",
                },
            ],
        }),
    ],
}

export default options
