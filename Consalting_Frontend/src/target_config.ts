const target_tauri = true

export const api_proxy_addr = "http://192.168.0.18:8000/api"
export const img_proxy_addr = "http://91.135.156.74:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "/api/"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "/img-proxy/"
export const dest_root = (target_tauri) ? "" : "/image_editing_frontend"
