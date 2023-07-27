import { translateContent } from './translation';

function setDefaultValues() {
	const isLightMode = localStorage.getItem('is-light-mode') === 'true';
	const language = localStorage.getItem('language') ?? 'en-US';
	const isAdTrackingEnabled = localStorage.getItem('is-ad-tracking-enabled') === 'true';
	const isNotificationsEnabled = Notification.permission === 'granted';

	document.querySelector('c-switch#light-mode-switch')?.toggleAttribute('checked', isLightMode);
	document.querySelector('c-select#language-select')?.setAttribute('value', language);
	document.querySelector('c-switch#ad-tracking-switch')?.toggleAttribute('checked', isAdTrackingEnabled);
	document.querySelector('c-switch#notifications-switch')?.toggleAttribute('checked', isNotificationsEnabled);

	document.documentElement.classList.toggle('light-mode', isLightMode);
}

function addEventListeners() {
	document.querySelector('c-switch#light-mode-switch')?.addEventListener('change', (event) => {
		const isLightMode = (event.target as HTMLInputElement).checked;

		localStorage.setItem('is-light-mode', isLightMode.toString());
		document.documentElement.classList.toggle('light-mode', isLightMode);
	});

	document.querySelector('c-select#language-select')?.addEventListener('change', (event) => {
		const language = (event.target as HTMLSelectElement).value;

		localStorage.setItem('language', language);
		document.documentElement.lang = language;

		translateContent();
	});

	document.querySelector('c-switch#ad-tracking-switch')?.addEventListener('change', (event) => {
		const isAdTrackingEnabled = (event.target as HTMLInputElement).checked;

		localStorage.setItem('is-ad-tracking-enabled', isAdTrackingEnabled.toString());

		if (isAdTrackingEnabled) {
			// eslint-disable-next-line no-alert
			alert('All your data are belong to us!');
		}
	});

	document.querySelector('c-switch#notifications-switch')?.addEventListener('change', async (event) => {
		const isNotificationsEnabled = (event.target as HTMLInputElement).checked;

		try {
			if (!isNotificationsEnabled) {
				await Notification.requestPermission();
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
		}
	});
}

export function initializeSettings() {
	setDefaultValues();
	addEventListeners();
}
