import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AvatarPlaceholder from '../assets/avatar-placeholder.png';

/** @typedef {object} Props
 * @property {(emp: import('../screens/HomeScreen').Employee) => void} onEdit
 * @property {import('../screens/HomeScreen').Employee} data
 */

/**
 *
 * @param {Props} props
 */
export default function EmployeeCard(props) {
  return (
    <View
      style={{
        padding: 16,
        // borderWidth: 0.3,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'black',
        backgroundColor: 'white',
        borderColor: '#888',
        shadowColor: '#888',
        elevation: 3,
      }}>
      <View style={{marginRight: 10}}>
        <Image
          source={
            !!props.data.profile_image
              ? {
                  uri: props.data.profile_image,
                }
              : AvatarPlaceholder
          }
          style={{
            width: 50,
            height: 50,
            borderWidth: 5,
            borderRadius: 9999,
            borderColor: 'gray',
          }}
        />
      </View>
      <View>
        <Text style={{fontWeight: '700', color: '#000'}}>
          Name: {props.data.employee_name}
        </Text>
        <Text>Age: {props.data.employee_age}</Text>
        <Text>Salary: ${props.data.employee_salary}</Text>
      </View>

      <View style={{flex: 1}} />

      <View>
        <TouchableOpacity
          onPress={() => {
            props.onEdit(props.data);
          }}>
          <FeatherIcon name={'edit'} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#497AFC',
  },
  actionText: {
    padding: 10,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
