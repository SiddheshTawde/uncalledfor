export function formatDate(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
}

export function formatTime(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, "0")
  const ampm = h >= 12 ? "pm" : "am"
  return `${h % 12 || 12}:${m}${ampm}`
}
