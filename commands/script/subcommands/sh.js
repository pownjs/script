exports.yargs = {
    command: 'sh',
    describe: 'Run shell command',

    builder: {
        command: {
            describe: 'The shell command',
            type: 'string',
            alias: 'c'
        }
    },

    handler: async(argv) => {
        const { command } = argv

        const { execSync } = require('child_process')

        execSync(command, { stdio: 'inherit' })
    }
}
