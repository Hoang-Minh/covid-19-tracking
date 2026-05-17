const StatCard = ({ title, value, subtitle, colorClass }) => {
  const display =
    value == null
      ? '—'
      : typeof value === 'number'
      ? new Intl.NumberFormat('en-US').format(value)
      : value

  return (
    <div className={`rounded-xl shadow p-5 bg-white border-t-4 ${colorClass}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold my-1">{display}</p>
      <p className="text-gray-400 text-xs">{subtitle}</p>
    </div>
  )
}

export default StatCard
