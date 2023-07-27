import { CustomAvatar } from '../avatar';

import cssLink from './style.css?url';

/**
 * The editable version of the avatar component, adds the ability to change the avatar image.
 *
 * @element c-avatar-editable
 */
export class CustomAvatarEditable extends CustomAvatar {
	static get observedAttributes() { return [...super.observedAttributes, 'disabled']; }

	/** The edit overlay element. */
	#editOverlay: HTMLDivElement;

	constructor() {
		super();

		this.shadowRoot.querySelector('link')?.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="${cssLink}">`);

		this.shadowRoot.querySelector('#container')?.insertAdjacentHTML('beforeend', `
			<div id="edit-overlay">
				<label for="avatar-input">📷</label>
				<input type="file" id="avatar-input" accept="image/*" />
			</div>
		`);

		this.shadowRoot.querySelector('c-status-changer')?.removeAttribute('disabled');

		this.#editOverlay = this.shadowRoot.querySelector('#edit-overlay') as HTMLDivElement;

		if (!this.hasAttribute('disabled')) {
			this.disabled = false;
		}
	}

	/**
	 * Whether the avatar is disabled or not.
	 *
	 * @type {boolean}
	 * @attr disabled
	 */
	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		this.toggleAttribute('disabled', value);
	}

	#updateImage(file: File) {
		const img = this.shadowRoot.querySelector('img') as HTMLImageElement;

		const reader = new FileReader();

		reader.onloadend = () => {
			img.src = reader.result as string;
			this.image = img.src;
		};

		reader.readAsDataURL(file);
	}

	connectedCallback() {
		this.addEventListener('dragover', (evt) => {
			evt.preventDefault();
			this.#editOverlay.classList.add('drop');
		});

		this.addEventListener('dragleave', () => {
			this.#editOverlay.classList.remove('drop');
		});

		this.shadowRoot.querySelector('#edit-overlay')?.addEventListener('drop', (evt) => {
			evt.preventDefault();
			evt.stopPropagation();

			this.#editOverlay.classList.remove('drop');

			if (!this.disabled) {
				return;
			}

			const [file] = Array.from(evt.dataTransfer?.files ?? []);
			const fileType = file.type;

			if (fileType.startsWith('image/')) {
				this.#updateImage(file);
			}
		});

		this.shadowRoot.querySelector('#avatar-input')?.addEventListener('change', (evt) => {
			const target = evt.target as HTMLInputElement;
			const [file] = Array.from(target.files ?? []);
			const fileType = file.type;

			if (fileType.startsWith('image/')) {
				this.#updateImage(file);
			}
		});

		document.addEventListener('paste', (evt) => {
			if (this.disabled) {
				return;
			}

			const clipboardData = evt.clipboardData as DataTransfer;
			const { files } = clipboardData;
			const file = [...files].find((potentialFile) => potentialFile.type.startsWith('image/'));

			if (file) {
				this.#updateImage(file);
			}
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		super.attributeChangedCallback(name, oldValue, newValue);

		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'disabled':
				this.disabled = newValue !== null;
				break;
			default:
		}
	}
}

if (!customElements.get('c-avatar-editable')) {
	customElements.define('c-avatar-editable', CustomAvatarEditable);
}
