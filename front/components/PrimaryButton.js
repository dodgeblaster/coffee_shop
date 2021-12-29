export default function PrimaryButton(props) {
    return (
        <button
            disabled={props.disabled}
            className={`px-4 py-1 text-white text-sm rounded ${
                props.fullWidth && 'w-full'
            }`}
            style={{
                background: '#146D26',
                opacity: props.disabled ? '0.5' : '1'
            }}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}
