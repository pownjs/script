const subcommands = [
    require('./sh'),
    require('./set'),
    require('./eval'),
    require('./exit'),
    require('./echo'),
    require('./sleep'),
    require('./throw')
]

module.exports = { subcommands }
