import React from 'react';
import {useDispatch} from 'react-redux';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {api, useGetEmployeeListQuery} from '../store/services/api';
import {FlatList} from 'react-native-gesture-handler';
import EmployeeCard from '../components/EmployeeCard';
import {PRIMARY_COLOR} from '../constants/Colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {authSlice} from '../store/slices/authSlice';

export default function HomeScreen(props) {
  const dispatch = useDispatch();
  const {data, isLoading, isError, error} = useGetEmployeeListQuery();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return <Text>{error.data.message}</Text>;
  }

  /** @type {Employee[]} employeeListData */
  const employeeList = data.data;

  /** @param {Employee} employee */
  function handleEmployeeEdit(employee) {
    props.navigation.navigate('EmployeeUpsert', employee);
  }

  /**
   * @param {{item: Employee}} props
   */
  const renderEmployeeCard = props => {
    return <EmployeeCard data={props.item} onEdit={handleEmployeeEdit} />;
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    dispatch(api.util.resetApiState());
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <View
        style={{
          padding: 20,
          borderBottomWidth: 0.3,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 30,
          backgroundColor: '#FFFFFF',
          elevation: 5,
          borderColor: '#888',
        }}>
        <View />
        <Text style={{fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR}}>
          Employee List
        </Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('EmployeeUpsert');
            }}>
            <Fontisto name={'plus-a'} size={22} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={employeeList}
        renderItem={renderEmployeeCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
        }}
        ItemSeparatorComponent={<View style={{height: 10}} />}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,

          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: PRIMARY_COLOR,
          padding: 20,
        }}
        onPress={handleLogout}>
        <AntDesign name={'logout'} size={22} color={'#ffffff'} />
      </TouchableOpacity>
    </View>
  );
}
