import StatCard from './StatCard'

const StatCardList = ({ stats }) => {
  const cards = [
    {
      title: 'ILI Patients',
      value: stats ? Number(stats.ilitotal) : null,
      subtitle: 'Patients with influenza-like illness',
      colorClass: 'border-blue-500',
    },
    {
      title: 'Total Patients',
      value: stats ? Number(stats.total_patients) : null,
      subtitle: 'Total patients seen this week',
      colorClass: 'border-green-500',
    },
    {
      title: '% ILI',
      value: stats ? `${Number(stats.weighted_ili).toFixed(2)}%` : null,
      subtitle: 'Weighted % of visits for ILI',
      colorClass: 'border-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  )
}

export default StatCardList
