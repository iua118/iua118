'use client';

import { useAuthStore } from '@/lib/store/auth.store';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Xin chào, {user?.firstName} {user?.lastName}! 👋
        </h1>
        <p className="text-blue-100">Chào mừng bạn quay lại CRM System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Khách hàng tiềm năng"
          value="24"
          change="+12%"
          icon="🎯"
          color="blue"
        />
        <StatCard
          title="Thương vụ đang xử lý"
          value="8"
          change="+5%"
          icon="🤝"
          color="green"
        />
        <StatCard
          title="Công việc chưa hoàn thành"
          value="15"
          change="-3%"
          icon="✓"
          color="orange"
        />
        <StatCard
          title="Doanh thu tháng này"
          value="$45K"
          change="+18%"
          icon="💰"
          color="purple"
        />
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            <ActivityItem
              title="Khách hàng mới được thêm"
              description="Nguyễn Văn A - Công ty ABC"
              time="2 giờ trước"
              icon="🆕"
            />
            <ActivityItem
              title="Cập nhật thương vụ"
              description="Deal với công ty XYZ chuyển sang giai đoạn Proposal"
              time="5 giờ trước"
              icon="📝"
            />
            <ActivityItem
              title="Cuộc họp đã hoàn thành"
              description="Họp với khách hàng VIP"
              time="1 ngày trước"
              icon="📞"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tác vụ nhanh</h2>
          <div className="space-y-2">
            <QuickAction label="+ Thêm khách hàng" href="/dashboard/leads" />
            <QuickAction label="+ Thêm thương vụ" href="/dashboard/deals" />
            <QuickAction label="+ Tạo công việc" href="/dashboard/tasks" />
            <QuickAction label="📊 Xem báo cáo" href="/dashboard/reports" />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Vai trò" value={user?.role} />
          <InfoItem label="Tên" value={`${user?.firstName} ${user?.lastName}`} />
          <InfoItem label="Bộ phận" value="Sales" />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className="text-green-600 text-sm font-medium">{change}</span>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: string;
}

function ActivityItem({ title, description, time, icon }: ActivityItemProps) {
  return (
    <div className="flex gap-4 pb-3 border-b border-gray-100 last:border-b-0">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

interface QuickActionProps {
  label: string;
  href: string;
}

function QuickAction({ label, href }: QuickActionProps) {
  return (
    <a
      href={href}
      className="block w-full px-4 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
    >
      {label}
    </a>
  );
}

interface InfoItemProps {
  label: string;
  value?: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}
