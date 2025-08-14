const BASE_URL = 'http://localhost:5000';

async function testShippingAPI() {
  try {
    console.log('🧪 Testing Shipping API...\n');

    // Test 1: Get provinces
    console.log('1. Testing GET /shipping/provinces');
    const provincesResponse = await fetch(`${BASE_URL}/shipping/provinces`);
    const provincesData = await provincesResponse.json();
    console.log('✅ Provinces API:', provincesData.success);
    console.log('📋 Total provinces:', provincesData.data.length);
    console.log('🏙️  Free shipping cities:', provincesData.data.slice(0, 6));
    console.log('');

    // Test 2: Calculate shipping fee for free shipping city
    console.log('2. Testing shipping fee for Hà Nội (should be free)');
    const freeShippingResponse = await fetch(`${BASE_URL}/shipping/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: 'Hà Nội'
      })
    });
    const freeShippingData = await freeShippingResponse.json();
    console.log('✅ Free shipping test:', freeShippingData.success);
    console.log('💰 Shipping fee:', freeShippingData.data.shipping_fee);
    console.log('🚚 Is free shipping:', freeShippingData.data.is_free_shipping);
    console.log('');

    // Test 3: Calculate shipping fee for paid shipping city
    console.log('3. Testing shipping fee for An Giang (should be 10k)');
    const paidShippingResponse = await fetch(`${BASE_URL}/shipping/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: 'An Giang'
      })
    });
    const paidShippingData = await paidShippingResponse.json();
    console.log('✅ Paid shipping test:', paidShippingData.success);
    console.log('💰 Shipping fee:', paidShippingData.data.shipping_fee);
    console.log('🚚 Is free shipping:', paidShippingData.data.is_free_shipping);
    console.log('');

    // Test 4: Calculate shipping fee for invalid city
    console.log('4. Testing shipping fee for invalid city');
    try {
      const invalidResponse = await fetch(`${BASE_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: 'Invalid City'
        })
      });
      const invalidData = await invalidResponse.json();
      console.log('❌ Should have failed but got:', invalidData);
    } catch (error) {
      console.log('✅ Invalid city test failed as expected');
      console.log('📝 Error message:', error.message);
    }
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testShippingAPI();
