import { useEffect, useState } from 'react';
import activityLogApi from '../datasource/api-activityLog';

function Activities() {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await activityLogApi.getAllLogs();
                const normalized = Array.isArray(response)
                    ? response
                    : response?.data || response?.logs || response?.activityLogs || [];
                setActivities(normalized);
            } catch (fetchError) {
                console.error('Failed to fetch activity logs:', fetchError);
                setError(fetchError.message || 'Failed to load activity logs.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString();
    };

    const getUserLabel = (activity) => {
        if (typeof activity?.user === 'string') return activity.user;
        if (activity?.user?.username) return activity.user.username;
        if (activity?.user?.email) return activity.user.email;
        if (activity?.user?._id) return activity.user._id;
        return 'Unknown user';
    };

    const toTimestamp = (activity) => {
        const raw = activity?.createdAt || activity?.timestamp;
        const parsed = new Date(raw);
        return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
    };

    const actionOptions = [...new Set(activities.map((item) => item?.action).filter(Boolean))].sort();

    const filteredActivities = activities.filter((activity) => {
        const action = String(activity?.action || '').toLowerCase();
        const user = getUserLabel(activity).toLowerCase();
        const target = String(activity?.target || '').toLowerCase();
        const query = searchTerm.trim().toLowerCase();
        const createdAtTimestamp = toTimestamp(activity);

        const matchesSearch = !query || action.includes(query) || user.includes(query) || target.includes(query);
        const matchesAction = actionFilter === 'all' || String(activity?.action || '') === actionFilter;
        const matchesUser = !userFilter.trim() || user.includes(userFilter.trim().toLowerCase());

        let matchesDateRange = true;
        if (fromDate || toDate) {
            if (!createdAtTimestamp) {
                matchesDateRange = false;
            } else {
                const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
                const toTime = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null;

                if (fromTime && createdAtTimestamp < fromTime) matchesDateRange = false;
                if (toTime && createdAtTimestamp > toTime) matchesDateRange = false;
            }
        }

        return matchesSearch && matchesAction && matchesUser && matchesDateRange;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setActionFilter('all');
        setUserFilter('');
        setFromDate('');
        setToDate('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">System Activities</h1>

                {loading && (
                    <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">
                        Loading activity logs...
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                {!loading && !error && activities.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">
                        No activity logs found.
                    </div>
                )}

                {!loading && !error && activities.length > 0 && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search user, action, target"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All actions</option>
                                    {actionOptions.map((action) => (
                                        <option key={action} value={action}>{action}</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    placeholder="Filter by user"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <p className="text-sm text-gray-600">
                                    Showing {filteredActivities.length} of {activities.length} activities
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredActivities.map((activity, index) => (
                                    <tr key={activity?._id || `${activity?.action || 'activity'}-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getUserLabel(activity)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{activity?.action || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{activity?.target || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(activity?.createdAt || activity?.timestamp)}</td>
                                    </tr>
                                ))}

                                {filteredActivities.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No activities match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Activities;
