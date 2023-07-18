import cssLink from './style.css?url';

/**
 * A custom slider element that allows the user to select a value from a range.
 *
 * @fires input - Fires when the user has changed the value.
 * @fires change - Fires when the user has finished changing the value.
 *
 * @slot - The slider's label.
 * @slot description - The slider's description.
 *
 * @element c-slider
 */
export class CustomSlider extends HTMLElement {
	static get observedAttributes() { return ['value', 'min', 'max', 'step', 'disabled', 'readonly']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'slider';
		this.#internals.ariaValueMin = this.min.toString();
		this.#internals.ariaValueMax = this.max.toString();
		this.#internals.ariaValueNow = this.value;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<label id="slider-container" for="slider">
				<section id="label">
					<h3>
						<slot></slot>
					</h3>
					<p>
						<slot name="description"></slot>
					</p>
				</section>
				<input type="range" id="slider" name="slider" min="${this.min}" max="${this.max}" value="${this.value}" step="${this.step}" ${this.disabled ? 'disabled' : ''} ${this.readonly ? 'readonly' : ''}>
			</label>
		`;
	}

	/**
	 * The value of the slider.
	 *
	 * @type {string}
	 * @attr value
	 */
	get value() {
		return this.getAttribute('value') ?? '50';
	}

	set value(value: string) {
		this.setAttribute('value', value);
		this.shadowRoot.querySelector('input')?.setAttribute('value', value);
		this.#internals.ariaValueNow = value;
	}

	/**
	 * The minimum value of the slider.
	 *
	 * @type {number}
	 * @default 0
	 * @attr min
	 */
	get min() {
		return Number.parseFloat(this.getAttribute('min') ?? '0');
	}

	set min(value: number) {
		const valueString = value.toString();

		this.setAttribute('min', valueString);
		this.shadowRoot.querySelector('input')?.setAttribute('min', valueString);
		this.#internals.ariaValueMin = valueString;
	}

	/**
	 * The maximum value of the slider.
	 *
	 * @type {number}
	 * @default 100
	 * @attr max
	 */
	get max() {
		return Number.parseFloat(this.getAttribute('max') ?? '100');
	}

	set max(value: number) {
		const valueString = value.toString();

		this.setAttribute('max', valueString);
		this.shadowRoot.querySelector('input')?.setAttribute('max', valueString);
		this.#internals.ariaValueMax = valueString;
	}

	/**
	 * The step value of the slider.
	 *
	 * @type {number}
	 * @default 1
	 * @attr step
	 */
	get step() {
		return Number.parseFloat(this.getAttribute('step') ?? '1');
	}

	set step(value: number) {
		const valueString = value.toString();

		this.setAttribute('step', valueString);
		this.shadowRoot.querySelector('input')?.setAttribute('step', valueString);
	}

	/**
	 * Whether the slider is disabled.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr disabled
	 */
	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('input')?.toggleAttribute('disabled', value);
	}

	/**
	 * Whether the slider is readonly.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr readonly
	 */
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
		const valueMissing = this.value === '';
		const value = Number(this.value);

		const stepMismatch = this.step !== undefined && (value % this.step !== 0);
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
		this.shadowRoot.querySelector('slot:not([name])')?.addEventListener('slotchange', (evt) => {
			const target = evt.target as HTMLSlotElement;

			this.#internals.ariaLabel = (target.assignedNodes()[0]?.textContent ?? '').trim();
		});

		this.shadowRoot.querySelector('input')?.addEventListener('input', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';
			this.#internals.setFormValue(this.value);

			this.#validate();

			this.dispatchEvent(new InputEvent('input', {
				bubbles: true,
				composed: true,
				cancelable: true,
				data: this.value,
				isComposing: false,
				inputType: 'insertText'
			}));
		});

		this.shadowRoot.querySelector('input')?.addEventListener('change', () => {
			this.value = this.shadowRoot.querySelector('input')?.value ?? '';
			this.#internals.setFormValue(this.value);

			this.#validate();

			this.dispatchEvent(new Event('change', {
				bubbles: true,
				composed: true,
				cancelable: true
			}));
		});
	}

	attributeChangedCallback(name: string, oldValue?: string, newValue?: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'value':
				this.value = newValue ?? '50';
				break;
			case 'min':
				this.min = Number.parseFloat(newValue ?? '0');
				break;
			case 'max':
				this.max = Number.parseFloat(newValue ?? '100');
				break;
			case 'step':
				this.step = Number.parseFloat(newValue ?? '1');
				break;
			case 'disabled':
				this.disabled = newValue !== null;
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
