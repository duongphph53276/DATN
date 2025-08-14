import axios from 'axios';

const checkPermissions = async () => {
  try {
    console.log('🔍 Đang kiểm tra permissions từ API...\n');

    // Lấy tất cả permissions
    const response = await axios.get('http://localhost:5000/permissions');
    const permissions = response.data;

    console.log(`📊 Tổng số permissions: ${permissions.length}\n`);

    // Kiểm tra permissions trùng lặp
    const permissionNames = permissions.map(p => p.name);
    const duplicates = permissionNames.filter((name, index) => permissionNames.indexOf(name) !== index);
    const uniqueDuplicates = [...new Set(duplicates)];

    if (uniqueDuplicates.length > 0) {
      console.log('⚠️  Tìm thấy permissions trùng lặp:');
      uniqueDuplicates.forEach(name => {
        const dupes = permissions.filter(p => p.name === name);
        console.log(`   - "${name}": ${dupes.length} bản sao`);
        dupes.forEach((p, i) => {
          console.log(`     ${i + 1}. ID: ${p._id}, Created: ${p.createdAt}`);
        });
      });
      console.log('');
    } else {
      console.log('✅ Không tìm thấy permissions trùng lặp!');
    }

    // Kiểm tra permissions không hợp lệ
    const invalidPermissions = permissions.filter(p => !p.name || p.name.trim() === '');
    if (invalidPermissions.length > 0) {
      console.log(`\n⚠️  Tìm thấy ${invalidPermissions.length} permissions không hợp lệ:`);
      invalidPermissions.forEach(p => {
        console.log(`   - ID: ${p._id}, Name: "${p.name}"`);
      });
    }

    // Hiển thị danh sách permissions
    console.log(`\n📋 Danh sách tất cả permissions (${permissions.length} permissions):`);
    permissions.sort((a, b) => a.name.localeCompare(b.name)).forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} - ${p.description}`);
    });

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra permissions:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

checkPermissions();
