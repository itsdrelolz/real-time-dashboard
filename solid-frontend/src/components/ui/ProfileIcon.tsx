

function Card(props: { children: JSX.Element }) {
    return (
        <div class="bg-white rounded-lg shadow-md p-4">
            {props.children}
        </div>
    )
}

export default Card