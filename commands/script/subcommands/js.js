exports.yargs = {
    command: 'js [exp...]',
    describe: 'Run js expression',

    builder: {
        expression: {
            describe: 'JavaScript expression',
            type: 'string',
            alias: ['e']
        }
    },

    handler: async(argv) => {
        const { expression, exp } = argv

        const main = async() => {
            if (expression) {
                await eval(expression)
            }
            else
            if (exp) {
                await eval(exp.join(' '))
            }
        }

        await main()
    }
}
