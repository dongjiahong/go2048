import { AsyncStorage } from 'react-native'

export default class LocalStorageManager {
    constructor() {
        this.bestScoreKey = "bestScore"
        this.gameStateKey = "gameState"
        this.storage = AsyncStorage
    }

    getItem(options) {
        AsyncStorage.getItem(options.key, (error, result) => {
            if (error) {
                options.error(error)
            } else {
                options.success(result)
            }
        })
    }

    setItem(options) {
        AsyncStorage.setItem(options.key, options.value, (error, result) => {
            if (error) {
                options.error(error)
            } else {
                options.success(result)
            }
        })
    }

    removeItem(options) {
        AsyncStorage.removeItem(options.key, (error, result) => {
            if (error) {
                options.error(error)
            } else {
                options.success(result)
            }
        })
    }

    // Best score getters/setters
    getBestScore(callback) {
        callback = callback ? callback: () => {}
        this.getItem({
            key: this.bestScoreKey,
            success: (result) => {
                // isNaN(x)用来检测参数x是否是非数字值
                callback(result && !isNaN(result) ? parseInt(result):0)
            },
            error: (error) => {
                console.log(error)
            },
        })
    }

    setBestScore(score, callback) {
        callback = callback ? callback: () => {}
        this.setItem({
            key: this.bestScoreKey,
            value: score.toString(),
            success: callback,
            error: (error) => {
                console.log(error)
            }
        })
    }

    // game state getters/setters
    getGameState(callback) {
        return this.getItem({
            key: this.gameStateKey,
            success: (result) => {
                let state = result?JSON.parse(result):null
                callback(state)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    setGameState(gameState, callback) {
        callback = callback?callback:()=>{}
        let json = gameState?JSON.stringify(gameState):null
        this.setItem({
            key: this.bestScoreKey,
            value: json,
            success: callback,
            error: (error)=>{
                console.log(error)
            }
        })
    }

    clearGameState(callback) {
        callback = callback?callback:()=>{}
        this.removeItem({
            key: this.bestScoreKey,
            success: callback,
            error: (error) => {
                console.log(error)
            }
        })
    }
}
