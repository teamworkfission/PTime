import { supabase } from '../lib/supabase';
import { CreateBusinessDto, Business } from '../types/business';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export class BusinessService {
  
  private async getAuthHeaders(): Promise<{ Authorization: string } | {}> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
      };
    }
    
    return {};
  }

  async fetchBusinesses(): Promise<Business[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const businesses = await response.json();
      return businesses;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error(`Failed to fetch businesses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createBusiness(businessData: CreateBusinessDto): Promise<Business> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const business = await response.json();
      return business;
    } catch (error) {
      console.error('Error creating business:', error);
      throw new Error(`Failed to create business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateBusiness(businessId: string, businessData: Partial<CreateBusinessDto>): Promise<Business> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const business = await response.json();
      return business;
    } catch (error) {
      console.error('Error updating business:', error);
      throw new Error(`Failed to update business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteBusiness(businessId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      throw new Error(`Failed to delete business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBusinessById(businessId: string): Promise<Business> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const business = await response.json();
      return business;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw new Error(`Failed to fetch business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const businessService = new BusinessService();
