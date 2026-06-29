import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AdminOverviewCharts({ data }) {
  const usersByMonth = data?.usersByMonth || [];
  const listingsByCategory = data?.listingsByCategory || [];
  const transactionsByStatus = data?.transactionsByStatus || [];
  const reportsByStatus = data?.reportsByStatus || [];

  const pieColors = ["#2e7d32", "#43a047", "#66bb6a", "#a5d6a7", "#1b5e20"];

  const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #d8e8d8",
    boxShadow: "0 10px 24px rgba(46, 125, 50, 0.12)",
  };

  const hasItems = (items) => Array.isArray(items) && items.length > 0;

  const EmptyChart = ({ text = "No chart data" }) => (
    <div className="admin-chart-empty">{text}</div>
  );

  return (
    <div className="admin-charts-section">
      <div className="admin-charts-grid">
        <div className="card admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3>Users Growth</h3>
              <p>Number of registered users by month</p>
            </div>
          </div>

          <div className="admin-chart-body">
            {hasItems(usersByMonth) ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={usersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2e7d32"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="card admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3>Listings by Category</h3>
              <p>Distribution of products across categories</p>
            </div>
          </div>

          <div className="admin-chart-body">
            {hasItems(listingsByCategory) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={listingsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="value"
                    fill="#2e7d32"
                    radius={[10, 10, 0, 0]}
                    name="Listings"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="card admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3>Transactions by Status</h3>
              <p>Current order status overview</p>
            </div>
          </div>

          <div className="admin-chart-body">
            {hasItems(transactionsByStatus) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={transactionsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="value"
                    fill="#43a047"
                    radius={[10, 10, 0, 0]}
                    name="Transactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="card admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3>Reports by Status</h3>
              <p>Moderation report distribution</p>
            </div>
          </div>

          <div className="admin-chart-body">
            {hasItems(reportsByStatus) ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={reportsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {reportsByStatus.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewCharts;
