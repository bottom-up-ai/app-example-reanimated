import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftContainer: {
		justifyContent: 'center',
		alignItems: "flex-start",
		zIndex: 1, /* Ensure it's rendered above the title when title is centered */
	},
	leftContainerWithContent: {
		minWidth: 40,
	  },
	rightContainer: {
		justifyContent: 'center',
		alignItems: 'flex-end',
		zIndex: 1, /* Ensure it's rendered above the title when title is centered */
	},
	rightContainerWithContent: {
		minWidth: 40,
	},
	titleContainer: {
		flex: 1,
	},
	titleCentered: {
		alignItems: 'center',
	},
	titleLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

const Header = (props: BottomTabHeaderProps) => {
	const { route, options, navigation } = props;
	const insets = useSafeAreaInsets();

	const headerTitle = options.headerTitle || route.name;

	const tintColor = options.headerTintColor || '#000000';
	const titleStyle = options.headerTitleStyle || {};
	const titleAlignment = options.headerTitleAlign || 'left';

	// Check if left and right components exist
	const hasLeftComponent = !!options.headerLeft;
	const hasRightComponent = !!options.headerRight;

	/* Determine if we can go back (in a nested stack) */
	const canGoBack = navigation.canGoBack();

	return (
			<Animated.View
				style={[
					styles.container,
					{ paddingTop: insets.top },
					options.headerStyle
				]}
			>
				{options.headerBackground ? options.headerBackground({ style: {} }) : undefined}

				{/* Left component */}
				{(hasLeftComponent || titleAlignment === 'center') && (
					<View style={[
						styles.leftContainer,
						(hasLeftComponent || titleAlignment === 'center') && styles.leftContainerWithContent,
					]}>
						{options.headerLeft && options.headerLeft({ tintColor, canGoBack })}
					</View>
				)}

				{/* Title component */}
				<View 
					style={[
						styles.titleContainer,
						titleAlignment === "center" ? styles.titleCentered : styles.titleLeft
					]}
				>
					{
						typeof headerTitle === "string" ? (
							<Animated.Text
								numberOfLines={1}
								style={[
									{ color: tintColor, textAlign: titleAlignment },
									titleStyle,
								]}
							>
								{headerTitle}
							</Animated.Text> 
						) : headerTitle({
							children: route.name,
							tintColor,
							style: [titleStyle, { textAlign: titleAlignment }]
						})
					}
				</View>

				{/* Right component */}
				{(hasRightComponent || titleAlignment === 'center') && (
					<View style={[
						styles.rightContainer,
						(hasRightComponent || titleAlignment === 'center') && styles.rightContainerWithContent,
					]}>
						{options.headerRight && options.headerRight({ tintColor, canGoBack })}
					</View>
				)}
			</Animated.View>
	);
};

export default Header;