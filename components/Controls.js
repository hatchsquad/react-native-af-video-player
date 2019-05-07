import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback as Touchable,
  TouchableOpacity,
  Text,
  AppState
} from 'react-native'
import Icons from "react-native-vector-icons/MaterialIcons";
import {
  PlayButton,
  ControlBar,
  Loading,
  TopBar,
  ProgressBar,
  FullScreenVideoList
} from './index'
import {isEmpty} from './utils';
const backgroundColor = "transparent";
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99
  },
  flex: {
    flex: 1,
    flexDirection: 'row'
  },
  playButton: {
    // opacity: 0.9,
    position: "absolute"
  },
  playContainer: {
    flex: 1,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  }
})

class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hideControls: false,
      seconds: 0,
      seeking: false,
      bottom:-100,
      appState: AppState.currentState,
      showPlaylist: false,
    }
    this.animControls = new Animated.Value(1)
    this.scale = new Animated.Value(1)
    this.progressbar = new Animated.Value(2)
    this.onBackButtonClickSeek = this.onBackButtonClickSeek.bind(this);
    this.onForwardButtonClickSeek =  this.onForwardButtonClickSeek.bind(this);
  }
  togglePlaylist = () => {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }
  toggleFS = () => {
    this.state.showPlaylist ?  this.togglePlaylist : null;
    this.props.toggleFS;
  }
  handleAppStateChange = (nextAppState) => {
    const { timeDifference, currentVideoToPlay, isLive, isStillLive, seekTo, duration } = this.props;
    const current = new Date().getTime() + timeDifference;
    const start = currentVideoToPlay.startTime;
    const end = currentVideoToPlay.endTime;
    const seekTime = (current - start)/1000;
    if (
      this.state.appState.match(/inactive|background/) && nextAppState === 'active' && isLive && isStillLive
    ) {
      this.setState({ appState: nextAppState});
      if (seekTime <= duration) {
        seekTo(seekTime);
      } else {
        seekTo(duration);
      }
    }
    if (
        this.state.appState.match(/inactive|active/) && nextAppState === 'background' && isLive && isStillLive
    ) {
        this.setState({ appState: nextAppState });
    }
    
};
  onBackButtonClickSeek(currentTime){
    if (this.props.sendToCLickStream != undefined && this.props.sendToCLickStream!= null) {
    const clickstreamParams = {
      key1: 'video_id',
      value1: this.props.videoId,
      key2: 'button_name',
      value2: 'backward',
  };
  this.props.sendToCLickStream('growth_app', 'click', 'app_classroom_player_click', null, clickstreamParams);
}
    if (this.props.isStillLive) {
      this.props.goLive(0, false);
      this.props.seekTo(currentTime - 10);
    } else {
      this.props.seekTo(currentTime - 10);
    }
  }
  onForwardButtonClickSeek(currentTime){
    if (this.props.sendToCLickStream != undefined && this.props.sendToCLickStream!= null) {
    const clickstreamParams = {
      key1: 'video_id',
      value1: this.props.videoId,
      key2: 'button_name',
      value2: 'forward',
  };
  this.props.sendToCLickStream('growth_app', 'click', 'app_classroom_player_click', null, clickstreamParams);
}
    if (this.props.isStillLive) {
      const {currentVideoToPlay} = this.props;
      const start = currentVideoToPlay.startTime;
      const end = currentVideoToPlay.endTime;
      const duration = this.props.duration;
      const current = new Date().getTime() + this.props.timeDifference;
      const seekTime = (current - start)/1000;

      if((currentTime+10) < seekTime){
        this.props.seekTo(currentTime + 10);

      } else{
        this.props.goLive(1, true);
      }
    } else {
      this.props.seekTo(currentTime + 10);
    }
    
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.setTimer()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearInterval(this.timer)
  }

  onSeek(pos) {
    this.props.onSeek(pos)
    if (!this.state.seeking) {
      this.setState({ seeking: true })
    }
  }

  onSeekRelease(pos) {
    this.props.onSeekRelease(pos)
    this.setState({ seeking: false, seconds: 0 })
  }

  setTimer() {
    this.timer = setInterval(() => {
      switch (true) {
        case this.state.seeking:
          // do nothing
          break
        case this.props.paused:
          if (this.state.seconds > 0) this.setState({ seconds: 0 })
          break
        case this.state.hideControls:
          break
        case ((this.state.seconds > this.props.controlDuration) && !this.state.showPlaylist ):
          this.hideControls()
          break
        default:
          this.setState({ seconds: this.state.seconds + 1 })
      }
    }, 1000)
  }

  showControls() {
    this.setState({ hideControls: false, bottom: -100 }, () => {
      this.progressbar.setValue(2)
      Animated.parallel([
        Animated.timing(this.animControls, { toValue: 1, duration: 200 }),
        Animated.timing(this.scale, { toValue: 1, duration: 200 })
      ]).start()
    })
  }

  hideControls() {
      Animated.parallel([
        Animated.timing(this.animControls, { toValue: 0, duration: 200 }),
        Animated.timing(this.scale, { toValue: 0.25, duration: 200 })
      ]).start(() => this.setState({ hideControls: true, showPlaylist: false, bottom: -100, seconds: 0 }))
  }

  hiddenControls() {
    Animated.timing(this.progressbar, { toValue: 0, duration: 200 }).start()
    return (
      <Touchable style={styles.container} onPress={() => this.showControls()}>
        <Animated.View style={[styles.container, { paddingBottom: this.progressbar }]}>
          <ProgressBar theme={this.props.theme.progress} progress={this.props.progress} />
        </Animated.View>
      </Touchable>
    )
  }

  loading() {
    return (
      <View style={styles.container}>
        <Loading theme={this.props.theme.loading} />
      </View>
    )
  }

  displayedControls() {
    const {
      paused,
      fullscreen,
      muted,
      loading,
      logo,
      more,
      onMorePress,
      title,
      progress,
      currentTime,
      duration,
      theme,
      inlineOnly,
      disableSeek,
      onBack,
      isFullscreen,
      seekTo,
      isLive,
      goLive,
      list,
      timeDifference,
      playListId,
      isUpcomingList,
      navigation,
      playlistTitle,
      liveVideo,
      sendToCLickStream,
      isStillLive,
      videoId
    } = this.props

    const { center, ...controlBar } = theme;
    return (
      <Touchable onPress={() => this.hideControls()}>
        <Animated.View style={[styles.container, { opacity: this.animControls, backgroundColor: "#000000AA" }]}>
          <TopBar
            title={title}
            logo={logo}
            more={more}
            onMorePress={() => onMorePress()}
            theme={{ title: theme.title, more: theme.more }}
            isFullscreen={isFullscreen}
            onBack={onBack}
            toggleFS={() => this.toggleFS()}
          />
          <Animated.View style={[styles.flex, { transform: [{ scale: this.scale }] }]}>
          { (currentTime > 10 && !this.state.showPlaylist) ? <View style={styles.playContainer}>
              <Touchable onPress={() => this.onBackButtonClickSeek(currentTime)}>
                <View
                  style={{ justifyContent: "center", alignItems: "center",  height: 50, width: 50  }}
                >
                  <Text style={{ position: "relative", color: "#fff", fontSize: 9 }}>
                    10
                  </Text>
                  <Icons
                    style={[styles.playButton, { transform: [{ scaleX: -1 }] }]}
                    name={"refresh"}
                    color={center}
                    size={35}
                  />
                </View>
              </Touchable>
            </View> : <View style={styles.playContainer} />}
            { !this.state.showPlaylist && <PlayButton
              onPress={() => this.props.togglePlay()}
              paused={paused}
              loading={loading}
              theme={center}
            />}
            { ((!isLive || !isStillLive ) && ((duration - currentTime) > 10) && !this.state.showPlaylist ) ? <View style={styles.playContainer}>
              <Touchable onPress={() => this.onForwardButtonClickSeek(currentTime)}>
                <View
                  style={{ justifyContent: "center", alignItems: "center",  height: 50, width: 50  }}
                >
                  <Text style={{ position: "relative", color: "#fff", fontSize: 9 }}>
                    10
                  </Text>
                  <Icons
                    style={styles.playButton}
                    name={"refresh"}
                    color={center}
                    size={35}
                  />
                </View>
              </Touchable>
            </View> : <View style={styles.playContainer}/>}
          </Animated.View>
          <ControlBar
            toggleFS={() => this.props.toggleFS()}
            toggleMute={() => this.props.toggleMute()}
            togglePlay={() => this.props.togglePlay()}
            muted={muted}
            paused={paused}
            fullscreen={fullscreen}
            onSeek={pos => this.onSeek(pos)}
            onSeekRelease={pos => this.onSeekRelease(pos)}
            progress={progress}
            currentTime={currentTime}
            disableSeek={disableSeek}
            duration={duration}
            theme={controlBar}
            inlineOnly={inlineOnly}
            isStillLive={isStillLive}
            showPlaylist={this.state.showPlaylist}
            togglePlaylist={this.togglePlaylist}
          />
          {
            fullscreen && 
            !isEmpty(list) && <FullScreenVideoList
            list={list}
            timeDifference={timeDifference}
            playListId={playListId}
            isUpcomingList={isUpcomingList}
            navigation={navigation}
            playlistTitle={playlistTitle}
            liveVideo={liveVideo}
            bottom={this.state.bottom}
            sendToCLickStream={sendToCLickStream}
            showPlaylist={this.state.showPlaylist}
            togglePlaylist={this.togglePlaylist}
            theme={controlBar}
            toggleFS={() => this.props.toggleFS()}
            />
          }
          { isStillLive && (currentTime > 0) && <TouchableOpacity onPress={ !isLive ? () =>  goLive(1, true, true) : null} style={{ position: 'absolute' , right: 5, top:5 ,paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: isLive ? "#ff0000" : "#fff"}}>{ isLive && <View style={{height: 6, width: 6, borderRadius: 3, backgroundColor: "#fff", marginRight: 5}}/>}<Text  style={{color: isLive ? "#fff" : "#ff0000", fontSize: 12}}>{isLive ? "LIVE" : "GO LIVE"}</Text></TouchableOpacity>}
        </Animated.View>
      </Touchable>
    )
  }

  render() {
    if (this.props.loading) return this.loading()
    if (this.state.hideControls) {
      return this.hiddenControls()
    }
    return this.displayedControls()
  }
}

Controls.propTypes = {
  toggleFS: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  togglePlay: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  onMorePress: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired,
  inlineOnly: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  more: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  disableSeek:PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  seekTo: PropTypes.func.isRequired,
  isLive:PropTypes.bool.isRequired,
  goLive:PropTypes.func.isRequired,
  list: PropTypes.array,
  timeDifference: PropTypes.number,
  playListId: PropTypes.string,
  isUpcomingList: PropTypes.bool,
  navigation: PropTypes.object,
  playlistTitle: PropTypes.string,
  liveVideo: PropTypes.object,
  sendToCLickStream: PropTypes.func,
  isStillLive: PropTypes.bool,
  videoId: PropTypes.string.isRequired,
}

export { Controls }
