export const isHomePage = (path:string) => {
	return path == "/"
}

export const isServicePage = (path:string) => {
    return path.match(/^\/services\/(\d+)/)
}


export function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

export function getCsrfToken() {
    return getCookie("csrftoken");
}

export function dateToString(dateAsString?: string) {
    if (dateAsString === undefined) {
        return "-";
    }

    const date = new Date(dateAsString);

    return date.toLocaleString("ru-RU", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}