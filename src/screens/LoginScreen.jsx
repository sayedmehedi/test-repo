import z from 'zod';
import React from 'react';
import * as Colors from '../constants/Colors';
import CommonBtn from '../components/CommonBtn';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ErrorMessage} from '@hookform/error-message';
import {useLoginMutation} from '../store/services/api';
import {View, Text, StyleSheet, TextInput} from 'react-native';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginScreen = () => {
  const [login, {isLoading}] = useLoginMutation();

  const {control, handleSubmit, formState} = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const {isValid} = formState;

  const handleUserLogin = handleSubmit(({username, password}) => {
    login({username, password});
  });

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#000',
          fontSize: 26,
          marginTop: 162,
          fontFamily: 'Roboto-Bold',
        }}>
        Enter your username & {'\n'}password to login
      </Text>

      <Text style={{color: '#000', marginTop: 32}}>Username</Text>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="username"
          render={({field, formState: {errors}}) => {
            return (
              <React.Fragment>
                <TextInput
                  style={{
                    ...styles.input2,
                  }}
                  value={field.value}
                  placeholder="Ex. Username"
                  onChangeText={field.onChange}
                  placeholderTextColor={'#888'}
                />

                <ErrorMessage
                  errors={errors}
                  name={field.name}
                  render={({message}) => {
                    return <Text style={styles.errorMsg}>{message}</Text>;
                  }}
                />
              </React.Fragment>
            );
          }}
        />
      </View>

      <View>
        <Text style={{color: '#000', marginTop: 32}}>Password</Text>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name={'password'}
            render={({field, formState: {errors}}) => {
              return (
                <React.Fragment>
                  <TextInput
                    secureTextEntry
                    style={{
                      ...styles.input2,
                    }}
                    value={field.value}
                    placeholder="*********"
                    placeholderTextColor={'#888'}
                    onChangeText={field.onChange}
                  />

                  <ErrorMessage
                    errors={errors}
                    name={field.name}
                    render={({message}) => {
                      return <Text style={styles.errorMsg}>{message}</Text>;
                    }}
                  />
                </React.Fragment>
              );
            }}
          />
        </View>

        <View style={{marginTop: 22}}>
          <CommonBtn
            middle
            title={'Login'}
            color={'#FFFFFF'}
            isLoading={isLoading}
            onPress={handleUserLogin}
            backgroundColor={!isValid ? '#888' : Colors.PRIMARY_COLOR}
            borderColor={!isValid ? Colors.GRAY_COLOR : Colors.PRIMARY_COLOR}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  inputContainer: {
    // flexDirection: 'row',
  },
  input2: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#C6C6C6',
    color: '#000',
  },
  errorMsg: {
    color: 'red',
  },
});
