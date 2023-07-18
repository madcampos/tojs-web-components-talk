/**
 * Add missing types for existing/future features on the web.
 */

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
