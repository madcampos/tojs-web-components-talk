import cssLink from './style.css?url';

export class CustomPurchaseCard extends HTMLElement {
	static get observedAttributes() { return ['title', 'price', 'image']; }

	static CURRENCY = 'CAD';
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	static TAX_RATE = 0.13;

	declare shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="card-container">
				<div id="hero-image">
					<img src="" alt="Hero Image">
				</div>
				<div id="card-content">
					<h2 id="card-title"></h2>
					<p id="card-price"></p>
				</div>

				<div id="card-actions">
					<button id="card-button">🪙 Buy</button>
				</div>
			</div>
		`;
	}

	get title() {
		return this.getAttribute('title') ?? '';
	}

	set title(value) {
		this.setAttribute('title', value);
		(this.shadowRoot.querySelector('#card-title') as HTMLHeadingElement).textContent = value;
	}

	get price() {
		return this.getAttribute('price') ?? '';
	}

	set price(value) {
		this.setAttribute('price', value);

		const price = Number.isNaN(Number.parseFloat(this.price)) ? 0 : Number.parseFloat(this.price);

		const formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: CustomPurchaseCard.CURRENCY, currencyDisplay: 'narrowSymbol' });
		const formattedPrice = formatter.format(price);

		(this.shadowRoot.querySelector('#card-price') as HTMLParagraphElement).textContent = formattedPrice;
	}

	get image() {
		return this.getAttribute('image') ?? '';
	}

	set image(value) {
		this.setAttribute('image', value);
		(this.shadowRoot.querySelector('#hero-image img') as HTMLImageElement).src = value;
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#card-button')?.addEventListener('click', async () => {
			const price = Number.isNaN(Number.parseFloat(this.price)) ? 0 : Number.parseFloat(this.price);
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

			try {
				const response = await request.show();

				await response.complete('success');

				const event = new CustomEvent('purchase', {
					detail: {
						title: this.title,
						price: this.price
					}
				});

				this.dispatchEvent(event);
			} catch (err) {
				console.error(err);
			}
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'title':
				this.title = newValue;
				break;
			case 'price':
				this.price = newValue;
				break;
			case 'image':
				this.image = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-purchase-card')) {
	customElements.define('c-purchase-card', CustomPurchaseCard);
}
