import type { CustomButton } from '../button';

import { toggleLikeMessage } from '../../friends';

import cssLink from './style.css?url';

/**
 * Custom card layout with image, title, subtitle, content and like/share buttons.
 *
 * @slot - The content of the card.
 * @slot title - The title of the card.
 * @slot subtitle - The subtitle of the card.
 * @slot image - The image of the card.
 *
 * @element c-card
 */
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
					<div>
						<h2><slot name="title"></slot></h2>
						<p><slot name="subtitle"></slot></p>
					</div>
				</header>

				<div id="content">
					<slot></slot>
				</div>

				<footer>
					<c-button id="like" title="Like">👍</c-button>
					<c-button id="unlike" title="Remove Like">💔</c-button>
					<c-button id="share" title="Share">📤</c-button>
				</footer>
			</article>
		`;
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#like')?.addEventListener('click', async (evt) => {
			const target = evt.target as CustomButton;

			target.disabled = true;

			try {
				await toggleLikeMessage(this.getAttribute('message-id') ?? '');

				this.toggleAttribute('liked', true);

				this.dispatchEvent(new CustomEvent<{ state: boolean, id: string }>('like', {
					detail: {
						state: target.classList.contains('liked'),
						id: this.getAttribute('message-id') ?? ''
					}
				}));
			} catch {
				console.error('Like failed');
			}

			target.disabled = false;
		});

		this.shadowRoot.querySelector('#unlike')?.addEventListener('click', async (evt) => {
			const target = evt.target as CustomButton;

			target.disabled = true;

			try {
				await toggleLikeMessage(this.getAttribute('message-id') ?? '');

				this.toggleAttribute('liked', false);

				this.dispatchEvent(new CustomEvent<{ state: boolean, id: string }>('like', {
					detail: {
						state: target.classList.contains('liked'),
						id: this.getAttribute('message-id') ?? ''
					}
				}));
			} catch {
				console.error('Like failed');
			}

			target.disabled = false;
		});

		this.shadowRoot.querySelector('#share')?.addEventListener('click', async (evt) => {
			const target = evt.target as CustomButton;

			target.disabled = true;

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

			target.disabled = false;
		});
	}
}

if (!customElements.get('c-card')) {
	customElements.define('c-card', CustomCard);
}
