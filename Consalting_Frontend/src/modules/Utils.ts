export const isHomePage = (path:string) => {
	return path == "/"
}

export const isServicePage = (path:string) => {
    return path.match(/^\/services\/(\d+)/)
}