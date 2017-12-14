import React,{Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

import GridRow from './gridRow'
import Dimensions from '../utils/dimensions'
const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        width: width-Dimensions.size['10'],
        //height: width-Dimensions.size['10'],
        height: height-Dimensions.size['10'],
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden',
        paddingHorizontal: Dimensions.size['2'],
        paddingVertical: Dimensions.size['2'],
        flexDirection: 'column',
    }
})

class GridContainer extends Component {
    render(){
        return (
            <View style={styles.container}>
                <GridRow/>
                <GridRow/>
                <GridRow/>
                <GridRow/>
            </View>
        )
    }
}

export default GridContainer