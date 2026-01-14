const games = {}

function getOrCreateGame(gameId = 'default') {
  if (!games[gameId]) {
    games[gameId] = {
      id: gameId,
      budget: 15000000,
      credits: 15000000,
      currentHour: 6,
      currentDay: 0,
      gameActive: false,
      gameSpeed: 1,
      energyUnits: [],
      powerRequired: 0,
      powerGenerated: 0,
      carbonDioxideTotal: 0,
      notifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  return games[gameId]
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname

  try {
    if (pathname === '/api/health') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    if (pathname === '/api/game/state') {
      const gameId = req.query?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      return res.json(game)
    }

    if (pathname === '/api/game/units') {
      return res.json([
        { id: 'engine', name: 'Engine', cost: 50000, startupCost: 5000 },
        { id: 'turbine', name: 'Turbine', cost: 45000, startupCost: 10000 },
        { id: 'solar', name: 'Solar Panel', cost: 500000, startupCost: 100 },
        { id: 'wind', name: 'Wind Turbine', cost: 300000, startupCost: 200 },
        { id: 'coal', name: 'Coal Plant', cost: 3000000, startupCost: 10000 },
        { id: 'nuclear', name: 'Nuclear Plant', cost: 8000000, startupCost: 20000 },
        { id: 'battery', name: 'Battery', cost: 100000, startupCost: 0 },
      ])
    }

    if (pathname === '/api/game/buy-unit') {
      const gameId = req.body?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      return res.json({ success: true, state: game })
    }

    if (pathname === '/api/game/toggle-unit') {
      const gameId = req.body?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      return res.json({ success: true, state: game })
    }

    if (pathname === '/api/game/start') {
      const gameId = req.body?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      game.gameActive = true
      return res.json({ success: true, state: game })
    }

    if (pathname === '/api/game/update') {
      const gameId = req.body?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      return res.json(game)
    }

    if (pathname === '/api/game/set-speed') {
      const gameId = req.body?.gameId || 'default'
      const game = getOrCreateGame(gameId)
      game.gameSpeed = req.body?.speed || 1
      return res.json({ success: true, state: game })
    }

    if (pathname === '/api/game/restart') {
      const gameId = req.body?.gameId || 'default'
      games[gameId] = getOrCreateGame(gameId)
      return res.json({ success: true, state: games[gameId] })
    }

    res.status(404).json({ error: 'Not found' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

