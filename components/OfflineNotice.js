import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

class OfflineNotice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isConnected: false
    }
    this.netinfoListener = null;
  }

  componentDidMount() {
    this.netinfoListener = NetInfo.addEventListener(state => {
      this.setState({
        isConnected: state.isConnected
      })
    });
  }

  componentWillUnmount() {
    this.netinfoListener();
  }

  render() {
    const { isConnected } = this.state;

    if (isConnected === false) {
      return (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  offlineText: { color: '#fff' }
});

export default OfflineNotice;
