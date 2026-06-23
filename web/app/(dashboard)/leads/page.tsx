'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLeadsStore } from '@/lib/store/leads.store';

const LEAD_SOURCES = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'FACEBOOK_ADS', label: 'Facebook Ads' },
  { value: 'GOOGLE_ADS', label: 'Google Ads' },
  { value: 'TIKTOK_ADS', label: 'TikTok Ads' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'MANUAL', label: 'Nhập tay' },
  { value: 'LANDING_PAGE', label: 'Landing Page' },
  { value: 'API', label: 'API' },
];

const LEAD_STATUSES = [
  { value: 'NEW', label: '🆕 Mới', color: 'blue' },
  { value: 'CONTACTED', label: '📞 Đã liên hệ', color: 'purple' },
  { value: 'QUALIFIED', label: '✓ Đủ điều kiện', color: 'green' },
  { value: 'UNQUALIFIED', label: '✗ Không đủ điều kiện', color: 'red' },
  { value: 'NURTURING', label: '🌱 Đang nuôi dưỡng', color: 'orange' },
  { value: 'CONVERTED', label: '🎉 Đã chuyển đổi', color: 'emerald' },
  { value: 'LOST', label: '❌ Mất', color: 'gray' },
];

export default function LeadsPage() {
  const {
    leads,
    isLoading,
    error,
    page,
    pages,
    total,
    filters,
    fetchLeads,
    setFilters,
    deleteLead,
  } = useLeadsStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  useEffect(() => {
    fetchLeads(page);
  }, []);

  const handleSearch = () => {
    setFilters({ search: searchQuery });
    fetchLeads(1);
  };

  const handleFilterChange = (status?: string, source?: string) => {
    if (status !== undefined) {
      setSelectedStatus(status);
      setFilters({ status: status || undefined });
    }
    if (source !== undefined) {
      setSelectedSource(source);
      setFilters({ source: source || undefined });
    }
    fetchLeads(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa lead này?')) {
      try {
        await deleteLead(id);
      } catch (err) {
        alert('Lỗi khi xóa lead');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusObj = LEAD_STATUSES.find((s) => s.value === status);
    if (!statusObj) return status;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      gray: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorClasses[statusObj.color as keyof typeof colorClasses]}`}>
        {statusObj.label}
      </span>
    );
  };

  const getSourceLabel = (source: string) => {
    return LEAD_SOURCES.find((s) => s.value === source)?.label || source;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🎯 Khách hàng tiềm năng</h1>
        <Link
          href="/dashboard/leads/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          + Thêm Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Tổng leads" value={total.toString()} icon="📊" />
        <StatCard label="Mới" value={leads.filter((l) => l.status === 'NEW').length.toString()} icon="🆕" />
        <StatCard label="Đủ điều kiện" value={leads.filter((l) => l.status === 'QUALIFIED').length.toString()} icon="✓" />
        <StatCard label="Đã chuyển đổi" value={leads.filter((l) => l.status === 'CONVERTED').length.toString()} icon="🎉" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tên, email, công ty..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(e.target.value, undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Tất cả --</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nguồn
            </label>
            <select
              value={selectedSource}
              onChange={(e) => handleFilterChange(undefined, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Tất cả --</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('');
                setSelectedSource('');
                setFilters({});
                fetchLeads(1);
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg mb-4">Không có leads nào</p>
            <Link href="/dashboard/leads/create" className="text-blue-600 hover:text-blue-700">
              Tạo lead đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Công ty
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nguồn
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Điểm
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{lead.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getSourceLabel(lead.source)}
                    </td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(lead.status)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 font-medium">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => fetchLeads(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            ← Trước
          </button>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchLeads(p)}
                className={`px-4 py-2 rounded-lg transition ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchLeads(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
