import React, {Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

import GameMessage from './gameMessage'
import GridContainer from './gridContainer'
import TileContainer from './tileContainer'
import Dimensions from '../utils/dimensions'

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        width: width - Dimensions.size['10'],
        //height: width - Dimensions.size['10'],
        height: height - Dimensions.size['10'],
        backgroundColor: '#bbada0',
        borderRadius: Dimensions.size['2'],
        marginTop: Dimensions.size['12'],
    }
})

class GameContainer extends Component{
    render() {
        const {tiles, won, over, onKeepGoing, onTryAgain} = this.props
        return (
            <View stle={styles.container}>
                <GridContainer/>
                <TileContainer tiles={tiles}/>
                <GameMessage
                    won={won}
                    over={over}
                    onKeepGoing={onKeepGoing}
                    onTryAgain={onTryAgain}
                />
            </View>
        )
    }
}

export default GameContainer