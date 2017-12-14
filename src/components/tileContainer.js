import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

import Tile from './tile'
import Dimensions from '../utils/dimensions'
const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        width: width-Dimensions.size['10'],
        height: width-Dimensions.size['10'],
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden',
    },
})

const TileContainer = (props) => {
    const children = props.tiles
    return (
        <View style={styles.container}>
            {children.map((item) => {
                return <Tile x={item.x} y={item.y} value={item.value} key={item.prog}/>
            })}
        </View>
    )
}

export default TileContainer