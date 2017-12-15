import React,{ Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    PanResponder,       // 该类可以将多点触摸操作协调为一个手势，它使得单点触摸可以接受更多的触摸操作，也可以用于识别简单的多点触摸
    LayoutAnimation,    // 当布局变化时，自动将视图运动到他们新的位置上
    Alert,              // 启动一个提示对话框，包含对应的标题和信息
} from 'react-native'

// modules
import StorageManager from '../utils/localStorageManager'
import Grid from '../utils/grid'
import Tile from '../utils/tile'

// views
import Heading from './heading'
import AboveGame from './aboveGame'
import GameContainer from './gameContainer'

// Dimensions
import Dimensions from '../utils/dimensions'

let NativeModules = require('NativeModules')
let { UIManager } = NativeModules

const {height, width} = Dimensions.get('window')

// storageManager
const storageManager = new StorageManager()

export default class Container extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tiles: [],
            score: 0,
            over: false,
            won: false,
            keepPlaying: false,
            grid: new Grid(props.size),
            size: props.size            
        }
    }

    // Move a tile and its representation
    moveTile(tile, cell) {
        this.grid.cells[tile.x][tile.y] = null
        this.grid.cells[cell.x][cell.y] = tile
        tile.updatePosition(cell)
    }

    // Get the vector representing the chosen direction
    getVector(direction) {
        // Vectors representing tile movement
        const map = {
            0: {x: 0, y: -1}, // up
            1: {x: 1, y: 0},  // right
            2: {x: 0, y: 1},  // down
            3: {x: -1, y: 0}, // left
        }
        return map[direction]
    }

    // Build a list of positions to traverse in the right order
    buildTraversals(vector) {
        let traversals = {x: [], y: []}
        for (let pos = 0; pos < this.state.size; pos++) {
            traversals.x.push(pos)
            traversals.y.push(pos)
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse()
        if (vector.y === 1) traversals.y = traversals.y.reverse()

        return traversals
    }

    // save all tile positions and remove merger info
    prepareTiles() {
        this.grid.eachCell((x,y,tile)=>{ // 遍历所有的瓷片,并进行如下操作
            if (tile) {
                tile.mergedFrom = null
                tile.savePosition() // 保存该瓷片的位置信息（x,y）
            }
        })
    }

    findFarthestPosition(cell, vector) {
        let previous

        // progress towards the vector direction until an obstacle is found
        do {
            previous = cell
            cell = {x: previous.x + vector.x, y: previous.y + vector.y}
        } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell))

        return {
            farthest: previous,
            next: cell, //Used to check if a merge is required
        }
    }

    // Return true if the game is lost, or has won and user hasn't kept playing
    isGameTerminated() {
        return this.over || (this.won && !this.keepPlaying)
    }

    positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y
    }

    // Adds a tile in a random position
    addRandomTile() {
        let cellsAvailable = this.grid.cellsAvailable()

        if (cellsAvailable) {
            let value = Math.random() < 0.9 ? 2 : 4
            let tile = new Tile(this.grid.randomAvailableCell(), value)

            this.grid.insertTile(tile)
        }
    }

    // Check for available matches between tiles (more expensive check)
    tileMatchesAvailable() {
        let self = this
        let tile
        for(let x = 0; x < this.state.size; x++) {
            for (let y =0; y < this.state.size; y++) {
                tile = this.grid.cellContent({x: x, y: y})

                if (tile) {
                    for(let direction = 0; direction < 4; direction++) {
                        let vector = self.getVector(direction)
                        let cell = {x: x + vector.x, y: y + vector.y}
                        let other = self.grid.cellContent(cell)

                        if (other && other.value === tile.value) {
                            return true // These two tiles can be merged
                        }
                    }
                }
            }
        }
        return false
    }

    movesAvailable() {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable()
    }

    // Represent the current game as on object
    serialize() {
        return {
            grid: this.grid.serialize(),
            score: this.score,
            over: this.over,
            won: this.won,
            keepPlaying: this.keepPlaying,
        }
    }

    // Sends the updated grid to the actutor [actutor: 开动者，激励者，启动器]
    actuate() {
        // Clear the state when the game is over (game over only, not win)
        if (this.over) {
            storageManager.clearGameState()
        } else {
            storageManager.setGameState(this.serialize())
        }

        let tiles = []
        this.grid.cells.forEach((column) => {
            column.forEach((cell) => {
                if (cell) {
                    tiles.push({
                        x: cell.x,
                        y: cell.y,
                        value: cell.value,
                        prog: cell.prog,
                    })
                }
            })
        })

        let _self = this
        storageManager.getBestScore((bestScore) => {
            // Animate the update
            //LayoutAnimation.easeInEaseOut()
            if (bestScore < _self.score) {
                storageManager.setBestScore(_self.score)
                _self.setState({score: _self.score, best: _self.score, tiles: tiles, won: _self.won, over: _self.over})
            } else {
                _self.setState({score: _self.score, tiles: tiles, won: _self.won, over: _self.over})
            }
        })
    }

    // move tiles on the grid in the specified direction
    move(direction) {
        // direction 0: up, 1: right, 2: down, 3:left
        let self = this
        if (this.isGameTerminated()) { return } // Don't do anything if the game's over
        let cell, tile
        let vector = this.getVector(direction) // 获取移动的向量
        let traversals = this.buildTraversals(vector) 
        let moved = false
        // save the current tile position and remove merger information
        this.prepareTiles()
        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach((x)=>{             // 从滑动方向最深的位置反向遍历
            traversals.y.forEach((y)=>{
                cell = {x: x, y: y}             // 当前要处理的cell
                tile = self.grid.cellContent(cell)

                if (tile) {
                    let positions = self.findFarthestPosition(cell, vector)
                    let next = self.grid.cellContent(positions.next)

                    // Only one merger per row traversal
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        var merged = new Tile(positions.next, tile.value * 2)
                        merged.mergedFrom = [tile, next]

                        self.grid.insertTile(merged)
                        self.grid.removeTile(tile)

                        // Converge the two tile's positions
                        tile.updatePosition(positions.next)

                        // Update the socre
                        self.score += merged.value

                        // The mighty 2048
                        if (merged.value === 2048) {
                            self.won = true
                        }
                    }else{
                        self.moveTile(tile, positions.farthest)
                    }

                    if (!self.positionsEqual(cell, tile)) {
                        moved = true
                    }
                }
            })
        })

        if (moved) {
            this.over = true
            this.addRandomTile()
            if (!this.movesAvailable()) {
                this.over = true
            }
            this.actuate()
        }

    }

    componentWillMount() {
        this.setup()
        let _self = this
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,      // 在用户开始触摸时候，是否愿意成为响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => true,       // 在每一个触摸点开始移动时（滑动）再次询问是否愿意成为响应者
            onPanResponderGrant: (evt, gestureState) => {                   // 现在开始响应触摸事件了，
                if (_self.moving == false) {
                    _self.moving = true
                }
            },
            onPanResponderMove: (evt, gestureState) => {},    // 用户在屏幕上移动手指时
            onPanResponderRelease: (evt, gestureState) => {   // 触摸结束时，（手指抬起离开屏幕）
                if (_self.moving) {
                    _self.moving = false
                    let dx = gestureState.dx
                    let dy = gestureState.dy
                    let absDx = dx>0?dx:-dx
                    let absDy = dy>0?dy:-dy
                    let canMove = absDx>absDy?absDx-absDy>10:absDx-absDy<-10
                    if (canMove) {
                        _self.move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0))
                    }
                }
            },
        })

        this.moving = false

        // Animate creation
        UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    getRandomTile() {
        let value = Math.random() < 0.9 ? 2 : 4
        let pos = this.grid.randomAvailableCell()
        let tile = new Tile(pos, value)
        this.grid.insertTile(tile)

        return {
            value: value,
            x: pos.x,
            y: pos.y,
            prog: tile.prog,
        }
    }

    getRandomTiles() {
        let ret = []
        for (let i = 0; i < this.props.startTiles; i++) {
            ret.push(this.getRandomTile())
        }
        return ret
    }

    setGameState(previousState) {
        // Reload the game from a previous game if present
        if (previousState) {
            this.grid   = new Grid(previousState.grid.size, previousState.grid.cells) // reload grid
            this.score  = parseInt(previousState.score)
            this.over   = (previousState.over == true || previousState.over == 'true')
            this.won    = (previousState.won == true || previousState.won == 'true')
            this.keepPlaying = (previousState.keepPlaying == true || previousState.keepPlaying == 'true')
        } else {
            this.grid   = new Grid(this.state.size)
            this.score  = 0
            this.over   = false
            this.won    = false
            this.keepPlaying = false
        }
         
        let _self = this
        storageManager.getBestScore((bestScore) => {
            // Animate the update
           // LayoutAnimation.easeInEaseOut()
            _self.setState({
                score: _self.score, 
                best: bestScore, 
                tiles: _self.getRandomTiles(), 
                over: _self.over, 
                won: _self.won
            })
        })
    }

    // set up game
    setup() {
        let _self = this
        // 初始化游戏
        storageManager.getGameState((result)=>_self.setGameState(result))
    }

    continueGame() {
        this.won = false
        this.over = false
        this.setState({won: this.won, over: this.over})
    }

    restart() {
        storageManager.clearGameState()
        this.continueGame()
        this.setup()
    }

    render() {
        let tiles = this.state.tiles?this.state.tiles:[]
        let _self = this
        return (
            <View {...this._panResponder.panHandlers} style={styles.container}>
                <Heading score={ this.state.score } best={this.state.best}/>
                <AboveGame onRestart={()=>_self.restart()}/>
                <GameContainer size={this.state.size} tiles={this.state.tiles} won={this.state.won} 
                    over={this.state.over} onKeepGoing={()=>_self.keepGoing()} onTryAgain={()=>_self.restart()}>
                </GameContainer>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#faf8ef',
        paddingHorizontal: Dimensions.size["5"],
   },
})
