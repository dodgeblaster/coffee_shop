export default function InFocusCard(props) {
    return (
        <div className="px-6 py-6 rounded-md border border-gray-200 min-h-full shadow-md">
            {props.children}
        </div>
    )
}
