
function make2dArray (width, height, value = null) {
    const ret = []
    for (let i = 0; i < height; i ++) {
        const row = []
        for (let j = 0; j < width; j ++) {
            row.push(value)
        }
        ret.push(row)
    }
    return ret
}

function directionFromAngle (angle) {
    return [Math.cos(angle), Math.sin(angle)]
}

function generatePaths ({
    map,
    startX,
    startY,
    length,
    tile,
    pChange,
    pBranch
}) {
    const isInBounds = (x, y) => (
        y < map.length && y >= 0 && x < map[Math.floor(y)].length && x >= 0
    )
    const get = (x, y) => (
        map[Math.floor(y)][Math.floor(x)]
    )
    const set = (x, y, value) => {
        map[Math.floor(y)][Math.floor(x)] = value
    }
    const dfs = (x, y, angle = 0) => {
        const newAngle = () => (angle + (
            Math.round(Math.random()) - Math.round(Math.random())
        ) * Math.PI / 2)

        const [dx, dy] = directionFromAngle(angle)
        x += dx
        y += dy
        if (
            isInBounds(x, y) && get(x, y) !== tile
            && isInBounds(x + dx, y + dy) && get(x + dx, y + dy) !== tile
        ) {
            length -= 1
            set(x, y, tile)
            if (length >= 0) {
                if (Math.random() <= pChange) {
                    dfs(x, y, newAngle())
                } else if (Math.random() <= pBranch) {
                    dfs(x, y, newAngle())
                    dfs(x, y, newAngle())
                } else {
                    dfs(x, y, angle)
                }
                
            }
        }
    }
    dfs(startX, startY, 0 * Math.PI / 2)
    dfs(startX, startY, 1 * Math.PI / 2)
    dfs(startX, startY, 2 * Math.PI / 2)
    dfs(startX, startY, 3 * Math.PI / 2)
    set(startX, startY, tile)
    return map
}

function placeTileInEmpty ({ map, tile, pSpawn }) {
    for (const row of map) {
        for (let i = 0; i < row.length; i ++) {
            // Spawn
            if (row[i] == null && Math.random() <= pSpawn) {
                row[i] = tile
            }
        }
    }
    return map
}

function generateMap ({
    width,
    height,
    flowerTile,
    hideawayTile,
    pathTile
}) {
    let map = make2dArray(width, height)
    map = generatePaths({
        map,
        startX: Math.floor(width / 2),
        startY: Math.floor(height / 2),
        length: Math.floor(4 * Math.sqrt(width * height)),
        tile: pathTile,
        pChange: 0.2,
        pBranch: 0.5
    })
    map = placeTileInEmpty({
        map,
        tile: flowerTile,
        pSpawn: 0.1
    })
    map = placeTileInEmpty({
        map,
        tile: hideawayTile,
        pSpawn: 0.05
    })
    return map
}

function distanceBetween (a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
