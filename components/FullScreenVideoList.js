import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback as Touchable,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  PanResponder,
  Easing
} from "react-native";
import {
  PlayButton,
  ControlBar,
  Loading,
  TopBar,
  ProgressBar,
  VideoTile
} from "./index";
import { ToggleIcon } from './';

import { isEmpty } from "./utils";
const { height, width } = Dimensions.get("window");
const backgroundColor = "transparent";

class FullScreenVideoList extends Component {
  constructor(props) {
    super(props);
    // const initialPosition = { x: 0, y: height - 70 };
    // this.position = new Animated.Value(props.bottom);
    const parentResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
    //   onMoveShouldSetPanResponderCapture: (e, gestureState) => {
    //     return false;
    //   },
    onPanResponderGrant: (e, gestureState) => {
        console.log(gestureState.dy, this.state.bottom, "onPanResponderGrant-----%%%%%%---------->>>>>" );
        // if( gestureState.dy > -115 ){
        //     this.setState({
        //         // offset: e.nativeEvent.pageY,
        //         // isDividerClicked: true
        //         bottom: this.state.bottom - gestureState.dy
        //     })
        // }
        // if ( gestureState.dy < 0 && !this.state.toTop) {
        //     console.log("111111111111111111111111");
        //     Animated.timing(this.state.bottom, {
        //         toValue: 0,
        //         duration: 250,
        //         easing: Easing.linear
        //     }).start();
        //     this.setState({
        //         toTop: true
        //     });
        // } else if(gestureState.dy > 0  && this.state.toTop) {
        //     console.log("22222222222222222222222222");
        //     Animated.timing(this.state.bottom, {
        //         toValue: -100,
        //         duration: 250,
        //         easing: Easing.linear
        //     }).start();
        //     this.setState({
        //         toTop: false
        //     });
        // }
    },
    //   onStartShouldSetPanResponder: () => false,
    //   onMoveShouldSetPanResponder: (e, gestureState) => {
    //     if (this.state.toTop) {
    //       return gestureState.dy > 6;
    //     } else {
    //       return gestureState.dy < -6;
    //     }
    //   },
    onPanResponderMove: (e, gestureState) => {
        console.log(gestureState.dy, this.state.bottom, "onPanResponderMove--------------->>>>>" );
        // this.setState({
        //     bottomHeight    : gestureState.moveY > (this.state.deviceHeight - 40) ? 40 : this.state.deviceHeight - gestureState.moveY,
        //     offset: e.nativeEvent.pageY
        // })
        if ( gestureState.dy < 0) {
            Animated.spring(this.state.bottom, {
                toValue: 0,
                duration: 250,
                easing: Easing.linear
            }).start();
            // this.setState({
            //     toTop: true
            // });
            this.props.fullScreenListDrag(true);
        } else if(gestureState.dy > 0) {
            Animated.spring(this.state.bottom, {
                toValue: -100,
                duration: 250,
                easing: Easing.linear
            }).start();
            // this.setState({
            //     toTop: false
            // });
            this.props.fullScreenListDrag(false);
        }
    },
    onPanResponderRelease: (e, gestureState) => {
        // Do something here for the touch end event
        console.log(gestureState.dy, this.state.bottom, "onPanResponderRelease-----&&&&---------->>>>>" );
        // if (!this.state.toTop &&  gestureState.dy < -50) {
        //     console.log("222222222222222222222");
        //     this.setState({
        //         bottom: 0,
        //         toTop: true
        //     });
        // } else if(this.state.top && gestureState.dy > 50) {
        //     console.log("11111111111111111111");
        //     this.setState({
        //         bottom: -115,
        //         toTop: false
        //     });
        // }
        // this.setState({
        //     offset: e.nativeEvent.pageY,
        //     isDividerClicked: false
        // })
        // if ( gestureState.dy < 0 && !this.state.toTop) {
        //     console.log("111111111111111111111111");
        //     Animated.timing(this.state.bottom, {
        //         toValue: 0,
        //         duration: 250,
        //         easing: Easing.linear
        //     }).start();
        //     this.setState({
        //         toTop: true
        //     });
        // } else if(gestureState.dy > 0  && this.state.toTop) {
        //     console.log("22222222222222222222222222");
        //     Animated.timing(this.state.bottom, {
        //         toValue: -100,
        //         duration: 250,
        //         easing: Easing.linear
        //     }).start();
        //     this.setState({
        //         toTop: false
        //     });
        // }
        
    },
    //   onPanResponderTerminationRequest: () => false,
    //   onPanResponderMove: (evt, gestureState) => {
    //     let newy = gestureState.dy;
    //     if (this.state.toTop && newy < 0) return;
    //     if (this.state.toTop) {
    //       position.setValue({ x: 0, y: newy });
    //     } else {
    //       position.setValue({ x: 0, y: initialPosition.y + newy });
    //     }
    //   },
    //   onPanResponderRelease: (evt, gestureState) => {
    //     if (this.state.toTop) {
    //       if (gestureState.dy > 50) {
    //         this.snapToBottom(initialPosition);
    //       } else {
    //         this.snapToTop();
    //       }
    //     } else {
    //       if (gestureState.dy < -90) {
    //         this.snapToTop();
    //       } else {
    //         this.snapToBottom(initialPosition);
    //       }
    //     }
    //   }
    });
    this.offset = 0;
    this.parentResponder = parentResponder;
    this.state = {
      bottom: new Animated.Value(props.bottom),
    //   position,
      toTop: false
    };
  }

  componentDidUpdate() {
    if (this.props.showPlaylist) {
      Animated.timing(this.state.bottom, {
        toValue: 0,
        duration: 200,
      }).start();
    } else {
      Animated.timing(this.state.bottom, {
        toValue: -100,
        duration: 200,
      }).start();
    }
  }
