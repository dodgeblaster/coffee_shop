const Dot = () => (
    <div
        style={{ background: '#146D26' }}
        className="rounded-full h-2 w-2 mr-1"
    ></div>
)

const Bar = (x) => {
    const max = 240
    const percent = Math.floor((x.time / max) * 100)

    return (
        <div className="h-2 rounded-full w-20 bg-gray-300 relative overflow-hidden">
            <div
                style={{
                    position: 'absolute',
                    background: '#146D26',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${percent}%`
                }}
            ></div>
        </div>
    )
}

const Clock = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#146D26"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    )
}

export default function ProductItem(props) {
    return (
        <div
            className="px-4 py-3 border-b border-gray-100 flex relative"
            onClick={props.onClick}
        >
            {props.started && (
                <div
                    className="w-10 rounded-full h-4/6 absolute top-6 animate-pulse"
                    style={{
                        left: '-50px',
                        top: '20px'
                    }}
                >
                    <Clock />
                </div>
            )}
            {props.selected && (
                <div
                    className="w-2 rounded-full h-4/6 absolute top-3 -left-4"
                    style={{ background: '#146D26' }}
                />
            )}
            <div className="mr-3">
                <p className="text-sm font-bold">{props.name}</p>
                <p className="text-sm text-gray-400">
                    Order {props.id.slice(0, 6)}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-400 mb-1.5">Drinks</p>
                <div className="flex">
                    {props.items.map((x) => (
                        <Dot key={x.id} />
                    ))}
                </div>
            </div>

            <div className="ml-auto">
                <p className="text-sm text-gray-400 mb-1.5">Minutes</p>
                <Bar time={143} />
            </div>
        </div>
    )
}
