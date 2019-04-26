import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ToggleIcon, Time, Scrubber } from "./";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "flex-end"
  }
});

const ControlBar = (props) => {
  const {
    onSeek,
    onSeekRelease,
    progress,
    currentTime,
    duration,
    muted,
    fullscreen,
    theme,
    inlineOnly,
    disableSeek,
    isStillLive,
    togglePlaylist,
    showPlaylist
  } = props
  return (
    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={[styles.container, {height: fullscreen ? 80 : 35}]}>
      <Time time={currentTime} theme={theme.seconds} />
      {!isStillLive && <Scrubber
        onSeek={pos => onSeek(pos)}
        onSeekRelease={pos => onSeekRelease(pos)}
        progress={progress}
        theme={{ scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar }}
      />}
      <ToggleIcon
        paddingLeft
        theme={theme.volume}
        onPress={() => props.toggleMute()}
        isOn={muted}
        iconOff="volume-up"
        iconOn="volume-mute"
        size={20}
      />
      {!isStillLive && <Time time={duration} theme={theme.duration} />}
      { !inlineOnly &&
      <ToggleIcon
        paddingRight
        onPress={() => props.toggleFS()}
        iconOff="fullscreen"
        iconOn="fullscreen-exit"
        isOn={fullscreen}
        theme={theme.fullscreen}
      />}
      {fullscreen && <ToggleIcon
        paddingRight
        onPress={() => togglePlaylist()}
        iconOff="keyboard-arrow-down"
        iconOn="keyboard-arrow-up"
        isOn={showPlaylist}
        theme={theme.fullscreen}
      />}
      </LinearGradient>
  )
}

ControlBar.propTypes = {
  toggleFS: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  inlineOnly: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  disableSeek: PropTypes.bool,
  isStillLive: PropTypes.bool,
  showPlaylist: PropTypes.bool,
  togglePlaylist: PropTypes.func
};

export { ControlBar }
