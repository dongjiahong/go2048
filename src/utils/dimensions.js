import {
    Dimensions, // 本模块用于获取设备的宽高
    StatusBar,
} from 'react-native'

let {width, scale, height, fontScale} = Dimensions.get('window')
let statusBarHeight = StatusBar.currentHeight
fontScale = scale

module.exports = {
    get: Dimensions.get,
    screenWidth: width,
    screenHeight: height,
    screenScale: scale,
    width: width,
    height: height,
    scale: scale,
    fontScale: fontScale,
    statusBarHeight: statusBarHeight,
    toolBarHeight: 22*fontScale,
    tabBarHeight: 25*fontScale,
    contentHeight: height-statusBarHeight,
    getFontSize: (size)=>{return size*fontScale}, // 4 6 8 12 16 24 32 48 64
    getWidth: (width)=>{return width*fontScale},
    getHeight: (height)=>{return height*fontScale},
    size: {
        "1": 1*fontScale,
        "2": 2*fontScale,
        "4": 4*fontScale,
        "5": 5*fontScale,
        "6": 6*fontScale,
        "7": 7*fontScale,
        "8": 8*fontScale,
        "9": 9*fontScale,
        "10": 10*fontScale,
        "12": 12*fontScale,
        "14": 14*fontScale,
        "16": 16*fontScale,
        "18": 18*fontScale,
        "20": 20*fontScale,
        "22": 22*fontScale,
        "24": 24*fontScale,
        "27": 27*fontScale,
        "30": 30*fontScale,
        "32": 32*fontScale,
        "36": 36*fontScale,
        "40": 40*fontScale,
        "44": 44*fontScale,
        "45": 45*fontScale,
        "48": 48*fontScale,
        "50": 50*fontScale,
        "54": 54*fontScale,
        "60": 60*fontScale,
        "64": 64*fontScale,
        "66": 66*fontScale,
    },
}