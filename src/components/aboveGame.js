import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'

import Dimensions from '../utils/dimensions'
const {height, widht} = Dimensions.get('window')

class AboveGame extends Component {
    render() {
        const {onRestart} = this.props
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Join numbers and get to the 
                        <Text style={styles.boldText}> 2048! </Text>
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={onRestart}>
                    <View style={styles.newGameContainer}>
                        <Text style={styles.newGame}>New Game</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: Dimensions.size["5"],
        marginBottom: Dimensions.size["5"],
    },
    textContainer: {
        flex: 1,
        marginRight: Dimensions.size["4"],
    },
    text: {
        color: '#776E65',
        fontSize: Dimensions.size['6'],
        lineHeight: Dimensions.size['8'],
    },
    boldText: {
        fontWeight: 'bold',
    },
    newGameContainer: {
        backgroundColor: '#8f7a66',
        paddingHorizontal: Dimensions.size['4'],
        paddingVertical: Dimensions.size['4'],
        borderRadius: Dimensions.size['2'],
    },
    newGame: {
        color: '#fff',
        fontSize: Dimensions.size['6'],
        lineHeight: Dimensions.size['8'],
    }
})

export default AboveGame