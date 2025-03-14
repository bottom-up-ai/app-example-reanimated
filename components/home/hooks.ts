import { useQuery } from '@tanstack/react-query';

export const wait = async (ms: number) => {
	await new Promise((resolve, reject) => {setTimeout(() => resolve(''), ms)});
};

/** 
 * @param date Format YYYY-MM-DD
 * */
export const useMeals = (date: string) => {
	const result = useQuery({
		queryKey: ["meals", date],
		queryFn: async () => {
			/* use the date to get the corresponding data for that day */
			
			await wait(2_000); /* simulate an api call */

			return [];
		},
	});

	return result;
};