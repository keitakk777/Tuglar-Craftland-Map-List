// Gọi file của Huỳnh
import { mapSniperAOT } from "./tuglar/huynh-nguyen/sniperaot"

// Gọi file của Huy Lê 
import { mapTranChienDaBong } from "./tuglar/huy-le/tran-chien-da-bong"

// Gọi file của Long Sensei
import { mapLuuTruXanh } from "./tuglar/long-sensei/luu-tru-xanh"

// Gọi file của Hoài Ân
import { mapffffff2PLAYERFFFF002D } from "./tuglar/hoai-an/2player-2d"
import { mapObbyKhongDuocNhay } from "./tuglar/hoai-an/obbykhongduocnhay"
import { mapParkourBanana } from "./tuglar/hoai-an/parkourbanana"
import { mapParkourPanda } from "./tuglar/hoai-an/parkourpanda"
import { mapParkourDoraemon } from "./tuglar/hoai-an/parkourdoraemon"
import { mapParkourBanhSinhNhat } from "./tuglar/hoai-an/parkourbanhsinhnhat"
import { mapParkourDaoBay } from "./glx/viet-thang/parkourdaobay"

// MAP GLX
// Gọi file của Việt Thắng

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
  "10": mapParkourDaoBay,
}