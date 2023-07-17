interface ToggleEvent extends Event {
	newState: 'open' | 'closed',
	oldState: 'open' | 'closed'
}

interface ElementEventMap {
	'drop': DragEvent,
	'toggle': ToggleEvent
}

interface HTMLElement {
	hidePopover(): void,
	showPopover(): void,
	togglePopover(): void
}
