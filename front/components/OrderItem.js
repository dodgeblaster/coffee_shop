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

const MockImage = () => (
    <div className="h-10 w-10" style={{ background: '#2D2D2D' }}></div>
)

const Line = () => {
    return (
        <div
            className="flex-1 mx-2"
            style={{
                borderTop: '1px dotted #ddd'
            }}
        ></div>
    )
}

const CloseButton = (props) => {
    const Svg = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    )

    return (
        <div
            onClick={props.onClick}
            className="ml-2 bg-white rounded-full px-1 py-1 shadow border border-gray-100 cursor-pointer"
        >
            <Svg />
        </div>
    )
}

export default function OrderItem(props) {
    return (
        <div
            className="text-xs flex items-start mb-1 relative mr-8"
            onClick={props.onClick}
        >
            <MockImage />
            <div className="flex items-center flex-1">
                <span className="opacity-80 mx-2">{props.name}</span>
                <Line />
                <span className="ml-auto mx-2">{format(props.price)}</span>
                <CloseButton onClick={props.remove} />
            </div>
        </div>
    )
}
