import cssLink from './style.css?url';
import { CustomSelect } from '../select';

/**
 * A status changer custom select element that allows for selection of a user online status.
 *
 * @fires selected - The option was selected.
 *
 * @element c-status-changer
 */
export class CustomStatusChanger extends CustomSelect {
	#statusMap = new Map([
		['Online', '🟢'],
		['Busy', '🔴'],
		['Away', '🟡'],
		['Offline', '⚪']
	]);

	constructor() {
		super();

		this.shadowRoot.querySelector('link')?.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="${cssLink}">`);

		(this.shadowRoot.querySelector('#options-container') as HTMLDivElement).innerHTML = `
			<c-select-option value="Online">🟢 <slot name="online">Online</slot></c-select-option>
			<c-select-option value="Busy">🔴 <slot name="busy">Busy</slot></c-select-option>
			<c-select-option value="Away">🟡 <slot name="away">Away</slot></c-select-option>
			<c-select-option value="Offline">⚪ <slot name="offline">Offline</slot></c-select-option>
		`;

		if (!this.getAttribute('value')) {
			this.value = 'Online';
		}
	}

	get value() {
		return super.value;
	}

	set value(value) {
		super.value = value;

		this.setAttribute('value', this.value);

		const selectedOption = this.shadowRoot.querySelector<HTMLLabelElement>('label') as HTMLLabelElement;

		selectedOption.innerText = this.#statusMap.get(this.value) ?? '';
	}
}

if (!customElements.get('c-status-changer')) {
	customElements.define('c-status-changer', CustomStatusChanger);
}
