export interface Organization {
  organizationId: number;
  organizationName: string;
}

export interface GetOrganizationsResponse {
  timestamp: string;
  organizations: Organization[];
}
