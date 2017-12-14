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

const GameContainer = (props) => {
    return (
        <View stle={styles.container}>
            <GridContainer/>
            <TileContainer tiles={props.tiles}/>
            <GameMessage
                won={props.won}
                over={props.over}
                onKeepGoing={props.onKeepGoing}
                onTryAgain={props.onTryAgain}
            />
        </View>
    )
}

export default GameContainer