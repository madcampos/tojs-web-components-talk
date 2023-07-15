import cssLink from './style.css?url';

export class CustomSlider extends HTMLElement {
	static get observedAttributes() { return ['value', 'min', 'max', 'step', 'disabled', 'required', 'readonly']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="slider-container">
				<label for="slider">
					<slot></slot>
				</label>
				<input type="range" id="slider" name="slider" min="${this.min}" max="${this.max}" value="${this.value}" step="${this.step}" ${this.disabled ? 'disabled' : ''} ${this.required ? 'required' : ''} ${this.readonly ? 'readonly' : ''}>
			</div>
		`;
	}

	get value() {
		return this.getAttribute('value') ?? '50';
	}

	set value(value: string) {
		this.setAttribute('value', value);
		this.shadowRoot.querySelector('input')?.setAttribute('value', value);
	}

	get min() {
		return this.getAttribute('min') ?? '0';
	}

	set min(value: string) {
		this.setAttribute('min', value);
		this.shadowRoot.querySelector('input')?.setAttribute('min', value);
	}

	get max() {
		return this.getAttribute('max') ?? '100';
	}

	set max(value: string) {
		this.setAttribute('max', value);
		this.shadowRoot.querySelector('input')?.setAttribute('max', value);
	}

	get step() {
		return this.getAttribute('step') ?? '1';
	}

	set step(value: string) {
		this.setAttribute('step', value);
		this.shadowRoot.querySelector('input')?.setAttribute('step', value);
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('input')?.toggleAttribute('disabled', value);
	}

	get required() {
		return this.hasAttribute('required');
	}

	set required(value: boolean) {
		this.toggleAttribute('required', value);
		this.shadowRoot.querySelector('input')?.toggleAttribute('required', value);
	}

	get readonly() {
		return this.hasAttribute('readonly');
	}

	set readonly(value: boolean) {
		this.toggleAttribute('readonly', value);
		this.shadowRoot.querySelector('input')?.toggleAttribute('readonly', value);
	}

	get form() { return this.#internals.form; }
	get name() { return this.getAttribute('name'); }
	get validity() { return this.#internals.validity; }
	get validationMessage() { return this.#internals.validationMessage; }
	get willValidate() { return this.#internals.willValidate; }

	checkValidity() { return this.#internals.checkValidity(); }
	reportValidity() { return this.#internals.reportValidity(); }
	setCustomValidity(message: string) { this.#internals.setValidity({ customError: message !== '' }, message); }

	#validate() {
		let message = '';
		const valueMissing = this.required && this.value === '';
		const value = Number(this.value);

		const stepMismatch = this.step !== undefined && (value % Number.parseFloat(this.step) !== 0);
		const badInput = Number.isNaN(value);

		if (stepMismatch || badInput) {
			message = 'Invalid value';
		}

		if (valueMissing) {
			message = 'Required';
		}

		this.#internals.setValidity({
			typeMismatch: false,
			patternMismatch: false,
			tooLong: false,
			tooShort: false,
			rangeOverflow: false,
			rangeUnderflow: false,
			customError: false,
			valueMissing,
			stepMismatch,
			badInput
		}, message);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('input')?.addEventListener('input', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';

			this.#validate();

			this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, cancelable: true }));
		});

		this.shadowRoot.querySelector('input')?.addEventListener('change', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';

			this.#validate();

			this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, cancelable: true }));
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'value':
				this.value = newValue;
				break;
			case 'min':
				this.min = newValue;
				break;
			case 'max':
				this.max = newValue;
				break;
			case 'step':
				this.step = newValue;
				break;
			case 'disabled':
				this.disabled = newValue !== null;
				break;
			case 'required':
				this.required = newValue !== null;
				break;
			case 'readonly':
				this.readonly = newValue !== null;
				break;
			default:
		}
	}
}

if (!window.customElements.get('c-slider')) {
	window.customElements.define('c-slider', CustomSlider);
}
