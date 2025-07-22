import Counter from "../models/counter.js";

export const generateSku = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "product" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // nếu chưa có thì tạo mới
  );

  const number = counter.seq.toString().padStart(4, "0");
  return `SP-${number}`; // Ví dụ: SP-0001
};
