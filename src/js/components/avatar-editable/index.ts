import { CustomAvatar } from '../avatar';

import cssLink from './style.css?url';

export class CustomAvatarEditable extends CustomAvatar {
	static get observedAttributes() { return [...super.observedAttributes, 'editable']; }

	#editOverlay: HTMLDivElement;

	constructor() {
		super();

		this.shadowRoot.querySelector('style')?.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="${cssLink}">`);

		this.shadowRoot.querySelector('#container')?.insertAdjacentHTML('beforeend', `
			<div id="edit-overlay">
				<label for="avatar-input">📷</label>
				<input type="file" hidden id="avatar-input" accept="image/*" />
			</div>
		`);

		this.#editOverlay = this.shadowRoot.querySelector('#edit-overlay') as HTMLDivElement;

		if (!this.hasAttribute('editable')) {
			this.editable = false;
		}
	}

	get editable() {
		return this.hasAttribute('editable');
	}

	set editable(value) {
		this.toggleAttribute('editable', value);
	}

	#updateImage(file: File) {
		const img = this.shadowRoot.querySelector('img') as HTMLImageElement;

		img.src = URL.createObjectURL(file);
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

			if (!this.editable) {
				return;
			}

			const [file] = Array.from(evt.dataTransfer?.files ?? []);
			const fileType = file.type;

			if (fileType.startsWith('image/')) {
				this.#updateImage(file);
			}

			this.#editOverlay.classList.remove('drop');
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
			if (this.editable) {
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
}

if (!customElements.get('c-avatar-editable')) {
	customElements.define('c-avatar-editable', CustomAvatarEditable);
}
