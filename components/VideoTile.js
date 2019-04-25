import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import PropTypes from 'prop-types';
// import Font from '../../../assets/font';
import { WaveIndicator } from 'react-native-indicators';
import { isEmpty, FormatDateTimeMessageServer, msToTime } from './utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');

class VideoTile extends PureComponent {
    render() {
        const { playListId, videoId, title, imageUri, descriptionText, navigation, vCounter, isUpcomingList, playlistTitle, startTime, endTime, duration, index, timeDifference, liveVideo, sendToCLickStream } = this.props;


        const currentTime = new Date().getTime() + timeDifference;
        // console.log("DUration", duration);
        // console.log("hours", hours);
        // console.log("minutes", minutes);
        // console.log("seconds", seconds);
        let status = (<View />);
        if (currentTime > startTime && currentTime < endTime) {
            status = (<View style={styles.liveContainer}>
                <View style={styles.waveindicator}>
                    <WaveIndicator
                        count={1}
                        waveFactor={0.4}
                        color={'#ff4b4b'}
                        size={20}
                    />
                </View>
                <Text style={styles.liveTextRed}>LIVE NOW</Text>
            </View>);
        } else if (currentTime < startTime) {
            status = (<Text numberOfLines={1} ellipsizeMode="tail" style={styles.liveText}>Schduled for {FormatDateTimeMessageServer(startTime, currentTime)}</Text>);
        } else {
            status = ((!isEmpty(vCounter) && vCounter !== 0) && <Text style={styles.numOfView}>{vCounter} views</Text>);
        }
        return (
            <TouchableOpacity style={styles.container} onPress={() => {
                const clickstreamParams = {
                    key1: 'video_id',
                    value1: videoId,
                    key2: 'playlist_name',
                    value2: playlistTitle,
                    key3: 'position',
                    value3: index + 1,
                };
                sendToCLickStream('growth_app', 'click', 'app_classroom_videodetail_video_clicked', null, clickstreamParams);
                navigation.replace('ClassRoomLive', { videoId, playListId, isUpcomingList, playlistTitle, title, index, liveVideo });
            }}>
                    {!isEmpty(imageUri) ?
                        <View style={styles.leftSec}>
                            <Image source={{ uri: imageUri }}
                                style={styles.imgSec}
                            />
                            {!(currentTime > startTime && currentTime < endTime) && !isEmpty(duration) && (duration > 0) && <View style={styles.bottom}>
                                <Text numberOfLines={1} style={styles.bottomTxt}>{msToTime(duration * 1000)}</Text>
                            </View>}
                        </View> :
                        <View style={[styles.leftSec, { backgroundColor: "#efefef", justifyContent: "center", alignItems: "center" }]}>
                            <View style={styles.playlistVideoDefaultImageView}>
                                <MaterialIcons name="play-arrow" size={20} color={"#cccccc"} />
                            </View>
                            {!(currentTime > startTime && currentTime < endTime) && !isEmpty(duration) && (duration > 0) && <View style={styles.bottom}>
                                <Text numberOfLines={1} style={styles.bottomTxt}>{msToTime(duration * 1000)}</Text>
                            </View>}
                        </View>
                    }
                        <Text style={styles.descText} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                        {status}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: 160,
        marginHorizontal: 8,
    },
    leftSec: {
        width: 160,
        height: 90,
    },
    playlistVideoDefaultImageView: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 5,
        borderColor: "#cccccc",
        justifyContent: "center",
        alignItems: "center"
    },
    imgSec: {
        flex: 1,
        backgroundColor: "#efefef",
    },
    descSec: {
        width: 250,
        paddingLeft: 5,
    },
    descText: {
        fontSize: 12,
        color: "#fff",
        // fontFamily: Font.regular,
        // width: width * 0.58
    },
    numOfView: {
        color: '#999',
    },
    bottom: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.6)",
        alignSelf: 'flex-end',
        bottom: 0,
        paddingHorizontal: 5,
    },
    bottomTxt: {
        fontSize: 10,
        color: 'white'
    },
    liveContainer: {
        flexDirection: 'row',
        width: width * 0.2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 3,
    },
    waveindicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ff0000',
        opacity: 0.7
    },
    upcomingContainer: {
        flexDirection: 'row',
        width: width * 0.5,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    liveTextRed: {
        color: '#ff3e3e',
        fontSize: 12,
        // fontFamily: Font.regular,
        marginLeft: 8
    },
    liveText: {
        fontSize: 12,
        color: '#999',
        // fontFamily: Font.regular,
    },
});

VideoTile.propTypes = {
    imageUri: PropTypes.string,
    videoId: PropTypes.string,
    playListId: PropTypes.string,
    title: PropTypes.string,
    descriptionText: PropTypes.string,
    vCounter: PropTypes.number,
    isUpcomingList: PropTypes.bool,
    navigation: PropTypes.object,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    liveVideo: PropTypes.object,
    timeDifference: PropTypes.number,
    sendToCLickStream: PropTypes.func
};

export { VideoTile }
