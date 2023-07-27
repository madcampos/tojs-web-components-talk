/* eslint-disable @typescript-eslint/no-magic-numbers */

import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

import { getRandomUsername } from './user-form';
import { translate } from './translation';

interface Friend {
	id: number,
	name: string,
	avatar: string,
	status: string
}

interface Message {
	id: number,
	friend: number,
	time: Date,
	message: string,
	liked?: boolean
}

interface FriendsDB extends DBSchema {
	friends: {
		key: number,
		value: Friend
	},
	messages: {
		key: number,
		value: Message
	}
}

async function openFriendsDB() {
	return openDB<FriendsDB>('friends-db', 1, {
		upgrade(idb) {
			idb.createObjectStore('friends', { keyPath: 'id', autoIncrement: true });
			idb.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
		}
	});
}

const statusList = [
	'🟢',
	'🔴',
	'🟡',
	'⚪️'
];

const messagesList = [
	'Hello, world!',
	"Hey, I just hacked into the megacorp's mainframe and stole some juicy secrets. Wanna join me for a cyber-heist?",
	"I'm loving the new cybernetic enhancements I got from the black market. They make me feel like a superhuman. How about you?",
	"Have you seen the latest trailer for Cyberpunk 2077? It looks amazing. I can't wait to play it.",
	"I'm stuck on this mission where I have to infiltrate a gang's hideout and rescue a hostage. Any tips?",
	"I just found a rare weapon mod that lets me shoot plasma bolts. It's awesome. Do you want to trade it for something?",
	'I just got into a car chase with some bounty hunters. It was intense. I managed to lose them by hacking a traffic light and causing a pile-up.',
	"I'm having a blast exploring the neon-lit streets of Night City. There's so much to see and do. What's your favorite location?",
	'I just met a mysterious hacker who offered me a job. He said he can pay me in bitcoins or cyberware. What should I choose?',
	"I just upgraded my cyberdeck and now I can hack into anything. It's so cool. Do you want to try it out?",
	'I just got into a fight with some cyberpunks. They were no match for my katana and my reflex boosters. Do you want to join me for some action?',
	'I just completed a side quest where I had to help a rogue AI escape from a corporate lab. It was a tough choice, but I decided to let it go.',
	'I just encountered a glitch in the game. It made my character look like a cyborg unicorn. It was hilarious. Have you seen any glitches?',
	"I just customized my character's appearance and style. I went for a cybergoth look with neon hair and tattoos. How do you like it?",
	'I just joined a faction called the Cyberpunks. They are rebels who fight against the oppression of the megacorps. Do you want to join them too?',
	"I just discovered a secret area in the game. It's a hidden underground club where you can dance, drink and gamble. Do you want to check it out?",
	"I just bought a new vehicle in the game. It's a flying motorcycle that can dodge missiles and lasers. It's awesome. Do you want to take it for a spin?",
	'I just hacked into a TV station and broadcasted a message to the whole city. It was a prank, but it caused a lot of chaos. Do you think I went too far?',
	"I just found a hidden easter egg in the game. It's a reference to The Matrix. It's pretty cool. Do you know any other easter eggs?",
	"I just completed the main story of the game. It was epic. I won't spoil it for you, but it had a lot of twists and turns. What did you think of it?",
	'I just started a new game plus mode in the game. It lets me keep all my skills and items, but makes the enemies harder and smarter. Do you want to join me?',
	'I just got into a car chase with some bounty hunters. It was intense. I managed to lose them by hacking a traffic light and causing a pile-up.',
	"I'm having a blast exploring the neon-lit streets of Night City. There's so much to see and do. What's your favorite location?",
	'I just met a mysterious hacker who offered me a job. He said he can pay me in bitcoins or cyberware. What should I choose?',
	"I just upgraded my cyberdeck and now I can hack into anything. It's so cool. Do you want to try it out?",
	'I just got into a fight with some cyberpunks. They were no match for my katana and my reflex boosters. Do you want to join me for some action?',
	'I just completed a side quest where I had to help a rogue AI escape from a corporate lab. It was a tough choice, but I decided to let it go.',
	'I just encountered a glitch in the game. It made my character look like a cyborg unicorn. It was hilarious. Have you seen any glitches?',
	"I just customized my character's appearance and style. I went for a cybergoth look with neon hair and tattoos. How do you like it?",
	'I just joined a faction called the Cyberpunks. They are rebels who fight against the oppression of the megacorps. Do you want to join them too?',
	"I just discovered a secret area in the game. It's a hidden underground club where you can dance, drink and gamble. Do you want to check it out?",
	"I just bought a new vehicle in the game. It's a flying motorcycle that can dodge missiles and lasers. It's awesome. Do you want to take it for a spin?",
	'I just hacked into a TV station and broadcasted a message to the whole city. It was a prank, but it caused a lot of chaos. Do you think I went too far?',
	"I just found a hidden easter egg in the game. It's a reference to The Matrix. It's pretty cool. Do you know any other easter eggs?",
	"I just completed the main story of the game. It was epic. I won't spoil it for you, but it had a lot of twists and turns. What did you think of it?",
	'I just started a new game plus mode in the game. It lets me keep all my skills and items, but makes the enemies harder and smarter. Do you want to join me?',
	"I just met an NPC who looks exactly like Keanu Reeves. He said he's Johnny Silverhand, a legendary rockerboy who died decades ago. He said he has some unfinished business and he needs my help.",
	'I just found a secret stash of rare loot in an abandoned warehouse. It has some high-tech gear, weapons, and cyberware. Do you want to split it with me?',
	'I just got an invitation to join an elite hacker group called the Netrunners. They said they can teach me some advanced hacking skills and give me access to some exclusive cyberdecks. Should I accept it?',
	'I just witnessed a huge explosion in the city center. It was caused by a terrorist group called the Maelstrom. They said they are fighting for the rights of cyborgs and they want to overthrow the megacorps.',
	"I just got a call from an old friend who needs my help. He said he's in trouble with some gangsters who want to kill him for stealing their data. He said he can pay me well if I save him.",
	'I just visited a ripperdoc who offered me a special deal on some experimental cyberware. He said it can enhance my abilities beyond normal limits, but it also has some risks and side effects.',
	"I just joined an online multiplayer mode where I can team up with other players and compete against other teams in various missions and challenges. It's fun and rewarding, but also very competitive and dangerous.",
	"I just got an offer from a megacorp that wants to hire me as a corporate spy. They said they can pay me handsomely if I infiltrate their rival's headquarters and steal their secrets.",
	'I just stumbled upon a conspiracy that involves the government, the megacorps, and the mysterious Illuminati. They are planning to use a mind control device to enslave the population and create a new world order.',
	"I just unlocked a secret ending in the game that reveals the true nature of reality and my role in it. It's mind-blowing and shocking, but also satisfying and rewarding."
];

