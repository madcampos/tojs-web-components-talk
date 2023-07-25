import type { CustomButton } from './components/button';

document.querySelector('#edit-button')?.addEventListener('click', (evt: Event) => {
	const target = evt.target as CustomButton;

	target.closest('form')?.removeAttribute('disabled');

	document.querySelector('c-avatar-editable')?.removeAttribute('disabled');
	document.querySelector('c-username-input')?.removeAttribute('disabled');
	document.querySelector('c-text-input')?.removeAttribute('disabled');
});

document.querySelector('form')?.addEventListener('submit', (evt: Event) => {
	evt.preventDefault();

	// TODO: implement saving/alert
});

// TODO: implement username generation
