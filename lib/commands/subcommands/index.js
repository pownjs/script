const subcommands = [
    require('./set'),
    require('./exit'),
    require('./echo'),
    require('./sleep'),
    require('./throw')
]

module.exports = { subcommands }
