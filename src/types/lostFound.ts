export interface PetReport {
  id: string;
  user_id: string;
  type: 'lost' | 'found';
  pet_name?: string;
  description: string;
  photo_url: string;
  location: string;
  contact_info: string;
  date_reported: string;
  status: 'active' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface PetReportData {
  type: 'lost' | 'found';
  pet_name?: string;
  description: string;
  photo_url: string;
  location: string;
  contact_info: string;
}

export interface ReportFilters {
  type?: 'all' | 'lost' | 'found';
  status?: 'all' | 'active' | 'resolved';
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface ImageUploadResult {
  url: string;
  error?: string;
}