function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAvatar() {
	const MAX_IMAGE_ID = 83;

	return `./images/avatars/avatar-${random(1, MAX_IMAGE_ID)}.jpeg`;
}

async function getOrCreateFriend(idb: IDBPDatabase<FriendsDB>) {
	let friend = await idb.get('friends', random(1, 12));

	if (!friend) {
		const friendId = await idb.put('friends', {
			name: getRandomUsername(),
			avatar: getRandomAvatar(),
			status: statusList[random(0, statusList.length - 1)]
		} as Friend);

		friend = await idb.get('friends', friendId) as Friend;
	}

	return friend;
}

function createMessageElement(friend: Friend, message: Message) {
	const messageElement = document.createElement('c-card');

	messageElement.setAttribute('message-id', message.id.toString());

	if (message.liked) {
		messageElement.setAttribute('liked', '');
	}

	messageElement.innerHTML = `
		<c-avatar slot="image" image="${friend.avatar}">
			<span slot="status">${friend.status}</span>
		</c-avatar>
		<span slot="title">${friend.name}</span>
		<span slot="subtitle"><time datetime="${message.time.toISOString()}">${new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(message.time)}</time></span>
		<p>${message.message}</p>
	`;

	return messageElement;
}

function addMessage(friend: Friend, message: Message, shouldShowNotification: boolean) {
	const messageElement = createMessageElement(friend, message);

	document.querySelector('#friends-panel')?.appendChild(messageElement);

	if (shouldShowNotification && Notification.permission === 'granted') {
		// eslint-disable-next-line no-new
		new Notification(`${friend.name} ${translate('notification-message')}`, {
			body: message.message,
			icon: friend.avatar
		});
	}
}

async function setDefaultMessages() {
	const idb = await openFriendsDB();

	const messages = await idb.getAll('messages');

	if (messages.length === 0) {
		const newMessagesCount = random(3, 12);

		for (let i = 0; i < newMessagesCount; i++) {
			// eslint-disable-next-line no-await-in-loop
			const friend = await getOrCreateFriend(idb);
			const messageText = messagesList[random(0, messagesList.length - 1)];
			const time = new Date();

			// eslint-disable-next-line no-await-in-loop
			const messageId = await idb.add('messages', {
				friend: friend.id,
				time,
				message: messageText
			} as Message);

			// eslint-disable-next-line no-await-in-loop
			const message = await idb.get('messages', messageId) as Message;

			addMessage(friend, message, false);
		}
	}

	for await (const message of messages) {
		const friend = await idb.get('friends', message.friend) as Friend;

		addMessage(friend, message, false);
	}
}

async function addNewMessage() {
	const idb = await openFriendsDB();

	const friend = await getOrCreateFriend(idb);
	const messageText = messagesList[random(0, messagesList.length - 1)];
	const time = new Date();

	const messageId = await idb.add('messages', {
		friend: friend.id,
		time,
		message: messageText
	} as Message);

	const message = await idb.get('messages', messageId) as Message;

	addMessage(friend, message, true);

	setTimeout(async () => {
		await addNewMessage();
	}, random(20 * 1000, 120 * 1000));
}

export async function toggleLikeMessage(id: string | number) {
	const idb = await openFriendsDB();

	const message = await idb.get('messages', Number.parseInt(id.toString()));

	if (message) {
		message.liked = !message.liked;

		await idb.put('messages', message);
	}
}

export async function initFriends() {
	await setDefaultMessages();

	setTimeout(async () => {
		await addNewMessage();
	}, random(1000, 5 * 1000));
}
