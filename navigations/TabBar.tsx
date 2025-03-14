import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

const TabBar = (props: BottomTabBarProps) => {
	const { descriptors, navigation, state } = props;

	const { tabBarBackground, tabBarStyle } = descriptors[state.routes[state.index].key].options;

	return (
		<Animated.View 
			style={[
				{ 
					flexDirection: 'row', 
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 60,
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0
				},
				tabBarStyle
			]}
		>
			{tabBarBackground ? tabBarBackground() : undefined}
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;
				const activeColor = options.tabBarActiveTintColor || "blue";
				const inactiveColor = options.tabBarInactiveTintColor || "black";
				const scaleAnim = useRef(new Animated.Value(1)).current;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});
		
					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const handlePressIn = () => {
					Animated.parallel([
						Animated.timing(scaleAnim, {
							toValue: 0.90,
							duration: 100,
							useNativeDriver: true
						}),
					]).start();
				};
				
				const handlePressOut = () => {
					Animated.parallel([
						Animated.timing(scaleAnim, {
							toValue: 1,
							duration: 100,
							useNativeDriver: true
						}),
					]).start();
				}

				if (options.tabBarButton) {
					return options.tabBarButton({
						children: undefined,
						onPress,
						onLongPress: onPress,
						accessibilityRole: "button",
						accessibilityState: isFocused ? { selected: true } : {},
						accessibilityLabel: options.tabBarAccessibilityLabel,
						testID: options.tabBarButtonTestID,
						key: index,
					});
				}

				return (
					<TouchableOpacity
						key={index}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarButtonTestID}
						onPress={onPress}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						activeOpacity={0.7}
						style={{
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: 90,
							transform: [{ scale: scaleAnim }],
						}}
					>
						{options.tabBarIcon ? options.tabBarIcon({
							focused: isFocused,
							color: isFocused ? activeColor : inactiveColor,
							size: 24,
						}) : null}
					</TouchableOpacity>
				);
			})}
		</Animated.View>
	);
};

export default TabBar;