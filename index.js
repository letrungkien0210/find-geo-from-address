// File: generate_geylang_addresses.js
const fs = require('fs');

// Hàm chọn ngẫu nhiên 1 phần tử trong mảng
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hàm tạo tên giả
function generateFakeName() {
  const firstNames = [
    "Ali", "David", "Ng", "Siti", "Tan", "Goh", "Rachel", "Mohamed",
    "Chen", "Elizabeth", "Arif", "Linda", "Wee", "Lim", "Guan", "Xiu"
  ];
  const lastNames = [
    "Abdullah", "Tan", "Lee", "Wong", "Lim", "Teo", "Goh", "Chen",
    "Chua", "Khan", "Saw", "Low", "Abbas", "Toh", "Nguyen", "Abdul"
  ];
  return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
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

function main() {
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

  const numAddresses = 500; // Số lượng địa chỉ cần tạo
  let csvLines = [];

  // Dòng tiêu đề CSV
  csvLines.push("No.,Number address,Street address,Household Owner,Latitude,Longitude");

  for (let i = 1; i <= numAddresses; i++) {
    // Số nhà
    const houseNumber = Math.floor(Math.random() * 999) + 1; // 1 - 999

    // Chọn đường
    const street = randomChoice(streetNames);

    // Tên giả
    const ownerName = generateFakeName();

    // Toạ độ
    const [lat, lng] = generateRandomGeolocation();

    // Thêm dòng CSV
    csvLines.push(`${i},${houseNumber},${street},${ownerName},${lat.toFixed(6)},${lng.toFixed(6)}`);
  }

  // Ghi ra file CSV
  const csvData = csvLines.join('\n');
  fs.writeFileSync('geylang_addresses.csv', csvData, 'utf8');

  console.log("Đã tạo file 'geylang_addresses.csv' với 500 địa chỉ mẫu ở Geylang.");
}

// Gọi hàm chính
main();