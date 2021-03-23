exports.yargs = {
    command: 'mem',
    describe: 'Print current memory usage',

    builder: {},

    handler: (argv) => {
        const process = require('process')

        const used = process.memoryUsage()

        for (let key in used) {
            console.info(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
        }
    }
}
