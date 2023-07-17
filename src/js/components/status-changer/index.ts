import cssLink from './style.css?url';
import { CustomSelect } from '../select';

export class CustomStatusChanger extends CustomSelect {
	constructor() {
		super();

		this.shadowRoot.querySelector('link')?.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="${cssLink}">`);
	}
}

if (!customElements.get('c-status-changer')) {
	customElements.define('c-status-changer', CustomStatusChanger);
}
