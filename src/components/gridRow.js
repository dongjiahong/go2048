import React,{Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

import GridCell from './gridCell'
import Dimensions from '../utils/dimensions'
const {height, width} = Dimensions.get('window')
const MARGIN_WIDTH = Dimensions.size['2']
const ITEM_WIDTH = (width-Dimensions.size['10']-MARGIN_WIDTH*10)/4

const styles = StyleSheet.create({
    container: {
        height: ITEM_WIDTH,
        marginVertical: Dimensions.size['2'],
        flexDirection: 'row',
    }
})

class GridRow extends Component {
    render(){
        return (
            <View style={styles.container}>
                <GridCell/>
                <GridCell/>
                <GridCell/>
                <GridCell/>
            </View>
        )
    }
}
export default GridRow