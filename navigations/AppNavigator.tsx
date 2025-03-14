import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/components/home/HomeScreen';
import TabBarItem from '@/navigations/TabBarItem';
import TabBar from '@/navigations/TabBar';
import { StatusBar } from 'expo-status-bar';
import Header from '@/navigations/Header';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type AppTabParamList = {
	home: undefined;
	roadmap: undefined;
	profile: undefined;
	"action-button": undefined;
};

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppNavigator = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<QueryClientProvider client={queryClient}>
					<StatusBar style="dark" backgroundColor="transparent" translucent />
					<Tab.Navigator
						backBehavior="history"
						initialRouteName="home"
						tabBar={(props) => <TabBar {...props} />}
						screenOptions={{
							animation: "shift",
							headerTitle: "Example",
							headerTitleAlign: "left",
							headerTitleStyle: {
								fontSize: 18,
								padding: 8,
							},
							headerTransparent: true,
							header: (props) => <Header {...props} />,
						}}
					>
						<Tab.Screen 
							name="home" 
							component={HomeScreen}
							options={{
								tabBarIcon: ({ focused, color }) => (
									<TabBarItem
										color={color}
										label="Home"
									/>
								),
							}}
						/>
					</Tab.Navigator>
				</QueryClientProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

export default AppNavigator;