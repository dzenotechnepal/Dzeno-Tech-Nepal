import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => (
  <div>
    <div className="page-heading">
      <div>
        <h1>Settings</h1>
        <p className="text-secondary">Configure company and admin preferences.</p>
      </div>
    </div>
    <div className="card empty-state">
      <SettingsIcon size={36} className="text-secondary" />
      <h3>Settings are not configured</h3>
      <p className="text-secondary">Company settings will be available when the settings service is connected.</p>
    </div>
  </div>
);

export default Settings;
