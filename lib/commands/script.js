exports.yargs = {
    command: 'script [file]',
    describe: 'Simple scripting engine',

    builder: (yargs) => {
        yargs.positional('file', {
            describe: 'Scripting file',
            default: '-'
        })
    },

    handler: async(argv) => {
        const { file } = argv

        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')

        const { loadableModules, loadableCommands } = await extract()

        const { options } = require('./utils/options')
        const { subcommands } = require('./subcommands')

        const executeOptions = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: subcommands
        }

        const fs = require('fs')
        const readline = require('readline')

        const rl = readline.createInterface({
            input: file === '-' ? process.stdin : fs.createReadStream(file)
        })

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
