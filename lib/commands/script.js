exports.yargs = {
    command: 'script [file|script] [args...]',
    describe: 'Simple scripting engine for automating pown commands.',

    builder: (yargs) => {
        yargs.option('command', {
            describe: 'Evaluate inline commands',
            type: 'boolean',
            alias: 'c',
            default: false
        })

        yargs.options('exit', {
            describe: 'Exit immediately',
            type: 'boolean',
            alias: 'e',
            default: false
        })

        yargs.options('expand', {
            describe: 'Expand command',
            type: 'boolean',
            alias: 'x',
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
        const { command, exit, expand, skip, file, script, args } = argv

        let skipIndex = skip

        const { extract } = require('@pown/modules')
        const { parse, execute } = require('@pown/cli')

        const { loadableModules, loadableCommands } = await extract()

        const { options } = require('./globals/options')
        const { subcommands } = require('./subcommands')

        options.exit = exit
        options.expand = expand

        const executeOptions = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: subcommands
        }

        const fs = require('fs')
        const readline = require('readline')

        let name

        let rl

        if (command) {
            name = '-'

            const { PassThrough } = require('stream')

            const bufferStream = new PassThrough()

            bufferStream.end(script)

            rl = readline.createInterface({
                input: bufferStream
            })
        }
        else {
            name = file === undefined ? '-' : file

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

        const processExit = (code) => {
            process.exit = originalExit

            process.exit(code)
        }

        let index = -1

        for await (let line of rl) {
            index++

            if (skipIndex) {
                skipIndex--

                continue
            }

            line = line.trim()

            if (!line || line.startsWith('#')) {
                continue
            }

            if (options.expand) {
                console.warn(`[${index}] $ ${line}`)
            }

            const cmd = parse(line, { ...process.env, ...[name, ...args], '@': args.join(' ') })

            if (cmd[0] === 'pown') {
                cmd.shift()
            }

            try {
                await execute(cmd, executeOptions)
            }
            catch (e) {
                if (e.exitCode) {
                    console.warn(e.message)

                    return processExit(e.exitCode)
                }
                else {
                    console.error(e)
                }

                if (options.exit) {
                    return processExit(1)
                }
            }
        }

        return processExit(0)
    }
}
