import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	data: any[];
	isLoading: boolean;
	date: string;
};

const styles = StyleSheet.create({
	containerEmpty: {
		minHeight: "100%",
		alignItems: "center",
		justifyContent: "center"
	},
	titleEmpty: {
		fontFamily: "Canela-Bold",
		fontSize: 24,
		lineHeight: 32,
		marginTop: 20
	},
	descriptionEmpty: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		marginTop: 8
	}
});

const MealsList = (props: Props) => {
	const { data, date, isLoading } = props;
	const insets = useSafeAreaInsets();

	return (
		<ScrollView
			style={[{ paddingHorizontal: 20, minHeight: "100%" }]}
			showsVerticalScrollIndicator={false}
			scrollEnabled={data.length > 0}
		>
			{isLoading ? (
				<View style={styles.containerEmpty}>
					<Text>Loading...</Text>
				</View>
			) : data.length === 0 ? (
				<View style={styles.containerEmpty}>
					<Text style={[styles.titleEmpty, { color: "#000" }]}>
						There's nothing to eat yet
					</Text>
					<Text style={[styles.descriptionEmpty, { color: "#949494" }]}>
						Start by logging your first meal.
					</Text>
				</View>
			) : (
				<View style={{ paddingBottom: 100, rowGap: 12, paddingTop: insets.top + 40 + 20 + 50 }}>
					<Text style={{ textAlign: "center" }}>{`Meals of day ${date}`}</Text>
					{Array.from({ length: 20 }).map((_, index) => (
						<View 
							key={index}
							style={{
								backgroundColor: "white",
								borderRadius: 12,
								height: 140,
							}}
						/>
					))}
				</View>
			)}
		</ScrollView>
	);
};

export default MealsList;