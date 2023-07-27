/* eslint-disable array-bracket-newline */

const translations = new Map([
	['en-US', new Map([
		['profile-tab', '🤖 Profile'],
		['status-online', 'Online'],
		['status-busy', 'Busy'],
		['status-away', 'Away'],
		['status-offline', 'Offline'],
		['username-label', 'Username'],
		['username-placeholder', 'Add your username here...'],
		['pronoums-label', 'Pronoums'],
		['pronoums-placeholder', 'E.g.: They/them, She/Her, He/His'],
		['edit-button', '✏️ Edit'],
		['save-button', '💾 Save'],
		['cancel-button', '❌ Cancel'],

		['settings-tab', '🛠️ Settings'],
		['light-mode-label', 'Light Mode'],
		['light-mode-description', 'Enable <em>light</em> mode.'],
		['language-label', 'Language'],
		['language-value-english', 'English'],
		['language-value-french', 'French'],
		['language-value-portuguese', 'Brazilian Portuguese'],
		['ad-tracking-label', 'Ad Tracking'],
		['ad-tracking-description', 'Enable <em>ad tracking</em>. Privacy is the default.'],
		['notifications-label', 'Notifications'],
		['notifications-description', 'Enable <em>notifications</em> for new messages.'],

		['friends-tab', '⭐ Friends'],

		['store-tab', '🪙 Store'],
		['store-description', 'Buy credits to unlock new features!'],
		['store-button', '🪙 Buy'],
		['store-credits-label', 'Credits'],
		['5-credits-label', '5 Credits'],
		['10-credits-label', '10 Credits'],
		['20-credits-label', '20 Credits'],
		['50-credits-label', '50 Credits'],
		['100-credits-label', '100 Credits'],
		['1000-credits-label', '1000 Credits'],
		['store-premium-label', 'Premium'],
		['1-premium-label', '1 Month'],
		['3-premium-label', '3 Months'],
		['6-premium-label', '6 Months'],
		['12-premium-label', '1 Year']
	])],
	['fr-FR', new Map([
		['profile-tab', '🤖 Profil'],
		['status-online', 'Connecté'],
		['status-busy', 'Occupé'],
		['status-away', 'Absent'],
		['status-offline', 'Déconnecté'],
		['username-label', 'Nom d\'utilisateur'],
		['username-placeholder', 'Add your username here...'],
		['pronoums-label', 'Pronoms'],
		['pronoums-placeholder', 'E.g.: They/them, She/Her, He/His'],
		['edit-button', '✏️ Éditer'],
		['save-button', '💾 Sauver'],
		['cancel-button', '❌ Annuler'],

		['settings-tab', '🛠️ Paramètres'],
		['light-mode-label', 'Mode Lumière'],
		['light-mode-description', 'Activer le mode <em>lumière</em>.'],
		['language-label', 'Langue'],
		['language-value-english', 'Anglais'],
		['language-value-french', 'Français'],
		['language-value-portuguese', 'Portugais brésilien'],
		['ad-tracking-label', 'Publicité'],
		['ad-tracking-description', 'Activer la <em>suivi publicitaire</em>. La confidentialité est la valeur par défaut.'],
		['notifications-label', 'Notifications'],
		['notifications-description', 'Activer les <em>notifications</em> par noveaux messages.'],

		['friends-tab', '⭐ Amis'],

		['store-tab', '🪙 Magasin'],
		['store-description', 'Acheter des crédits pour débloquer des nouvelles fonctionnalités!'],
		['store-button', '🪙 Achater'],
		['store-credits-label', 'Crédits'],
		['5-credits-label', '5 Crédits'],
		['10-credits-label', '10 Crédits'],
		['20-credits-label', '20 Crédits'],
		['50-credits-label', '50 Crédits'],
		['100-credits-label', '100 Crédits'],
		['1000-credits-label', '1000 Crédits'],
		['store-premium-label', 'Premium'],
		['1-premium-label', '1 Mois'],
		['3-premium-label', '3 Mois'],
		['6-premium-label', '6 Mois'],
		['12-premium-label', '1 An']
	])],
	['pt-BR', new Map([
		['profile-tab', '🤖 Perfil'],
		['status-online', 'Online'],
		['status-busy', 'Ocupado'],
		['status-away', 'Ausente'],
		['status-offline', 'Offline'],
		['username-label', 'Nome de usuário'],
		['username-placeholder', 'Adicione seu nome de usuário aqui...'],
		['pronoums-label', 'Pronomes'],
		['pronoums-placeholder', 'Ex.: Elu/Delu, Ela/dela, Ele/dele'],
		['edit-button', '✏️ Editar'],
		['save-button', '💾 Salvar'],
		['cancel-button', '❌ Cancelar'],

		['settings-tab', '🛠️ Configurações'],
		['light-mode-label', 'Modo claro'],
		['light-mode-description', 'Ativa o modo <em>claro</em>.'],
		['language-label', 'Idioma'],
		['language-value-english', 'Inglês'],
		['language-value-french', 'Francês'],
		['language-value-portuguese', 'Portugues do Brasil'],
		['ad-tracking-label', 'Anúncios'],
		['ad-tracking-description', 'Ativa o <em>rastreamento de anúncios</em>. Privacidade é a configuração padrão.'],
		['notifications-label', 'Notificações'],
		['notifications-description', 'Ativa <em>notificaçoes</em> para novas mensagens.'],

		['friends-tab', '⭐ Amigos'],

		['store-tab', '🪙 Loja'],
		['store-description', 'Compre créditos para desbloquear novas funcionalidades!'],
		['store-button', '🪙 Comprar'],
		['store-credits-label', 'Créditos'],
		['5-credits-label', '5 Créditos'],
		['10-credits-label', '10 Créditos'],
		['20-credits-label', '20 Créditos'],
		['50-credits-label', '50 Créditos'],
		['100-credits-label', '100 Créditos'],
		['1000-credits-label', '1000 Créditos'],
		['store-premium-label', 'Premium'],
		['1-premium-label', '1 Mês'],
		['3-premium-label', '3 Meses'],
		['6-premium-label', '6 Meses'],
		['12-premium-label', '1 Ano']
	])]
]);

function setDefaultValues() {
	const language = localStorage.getItem('language') ?? 'en-US';

	document.querySelector('c-select#language-select')?.setAttribute('value', language);
	localStorage.setItem('language', language);
}

export function translate(key: string | null | undefined) {
	const savedLanguage = localStorage.getItem('language') as string;
	const translation = translations.get(savedLanguage)?.get(key ?? '');

	if (!key) {
		console.warn('Missing key for translation');
	}

	if (!translation) {
		console.warn(`Missing translation for key "${key}" in language "${savedLanguage}"`);
	}

	return translation ?? '';
}

export function translateContent() {
	document.querySelectorAll('[data-translate-content]').forEach((element) => {
		element.innerHTML = translate(element.getAttribute('data-translate-content'));
	});

	document.querySelectorAll('[data-translate-attribute]').forEach((element) => {
		const [attribute, key] = (element.getAttribute('data-translate-attribute') ?? '').split(':');

		element.setAttribute(attribute, translate(key));
	});

	// Small hack to update select value.
	document.querySelectorAll('c-select').forEach((element) => {
		// eslint-disable-next-line no-self-assign
		element.value = element.value;
	});
}

export function initializeTranslation() {
	setDefaultValues();
	translateContent();
}
