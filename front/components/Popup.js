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
            className="bg-white rounded-full px-2 py-2 shadow border border-gray-100 cursor-pointer absolute -top-2 -right-2"
        >
            <Svg />
        </div>
    )
}

export default function Popup(props) {
    return (
        <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-black opacity-70 z-10"></div>
            <div
                className="rounded border border-gray-100 shadow-lg relative z-50 bg-white"
                style={{
                    width: 300
                }}
            >
                {props.children}
            </div>
        </div>
    )
}
