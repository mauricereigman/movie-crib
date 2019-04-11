export function arrayOfSize(amount: number): number[] {
	return [...new Array(amount)].map((value, index) => index);
}
