/**
 * Adds custom elements to the global HTMLElementTagNameMap.
 * This makes them show up correctly on querySelector calls.
 */

// This library is a helper to improve the type safety of querySelector calls.
import type {} from 'typed-query-selector/strict';

import type { CustomAvatar } from '../js/components/avatar';
import type { CustomAvatarEditable } from '../js/components/avatar-editable';
import type { CustomButton } from '../js/components/button';
import type { CustomCard } from '../js/components/card';
import type { CustomPurchaseCard } from '../js/components/purchase-card';
import type { CustomSelect } from '../js/components/select';
import type { CustomSelectOption } from '../js/components/select-option';
import type { CustomSlider } from '../js/components/slider';
import type { CustomStatusChanger } from '../js/components/status-changer';
import type { CustomSwitch } from '../js/components/switch';
import type { CustomTab } from '../js/components/tab';
import type { CustomTabs } from '../js/components/tabs';
import type { CustomTabPanel } from '../js/components/tab-panel';
import type { CustomTextInput } from '../js/components/text-input';
import type { CustomUsernameInput } from '../js/components/username';

declare global {
	interface HTMLElementTagNameMap {
		'c-avatar': CustomAvatar,
		'c-avatar-editable': CustomAvatarEditable,
		'c-button': CustomButton,
		'c-card': CustomCard,
		'c-purchace-card': CustomPurchaseCard,
		'c-select': CustomSelect,
		'c-select-option': CustomSelectOption,
		'c-slider': CustomSlider,
		'c-status-changer': CustomStatusChanger,
		'c-switch': CustomSwitch,
		'c-tab': CustomTab,
		'c-tabs': CustomTabs,
		'c-tab-panel': CustomTabPanel,
		'c-text-input': CustomTextInput,
		'c-username-input': CustomUsernameInput
	}
}
