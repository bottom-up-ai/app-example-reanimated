import { add, sub, format } from 'date-fns';
import { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useMeals } from '@/components/home/hooks';
import MealsList from '@/components/home/MealsList';

const styles = StyleSheet.create({
	subheader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: "space-between",
		paddingHorizontal: 10,
		position: "absolute",
		zIndex: 1,
		top: 50,
		width: "100%"
	},
	dateContainer: {
		position: "relative",
		overflow: "hidden",
		flex: 1
	},
	date: {
		fontSize: 18,
		textAlign: "center"
	}
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', { 
	weekday: "long", 
	day: "numeric", 
	month: "short",
});

const DATE_OFFSET = 180;

const HomeScreen = () => {
	const insets = useSafeAreaInsets();
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const translateX = useSharedValue(0);

	const nextDate = add(currentDate, { days: 1 });
	const previousDate = sub(currentDate, { days: 1 });

	const currentDateString = format(currentDate, "yyyy-MM-dd");
	const nextDateString = format(nextDate, "yyyy-MM-dd");
	const previousDateString = format(previousDate, "yyyy-MM-dd");

	const currentDayMeals = useMeals(currentDateString);
	const previousDayMeals = useMeals(previousDateString);
	const nextDayMeals = useMeals(nextDateString);

	const SCREEN_WIDTH = useWindowDimensions().width;
	const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

	const goToPreviousDay = useCallback(() => {
		setCurrentDate((prevDate) => sub(prevDate, { days: 1 }));
	}, [setCurrentDate, sub]);
	
	const goToNextDay = useCallback(() => {
		setCurrentDate((prevDate) => add(prevDate, { days: 1 }));
	}, [setCurrentDate, add]);

	const pan = Gesture.Pan()
		.onUpdate((event) => {
			translateX.value = event.translationX;
		})
		.onEnd((event) => {
			if (event.velocityX < -500 || event.translationX < -SWIPE_THRESHOLD) {
				/* swipe left -> next day */
				translateX.value = withSpring(
					-SCREEN_WIDTH, 
					{ velocity: event.velocityX, damping: 50, stiffness: 50 }, 
					() => {
						runOnJS(goToNextDay)();
						translateX.value = 0;
					}
				);
			} else if (event.velocityX > 500 || event.translationX > SWIPE_THRESHOLD) {
				/* swipe right -> previous day */
				translateX.value = withSpring(
					SCREEN_WIDTH, 
					{ velocity: event.velocityX, damping: 50, stiffness: 50 }, 
					() => {
						runOnJS(goToPreviousDay)();
						translateX.value = 0;
					}
				);
			} else {
				/* back to original position */
				translateX.value = withSpring(0);
			}
		})
	;

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }]
	}));

	const nextScreenStyle = useAnimatedStyle(() => ({
		transform: [
			{ 
				translateX: interpolate( /* Parallax */
					translateX.value,
					[-SCREEN_WIDTH, 0, SCREEN_WIDTH],
					[0, SCREEN_WIDTH, SCREEN_WIDTH],
				)
			},
		],
	}));

	const previousScreenStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: interpolate(
					translateX.value,
					[-SCREEN_WIDTH, 0, SCREEN_WIDTH],
					[-SCREEN_WIDTH, -SCREEN_WIDTH, 0]
				)
			},
		],
	}));

	const previousDateAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			translateX.value, 
			[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
			[0, 0, 1]
		),
		transform: [
			{ 
				translateX: interpolate(
					translateX.value, 
					[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
					[-DATE_OFFSET, -DATE_OFFSET, 0]
				) 
			}
		]
	}));
	
	const currentDateAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			translateX.value, 
			[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
			[0, 1, 0]

		),
		transform: [
			{ 
				translateX: interpolate(
					translateX.value, 
					[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
					[-DATE_OFFSET, 0, DATE_OFFSET]
				) 
			}
		]
	}));
	
	const nextDateAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			translateX.value, 
			[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
			[1, 0, 0]
		),
		transform: [
			{ 
				translateX: interpolate(
					translateX.value, 
					[-SCREEN_WIDTH, 0, SCREEN_WIDTH], 
					[0, DATE_OFFSET, DATE_OFFSET]
				) 
			}
		]
	}));
	
	return (
		<View>
			<View style={[styles.subheader, { marginTop: insets.top + 10 }]}>
				<View style={styles.dateContainer}>
					<Animated.Text style={[styles.date, previousDateAnimatedStyle, { position: "absolute", width: "100%", backgroundColor: "lightblue" }]}>
						{dateFormatter.format(previousDate)}.
					</Animated.Text>
					<Animated.Text style={[styles.date, currentDateAnimatedStyle, { backgroundColor: "pink" }]}>
						{dateFormatter.format(currentDate)}.
					</Animated.Text>
					<Animated.Text style={[styles.date, nextDateAnimatedStyle, { position: "absolute", width: "100%", backgroundColor: "lightgreen" }]}>
						{dateFormatter.format(nextDate)}.
					</Animated.Text>
				</View>
			</View>
			<GestureDetector gesture={pan}>
				<View style={{ overflow: "hidden" }}>
					{/* previous screen */}
					<Animated.View style={[previousScreenStyle, { width: "100%", position: "absolute", minHeight: "100%" }]}>
						<MealsList date={previousDateString} data={[]} isLoading={previousDayMeals.isLoading} />
					</Animated.View>

					{/* current screen */}
					<Animated.View style={[animatedStyle, { width: "100%" }]}>
						<MealsList date={currentDateString} data={[]} isLoading={currentDayMeals.isLoading} />
					</Animated.View>

					{/* next screen */}
					<Animated.View style={[nextScreenStyle, { width: "100%", position: "absolute", minHeight: "100%" }]}>
						<MealsList date={nextDateString} data={[]} isLoading={nextDayMeals.isLoading} />
					</Animated.View>
				</View>
			</GestureDetector>
		</View>
	);
};

export default HomeScreen;