import { CustomTextInput } from '../text-input';

import cssLink from './style.css?url';

/**
 * An extension of the text input element to handle usernames.
 * It will append a random 4 digit number to the end of the username, like discord.
 *
 * @element c-username-input
 */
export class CustomUsernameInput extends CustomTextInput {
	static get observedAttributes() { return [...super.observedAttributes, 'user-hash']; }

	/**
	 * The random 4 digit number appended to the end of the username.
	 */
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	#userHash = Math.random().toString().substring(4, 8);

	constructor() {
		super();

		this.shadowRoot.querySelector('link')?.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="${cssLink}">`);

		this.shadowRoot.querySelector('input')?.insertAdjacentHTML('afterend', `<span id="username-hash">${this.userHash}</span>`);
	}

	/**
	 * The random 4 digit number appended to the end of the username.
	 * Defaults to a random number.
	 *
	 * @type {string}
	 * @attr user-hash
	 */
	get userHash() {
		return this.getAttribute('user-hash') ?? this.#userHash;
	}

	set userHash(value: string) {
		this.setAttribute('user-hash', value);
		this.#userHash = value;
		(this.shadowRoot.querySelector('#username-hash') as HTMLSpanElement).textContent = value;
	}

	connectedCallback() {
		super.connectedCallback();

		this.shadowRoot.querySelector('input')?.addEventListener('input', (evt) => {
			if (this.value.includes('#')) {
				evt.stopPropagation();
				this.setCustomValidity('Username cannot contain #');
			}
		});

		this.shadowRoot.querySelector('input')?.addEventListener('change', (evt) => {
			if (this.value.includes('#')) {
				evt.stopPropagation();
				this.setCustomValidity('Username cannot contain #');
			}
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'user-hash':
				this.userHash = newValue;
				break;
			default:
		}

		super.attributeChangedCallback(name, oldValue, newValue);
	}
}

if (!customElements.get('c-username-input')) {
	customElements.define('c-username-input', CustomUsernameInput);
}
