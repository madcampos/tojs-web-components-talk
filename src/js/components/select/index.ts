import type { CustomSelectOption } from '../select-option';

import cssLink from './style.css?url';

export class CustomSelect extends HTMLElement {
	static get observedAttributes() { return ['value', 'disabled', 'required']; }
	static formAssociated = true;

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	#isPopoverVisible = false;
	#placeholderText = 'Select an option...';
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	#PAGE_SIZE = 10;

	#searchString = '';
	#searchTimeout: number | null = null;
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	#DEFAULT_SEARCH_TIMEOUT = 500;

	#optionsSlot: HTMLSlotElement;
	#selectedOption: HTMLLabelElement;
	#optionsList: HTMLElement;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.#internals = this.attachInternals();

		this.#internals.role = 'combobox';
		this.#internals.ariaHasPopup = 'listbox';
		this.#internals.ariaExpanded = 'false';
		this.tabIndex = 0;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="container">
				<div id="label">
					<slot name="label"></slot>
				</div>

				<div id="combobox-container">
					<label for="trigger-button">
						${this.value ? this.value : this.#placeholderText}
					</label>
					<button id="trigger-button" popovertarget="options-container" ${this.disabled ? 'disabled' : ''}>
						<slot name="trigger-text">▽</slot>
					</button>

					<div popover id="options-container" role="listbox" aria-labeledby="label" tabindex="-1">
						<slot></slot>
					</div>
				</div>
			</div>
		`;

		this.#optionsSlot = this.shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])') as HTMLSlotElement;
		this.#selectedOption = this.shadowRoot.querySelector<HTMLLabelElement>('label') as HTMLLabelElement;
		this.#optionsList = this.shadowRoot.querySelector<HTMLElement>('[popover]') as HTMLElement;
	}

	get value() {
		return this.getAttribute('value') ?? '';
	}

	set value(value: string) {
		this.setAttribute('value', value);

		const options = this.#optionsSlot.assignedElements() as CustomSelectOption[];
		const selectedOption = options.find((option) => option.value === this.value);

		this.#selectedOption.textContent = selectedOption?.textContent ?? this.#placeholderText;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
		this.shadowRoot.querySelector('button')?.toggleAttribute('disabled', value);
	}

	get required() {
		return this.hasAttribute('required');
	}

	set required(value: boolean) {
		this.toggleAttribute('required', value);
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
		const valueMissing = this.required && !this.value;

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

	#handlePopoverActionKeys(evt: KeyboardEvent) {
		const { key, altKey, ctrlKey, metaKey } = evt;
		let isPopoverActionKey = false;

		if (!altKey && !ctrlKey && !metaKey) {
			switch (key) {
				case 'Enter':
				case 'Space':
					this.#optionsList.togglePopover();
					isPopoverActionKey = true;
				break;
				case 'Escape':
					this.#optionsList.hidePopover();
					isPopoverActionKey = true;
				break;
				case 'Tab':
					this.#optionsList.hidePopover();
					isPopoverActionKey = false;
				break;
				default:
			}
		}

		if (!this.#isPopoverVisible && altKey && key === 'ArrowDown') {
			this.#optionsList.showPopover();
			isPopoverActionKey = false;
		}

		if (this.#isPopoverVisible && altKey && key === 'ArrowUp') {
			this.#optionsList.hidePopover();
			isPopoverActionKey = false;
		}

		return isPopoverActionKey;
	}

	#handleCurrentIndex(items: CustomSelectOption[]) {
		let index = items.findIndex((item) => item.value === this.value);

		if (items.includes(document.activeElement as CustomSelectOption)) {
			index = items.indexOf(document.activeElement as CustomSelectOption);
		}

		return index;
	}

	#handlePopoverNavigationKeys(evt: KeyboardEvent, selectedIndex: number, totalItems: number) {
		const { key, altKey, ctrlKey, metaKey } = evt;
		let index = selectedIndex;

		if (!altKey && !ctrlKey && !metaKey) {
			switch (key) {
				case 'ArrowLeft':
				case 'ArrowUp':
					index = Math.max(0, index - 1);
				break;
				case 'ArrowRight':
				case 'ArrowDown':
					index = Math.min(totalItems - 1, index + 1);
				break;
				case 'Home':
					index = 0;
				break;
				case 'End':
					index = totalItems - 1;
				break;
				case 'PageUp':
					index = Math.max(0, index - this.#PAGE_SIZE);
				break;
				case 'PageDown':
					index = Math.min(totalItems - 1, index + this.#PAGE_SIZE);
				break;
				default:
			}
		}

		return index;
	}

	#handleTypingKeys(evt: KeyboardEvent, selectedIndex: number, items: CustomSelectOption[]) {
		const { key, altKey, ctrlKey, metaKey } = evt;
		let index = selectedIndex;

		if (key === 'Backspace' || key === 'Clear' || (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)) {
			if (typeof this.#searchTimeout === 'number') {
				window.clearTimeout(this.#searchTimeout);
			}

			this.#searchTimeout = window.setTimeout(() => {
				this.#searchString = '';
			}, this.#DEFAULT_SEARCH_TIMEOUT);

			this.#searchString += key.toLowerCase();

			index = items.slice(index).findIndex((item) => item.textContent?.toLowerCase().startsWith(this.#searchString));

			if (index === -1) {
				index = selectedIndex;
			}
		}

		return index;
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
			case 'required':
				this.required = newValue !== null;
				break;
			default:
		}
	}

	connectedCallback() {
		this.shadowRoot.querySelector('slot[name="label"]')?.addEventListener('slotchange', (evt) => {
			const target = evt.target as HTMLSlotElement;

			this.#internals.ariaLabel = (target.assignedNodes()[0]?.textContent ?? '').trim();
		});

		this.#optionsList.addEventListener('toggle', (evt) => {
			this.#isPopoverVisible = evt.newState === 'open';
			this.#internals.ariaExpanded = this.#isPopoverVisible ? 'true' : 'false';

			if (this.#isPopoverVisible) {
				const selectedOption = (this.#optionsSlot.assignedElements() as CustomSelectOption[]).find((item) => item.value === this.value);

				if (selectedOption) {
					selectedOption.focus();
					this.setAttribute('aria-activedescendant', selectedOption.id);
				}
			} else {
				this.shadowRoot.querySelector<HTMLButtonElement>('#trigger-button')?.focus();
			}
		});

		this.addEventListener('selected', (evt) => {
			const target = evt.target as CustomSelectOption;

			(this.#optionsSlot.assignedElements() as CustomSelectOption[]).forEach((item) => {
				item.selected = item === target;
			});

			this.value = target.value;
			this.#internals.setFormValue(target.value);

			this.#validate();

			this.#optionsList.hidePopover();

			this.dispatchEvent(new Event('change', { bubbles: true, composed: true, cancelable: true }));
		});

		this.addEventListener('keydown', (evt) => {
			const SPECIAL_KEYS = ['Escape', 'Enter', 'Space', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];

			if (SPECIAL_KEYS.includes(evt.key)) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			const isPopoverActionKey = this.#handlePopoverActionKeys(evt);

			if (isPopoverActionKey) {
				return;
			}

			const options = this.#optionsSlot.assignedElements() as CustomSelectOption[];
			let index = this.#handleCurrentIndex(options);

			index = this.#handleTypingKeys(evt, index, options);
			index = this.#handlePopoverNavigationKeys(evt, index, options.length);

			const selectedOption = options[index];

			if (selectedOption) {
				if (this.#isPopoverVisible) {
					selectedOption.focus();
					this.setAttribute('aria-activedescendant', selectedOption.id);
				} else {
					this.value = selectedOption.value;
				}
			}
		});
	}
}

if (!customElements.get('c-select')) {
	customElements.define('c-select', CustomSelect);
}
