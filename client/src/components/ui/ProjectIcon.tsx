import { JSX } from "solid-js"


interface ProjectIconProps {
    image: string 
    name: string 
}

function ProjectIcon(props: ProjectIconProps) {
    return (
        <button class="bg-white rounded-lg shadow-md p-4" >
            <img src={props.image} alt={props.name} />
            <span>{props.name.charAt(0).toUpperCase()}</span> // first letter of the name
        </button>
    )
}

export default ProjectIcon