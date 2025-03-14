import { Text, View } from 'react-native';

type Props = {
	color: string;
	label: string;
};

const TabBarItem = (props: Props) => {
	const { color, label } = props;

	return (
		<View
			style={{ 
				alignItems: "center",
				justifyContent: "center", 
				paddingVertical: 8,
				rowGap: 4,
			}}
		>
			<View style={{}}>
				<Text 
					style={{ 
						fontSize: 10, 
						fontFamily: "Inter-Medium", 
						color: color, 
						width: "100%",
					}}
				>
					{label}
				</Text>
			</View>
		</View>
	);
};

export default TabBarItem;