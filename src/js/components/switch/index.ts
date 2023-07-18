import cssLink from './style.css?url';

/**
 * A custom on/off switch element.
 *
 * @fires input - Fires when the user has changed the value.
 * @fires change - Fires when the user has finished changing the value.
 *
 * @slot - The switch's label.
 * @slot description - The switch's description.
 *
 * @element c-switch
 */
export class CustomSwitch extends HTMLElement {
	static get observedAttributes() { return ['value', 'checked', 'required', 'disabled', 'readonly']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'switch';
		this.#internals.ariaChecked = this.checked ? 'true' : 'false';
		this.tabIndex = 0;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<label for="switch" id="switch-container">
				<section id="label">
					<h3>
						<slot></slot>
					</h3>
					<p>
						<slot name="description"></slot>
					</p>
				</section>

				<input type="checkbox" id="switch" name="switch" value="${this.value}" ${this.checked ? 'checked' : ''} ${this.required ? 'required' : ''} ${this.disabled ? 'disabled' : ''} ${this.readonly ? 'readonly' : ''}>

				<div id="switch-track">
					<div id="switch-thumb"></div>
				</div>

				<div id="state-indicators">
					<span class="on" aria-hidden="true">On</span>
					<span class="off" aria-hidden="true">Off</span>
				</div>
			</label>
		`;
	}

	/**
	 * The value of the switch.
	 *
	 * @type {string}
	 * @attr value
	 */
	get value() {
		return this.getAttribute('value') ?? 'on';
	}

	set value(value: string) {
		this.setAttribute('value', value);
		this.shadowRoot.querySelector('input')?.setAttribute('value', value);
	}

	/**
	 * Whether the switch is checked or not.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr checked
	 */
	get checked() {
		return this.hasAttribute('checked');
	}

	set checked(value: boolean) {
		this.toggleAttribute('checked', value);
		this.#internals.ariaChecked = value ? 'true' : 'false';
		this.shadowRoot.querySelector('input')?.toggleAttribute('checked', value);
	}

	/**
	 * Whether the switch is required or not.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr required
	 */
	get required() {
		return this.hasAttribute('required');
	}

	set required(value: boolean) {
		this.toggleAttribute('required', value);
		this.#internals.ariaRequired = value ? 'true' : 'false';
		this.shadowRoot.querySelector('input')?.toggleAttribute('required', value);
	}

	/**
	 * Whether the switch is disabled or not.
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
		this.#internals.ariaDisabled = value ? 'true' : 'false';
		this.shadowRoot.querySelector('input')?.toggleAttribute('disabled', value);
	}

	/**
	 * Whether the switch is readonly or not.
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
		const valueMissing = this.required && !this.checked;

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
			stepMismatch: false,
			badInput: false,
			valueMissing
		}, message);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('slot:not([name])')?.addEventListener('slotchange', (evt) => {
			const target = evt.target as HTMLSlotElement;

			this.#internals.ariaLabel = (target.assignedNodes()[0]?.textContent ?? '').trim();
		});

		this.shadowRoot.querySelector('input')?.addEventListener('input', () => {
			this.checked = this.shadowRoot.querySelector('input')?.checked ?? false;
			this.#internals.setFormValue(this.value, this.checked ? 'checked' : undefined);

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
			this.checked = this.shadowRoot.querySelector('input')?.checked ?? false;
			this.#internals.setFormValue(this.value, this.checked ? 'checked' : undefined);

			this.#validate();

			this.dispatchEvent(new Event('change', {
				bubbles: true,
				composed: true,
				cancelable: true
			}));
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
			case 'checked':
				this.checked = newValue !== null;
				break;
			case 'required':
				this.required = newValue !== null;
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

if (!customElements.get('c-switch')) {
	customElements.define('c-switch', CustomSwitch);
}
