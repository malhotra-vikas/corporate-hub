export interface Company {
    id: string;
    name: string;
    description: string;
    industry: string;
    foundedYear: number;
    website: string;
    logoUrl?: string;
    aboutCompany: string;
    cautionaryNote: string;
    companyDescriptor: string;
    ceoName: string;
    contactName: string;
    contactEmail: string;
    irContactName: string;
    irContactEmail: string;
    irContactPhone: string;
    irCompanyName: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'companyUser';
    active: boolean;
    company?: Company;
}
