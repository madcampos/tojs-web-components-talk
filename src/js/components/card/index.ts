import cssLink from './style.css?url';

export class CustomCard extends HTMLElement {
	static get observedAttributes() { return ['image']; }

	declare shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<article>
				<header>
					<picture>
						<img loading="lazy" role="presentation">
					</picture>
					<h2><slot name="title"></slot></h2>
					<p><slot name="subtitle"></slot></p>
				</header>

				<slot></slot>

				<footer>
					<button id="like" title="Like">👍</button>
					<button id="share" title="Share">📤</button>
				</footer>
			</article>
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

if (!customElements.get('c-card')) {
	customElements.define('c-card', CustomCard);
}
