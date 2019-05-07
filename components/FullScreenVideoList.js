import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";
import {
  VideoTile
} from "./index";
import { ToggleIcon } from './';

import { isEmpty } from "./utils";
const { height, width } = Dimensions.get("window");
const backgroundColor = "transparent";

class FullScreenVideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: new Animated.Value(props.bottom),
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
      theme,
      onVideoSelected
    } = this.props;
    return !isEmpty(list) ? (
      <Animated.View style={{ position: "absolute", bottom: this.state.bottom }}>
        {
          <View style={{alignSelf: 'center', justifyContent: 'center' , height: 25, width: width}}>
          <ToggleIcon
            onPress={() => togglePlaylist()}
            iconOff="keyboard-arrow-up"
            iconOn="keyboard-arrow-down"
            isOn={showPlaylist}
            theme={theme.fullscreen}
            size={40}
          /></View>
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
              onVideoSelected={onVideoSelected}
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
  togglePlaylist: PropTypes.func,
  theme: PropTypes.object.isRequired,
};

export { FullScreenVideoList };