exports.yargs = {
    command: 'js',
    describe: 'Run js expression',

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
            await eval(expression)
        }

        await main()
    }
}
