import { fetchRegions } from '../../api'

const RegionPicker = ({ region, onRegionChange }) => {
  const regions = fetchRegions()
  return (
    <div className="flex justify-center mb-6">
      <select
        className="border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={region}
        onChange={(e) => onRegionChange(e.target.value)}
      >
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RegionPicker
