import { JSX, type ParentComponent } from 'solid-js'
import { For } from 'solid-js'
import ProjectIcon from './ui/ProjectIcon'

interface SidebarItem {
  onClick: () => void
  image: string
  name: string
}

interface SidebarProps {
  children?: SidebarItem[]
}

const Sidebar: ParentComponent<SidebarProps> = (props) => {
  return (
    <div>
      <For each={props.children}>
        {(child) => <ProjectIcon image={child.image} name={child.name} />}

      </For>
      </div>
  )
}

export default Sidebar