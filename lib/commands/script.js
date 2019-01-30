exports.yargs = {
    command: 'script <file>',
    describe: 'Simple scripting engine',

    handler: async(argv) => {
        const { file } = argv

        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')
        const { yieldFileLines } = require('@pown/file')

        const { loadableModules, loadableCommands } = await extract()

        const options = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: [
                require('./subcommands/echo')
            ]
        }

        for await (let line of yieldFileLines(file)) {
            line = line.trim()

            if (!line) {
                continue
            }

            if (line.startsWith('#')) {
                continue
            }

            await execute(line, options)
        }
    }
}
