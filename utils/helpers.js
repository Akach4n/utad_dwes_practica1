// Comprueba si alguien nacido en esa fecha aún no ha cumplido 18 años
export function isMinor(birthDate) {
	const eighteenthBirthday = new Date(birthDate);
	eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18);
	return new Date() < eighteenthBirthday;
}

// Los vídeos aptos los puede ver cualquiera y el resto solo los adultos
export function canWatch(user, video) {
	return video.kidsFriendly || !isMinor(user.birthDate);
}
