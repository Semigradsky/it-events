import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';

import {
  List,
  ListItem
} from "react-native-elements";

import * as api from './api-stubs';

const formatEventDates = (dateStart, dateEnd, timeStart, timeEnd) => {
  dateStart = new Date(dateStart).toLocaleDateString();
  dateEnd = new Date(dateEnd).toLocaleDateString();

  if (dateStart === dateEnd) {
    if (!timeStart) {
      return dateStart;
    }
    return `${dateStart} ${timeStart}-${timeEnd}`;
  }

  if (!timeStart) {
    return `${dateStart} - ${dateEnd}`;
  }
  return `${dateStart} ${timeStart} - ${dateEnd} ${timeEnd}`;
};

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'IT Events',
  };

  state = {
    loading: false,
    refreshing: false,
    page: 1,
    events: []
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { page } = this.state;

    this.setState({ loading: true });
    api.getEvents(page)
      .then((data) => this.setState({
        events: page === 1 ? data : [...this.state.events, ...data],
        loading: false,
        refreshing: false,
      }))
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  handleRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
    }, () => {
      this.getData();
    });
  };

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1,
      loading: true,
    }, () => {
      this.getData();
    });
  };

  handleOpenEventInfo = (eventId) => {
    this.props.navigation.navigate('Details', { eventId });
  };

  render() {
    const { events } = this.state;

    return (
      <List containerStyle={styles.container}>
        <FlatList
          data={events}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return <ListItem
              title={item.title}
              subtitle={
                <View style={styles.subtitleView}>
                  <Text>{item.address}</Text>
                  <Text>{formatEventDates(item.start_date, item.finish_date, item.start_time, item.finish_time)}</Text>
                </View>
              }
              avatar={{uri: item.hero_image_url}}
              onPress={this.handleOpenEventInfo.bind(this, item._id)}
            />
          }}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndThreshold={100}
        />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   marginTop: 0,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  subtitleView: {
    paddingLeft: 10,
    paddingTop: 5
  },
});
