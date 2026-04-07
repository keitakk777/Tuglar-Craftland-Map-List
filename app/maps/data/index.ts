// Gọi file của Huỳnh
import { mapSniperAOT } from "./huynh-nguyen/sniperaot"

// Gọi file của Huy Lê 
import { mapTranChienDaBong } from "./huy-le/tran-chien-da-bong"

// Gọi file của Long Sensei
import { mapLuuTruXanh } from "./long-sensei/luu-tru-xanh"

// Gọi file của Hoài Ân
import { map2Player2D } from "./hoai-an/2player-2d"
import { mapObbyKhongDuocNhay } from "./hoai-an/obbykhongduocnhay"

export const mapDetails = {
  "1": mapLuuTruXanh,
  "2": mapTranChienDaBong, // 🎯 Phải có dấu phẩy ở đây ní ơi!
  "3": map2Player2D,       // Thêm dấu phẩy ở cuối cho chắc, sau này thêm map 4 đỡ bị lỗi
  "4": mapObbyKhongDuocNhay,
  "5": mapSniperAOT,
}