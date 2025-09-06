export interface SvgIcon {
  componentName: string
  content: string
  name: string
  optimizedSize: number
  path: string
  unoptimizedSize: number
}

export interface IconsResponse {
  componentPrefix: string
  icons: SvgIcon[]
}

export interface ServerFunctions {
  /**
   * Get a specific icon by its component name
   */
  getIcon: (componentName: string) => Promise<SvgIcon | null>

  /**
   * List all available SVG icons
   */
  listIcons: () => Promise<IconsResponse>
}

export interface ClientFunctions {}
