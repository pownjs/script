exports.yargs = {
    command: 'script [file|script]',
    describe: 'Simple scripting engine for automating pown commands.',

    builder: (yargs) => {
        yargs.option('eval', {
            describe: 'Evaluate inline script',
            type: 'boolean',
            alias: 'e',
            default: false
        })

        yargs.option('skip', {
            describe: 'Skip number of lines',
            type: 'number',
            alias: 's',
            default: 0
        })
    },

    handler: async(argv) => {
        const { eval, skip, file, script } = argv

        let skipIndex = skip

        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')

        const { loadableModules, loadableCommands } = await extract()

        const { options } = require('./globals/options')
        const { subcommands } = require('./subcommands')

        const executeOptions = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: subcommands
        }

        const fs = require('fs')
        const readline = require('readline')

        let rl

        if (eval) {
            const { PassThrough } = require('stream')

            const bufferStream = new PassThrough()

            bufferStream.end(script)

            rl = readline.createInterface({
                input: bufferStream
            })
        }
        else {
            rl = readline.createInterface({
                input: file === undefined ? process.stdin : fs.createReadStream(file)
            })
        }

        const originalExit = process.exit

        process.exit = function(...args) {
            if (options.exit) {
                originalExit.call(this, ...args)
            }
        }

        const exit = (code) => {
            process.exit = originalExit

            process.exit(code)
        }

        for await (let line of rl) {
            if (skipIndex) {
                skipIndex--

                continue
            }

            line = line.trim()

            if (!line || line.startsWith('#')) {
                continue
            }

            if (options.expand) {
                console.warn('$', line)
            }

            try {
                await execute(line, executeOptions)
            }
            catch (e) {
                if (e.exitCode) {
                    console.warn(e.message)

                    return exit(e.exitCode)
                }
                else {
                    console.error(e)
                }

                if (options.exit) {
                    return exit(1)
                }
            }
        }

        return exit(0)
    }
}
