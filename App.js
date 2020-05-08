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
import TrackPlayer from 'react-native-track-player';

const IMAGE_PLACEHOLDER = require("./assets/placeholder.jpg");
const STREAM_ENDPOINT = 'https://stream.fear.fm';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isPlaying: true,
      artist: 'Fear.FM',
      title: 'Be Proud and Listen Loud'
    }
    this.player = null;
  }

  componentDidMount() {
    const { artist, title } = this.state;

    TrackPlayer.setupPlayer({
      stopWithApp: false,
      volume: 1
    }).then(() => {
      var track = {
        id: 'fearfm-stream', // Must be a string, required
        url: STREAM_ENDPOINT, // Load media from the network
        title,
        artist,
        artwork: IMAGE_PLACEHOLDER, // Load artwork from the network
      };
      TrackPlayer.add([track]).then(function(a) {
        TrackPlayer.play();
      });
    });
  }

  onPlayPauseclick = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      TrackPlayer.stop();
      this.setState({
        isPlaying: false
      });
    } else {
      TrackPlayer.play();
      this.setState({
        isPlaying: true
      });
    }
  }

  render() {
    const { artist, title, isPlaying } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.coverContainer}>
            <Image source={IMAGE_PLACEHOLDER} style={styles.cover}></Image>
          </View>
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={[styles.textDark, { fontSize: 20, fontWeight: "500" }]}>{artist}</Text>
            <Text style={[styles.text, { fontSize: 16, marginTop: 8 }]}>{title}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
            <TouchableOpacity style={styles.playButtonContainer} onPress={this.onPlayPauseclick}>
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
