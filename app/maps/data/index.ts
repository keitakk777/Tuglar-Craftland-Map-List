// Gọi file của Huỳnh
import { mapSniperAOT } from "./huynh-nguyen/sniperaot"

// Gọi file của Huy Lê 
import { mapTranChienDaBong } from "./huy-le/tran-chien-da-bong"

// Gọi file của Long Sensei
import { mapLuuTruXanh } from "./long-sensei/luu-tru-xanh"

// Gọi file của Hoài Ân
import { mapffffff2PLAYERFFFF002D } from "./hoai-an/2player-2d"
import { mapObbyKhongDuocNhay } from "./hoai-an/obbykhongduocnhay"
import { mapParkourBanana } from "./hoai-an/parkourbanana"
import { mapParkourPanda } from "./hoai-an/parkourpanda"
import { mapParkourDoraemon } from "./hoai-an/parkourdoraemon"
import { mapParkourBanhSinhNhat } from "./hoai-an/parkourbanhsinhnhat"

export const mapDetails = {
  "1": mapLuuTruXanh,
  "2": mapTranChienDaBong, // 🎯 Phải có dấu phẩy ở đây ní ơi!
  "3": mapffffff2PLAYERFFFF002D,       // Thêm dấu phẩy ở cuối cho chắc, sau này thêm map 4 đỡ bị lỗi
  "4": mapObbyKhongDuocNhay,
  "5": mapSniperAOT,
  "6": mapParkourBanana,
  "7": mapParkourPanda,
  "8": mapParkourDoraemon,
  "9": mapParkourBanhSinhNhat,
}