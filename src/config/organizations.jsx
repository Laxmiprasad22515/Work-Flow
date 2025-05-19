
export const organizations = [
  { id: 'org_azure', name: 'Azure Tech' },
  { id: 'org_aws', name: 'AWS' },
  { id: 'org_accenture', name: 'Accenture' },
  { id: 'org_innovate', name: 'Innovate Solutions' },
  { id: 'org_techm', name: 'Tech Mahindra' },
];

export const adminUsers = [
  { username: 'azureadmin1', password: 'azurepass1', organizationId: 'org_azure', role: 'admin' },
  { username: 'azureadmin2', password: 'azurepass2', organizationId: 'org_azure', role: 'admin' },
  { username: 'awsadmin1', password: 'awspass1', organizationId: 'org_aws', role: 'admin' },
  { username: 'awsadmin2', password: 'awspass2', organizationId: 'org_aws', role: 'admin' },
  { username: 'accentureadmin1', password: 'accenturepass1', organizationId: 'org_accenture', role: 'admin' },
  { username: 'accentureadmin2', password: 'accenturepass2', organizationId: 'org_accenture', role: 'admin' },
  { username: 'innovateadmin1', password: 'innovatepass1', organizationId: 'org_innovate', role: 'admin' },
  { username: 'innovateadmin2', password: 'innovatepass2', organizationId: 'org_innovate', role: 'admin' },
  { username: 'techmadmin1', password: 'techmpass1', organizationId: 'org_techm', role: 'admin' },
  { username: 'techmadmin2', password: 'techmpass2', organizationId: 'org_techm', role: 'admin' },
  // Generic admin for fallback or if organization context is not strictly enforced at login
  { username: 'admin', password: 'admin', role: 'admin', organizationId: null } 
];

export const generateEmployeeId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
  