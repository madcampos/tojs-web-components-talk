import cssLink from './style.css?url';

export class CustomTab extends HTMLElement {
	static get observedAttributes() { return ['selected', 'panel']; }

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'tab';
		this.#internals.ariaSelected = 'false';
		this.tabIndex = -1;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<button>
				<slot></slot>
			</button>
		`;
	}

	get selected() {
		return this.#internals.ariaSelected === 'true';
	}

	set selected(value: boolean) {
		this.toggleAttribute('selected', value);
		this.#internals.ariaSelected = value ? 'true' : 'false';
		this.tabIndex = value ? 0 : -1;
	}

	get panel() {
		return this.getAttribute('panel') ?? '';
	}

	set panel(value: string) {
		this.setAttribute('panel', value);
		this.setAttribute('aria-controls', value);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'selected':
				this.selected = newValue !== null;
				break;
			case 'panel':
				this.panel = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-tab')) {
	customElements.define('c-tab', CustomTab);
}
