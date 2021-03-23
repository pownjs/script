const subcommands = [
    require('./js'),
    require('./sh'),
    require('./set'),
    require('./mem'),
    require('./exit'),
    require('./echo'),
    require('./sleep'),
    require('./throw')
]

module.exports = { subcommands }
