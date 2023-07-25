import cssLink from './style.css?url';

/**
 * A avatar element that shows an image with border and optionally a status for a user.
 *
 * @element c-avatar
 */
export class CustomAvatar extends HTMLElement {
	static get observedAttributes() { return ['image']; }

	declare shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="container">
				<div id="image-wrapper">
					<svg width="100%" height="100%" viewBox="0 0 100 100">
						<path d="M71,20.2C61.5,20.2 53.7,27.2 52.4,36.3L47.6,36.3C46.3,27.2 38.4,20.2 29,20.2C18.6,20.2 10.2,28.6 10.2,39C10.2,49.4 18.6,57.8 29,57.8C38.5,57.8 46.3,50.8 47.6,41.7L52.4,41.7C53.7,50.8 61.6,57.8 71,57.8C81.4,57.8 89.8,49.4 89.8,39C89.9,28.6 81.4,20.2 71,20.2ZM57.6,39C57.6,31.6 63.6,25.6 71,25.6C78.4,25.6 84.4,31.6 84.4,39C84.4,46.4 78.4,52.4 71,52.4C63.6,52.4 57.6,46.4 57.6,39ZM29,52.4C21.6,52.4 15.6,46.4 15.6,39C15.6,31.6 21.6,25.6 29,25.6C36.4,25.6 42.4,31.6 42.4,39C42.4,46.4 36.4,52.4 29,52.4Z"/>
						<circle cx="29" cy="39" r="4.3"/>
						<circle cx="71" cy="39" r="4.3"/>
						<path d="M64.2,67C62.9,66.3 61.3,66.8 60.6,68.1C58.5,72 54.5,74.5 50.1,74.5C45.7,74.5 41.6,72.1 39.6,68.1C38.9,66.8 37.3,66.3 36,67C34.7,67.7 34.2,69.3 34.9,70.6C37.9,76.3 43.8,79.8 50.2,79.8C56.6,79.8 62.5,76.3 65.5,70.6C66,69.3 65.5,67.7 64.2,67Z"/>
				</svg>
					<img src="${this.image}" role="presentation" loading="lazy" />
				</div>
				<div id="status">
					<slot name="status"></slot>
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

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'image':
				this.image = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-avatar')) {
	customElements.define('c-avatar', CustomAvatar);
}
