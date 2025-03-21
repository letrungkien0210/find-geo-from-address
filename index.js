const fs = require('fs');
const NodeGeocoder = require("node-geocoder");

// 1) Tạo cấu hình geocoder
// Ở đây ta dùng 'openstreetmap', không cần key, nhưng có rate limit
// Nếu dùng Google Maps API, thì đổi provider = 'google' và cung cấp API key
const options = {
    provider: "openstreetmap",
    // httpAdapter: "https", // Tùy chọn
    // apiKey: "YOUR_KEY",   // Nếu dùng Google, Here, v.v.
    // formatter: null,      // Mặc định
  };
  const geocoder = NodeGeocoder(options);

// Hàm chọn ngẫu nhiên 1 phần tử trong mảng
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hàm tạo tên giả
function generateFakeName() {
  // Nếu hàm chưa khởi tạo thì khởi tạo một lần
  if (!generateFakeName._initialized) {
    const firstNames = [
      "Monkey D.", "Roronoa", "Portgas D.", "Vinsmoke", "Charlotte", "Donquixote", "Nico", "Trafalgar D.", "Boa", "Nefertari", "Marshall D.", "Brook", "Tony Tony",
      "Eustass", "Jewelry", "Capone", "Dracule", "Crocodile", "Bentham", "Urouge", "X. Drake", "Sabo", "Inuarashi", "Nekomamushi", "Koala", "Yamato",
      "Kozuki", "Shirahoshi", "Franky", "Jimbei", "Pedro", "Pekoms", "Ivankov", "Viola", "Rebecca", "Shanks", "Buggy", "Arlong", "Enel", "Caesar"
    ];
    const lastNames = [
      "Luffy", "Zoro", "Ace", "Sanji", "Katakuri", "Doflamingo", "Robin", "Law", "Hancock", "Vivi", "Teach", "Chopper",
      "Kid", "Bonney", "Gang Bege", "Mihawk", "Sir", "Mr.2", "Mad Monk", "Marine", "Revo", "Duke", "Cat Viper", "Fishman", "Onigashima",
      "Oden", "Mermaid Princess", "Cyborg", "(Okama)", "Dancer", "Gladiator", "Red-Haired", "Star Clown", "Fishman", "God", "Clown"
    ];

    // Build tất cả combo
    let combos = [];
    for (const f of firstNames) {
      for (const l of lastNames) {
        combos.push(`${f} ${l}`);
      }
    }

    // Shuffle combos
    combos = combos.sort(() => 0.5 - Math.random());

    // Gắn vào thuộc tính tĩnh của hàm
    generateFakeName._pool = combos;
    generateFakeName._index = 0;
    generateFakeName._initialized = true;
  }

  // Nếu vượt quá số combo, ta có thể lặp lại hoặc báo lỗi
  if (generateFakeName._index >= generateFakeName._pool.length) {
    // Option A: trả về "Hết tên"
    // return "No More Names";

    // Option B: Lặp lại từ đầu:
    generateFakeName._index = 0;
  }

  const name = generateFakeName._pool[generateFakeName._index];
  generateFakeName._index++;
  return name;
}

// Hàm tạo mã từ tên
function generateHouseholdCode(name) {
  // Loại bỏ các ký tự đặc biệt (giữ lại chữ và số)
  let code = name.replace(/[^\w\s]/g, '');
  // Thay thế khoảng trắng bằng gạch dưới
  code = code.replace(/\s+/g, '_');
  return code;
}

// Hàm tạo toạ độ ngẫu nhiên quanh khu vực Geylang
function generateRandomGeolocation() {
  // Giá trị ước lượng, bạn có thể điều chỉnh lại tuỳ ý
  const minLat = 1.310;
  const maxLat = 1.330;
  const minLng = 103.870;
  const maxLng = 103.900;

  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;
  return [lat, lng];
}

async function main() {
  // Danh sách một số đường ở Geylang
  const streetNames = [
    "Geylang Road", "Sims Avenue", "Guillemard Road", "Aljunied Road",
    "Lorong 10 Geylang", "Lorong 12 Geylang", "Lorong 16 Geylang",
    "Lorong 22 Geylang", "Lorong 25 Geylang", "Lorong 27 Geylang",
    "Lorong 28 Geylang", "Lorong 33 Geylang", "Lorong 38 Geylang",
    "Lorong 40 Geylang", "Lorong Bachok", "Geylang East Central",
    "Geylang East Avenue 1", "Geylang East Avenue 2", "Paya Lebar Road",
    "Tanjong Katong Road", "Jalan Satu", "Jalan Dua", "Jalan Enam"
  ];

  const numAddresses = 700; // Số lượng địa chỉ cần tạo
  let csvLines = [];

  // Dòng tiêu đề CSV
  const header = "No.;Street Number;Street Name;Household Owner;Household Code;Coordinate";
  fs.writeFileSync('geylang_addresses.csv', header + '\n', 'utf8');

  for (let i = 1; i <= numAddresses; i++) {
    // Số nhà
    const houseNumber = Math.floor(Math.random() * 999) + 1; // 1 - 999

    // Chọn đường
    const street = randomChoice(streetNames);

    // Tên giả
    const ownerName = generateFakeName();
    
    // Tạo household code
    const householdCode = generateHouseholdCode(ownerName);

    // Full address for geocoding
    const address = `${houseNumber} ${street}, Singapore`;
    const res = await geocoder.geocode(address);

    // Toạ độ
    let lat = 0;
    let lng = 0;
    if (res && res.length > 0) {
        // Lấy thông tin lat/lng đầu tiên
        const { latitude, longitude } = res[0];
        console.log(`[${i}/${numAddresses}] Geocoded: ${address} -> ${latitude}, ${longitude}`);
        lat = latitude;
        lng = longitude;
    } else {
        // Không tìm thấy kết quả
        const row = `${i};${houseNumber};"${street}";${ownerName};${householdCode};""`;
        fs.appendFileSync('geylang_addresses.csv', row + '\n', 'utf8');
        console.log(`[${i}/${numAddresses}] Không tìm thấy toạ độ cho: ${address}`);
        continue;
    }

    // Thêm dòng CSV
    const coordinate = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    const row = `${i};${houseNumber};"${street}";${ownerName};${householdCode};${coordinate}`;
    fs.appendFileSync('geylang_addresses.csv', row + '\n', 'utf8');

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`Đã tạo file 'geylang_addresses.csv' với ${numAddresses} địa chỉ mẫu ở Geylang.`);
}

// Gọi hàm chính
main();