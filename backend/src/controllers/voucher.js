import { VoucherModel } from '../models/Voucher.js';

export const ListVoucher = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find();
    res.status(200).send({message: "Hien thi danh sach voucher thanh cong", status : true, data: vouchers});
  } catch (error) {
    res.status(500).json({ message: "loi hien thi danh sach voucher", error: error.message });
  }
} 
export const CreateVoucher = async (req, res) => {
  try {
  const vouchers= await VoucherModel.create(req.body);
    res.status(201).send({message: "Tao voucher thanh cong", status : true, data: vouchers});
  } catch (error) {
    res.status(500).json({ message: "loi tao voucher", error: error.message });
  }
};
export const UpdateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher khong ton tai" });
    }
    res.status(200).send({message: "Cap nhat voucher thanh cong", status : true, data: updatedVoucher});
  } catch (error) {
    res.status(500).json({ message: "loi cap nhat voucher", error: error.message });
  }
};
export const DeleteVoucher = async (req, res) => {
  try{
    const { id } = req.params;
    const deletedVoucher = await VoucherModel.findByIdAndDelete(id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher khong ton tai" });
    }
    res.status(200).send({message: "Xoa voucher thanh cong", status : true, data: deletedVoucher});
  }
  catch (error) {
    res.status(500).json({ message: "loi xoa voucher", error: error.message });
  }
};