function Button(props: { children: string, class?: string, type?: "button" | "submit" | "reset" }) {
    return (
        <button 
            type={props.type || "button"}
            class="bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed {props.class || ''}"
        >
            {props.children}
        </button>
    )
}

export default Button;