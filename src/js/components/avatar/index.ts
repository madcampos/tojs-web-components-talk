import type { CustomStatusChanger } from '../status-changer';

import cssLink from './style.css?url';

/**
 * A avatar element that shows an image with border and optionally a status for a user.
 *
 * @element c-avatar
 */
export class CustomAvatar extends HTMLElement {
	static get observedAttributes() { return ['image', 'status']; }

	declare shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="container">
				<div id="image-wrapper">
					<img src="${this.image}" role="presentation" loading="lazy" />
				</div>
				<div id="status" ${!this.status ? 'hidden' : ''}>
					<c-status-changer value="${this.status}" disabled></c-status-changer>
				</div>
			</div>
		`;
	}

	/**
	 * The image to show in the avatar.
	 *
	 * @type {string}
	 * @attr image
	 */
	get image() {
		return this.getAttribute('image') ?? '';
	}

	set image(value) {
		this.setAttribute('image', value);

		const img = this.shadowRoot.querySelector('img') as HTMLImageElement;

		img.src = value;
	}

	/**
	 * The status to show in the avatar.
	 *
	 * @type {"Online" | "Busy" | "Away" | "Offline"}
	 * @attr status
	 */
	get status() {
		return this.getAttribute('status') ?? '';
	}

	set status(value) {
		this.setAttribute('status', value);

		const status = this.shadowRoot.querySelector('#status') as HTMLDivElement;

		if (value) {
			status.removeAttribute('hidden');

			const statusChanger = status.querySelector('c-status-changer') as CustomStatusChanger;

			statusChanger.value = value;
		} else {
			status.setAttribute('hidden', '');
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'image':
				this.image = newValue;
				break;
			case 'status':
				this.status = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-avatar')) {
	customElements.define('c-avatar', CustomAvatar);
}
