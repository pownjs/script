exports.yargs = {
    command: 'eval',
    describe: 'Run shell command',

    builder: {
        expression: {
            describe: 'JavaScript expression',
            type: 'string',
            alias: 'e'
        }
    },

    handler: async(argv) => {
        const { expression } = argv

        const main = async() => {
            eval(expression)
        }

        await main()
    }
}
