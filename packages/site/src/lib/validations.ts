export const isLowerCase = (str: string): boolean => {
	return str === str.toLowerCase();
};

export const isNineChars = (str: string): boolean => {
	return str.length === 9;
};

export const isSupportedChars = (str: string): boolean => {
	return /^[a-z1-5.]+$/.test(str);
};

export const isValidFirstChar = (str: string): boolean => {
	return /^[a-z]/.test(str);
};
