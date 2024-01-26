import z from 'zod';
import React from 'react';
import moment from 'moment';
import {PRIMARY_COLOR} from '../constants/Colors';
import {zodResolver} from '@hookform/resolvers/zod';
import {ErrorMessage} from '@hookform/error-message';
import {TabView, TabBar} from 'react-native-tab-view';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '../store/services/api';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

const initialEmployeeData = {
  employee_salary: '',
  employee_firstname: '',
  employee_lastname: '',
  employee_phone: '',
  employee_dob: '',
  employee_gender: '',
  employee_skills: [
    {
      name: '',
      level: '',
      years: '',
    },
  ],
};

const schema = z.object({
  employee_firstname: z.string().min(1),
  employee_lastname: z.string().min(1),
  employee_phone: z
    .string()
    .length(11)
    .regex(/\d{11}/, 'phone number must contain 11 digits'),
  employee_gender: z.enum(['male', 'female', 'other']),
  employee_dob: z.string().datetime(),
  employee_skills: z.array(
    z.object({
      name: z.string().min(1),
      years: z.number(),
      level: z.enum(['beginner', 'intermediate', 'advanced']),
    }),
  ),
  employee_salary: z.number(),
});

/**
 *
 * @param {{navigation: import('@react-navigation/native').NavigationProp<import('./HomeScreen').MainStackParamList>; route: import('@react-navigation/native').RouteProp<import('./HomeScreen').MainStackParamList, "EmployeeUpsert">}} props
 */
