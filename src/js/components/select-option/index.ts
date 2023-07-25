import cssLink from './style.css?url';

/**
 * The options custom element to accompany the custom select element.
 *
 * @fires selected - The option was selected.
 *
 * @slot - The option's content.
 *
 * @element c-select-option
 */
export class CustomSelectOption extends HTMLElement {
	static get observedAttributes() { return ['value', 'disabled']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'option';
		this.#internals.ariaSelected = 'false';

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<button tabindex="-1">
				<slot></slot>
			</button>
		`;
	}

	/**
	 * The value of the option.
	 *
	 * @type {string}
	 * @attr value
	 */
	get value() {
		return this.getAttribute('value') ?? this.innerText.trim();
	}

	set value(value: string) {
		this.setAttribute('value', value);
	}

	/**
	 * Whether the option is disabled.
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
	}

	/**
	 * Whether the option is selected.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr selected
	 */
	get selected() {
		return this.#internals.ariaSelected === 'true';
	}

	set selected(value: boolean) {
		this.#internals.ariaSelected = value ? 'true' : 'false';
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'value':
				this.value = newValue;
				break;
			case 'disabled':
				this.disabled = newValue !== null;
				break;
			default:
		}
	}

	connectedCallback() {
		this.shadowRoot.querySelector('button')?.addEventListener('click', () => {
			this.#internals.ariaSelected = 'true';

			this.dispatchEvent(new CustomEvent('selected', {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: {
					value: this.value
				}
			}));
		});
	}
}

if (!customElements.get('c-select-option')) {
	customElements.define('c-select-option', CustomSelectOption);
}
