import cssLink from './style.css?url';

/**
 * A custom purchase card element that displays a product's title, price, and image.
 * Also contains a button that initiates a purchase.
 *
 * @fires purchase - Fires when the user has completed the purchase.
 *
 * @element c-purchase-card
 */
export class CustomPurchaseCard extends HTMLElement {
	static get observedAttributes() { return ['title', 'price', 'image']; }

	declare shadowRoot: ShadowRoot;

	/** The currency used for the price. */
	static CURRENCY = 'CAD';
	/** The GST/HST rate used for calculating taxes for the purchase. */
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	static TAX_RATE = 0.13;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="card-container">
				<div id="hero-image">
					<img src="${this.image}" alt="Hero Image">
				</div>
				<div id="card-content">
					<h2 id="card-title">${this.title}</h2>
					<p id="card-price">${this.price}</p>
					<c-button id="card-button">🪙 Buy</c-button>
				</div>
			</div>
		`;
	}

	/**
	 * The product's title.
	 *
	 * @type {string}
	 * @attr title
	 */
	get title() {
		return this.getAttribute('title') ?? '';
	}

	set title(value) {
		this.setAttribute('title', value);
		(this.shadowRoot.querySelector('#card-title') as HTMLHeadingElement).textContent = value;
	}

	/**
	 * The product's price.
	 *
	 * @type {number}
	 * @attr price
	 */
	get price() {
		return Number.parseFloat(this.getAttribute('price') ?? '0');
	}

	set price(value) {
		this.setAttribute('price', value.toString());

		const normalizedPrice = Number.parseFloat(value.toString());
		const price = Number.isNaN(normalizedPrice) ? 0 : normalizedPrice;

		const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: CustomPurchaseCard.CURRENCY, currencyDisplay: 'narrowSymbol' });
		const formattedPrice = formatter.format(price);

		(this.shadowRoot.querySelector('#card-price') as HTMLParagraphElement).textContent = formattedPrice;
	}

	/**
	 * The product's image.
	 *
	 * @type {string}
	 * @attr image
	 */
	get image() {
		return this.getAttribute('image') ?? '';
	}

	set image(value) {
		this.setAttribute('image', value);
		(this.shadowRoot.querySelector('#hero-image img') as HTMLImageElement).src = value;
	}

	async #makePaymentRequest() {
		const price = Number.isNaN(this.price) ? 0 : this.price;
		const taxes = price * CustomPurchaseCard.TAX_RATE;
		const total = price + taxes;

		const request = new PaymentRequest(
			[{ supportedMethods: 'https://bobbucks.dev/pay', data: {} }],
			{
				id: crypto.randomUUID(),
				displayItems: [
					{
						label: this.title,
						amount: { currency: 'CAD', value: price.toString() }
					},
					{
						label: 'GST/HST',
						amount: { currency: 'CAD', value: taxes.toString() }
					}
				],
				total: {
					label: 'Total',
					amount: { currency: 'CAD', value: total.toString() }
				}
			}
		);

		const response = await request.show();

		await response.complete('success');

		const event = new CustomEvent('purchase', {
			detail: {
				title: this.title,
				price: this.price
			}
		});

		this.dispatchEvent(event);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#card-button')?.addEventListener('click', async (evt) => {
			const button = evt.target as HTMLButtonElement;

			button.disabled = true;

			try {
				await this.#makePaymentRequest();
			} catch (err) {
				console.error(err);
			}

			button.disabled = false;
		});
	}

	attributeChangedCallback(name: string, oldValue?: string, newValue?: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'title':
				this.title = newValue ?? '';
				break;
			case 'price':
				this.price = Number.parseFloat(newValue ?? '0');
				break;
			case 'image':
				this.image = newValue ?? '';
				break;
			default:
		}
	}
}

if (!customElements.get('c-purchase-card')) {
	customElements.define('c-purchase-card', CustomPurchaseCard);
}
