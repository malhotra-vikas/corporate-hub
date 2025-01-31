export interface Company {
  id: string
  name: string
  description: string
  industry: string
  foundedYear: number
  website: string
  logoUrl?: string
  aboutCompany: string
  cautionaryNote: string
  companyDescriptor: string
  ceoName: string
  contactName: string
  contactEmail: string
  irContactName: string
  irContactEmail: string
  irContactPhone: string
  irCompanyName: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "companyUser"
  active: boolean
  company?: Company
}

export interface File {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: string
}

export interface PriceMovement {
    percentage: number;
    movement: "Up" | "Down";
}

export interface Competitor {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    link: string;
}

export interface EarningsEvent {
  date: string
  company: string
  time: string
}

export interface NewsItem {
  link: string | undefined
  source: string
  time: string
  title: string
  image: string
}

export interface HubData {
  competitors: Competitor[]
  earningsCalendar: EarningsEvent[]
  news: NewsItem[]
}
