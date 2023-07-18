import cssLink from './style.css?url';

/**
 * A custom tab panel element, it is used in conjunction with the tab and the tabs container element.
 *
 * @slot - The content of the tab panel.
 *
 * @element c-tab-panel
 */
export class CustomTabPanel extends HTMLElement {
	static get observedAttributes() { return ['selected', 'tab']; }

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'tabpanel';
		this.tabIndex = -1;
		this.hidden = true;

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<article>
				<slot></slot>
			</article>
		`;
	}

	/**
	 * Whether or not the tab panel is selected.
	 *
	 * @type {boolean}
	 * @default false
	 * @attr selected
	 */
	get selected() {
		return this.#internals.ariaSelected === 'true';
	}

	set selected(value: boolean) {
		this.toggleAttribute('selected', value);
		this.#internals.ariaSelected = value ? 'true' : 'false';
		this.tabIndex = value ? 0 : -1;
		this.hidden = !value;
	}

	/**
	 * The id of the tab that controls this tab panel.
	 *
	 * @type {string}
	 * @default ''
	 * @attr tab
	 */
	get tab() {
		return this.getAttribute('tab') ?? '';
	}

	set tab(value: string) {
		this.setAttribute('tab', value);
		this.setAttribute('aria-labelledby', value);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'selected':
				this.selected = newValue !== null;
				break;
			case 'tab':
				this.tab = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('c-tab-panel')) {
	customElements.define('c-tab-panel', CustomTabPanel);
}
