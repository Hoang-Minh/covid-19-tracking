import StatCard from './StatCard'

const StatCardList = ({ currentData }) => {
  let thisWeekVal = null
  let lastWeekVal = null
  let changeVal = null
  let changeColor = 'border-gray-400'

  if (currentData) {
    const thisWeek = Number(currentData[0].percent_test_positivity)
    const lastWeek = Number(currentData[1].percent_test_positivity)
    const diff = thisWeek - lastWeek
    thisWeekVal = `${thisWeek.toFixed(1)}%`
    lastWeekVal = `${lastWeek.toFixed(1)}%`
    changeVal = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}pp`
    changeColor = diff > 0 ? 'border-red-500' : 'border-green-500'
  }

  const cards = [
    {
      title: 'This Week',
      value: thisWeekVal,
      subtitle: '% of flu tests positive',
      colorClass: 'border-blue-500',
    },
    {
      title: 'Last Week',
      value: lastWeekVal,
      subtitle: '% of flu tests positive',
      colorClass: 'border-gray-400',
    },
    {
      title: 'Change',
      value: changeVal,
      subtitle: 'Week-over-week (pp)',
      colorClass: changeColor,
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
