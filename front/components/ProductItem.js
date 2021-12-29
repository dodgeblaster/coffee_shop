const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const format = (x) => {
    const raw = x.toString()
    const f = raw
        .split('')
        .map((x, i, l) => {
            if (i === l.length - 2) {
                return '.' + x
            }
            return x
        })
        .join('')

    return formatter.format(f)
}

export default function ProductItem(props) {
    return (
        <button
            className="px-4 py-3 text-white text-xs flex shadow-md rounded"
            style={{ background: '#2D2D2D' }}
            onClick={props.onClick}
        >
            <span className="opacity-80">{props.name}</span>
            <span className="ml-auto">{format(props.price)}</span>
        </button>
    )
}
