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

        return new Promise((resolve, reject) => {
            const fs = require('fs')
            const readline = require('readline')

            let rl

            try {
                rl = readline.createInterface({
                    input: file === '-' ? process.stdin : fs.createReadStream(file),
                    output: process.stdout,
                    terminal: false
                })
            }
            catch (e) {
                return reject(e)
            }

            rl.on('line', async(line) => {
                line = line.trim()

                if (!line || line.startsWith('#')) {
                    return
                }

                if (options.expand) {
                    console.warn('$', line)
                }

                let originalExit = process.exit

                process.exit = function(...args) {
                    if (options.exit) {
                        originalExit.call(this, ...args)
                    }
                }

                try {
                    await execute(line, executeOptions)
                }
                catch (e) {
                    if (e.exitCode) {
                        console.warn(e.message)

                        originalExit.call(process, e.exitCode)
                    }
                    else {
                        console.error(e)
                    }

                    if (options.exit) {
                        originalExit.call(process, 1)
                    }
                }

                process.exit = originalExit
            })

            rl.on('error', (error) => {
                reject(error)

                rl.close()
            })

            rl.on('close', () => {
                resolve()

                rl.close()
            })
        })
    }
}
