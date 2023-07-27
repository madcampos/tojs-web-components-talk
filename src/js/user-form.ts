const nameList = ['Time', 'Past', 'Future', 'Dev', 'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling', 'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat', 'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit', 'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest', 'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video', 'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum', 'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code', 'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle', 'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha', 'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King', 'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb', 'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster', 'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big', 'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken', 'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies', 'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker', 'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice', 'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound', 'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'];

export function getRandomUsername(){
	const firstPart = nameList[Math.floor(Math.random() * nameList.length)];
	const secondPart = nameList[Math.floor(Math.random() * nameList.length)];
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const lastPart = Math.random() > 0.5 ? nameList[Math.floor(Math.random() * nameList.length)] : '';

	return `${firstPart}${secondPart}${lastPart}`;
}

function getRandomHashcode() {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	return Math.random().toString().substring(4, 8);
}

function setDefaultValues() {
	const username = localStorage.getItem('username') ?? getRandomUsername();
	const userHash = localStorage.getItem('user-hash') ?? getRandomHashcode();
	const pronoums = localStorage.getItem('pronoums');
	const avatar = localStorage.getItem('avatar');

	document.querySelector('c-username-input')?.setAttribute('value', username);
	localStorage.setItem('username', username);

	document.querySelector('c-username-input')?.setAttribute('user-hash', userHash);
	localStorage.setItem('user-hash', userHash);

	if (avatar) {
		document.querySelector('c-avatar-editable')?.setAttribute('image', avatar);
	}

	if (pronoums) {
		document.querySelector('c-text-input')?.setAttribute('value', pronoums);
	}
}

function toggleFormEditing(isEnabled: boolean) {
	document.querySelector('form')?.toggleAttribute('disabled', !isEnabled);
	document.querySelector('c-avatar-editable')?.toggleAttribute('disabled', !isEnabled);
	document.querySelector('c-username-input')?.toggleAttribute('disabled', !isEnabled);
	document.querySelector('c-text-input')?.toggleAttribute('disabled', !isEnabled);
}

function addEventListeners() {
	document.querySelector('#edit-button')?.addEventListener('click', () => {
		toggleFormEditing(true);
	});

	document.querySelector('#cancel-button')?.addEventListener('click', () => {
		toggleFormEditing(false);
	});

	document.querySelector('form')?.addEventListener('submit', (evt: Event) => {
		evt.preventDefault();

		const target = evt.target as HTMLFormElement;
		const formData = new FormData(target);
		const username = formData.get('username') as string | null;
		const pronoums = formData.get('pronoums') as string | null;
		const avatar = document.querySelector('c-avatar-editable')?.getAttribute('image') as string | null;

		if (username) {
			localStorage.setItem('username', username);
		}

		if (pronoums) {
			localStorage.setItem('pronoums', pronoums);
		}

		if (avatar) {
			localStorage.setItem('avatar', avatar);
		}

		toggleFormEditing(false);
	});
}

export function initializeUserForm() {
	setDefaultValues();
	addEventListeners();
}
