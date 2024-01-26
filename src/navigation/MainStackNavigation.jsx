import {useSelector} from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import EmployeeUpsertScreen from '../screens/EmployeeUpsertScreen';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const MainStack = createStackNavigator();

const MainStackNavigation = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}>
      {!isLoggedIn ? (
        <MainStack.Screen name="Login" component={LoginScreen} />
      ) : (
        <MainStack.Group>
          <MainStack.Screen name="Home" component={HomeScreen} />
          <MainStack.Screen
            name="EmployeeUpsert"
            component={EmployeeUpsertScreen}
            options={({route}) => {
              return {
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitle: !!route.params
                  ? 'Edit Employee'
                  : 'Create Employee',
              };
            }}
          />
        </MainStack.Group>
      )}
    </MainStack.Navigator>
  );
};

export default MainStackNavigation;
