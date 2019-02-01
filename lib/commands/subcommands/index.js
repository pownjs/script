const subcommands = [
    require('./set'),
    require('./exit'),
    require('./echo'),
    require('./sleep')
]

module.exports = { subcommands }
