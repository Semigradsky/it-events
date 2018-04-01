import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Linking
} from 'react-native';

import HTMLView from 'react-native-htmlview';

import {
  Badge
} from "react-native-elements";

import * as api from './api-stubs';

export default class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : '',
    }
  };

  state = {
    loading: false,
    refreshing: false,
    data: null
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { params } = this.props.navigation.state;

    this.setState({ loading: true });
    api.getEvent(params.eventId)
      .then((data) => {
        this.props.navigation.setParams({ title: data.title });
        this.setState({
          data,
          loading: false,
          refreshing: false,
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getData();
    });
  };

  openMap = (geo, query) => {
    Linking.openURL(`geo:${geo.latitude},${geo.longitude}?q=${query}`)
  };

  render() {
    const { data } = this.state;

    if (!data) {
      return null;
    }

    console.log(data);

    return (
      <ScrollView>
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />
        {data.tags.map(tag => <Badge key={tag} value={tag} />)}
        <Text
          style={{ color: 'blue' }}
          onPress={() => this.openMap(data.geo, data.address)}
        >
          {data.address}
        </Text>
        <HTMLView
          value={data.content}
        />
      </ScrollView>
    );
  }
}
