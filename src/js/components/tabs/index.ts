import cssLink from './style.css?url';

/**
 * A custom tabs container element, it is used in conjunction with the tab and the tab panel elements.
 * This element controls the navigation between the tabs and their panels.
 *
 * It will also crate and addign an id to the tabs and panels if they do not have one already.
 *
 * @slot tabs - The tabs to display.
 * @slot panels - The panels to display.
 *
 * @element c-tabs
 */
export class CustomTabs extends HTMLElement {
	static get observedAttributes() { return ['selected']; }

	declare shadowRoot: ShadowRoot;
	#internals: ElementInternals;

	/** The slot element containing the tabs */
	#tabsSlot: HTMLSlotElement;
	/** The slot element containing the panels */
	#panelsSlot: HTMLSlotElement;

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		this.#internals.role = 'tablist';
		this.#internals.ariaLabel = 'Tab Container';

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssLink}">
			<div id="tab-container">
				<div id="tabs-wrapper">
					<slot name="tabs"></slot>
				</div>
				<div id="panels-wrapper">
					<slot name="panels"></slot>
				</div>
			</div>
		`;

		this.#tabsSlot = this.shadowRoot.querySelector('slot[name="tabs"]') as HTMLSlotElement;
		this.#panelsSlot = this.shadowRoot.querySelector('slot[name="panels"]') as HTMLSlotElement;

		if (!this.id) {
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			this.id = `c-tabs-${Math.random().toString(36).substring(2, 12)}`;
		}
	}

	/**
	 * The id of the tab that is currently selected.
	 * Defaults to the first tab if no tab id is provided
	 *
	 * @type {string}
	 * @attr selected
	 */
	get selected() {
		return this.getAttribute('selected') ?? '';
	}

	set selected(value) {
		this.setAttribute('selected', value);

		const selectedTab = (this.#tabsSlot.assignedElements().find((tab) => tab.id === value) ?? this.#tabsSlot.assignedElements()[0]) as HTMLElement;

		this.#selectTab(selectedTab);
	}

	#associateTabs() {
		this.#tabsSlot.assignedElements().forEach((tabElement, index) => {
			const tabId = tabElement.getAttribute('id') ?? `${this.id}-tab-${index}`;

			const panel = this.#panelsSlot.assignedElements()[index] as HTMLElement;
			const panelId = panel.getAttribute('id') ?? tabElement.getAttribute('panel') ?? `${this.id}-panel-${index}`;

			tabElement.setAttribute('id', tabId);
			tabElement.setAttribute('panel', panelId);

			panel.setAttribute('id', panelId);
			panel.setAttribute('tab', tabId);
		});
	}

	#selectTab(tab: HTMLElement) {
		this.#tabsSlot.assignedElements().forEach((tabElement) => {
			tabElement.toggleAttribute('selected', tabElement.id === tab.id);
		});

		this.#panelsSlot.assignedElements().forEach((panel) => {
			panel.toggleAttribute('selected', panel.id === tab.getAttribute('panel'));
		});
	}

	connectedCallback() {
		this.#tabsSlot.addEventListener('slotchange', () => this.#associateTabs());

		this.#associateTabs();

		const selectedTab = (this.#tabsSlot.assignedElements().find((tab) => tab.id === this.selected || tab.hasAttribute('selected')) ?? this.#tabsSlot.assignedElements()[0]) as HTMLElement;

		this.#selectTab(selectedTab);

		this.addEventListener('focusin', (evt) => {
			const tab = (evt.target as HTMLElement).closest<HTMLElement>('c-tab');

			if (tab) {
				this.#selectTab(tab);
			}
		});

		this.addEventListener('keydown', (evt) => {
			const tab = (evt.target as HTMLElement).closest<HTMLElement>('c-tab');

			if (tab) {
				const tabs = this.#tabsSlot.assignedElements() as HTMLElement[];

				const index = tabs.indexOf(tab);

				switch (evt.key) {
					case 'ArrowLeft':
						tabs[(index - 1 + tabs.length) % tabs.length].focus();
					break;
					case 'ArrowRight':
						tabs[(index + 1) % tabs.length].focus();
					break;
					case 'Home':
						tabs[0].focus();
					break;
					case 'End':
						tabs[tabs.length - 1].focus();
					break;
					default:
				}
			}
		});
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
