import { useEffect, useState } from 'react';
import { Download, Search, Filter, Users, Calendar, FileText, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getRegistrations } from '../../lib/registrationService';

interface Registration {
  id: string;
  relationship_with_credentia: string;
  organization_name: string;
  website: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: {
    area: string;
    number: string;
  };
  alternate_phone?: {
    area: string;
    number: string;
  };
  dietary_restrictions: string[];
  ada_requirements: string[];
  travel_sponsorship: string[];
  preferred_airport?: string;
  consents_accepted: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'organization' | 'relationship'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    filterAndSortRegistrations();
  }, [registrations, searchTerm, filterBy, sortBy, sortOrder]);

  const loadRegistrations = async (clearRateLimit = false) => {
    try {
      setLoading(true);
      setError(null);

      // Clear rate limiting if requested
      if (clearRateLimit) {
        localStorage.removeItem('lastAdminFetch');
      }

      const result = await getRegistrations();
      if (result.success) {
        setRegistrations(result.data || []);
      } else {
        setError(result.error || 'Failed to load registrations');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRegistrations = () => {
    let filtered = [...registrations];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reg =>
        reg.organization_name.toLowerCase().includes(term) ||
        reg.website.toLowerCase().includes(term) ||
        reg.address.city.toLowerCase().includes(term) ||
        reg.address.state.toLowerCase().includes(term) ||
        reg.relationship_with_credentia.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(reg =>
        reg.relationship_with_credentia === filterBy
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'organization':
          aValue = a.organization_name.toLowerCase();
          bValue = b.organization_name.toLowerCase();
          break;
        case 'relationship':
          aValue = a.relationship_with_credentia.toLowerCase();
          bValue = b.relationship_with_credentia.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredRegistrations(filtered);
  };

  const exportToExcel = () => {
    if (filteredRegistrations.length === 0) {
      alert('No data to export');
      return;
    }

    // Transform data for Excel export
    const excelData = filteredRegistrations.map(reg => ({
      'Registration Date': new Date(reg.created_at).toLocaleDateString(),
      'Relationship with Credentia': reg.relationship_with_credentia,
      'Organization Name': reg.organization_name,
      'Website': reg.website,
      'Street Address': reg.address.street,
      'Street Address 2': reg.address.street2 || '',
      'City': reg.address.city,
      'State': reg.address.state,
      'Zip Code': reg.address.zip,
      'Country': reg.address.country,
      'Phone': `${reg.phone.area}-${reg.phone.number}`,
      'Alternate Phone': reg.alternate_phone ? `${reg.alternate_phone.area}-${reg.alternate_phone.number}` : '',
      'Dietary Restrictions': reg.dietary_restrictions.join(', '),
      'ADA Requirements': reg.ada_requirements.join(', '),
      'Travel Sponsorship': reg.travel_sponsorship.join(', '),
      'Preferred Airport': reg.preferred_airport || '',
      'Consents Accepted': reg.consents_accepted ? 'Yes' : 'No'
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    // Generate Excel file and save
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const fileName = `conference-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(data, fileName);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone: { area: string; number: string } | undefined) => {
    if (!phone) return 'N/A';
    return `(${phone.area}) ${phone.number}`;
  };

  const toggleSort = (field: 'date' | 'organization' | 'relationship') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-medium text-slate-900 mb-2">Error Loading Registrations</h2>
          <p className="text-slate-600 mb-4">{error}</p>
                    <div className="space-x-2">
            <button
              onClick={() => loadRegistrations(true)}
              className="px-4 py-2 bg-credentia-500 text-white rounded hover:bg-credentia-500 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('lastAdminFetch');
                loadRegistrations();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-base"
            >
              Clear Cache & Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-credentia-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Registration Admin</h1>
                <p className="text-slate-600">NNAAP & MACE Conference 2025</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-credentia-500 mr-2" />
                <span className="text-base font-medium text-credentia-500">
                  {filteredRegistrations.length} Registration{filteredRegistrations.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={exportToExcel}
                disabled={filteredRegistrations.length === 0}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by organization, website, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Relationships</option>
                  <option value="current-client">Current Clients</option>
                  <option value="prospective-client">Prospective Clients</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('organization')}
                  >
                    <div className="flex items-center">
                      Organization
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => toggleSort('relationship')}
                  >
                    <div className="flex items-center">
                      Relationship
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Requirements
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No registrations found</p>
                        <p className="text-base">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base text-slate-600">
                        {formatDate(registration.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-base font-medium text-slate-900">
                            {registration.organization_name}
                          </div>
                          <div className="text-base text-credentia-500 hover:text-credentia-500">
                            <a href={registration.website} target="_blank" rel="noopener noreferrer">
                              {registration.website}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          registration.relationship_with_credentia === 'current-client'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {registration.relationship_with_credentia === 'current-client'
                            ? 'Current Client'
                            : 'Prospective Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-base text-slate-600">
                        <div>
                          {registration.address.city}, {registration.address.state}
                        </div>
                        <div className="text-xs text-slate-500">
                          {registration.address.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-slate-600">
                        <div>{formatPhone(registration.phone)}</div>
                        {registration.alternate_phone && (
                          <div className="text-xs text-slate-500">
                            Alt: {formatPhone(registration.alternate_phone)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-base text-slate-600">
                        <div className="space-y-1">
                          {registration.dietary_restrictions.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Diet:</span> {registration.dietary_restrictions.join(', ')}
                            </div>
                          )}
                          {registration.ada_requirements.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">ADA:</span> {registration.ada_requirements.join(', ')}
                            </div>
                          )}
                          {registration.travel_sponsorship.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Travel:</span> {registration.travel_sponsorship.join(', ')}
                              {registration.preferred_airport && (
                                <span className="text-credentia-500"> (Airport: {registration.preferred_airport})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
