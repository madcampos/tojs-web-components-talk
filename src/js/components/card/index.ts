import cssLink from './style.css?url';

export class CustomCard extends HTMLElement {
	declare shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<article>
				<header>
					<picture>
						<slot name="image"></slot>
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

	connectedCallback() {
		const like = this.shadowRoot.querySelector('#like') as HTMLButtonElement;
		const share = this.shadowRoot.querySelector('#share') as HTMLButtonElement;

		like.addEventListener('click', () => {
			like.disabled = true;

			try {
				like.classList.toggle('active');

				this.dispatchEvent(new CustomEvent<{ state: boolean, id: string }>('like', {
					detail: {
						state: like.classList.contains('active'),
						id: this.getAttribute('user-id') ?? ''
					}
				}));
			} catch {
				console.error('Like failed');
			}

			like.disabled = false;
		});

		share.addEventListener('click', async () => {
			share.disabled = true;

			try {
				const title = this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="title"]')?.assignedElements()[0]?.textContent ?? '';
				const subtitle = this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="subtitle"]')?.assignedElements()[0]?.textContent ?? '';
				const text = this.shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements()[0]?.textContent ?? '';

				const data: ShareData = {
					title: `${title} (${subtitle})`,
					text,
					url: window.location.href
				};

				await navigator.share(data);
			} catch {
				console.error('Share failed');
			}

			share.disabled = false;
		});
	}
}

if (!customElements.get('c-card')) {
	customElements.define('c-card', CustomCard);
}
