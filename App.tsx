import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/navigations/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<AppNavigator />
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

export default App;