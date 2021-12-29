const titleStyles = {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 900
    // fontStyle: 'italic'
}

export default function Layout(props) {
    return (
        <main className="">
            <button
                className="px-4 py-1 text-white text-sm absolute top-2 left-2 rounded"
                style={{ background: '#146D26' }}
            >
                Back
            </button>
            <div className="flex justify-center items-center flex-col mt-24 mb-10">
                <h1 style={titleStyles} className="text-3xl">
                    {props.title}
                </h1>
                {[1, 2, 3].map((x) => (
                    <div
                        key={x}
                        style={{
                            margin: '4px 0',
                            height: 1,
                            width: 400,
                            background: '#146D26',
                            opacity: '0.8'
                        }}
                    />
                ))}
            </div>
            <div
                style={{
                    maxWidth: 900,
                    width: '90%',
                    margin: '0 auto',
                    minHeight: 500
                }}
            >
                {props.children}
            </div>
        </main>
    )
}
