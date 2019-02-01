exports.yargs = {
    command: 'set [options]',
    describe: 'Set scripting options',

    builder: {
        exit: {
            describe: 'Exit immediately',
            type: 'boolean',
            alias: 'e'
        },

        expand: {
            describe: 'Expand command',
            type: 'boolean',
            alias: 'x'
        }
    },

    handler: (argv) => {
        const { exit, expand } = argv

        const { options } = require('../utils/options')

        if (typeof(exit) !== undefined) {
            options.exit = exit
        }

        if (typeof(expand) !== undefined) {
            options.expand = expand
        }
    }
}
