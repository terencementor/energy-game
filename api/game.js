import Game from '../../backend/src/models/Game.js'

const games = {
  default: new Game('default'),
}

export default function handler(req, res) {
  const { path, ...query } = req.query
  const pathname = `/${path.join('/')}`

  if (pathname.startsWith('/api/game/')) {
    const endpoint = pathname.replace('/api/game/', '')
    const gameId = (req.body?.gameId || query.gameId) || 'default'

    let game = games[gameId]
    if (!game) {
      game = new Game(gameId)
      games[gameId] = game
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    switch (endpoint) {
      case 'state':
        return res.json(game.getState())
      case 'units':
        return res.json(game.getEnergyUnitTypes())
      case 'buy-unit':
        const success1 = game.buyEnergyUnit(req.body.typeId)
        return res.json({ success: success1, state: game.getState() })
      case 'toggle-unit':
        const success2 = game.toggleUnit(req.body.unitId)
        return res.json({ success: success2, state: game.getState() })
      case 'start':
        game.startGame()
        return res.json({ success: true, state: game.getState() })
      case 'update':
        game.update()
        return res.json(game.getState())
      case 'set-speed':
        game.setGameSpeed(req.body.speed)
        return res.json({ success: true, state: game.getState() })
      case 'restart':
        game.restartGame()
        return res.json({ success: true, state: game.getState() })
      default:
        return res.status(404).json({ error: 'Endpoint not found' })
    }
  }

  res.status(404).json({ error: 'Not found' })
}
