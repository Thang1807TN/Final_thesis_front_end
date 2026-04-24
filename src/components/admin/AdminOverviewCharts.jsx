import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminOverviewCharts({ data }) {
  if (!data) return null;

  const pieColors = ["#16a34a", "#f59e0b", "#ef4444", "#6366f1", "#0ea5e9"];

  return (
    <div className="admin-payment-charts-grid admin-payment-charts-grid-3">
      <div className="card admin-chart-card">
        <h3>Users by Month</h3>
        <div className="admin-chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.usersByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card admin-chart-card">
        <h3>Listings by Category</h3>
        <div className="admin-chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.listingsByCategory || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card admin-chart-card">
        <h3>Transactions by Status</h3>
        <div className="admin-chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.transactionsByStatus || []}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {(data.transactionsByStatus || []).map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card admin-chart-card">
        <h3>Reports by Status</h3>
        <div className="admin-chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.reportsByStatus || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewCharts;
