

function InputField(props: { 
    name: string, 
    type: string, 
    placeholder: string, 
    label: string, 
    value: string, 
    onInput: (e: Event) => void     
 }) {
    return (
        <div class="space-y-2">
            <label for={props.name} class="block text-sm font-medium text-gray-700">
                {props.label}
            </label>
            <input 
                name={props.name} 
                type={props.type} 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200" 
                placeholder={props.placeholder}
                value={props.value} 
                onInput={props.onInput} 
                required
            />
        </div>
    );
}

export default InputField;