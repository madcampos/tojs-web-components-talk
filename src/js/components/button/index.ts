import cssLink from './style.css?url';

export class CustomButton extends HTMLElement {
	static get observedAttributes() { return ['disabled', 'type']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'button';
		this.tabIndex = 0;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="wrapper">
				<button tabindex="-1">
					<slot></slot>
				</button>
			</div>
		`;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('button')?.toggleAttribute('disabled', value);
	}

	get type() {
		return this.getAttribute('type') ?? 'button';
	}

	set type(value: string) {
		this.setAttribute('type', value);
		this.shadowRoot.querySelector('button')?.setAttribute('type', value);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('button')?.addEventListener('click', () => {
			if (this.disabled) {
				return;
			}

			if (this.type === 'submit') {
				this.#internals.form?.requestSubmit();
			}

			if (this.type === 'reset') {
				this.#internals.form?.reset();
			}


			this.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (newValue === oldValue) {
			return;
		}

		switch (name) {
			case 'disabled':
				this.disabled = newValue !== null;
				break;
			case 'type':
				this.type = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-button')) {
	customElements.define('c-button', CustomButton);
}
