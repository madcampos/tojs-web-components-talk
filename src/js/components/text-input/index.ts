import cssLink from './style.css?url';

export class CustomTextInput extends HTMLElement {
	static get observedAttributes() { return ['value', 'placeholder', 'disabled', 'readonly', 'required', 'autocomplete', 'maxlength', 'minlength']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'textbox';
		this.#internals.ariaPlaceholder = this.placeholder;
		this.#internals.ariaRequired = this.required.toString();
		this.tabIndex = 0;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<label for="text-input" id="text-input-container">
				<h3>
					<slot></slot>
				</h3>

				<input type="text" id="text-input" name="text-input" value="${this.value}" placeholder="${this.placeholder}" ${this.disabled ? 'disabled' : ''} ${this.readonly ? 'readonly' : ''} ${this.required ? 'required' : ''} ${this.autocomplete ? 'autocomplete' : ''} ${this.maxLength ? 'maxlength' : ''} ${this.minLength ? 'minlength' : ''}>
			</label>
		`;
	}

	get value() {
		return this.getAttribute('value') ?? '';
	}

	set value(value: string) {
		this.setAttribute('value', value);
		this.shadowRoot.querySelector('input')?.setAttribute('value', value);
	}

	get placeholder() {
		return this.getAttribute('placeholder') ?? '';
	}

	set placeholder(value: string) {
		this.setAttribute('placeholder', value);
		this.shadowRoot.querySelector('input')?.setAttribute('placeholder', value);
		this.#internals.ariaPlaceholder = value;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('input')?.setAttribute('disabled', value.toString());
	}

	get readonly() {
		return this.hasAttribute('readonly');
	}

	set readonly(value: boolean) {
		this.toggleAttribute('readonly', value);
		this.shadowRoot.querySelector('input')?.setAttribute('readonly', value.toString());
	}

	get required() {
		return this.hasAttribute('required');
	}

	set required(value: boolean) {
		this.toggleAttribute('required', value);
		this.shadowRoot.querySelector('input')?.setAttribute('required', value.toString());
		this.#internals.ariaRequired = value.toString();
	}

	get autocomplete() {
		return this.hasAttribute('autocomplete');
	}

	set autocomplete(value: boolean) {
		this.toggleAttribute('autocomplete', value);
		this.shadowRoot.querySelector('input')?.setAttribute('autocomplete', value.toString());
	}

	get maxLength() {
		return this.getAttribute('maxlength') ?? '';
	}

	set maxLength(value: string) {
		this.setAttribute('maxlength', value);
		this.shadowRoot.querySelector('input')?.setAttribute('maxlength', value);
	}

	get minLength() {
		return this.getAttribute('minlength') ?? '';
	}

	set minLength(value: string) {
		this.setAttribute('minlength', value);
		this.shadowRoot.querySelector('input')?.setAttribute('minlength', value);
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
		const tooLong = this.maxLength !== undefined && this.value.length > Number.parseInt(this.maxLength);
		const tooShort = this.minLength !== undefined && this.value.length < Number.parseInt(this.minLength);

		if (tooLong || tooShort) {
			message = 'Invalid value';
		}

		if (valueMissing) {
			message = 'Required';
		}

		this.#internals.setValidity({
			typeMismatch: false,
			patternMismatch: false,
			stepMismatch: false,
			badInput: false,
			rangeOverflow: false,
			rangeUnderflow: false,
			customError: false,
			tooLong,
			tooShort,
			valueMissing
		}, message);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('slot:not([name])')?.addEventListener('slotchange', (evt) => {
			const target = evt.target as HTMLSlotElement;

			this.#internals.ariaLabel = (target.assignedNodes()[0]?.textContent ?? '').trim();
		});

		this.shadowRoot.querySelector('input')?.addEventListener('input', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';
			this.#internals.setFormValue(this.value);

			this.#validate();

			this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, cancelable: true }));
		});

		this.shadowRoot.querySelector('input')?.addEventListener('change', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';
			this.#internals.setFormValue(this.value);

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
			case 'placeholder':
				this.placeholder = newValue;
				break;
			case 'disabled':
				this.disabled = newValue !== null;
				break;
			case 'readonly':
				this.readonly = newValue !== null;
				break;
			case 'required':
				this.required = newValue !== null;
				break;
			case 'autocomplete':
				this.autocomplete = newValue !== null;
				break;
			case 'maxlength':
				this.maxLength = newValue;
				break;
			case 'minlength':
				this.minLength = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-text-input')) {
	customElements.define('c-text-input', CustomTextInput);
}
