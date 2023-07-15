import cssLink from './style.css?url';

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
				<div id="status"></div>
			</div>
		`;
	}

	get image() {
		return this.getAttribute('image') ?? '';
	}

	set image(value) {
		this.setAttribute('image', value);

		const img = this.shadowRoot.querySelector('img') as HTMLImageElement;

		img.src = value;
	}

	get status() {
		return this.getAttribute('status') ?? '';
	}

	set status(value) {
		this.setAttribute('status', value);

		const status = this.shadowRoot.querySelector('#status') as HTMLDivElement;

		status.className = value;
		status.innerHTML = value;
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
