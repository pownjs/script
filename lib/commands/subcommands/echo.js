exports.yargs = {
    command: 'echo [options] <message...>',
    describe: 'Echos message',

    builder: {
        type: {
            describe: 'Message type',
            default: 'info',
            alias: 't',
            choices: ['info', 'warn', 'error']
        }
    },

    handler: (argv) => {
        const { type, message } = argv

        console[type](...message)
    }
}
