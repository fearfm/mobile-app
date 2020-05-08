import React from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";

const AUDIO_STREAM_URI = 'https://stream.pimjansen.dev';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.playbackInstance = null;
    this.state = {
      artist: 'Fear.FM',
      title: 'Be Proud and Listen Loud',
      shouldPlay: true,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      shouldCorrectPitch: false,
      volume: 1.0,
      rate: 1.0,
      useNativeControls: false,
      throughEarpiece: false
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
    this._loadNewPlaybackInstance(true);
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance !== null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
    }

    const source = { uri: AUDIO_STREAM_URI };
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
    this._updateScreenForLoading(false);
  }

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        isPlaying: false,
        isLoading: true
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  _onLoad = status => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  _onError = error => {
    console.log(`ON ERROR : ${error}`);
  };

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);

    this.setState({
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT
    });

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance !== null) {
      if (this.state.isPlaying) {
        this.playbackInstance.stopAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onUseNativeControlsPressed = () => {
    this.setState({ useNativeControls: !this.state.useNativeControls });
  };

  render() {
    const { isPlaying } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.coverContainer}>
            <Image source={require("./assets/placeholder.jpg")} style={styles.cover}></Image>
          </View>
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={[styles.textDark, { fontSize: 20, fontWeight: "500" }]}>{this.state.artist}</Text>
            <Text style={[styles.text, { fontSize: 16, marginTop: 8 }]}>{this.state.title}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
            <TouchableOpacity style={styles.playButtonContainer} onPress={this._onPlayPausePressed}>
              <FontAwesome5
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#3D425C"
                style={[styles.playButton, { marginLeft: 8 }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEC"
  },
  textLight: {
    color: "#B6B7BF"
  },
  text: {
    color: "#8E97A6"
  },
  textDark: {
    color: "#3D425C"
  },
  coverContainer: {
    width: 350,
    height: 350,
    marginTop: 50,
  },
  cover: {
    width: 350,
    height: 350,
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF"
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C"
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500"
  },
  playButtonContainer: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#EEE",
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
  },
  footer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  }
});
