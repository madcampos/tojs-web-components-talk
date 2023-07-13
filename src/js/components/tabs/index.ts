import cssLink from './style.css?url';

export class CustomTabs extends HTMLElement {
	static get observedAttributes() { return ['selected']; }

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'tablist';
		this.#internals.ariaLabel = 'Tab Container';

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div class="tab-container">
				<div class="tabs">
					<slot name="tab"></slot>
				</div>
				<div class="tab-content">
					<slot name="content"></slot>
				</div>
			</div>
		`;
	}

	get selected() {
		return this.getAttribute('selected') ?? '';
	}

	set selected(value) {
		this.setAttribute('selected', value);

		// TODO: mark all tabs as selected, select the one with the id, hide pannels
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'selected':
				this.selected = newValue;
			break;
			default:
		}
	}
}

if (!customElements.get('c-tabs')) {
	customElements.define('c-tabs', CustomTabs);
}
