import './components/avatar';
import './components/avatar-editable';
import './components/button';
import './components/card';
import './components/purchase-card';
import './components/select';
import './components/select-option';
import './components/status-changer';
import './components/switch';
import './components/tab';
import './components/tab-panel';
import './components/tabs';
import './components/text-input';
import './components/username';

// Functionality
import { initializeTranslation } from './translation';
import { initializeSettings } from './settings';
import { initializeUserForm } from './user-form';
import { initFriends } from './friends';

initializeUserForm();
initializeSettings();
initializeTranslation();
void initFriends();