export default function EmployeeUpsertScreen(props) {
  const [updateEmployee, {isLoading: isUpdatingEmployee}] =
    useUpdateEmployeeMutation();
  const [createEmployee, {isLoading: isCreatingEmployee}] =
    useCreateEmployeeMutation();

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const {control, handleSubmit, trigger, watch} = useForm({
    resolver: zodResolver(schema),
    defaultValues: async () => {
      if (!!props.route.params) {
        const employeeDetails = props.route.params;

        const [empFirstName, empLastName] =
          employeeDetails.employee_name.split(' ');

        return {
          ...initialEmployeeData,
          employee_firstname: empFirstName ?? '',
          employee_lastname: empLastName ?? '',
          employee_phone: employeeDetails.employee_phone ?? '',
          employee_salary: employeeDetails.employee_salary ?? '',
          employee_dob: employeeDetails.employee_dob ?? '',
          employee_gender: employeeDetails.employee_gender ?? '',
          employee_skills: employeeDetails.employee_skills ?? [
            {
              name: '',
              level: '',
              years: '',
            },
          ],
        };
      }

      return initialEmployeeData;
    },
  });

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'basic', title: 'Basic'},
    {key: 'skills', title: 'Skills'},
    {key: 'preview', title: 'Preview'},
  ]);
  const {fields} = useFieldArray({
    control,
    name: 'employee_skills',
  });

  const {
    employee_dob,
    employee_firstname,
    employee_lastname,
    employee_gender,
    employee_phone,
    employee_skills,
    employee_salary,
  } = watch();

  const controlledSkills = fields.map((field, index) => ({
    ...field,
    ...employee_skills[index],
  }));

  const handleUpsert = handleSubmit(values => {
    if (!!props.route.params) {
      updateEmployee({
        ...values,
        id: props.route.params.id,
        employee_age: moment().diff(moment(values.employee_dob), 'years'),
        employee_name: `${values.employee_firstname} ${values.employee_lastname}`,
      })
        .unwrap()
        .then(() => {
          Alert.alert('Success', 'Employee updated successfully');
          props.navigation.goBack();
        })
        .catch(err => {
          Alert.alert('Error', err.data.message || err.message);
        });
      return;
    }

    createEmployee({
      ...values,
      employee_age: moment().diff(moment(values.employee_dob), 'years'),
      employee_name: `${values.employee_firstname} ${values.employee_lastname}`,
    })
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Employee create successfully');

        props.navigation.goBack();
      })
      .catch(err => {
        Alert.alert('Error', err.data.message || err.message);
      });
  });

  /**
   *
   * @param {import('react-native-tab-view').SceneRendererProps & {route: {key: string;title: string;}}} props
   */
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'basic':
        return (
          <ScrollView
            style={{
              padding: 8,
              elevation: 3,
              borderRadius: 3,
              backgroundColor: 'white',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Controller
                control={control}
                name={'employee_firstname'}
                render={({field, formState: {errors}}) => (
                  <View style={{width: '100%', flex: 1}}>
                    <TextInput
                      value={field.value}
                      style={styles.input}
                      placeholder="First Name"
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
                  </View>
                )}
              />

              <View style={{width: 10}} />

              <Controller
                control={control}
                name={'employee_lastname'}
                render={({field, formState: {errors}}) => (
                  <View style={{width: '100%', flex: 1}}>
                    <TextInput
                      value={field.value}
                      style={styles.input}
                      placeholder="Last Name"
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
                  </View>
                )}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Controller
                control={control}
                name={'employee_dob'}
                render={({field, formState: {errors}}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(true);
                        }}>
                        <View
                          style={{
                            paddingBottom: 10,
                            borderBottomWidth: 2,
                            paddingHorizontal: 10,
                            borderBottomColor: '#C6C6C6',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#888',
                            }}>
                            {!!field.value
                              ? moment(field.value).format('DD-MM-YYYY')
                              : 'Select Date of Birth'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          mode={'date'}
                          maximumDate={moment().subtract(1, 'day').toDate()}
                          value={
                            !!field.value ? new Date(field.value) : new Date()
                          }
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);

                            if (event.type !== 'dismissed') {
                              field.onChange(selectedDate.toISOString());
                            }
                          }}
                        />
                      )}

                      <ErrorMessage
                        errors={errors}
                        name={field.name}
                        render={({message}) => {
                          return <Text style={styles.errorMsg}>{message}</Text>;
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Controller
                control={control}
                name={'employee_phone'}
                render={({field, formState: {errors}}) => (
                  <View>
                    <TextInput
                      value={field.value}
                      style={styles.input}
                      placeholder="Phone"
                      onChangeText={field.onChange}
                      placeholderTextColor={'#888'}
                      keyboardType="phone-pad"
                    />

                    <ErrorMessage
                      errors={errors}
                      name={field.name}
                      render={({message}) => {
                        return <Text style={styles.errorMsg}>{message}</Text>;
                      }}
                    />
                  </View>
                )}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Controller
                control={control}
                name={'employee_gender'}
                render={({field, formState: {errors}}) => (
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => field.onChange('male')}
                        style={{marginRight: 20}}>
                        <View
                          style={{
                            borderRadius: 50,

                            padding: 8,
                            paddingHorizontal: 20,
                            borderWidth: 0.5,
                            borderColor: '#888',

                            backgroundColor:
                              field.value === 'male' ? PRIMARY_COLOR : '#fff',
                          }}>
                          <Text
                            style={{
                              color: field.value == 'male' ? 'white' : '#000',
                            }}>
                            Male
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => field.onChange('female')}
                        style={{marginRight: 20}}>
                        <View
                          style={{
                            borderRadius: 50,

                            padding: 8,
                            paddingHorizontal: 20,
                            borderWidth: 0.5,
                            borderColor: '#888',

                            backgroundColor:
                              field.value === 'female' ? PRIMARY_COLOR : '#fff',
                          }}>
                          <Text
                            style={{
                              color: field.value == 'female' ? 'white' : '#000',
                            }}>
                            Female
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => field.onChange('other')}>
                        <View
                          style={{
                            borderRadius: 50,

                            padding: 8,
                            paddingHorizontal: 20,
                            borderWidth: 0.5,
                            borderColor: '#888',

                            backgroundColor:
                              field.value === 'other' ? PRIMARY_COLOR : '#fff',
                          }}>
                          <Text
                            style={{
                              color: field.value == 'other' ? 'white' : '#000',
                            }}>
                            Other
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <ErrorMessage
                      errors={errors}
                      name={field.name}
                      render={({message}) => {
                        return <Text style={styles.errorMsg}>{message}</Text>;
                      }}
                    />
                  </View>
                )}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Controller
                control={control}
                name={`employee_salary`}
                render={({field, formState: {errors}}) => {
                  return (
                    <View>
                      <TextInput
                        keyboardType="numeric"
                        value={`${field.value}`}
                        style={styles.input}
                        onChangeText={val => {
                          if (!isNaN(val)) {
                            field.onChange(+val);
                          }
                        }}
                        placeholder="Salary"
                      />

                      <ErrorMessage
                        errors={errors}
                        name={field.name}
                        render={({message}) => {
                          return <Text style={styles.errorMsg}>{message}</Text>;
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>

            <View style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={async () => {
                  const valid = await trigger([
                    'employee_dob',
                    'employee_firstname',
                    'employee_lastname',
                    'employee_gender',
                    'employee_salary',
                    'employee_phone',
                  ]);

                  if (valid) {
                    setIndex(prev => prev + 1);
                  }
                }}>
                <View
                  style={{
                    width: '100%',
                    padding: 15,

                    backgroundColor: PRIMARY_COLOR,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Next
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'skills':
        return (
          <View
            style={{
              padding: 8,
              elevation: 3,
              borderRadius: 3,
              backgroundColor: 'white',
            }}>
            {controlledSkills.map((field, index) => {
              return (
                <React.Fragment key={field.id}>
                  <View>
                    <Controller
                      control={control}
                      name={`employee_skills.${index}.name`}
                      render={({field, formState: {errors}}) => {
                        return (
                          <View>
                            <TextInput
                              value={field.value}
                              style={styles.input}
                              placeholder="Skill name"
                              onChangeText={field.onChange}
                              placeholderTextColor={'#888'}
                            />

                            <ErrorMessage
                              errors={errors}
                              name={field.name}
                              render={({message}) => {
                                return (
                                  <Text style={styles.errorMsg}>{message}</Text>
                                );
                              }}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>

                  <View style={{marginTop: 20}}>
                    <Controller
                      control={control}
                      name={`employee_skills.${index}.level`}
                      render={({field, formState: {errors}}) => {
                        return (
                          <View>
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity
                                onPress={() => field.onChange('beginner')}
                                style={{marginRight: 20}}>
                                <View
                                  style={{
                                    borderRadius: 50,

                                    padding: 8,
                                    paddingHorizontal: 10,
                                    borderWidth: 0.5,
                                    borderColor: '#888',

                                    backgroundColor:
                                      field.value === 'beginner'
                                        ? PRIMARY_COLOR
                                        : '#fff',
                                  }}>
                                  <Text
                                    style={{
                                      color:
                                        field.value == 'beginner'
                                          ? 'white'
                                          : '#000',
                                    }}>
                                    Beginner
                                  </Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => field.onChange('intermediate')}
                                style={{marginRight: 20}}>
                                <View
                                  style={{
                                    borderRadius: 50,

                                    padding: 8,
                                    paddingHorizontal: 10,
                                    borderWidth: 0.5,
                                    borderColor: '#888',

                                    backgroundColor:
                                      field.value === 'intermediate'
                                        ? PRIMARY_COLOR
                                        : '#fff',
                                  }}>
                                  <Text
                                    style={{
                                      color:
                                        field.value == 'intermediate'
                                          ? 'white'
                                          : '#000',
                                    }}>
                                    Intermediate
                                  </Text>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => field.onChange('advanced')}>
                                <View
                                  style={{
                                    borderRadius: 50,

                                    padding: 8,
                                    paddingHorizontal: 10,
                                    borderWidth: 0.5,
                                    borderColor: '#888',

                                    backgroundColor:
                                      field.value === 'advanced'
                                        ? PRIMARY_COLOR
                                        : '#fff',
                                  }}>
                                  <Text
                                    style={{
                                      color:
                                        field.value == 'advanced'
                                          ? 'white'
                                          : '#000',
                                    }}>
                                    Advanced
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <ErrorMessage
                              errors={errors}
                              name={field.name}
                              render={({message}) => {
                                return (
                                  <Text style={styles.errorMsg}>{message}</Text>
                                );
                              }}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>

                  <View style={{marginTop: 20}}>
                    <Controller
                      control={control}
                      name={`employee_skills.${index}.years`}
                      render={({field, formState: {errors}}) => {
                        return (
                          <View>
                            <TextInput
                              keyboardType="numeric"
                              value={`${field.value}`}
                              style={styles.input}
                              onChangeText={val => {
                                if (!isNaN(val)) {
                                  field.onChange(+val);
                                }
                              }}
                              placeholder="Years of experience"
                            />

                            <ErrorMessage
                              errors={errors}
                              name={field.name}
                              render={({message}) => {
                                return (
                                  <Text style={styles.errorMsg}>{message}</Text>
                                );
                              }}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>
                </React.Fragment>
              );
            })}

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIndex(prev => prev - 1);
                }}>
                <View
                  style={{
                    width: 100,
                    padding: 15,

                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text style={{textAlign: 'center', color: '#FFFFFF'}}>
                    Back
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{width: 10}} />

              <TouchableOpacity
                onPress={async () => {
                  const valid = await trigger(['employee_skills']);

                  if (valid) {
                    setIndex(prev => prev + 1);
                  }
                }}>
                <View
                  style={{
                    width: 100,
                    padding: 15,
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text style={{textAlign: 'center', color: '#fff'}}>Next</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'preview':
        return (
          <View
            style={{
              padding: 8,
              elevation: 3,
              borderRadius: 3,
              backgroundColor: 'white',
            }}>
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Basic:</Text>
            <Text>First name: {employee_firstname}</Text>
            <Text>Last name: {employee_lastname}</Text>
            <Text>Gender: {employee_gender}</Text>
            <Text>Salary: ${employee_salary}</Text>
            <Text>
              Date of birth: {moment(employee_dob).format('DD-MM-YYYY')}
            </Text>
            <Text>Phone number: {employee_phone}</Text>

            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Skills: </Text>

            {controlledSkills.map(skill => {
              return (
                <View key={skill.id}>
                  <Text>Skill name: {skill.name}</Text>
                  <Text>level: {skill.level}</Text>
                  <Text>Years of experience: {skill.years}</Text>
                </View>
              );
            })}

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIndex(prev => prev - 1);
                }}>
                <View
                  style={{
                    width: 100,
                    padding: 15,
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text style={{textAlign: 'center', color: '#fff'}}>Back</Text>
                </View>
              </TouchableOpacity>

              <View style={{width: 10}} />

              <TouchableOpacity
                onPress={handleUpsert}
                disabled={isCreatingEmployee || isUpdatingEmployee}>
                <View
                  style={{
                    width: 100,
                    padding: 15,
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text style={{textAlign: 'center', color: '#fff'}}>
                    Submit
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      android_ripple={{borderless: false}}
      onTabPress={async ({preventDefault, route}) => {
        preventDefault();
        let valid = false;

        if (route.key === 'basic') {
          setIndex(0);
        }
        if (route.key === 'skills') {
          valid = await trigger([
            'employee_dob',
            'employee_firstname',
            'employee_lastname',
            'employee_gender',
            'employee_salary',
            'employee_phone',
          ]);
          if (valid) {
            setIndex(1);
          }
        }
        if (route.key === 'preview') {
          valid = await trigger([
            'employee_dob',
            'employee_firstname',
            'employee_lastname',
            'employee_gender',
            'employee_salary',
            'employee_phone',
          ]);
          if (valid) {
            valid = await trigger(['employee_skills']);
            if (valid) {
              setIndex(2);
            } else {
              setIndex(1);
            }
          }
        }
      }}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: PRIMARY_COLOR}}
      pressOpacity={1}
      renderIcon={({route, color}) => {
        switch (route.key) {
          case 'basic':
            return <FeatherIcon name={'info'} size={16} color={color} />;

          case 'skills':
            return (
              <FoundationIcon
                name={'social-skillshare'}
                size={16}
                color={color}
              />
            );

          case 'preview':
            return <FeatherIcon name={'triangle'} size={16} color={color} />;
        }
      }}
    />
  );

  return (
    <TabView
      swipeEnabled={false}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      initialLayout={{width: layout.width}}
      sceneContainerStyle={{padding: 15}}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    borderBottomColor: '#C6C6C6',
  },
  errorMsg: {
    color: 'red',
  },
});
