import { ALL_PROVINCES, calculateShippingFee, isValidProvince } from '../common/shipping.js';
import { AddressModel } from '../models/User/address.js';

class ShippingController {
  /**
   * @desc    Get all provinces
   * @route   GET /api/shipping/provinces
   * @access  Public
   */
  async getProvinces(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Get provinces successfully',
        data: ALL_PROVINCES
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Calculate shipping fee by address
   * @route   POST /api/shipping/calculate
   * @access  Public
   */
  async calculateShippingFee(req, res) {
    try {
      const { address_id, city } = req.body;

      let shippingFee = 0;
      let cityName = '';

      if (address_id) {
        // Calculate based on address_id
        const address = await AddressModel.findById(address_id);
        if (!address) {
          return res.status(404).json({
            success: false,
            message: 'Address not found'
          });
        }
        shippingFee = calculateShippingFee(address.city);
        cityName = address.city;
      } else if (city) {
        // Calculate based on city name
        if (!isValidProvince(city)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid province/city name'
          });
        }
        shippingFee = calculateShippingFee(city);
        cityName = city;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Either address_id or city is required'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Calculate shipping fee successfully',
        data: {
          city: cityName,
          shipping_fee: shippingFee,
          is_free_shipping: shippingFee === 0
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
}

export default new ShippingController();