//   snapToTop = () => {
//     Animated.timing(this.state.position, {
//       toValue: { x: 0, y: 0 },
//       duration: 300
//     }).start(() => {});
//     this.setState({ toTop: true });
//   };

//   snapToBottom = initialPosition => {
//     Animated.timing(this.state.position, {
//       toValue: initialPosition,
//       duration: 150
//     }).start(() => {});
//     this.setState({ toTop: false });
//   };

//   hasReachedTop({ layoutMeasurement, contentOffset, contentSize }) {
//     return contentOffset.y == 0;
//   }
  render() {
    const {
      list,
      timeDifference,
      playListId,
      isUpcomingList,
      navigation,
      playlistTitle,
      liveVideo,
      sendToCLickStream,
      showPlaylist,
      togglePlaylist,
      theme
    } = this.props;
    return !isEmpty(list) ? (
      <Animated.View style={{ position: "absolute", bottom: this.state.bottom }}>
        {
          (showPlaylist) && <ToggleIcon
            paddingRight
            onPress={() => togglePlaylist()}
            iconOff="keyboard-arrow-down"
            iconOn="keyboard-arrow-up"
            isOn={showPlaylist}
            theme={theme.fullscreen}
          />
        }
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={list}
          horizontal={true}
          keyExtractor={(item, index) => `${item.entityId}`}
          renderItem={({ item, index }) => (
            <VideoTile
              playListId={playListId}
              videoId={item.entityId}
              isUpcomingList={isUpcomingList}
              title={item.title}
              imageUri={item.thumbnailUrl}
              descriptionText={item.description}
              navigation={navigation}
              playlistTitle={playlistTitle}
              startTime={item.startTime}
              endTime={item.endTime}
              index={index}
              vCounter={item.videoViews}
              duration={item.duration}
              liveVideo={liveVideo}
              timeDifference={timeDifference}
              sendToCLickStream={sendToCLickStream}
            />
          )}
        /></Animated.View>
    ) : (
      <View />
    );
  }
}

FullScreenVideoList.propTypes = {
  list: PropTypes.array,
  timeDifference: PropTypes.number,
  playListId: PropTypes.string,
  isUpcomingList: PropTypes.bool,
  navigation: PropTypes.object,
  playlistTitle: PropTypes.string,
  liveVideo: PropTypes.object,
  bottom: PropTypes.number,
  sendToCLickStream: PropTypes.func,
  showPlaylist: PropTypes.bool,
  fullScreenListDrag: PropTypes.func,
  togglePlaylist: PropTypes.func,
  theme: PropTypes.object.isRequired,
};

export { FullScreenVideoList };
