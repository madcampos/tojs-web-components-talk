import cssLink from './style.css?url';

/**
 * A custom button element.
 *
 * @slot - The button's content.
 *
 * @element c-button
 */
export class CustomButton extends HTMLElement {
	static get observedAttributes() { return ['disabled', 'type']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'button';
		this.tabIndex = 0;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="container">
				<button tabindex="0" type="${this.type}" ${this.disabled ? 'disabled' : ''}>
					<slot></slot>
				</button>
			</div>
		`;
	}

	/**
	 * Whether the button is disabled.
	 *
	 * @type {boolean}
	 * @attr disabled
	 * @default false
	 */
	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('button')?.toggleAttribute('disabled', value);
	}

	/**
	 * The button's type.
	 *
	 * @type {'button' | 'submit' | 'reset'}
	 * @attr type
	 * @default button
	 */
	get type() {
		return this.getAttribute('type') ?? 'button';
	}

	set type(value: string) {
		this.setAttribute('type', value);
		this.shadowRoot.querySelector('button')?.setAttribute('type', value);
	}

	get form() { return this.#internals.form; }
	get name() { return this.getAttribute('name'); }
	get validity() { return this.#internals.validity; }
	get validationMessage() { return this.#internals.validationMessage; }
	get willValidate() { return this.#internals.willValidate; }

	checkValidity() { return this.#internals.checkValidity(); }
	reportValidity() { return this.#internals.reportValidity(); }
	setCustomValidity(message: string) { this.#internals.setValidity({ customError: message !== '' }, message); }

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
